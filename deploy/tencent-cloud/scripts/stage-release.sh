#!/usr/bin/env bash

set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run this release script as root." >&2
  exit 1
fi

repo_url=${1:-https://github.com/songtaoluo007-maker/zhipet-official-site.git}
git_ref=${2:-}
site_url=${NUXT_PUBLIC_SITE_URL:-https://petsense-agent.com}
content_database_path=/tmp/zhipet-content/contents.sqlite
build_content_directory=${content_database_path%/*}
release_root=/srv/zhipet/releases
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
staging_dir="${release_root}/.staging-${timestamp}"
current_link=/srv/zhipet/current
liveness_url=http://127.0.0.1:3000/api/live
readiness_url=http://127.0.0.1:3000/api/health
release_lock=/run/lock/zhipet-release.lock
repo_path=${repo_url#https://github.com/}
repo_path=${repo_path%.git}

if [[ ! ${git_ref} =~ ^[0-9a-f]{40}$ ]]; then
  echo "A full 40-character commit SHA is required." >&2
  exit 1
fi

exec 9>"${release_lock}"
if ! flock --nonblock 9; then
  echo "Another ZHIPET release is already running." >&2
  exit 1
fi

cleanup_failed_release() {
  pkill -KILL -u zhipet-build >/dev/null 2>&1 || true
  rm -rf --one-file-system -- "${build_content_directory}"
  if [[ -d ${staging_dir} ]]; then
    rm -rf --one-file-system -- "${staging_dir}"
  fi
}
trap cleanup_failed_release ERR

install -d -o root -g zhipet-deploy -m 0750 "${release_root}"
install -d -o zhipet-build -g zhipet-build -m 0700 /srv/zhipet/build-home

if [[ -e ${staging_dir} || -L ${staging_dir} ]]; then
  echo "Refusing an existing staging path: ${staging_dir}" >&2
  exit 1
fi
install -d -o zhipet-build -g zhipet-build -m 0750 "${staging_dir}"

if runuser -u zhipet-build -- env HOME=/srv/zhipet/build-home \
  git clone --filter=blob:none --no-tags "${repo_url}" "${staging_dir}"; then
  runuser -u zhipet-build -- env HOME=/srv/zhipet/build-home \
    git -C "${staging_dir}" checkout --detach "${git_ref}"
  commit_sha=$(runuser -u zhipet-build -- git -C "${staging_dir}" rev-parse HEAD)
  if [[ ${commit_sha} != "${git_ref}" ]]; then
    echo "Resolved commit does not match the requested release SHA." >&2
    exit 1
  fi
else
  rm -rf --one-file-system -- "${staging_dir}"

  if [[ ! ${repo_path} =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
    echo "The codeload fallback only supports validated GitHub repository URLs." >&2
    exit 1
  fi
  install -d -o zhipet-build -g zhipet-build -m 0750 "${staging_dir}"
  runuser -u zhipet-build -- curl --fail --show-error --silent --location \
    --proto '=https' --tlsv1.2 \
    "https://codeload.github.com/${repo_path}/tar.gz/${git_ref}" \
    -o "${staging_dir}/source.tar.gz"
  runuser -u zhipet-build -- tar -xzf "${staging_dir}/source.tar.gz" \
    --strip-components=1 -C "${staging_dir}"
  rm -f -- "${staging_dir}/source.tar.gz"
  commit_sha=${git_ref}
fi

short_sha=${commit_sha:0:12}
release_dir="${release_root}/${timestamp}-${short_sha}"
previous_release=

if [[ -e ${current_link} && ! -L ${current_link} ]]; then
  echo "Refusing a non-symlink current release path." >&2
  exit 1
elif [[ -L ${current_link} ]]; then
  previous_release=$(readlink -f "${current_link}")
  if [[ ! -d ${previous_release} || ${previous_release} != "${release_root}/"* ]]; then
    echo "Current release resolves outside the managed release root." >&2
    exit 1
  fi
  if [[ $(stat -c '%U:%G' "${previous_release}") != root:zhipet ]]; then
    echo "Current release is not owned by root:zhipet." >&2
    exit 1
  fi
fi

run_as_builder() {
  local workdir=$1
  shift
  runuser -u zhipet-build -- env \
    HOME=/srv/zhipet/build-home \
    PATH=/usr/local/bin:/usr/bin:/bin \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NODE_ENV="${NODE_ENV:-development}" \
    NUXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="${DATABASE_URL:-postgresql://build:build@127.0.0.1:5432/zhipet?schema=public}" \
    NUXT_APP_BASE_URL=/ \
    NUXT_PUBLIC_SITE_URL="${site_url}" \
    NUXT_PUBLIC_FEEDBACK_ENABLED=false \
    NUXT_PUBLIC_APP_DOWNLOAD_ENABLED=false \
    NUXT_CONTENT_DATABASE_PATH="${NUXT_CONTENT_DATABASE_PATH:-./contents.sqlite}" \
    /bin/bash -c 'cd -- "$1"; shift; exec "$@"' bash "${workdir}" "$@"
}

run_as_builder "${staging_dir}" pnpm install --frozen-lockfile --prod=false
run_as_builder "${staging_dir}" pnpm db:generate
run_as_builder "${staging_dir}" pnpm lint
run_as_builder "${staging_dir}" pnpm typecheck
NODE_ENV=test run_as_builder "${staging_dir}" pnpm test
NUXT_CONTENT_DATABASE_PATH="${content_database_path}" NODE_ENV=production \
  run_as_builder "${staging_dir}" pnpm build

pkill -KILL -u zhipet-build >/dev/null 2>&1 || true
rm -rf --one-file-system -- "${build_content_directory}"
chown -R --no-dereference root:zhipet "${staging_dir}"
chmod -R u=rwX,g=rX,o= "${staging_dir}"
rm -f -- "${staging_dir}/.release-commit"
printf '%s\n' "${commit_sha}" >"${staging_dir}/.release-commit"
chown root:zhipet "${staging_dir}/.release-commit"
chmod 0440 "${staging_dir}/.release-commit"

mv -- "${staging_dir}" "${release_dir}"

switch_current() {
  local target=$1
  ln -sfn -- "${target}" "${current_link}.next"
  mv -Tf -- "${current_link}.next" "${current_link}"
}

restart_and_wait_for_health() {
  if ! systemctl restart zhipet-web.service; then
    return 1
  fi

  for _ in {1..20}; do
    if curl --fail --silent --show-error --max-time 3 "${liveness_url}" >/dev/null \
      && curl --fail --silent --show-error --max-time 3 "${readiness_url}" >/dev/null; then
      return 0
    fi
    sleep 1
  done

  return 1
}

run_database_migrations() {
  local migration_home
  migration_home=$(mktemp -d /tmp/zhipet-migrate.XXXXXX)
  install -d -o zhipet -g zhipet -m 0700 \
    "${migration_home}" "${migration_home}/cache" "${migration_home}/tmp"

  if ! (
    cd -- "${release_dir}"
    runuser -u zhipet -- env -i \
      HOME="${migration_home}" \
      PATH=/usr/local/bin:/usr/bin:/bin \
      TMPDIR="${migration_home}/tmp" \
      XDG_CACHE_HOME="${migration_home}/cache" \
      NODE_ENV=production \
      /usr/local/bin/node \
      --env-file=/etc/zhipet/zhipet.env \
      --run db:migrate:deploy
  ); then
    rm -rf --one-file-system -- "${migration_home}"
    return 1
  fi

  rm -rf --one-file-system -- "${migration_home}"
}

run_database_migrations
switch_current "${release_dir}"

if ! restart_and_wait_for_health; then
  echo "Release health check failed: ${release_dir}" >&2

  if [[ -n ${previous_release} && -d ${previous_release} ]]; then
    echo "Rolling back to: ${previous_release}" >&2
    switch_current "${previous_release}"
    if ! restart_and_wait_for_health; then
      echo "Rollback release is also unhealthy: ${previous_release}" >&2
    fi
  else
    echo "No previous release is available for automatic rollback." >&2
    if ! systemctl stop zhipet-web.service; then
      echo "Failed to stop the unhealthy first-release service." >&2
    fi
    rm -f -- "${current_link}"
  fi

  exit 1
fi

trap - ERR
printf '%s\n' \
  "Release staged successfully." \
  "commit=${commit_sha}" \
  "release=${release_dir}" \
  "current=$(readlink -f /srv/zhipet/current)"
