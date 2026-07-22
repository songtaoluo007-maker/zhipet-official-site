#!/usr/bin/env bash

set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run this release script as root." >&2
  exit 1
fi

repo_url=${1:-https://github.com/songtaoluo007-maker/zhipet-official-site.git}
git_ref=${2:-}
site_url=${NUXT_PUBLIC_SITE_URL:-https://petsense-agent.com}
release_root=/srv/zhipet/releases
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
staging_dir="${release_root}/.staging-${timestamp}"
current_link=/srv/zhipet/current
health_url=http://127.0.0.1:3000/api/health
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
  if [[ -d ${staging_dir} ]]; then
    rm -rf --one-file-system -- "${staging_dir}"
  fi
}
trap cleanup_failed_release ERR

install -d -o zhipet -g zhipet -m 0750 "${release_root}"

if runuser -u zhipet -- env HOME=/srv/zhipet \
  git clone --filter=blob:none --no-tags "${repo_url}" "${staging_dir}"; then
  runuser -u zhipet -- env HOME=/srv/zhipet \
    git -C "${staging_dir}" checkout --detach "${git_ref}"
  commit_sha=$(runuser -u zhipet -- git -C "${staging_dir}" rev-parse HEAD)
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
  install -d -o zhipet -g zhipet -m 0750 "${staging_dir}"
  runuser -u zhipet -- curl --fail --show-error --silent --location \
    --proto '=https' --tlsv1.2 \
    "https://codeload.github.com/${repo_path}/tar.gz/${git_ref}" \
    -o "${staging_dir}/source.tar.gz"
  runuser -u zhipet -- tar -xzf "${staging_dir}/source.tar.gz" \
    --strip-components=1 -C "${staging_dir}"
  rm -f -- "${staging_dir}/source.tar.gz"
  printf '%s\n' "${git_ref}" >"${staging_dir}/.release-commit"
  chown zhipet:zhipet "${staging_dir}/.release-commit"
  commit_sha=${git_ref}
fi

short_sha=${commit_sha:0:12}
release_dir="${release_root}/${timestamp}-${short_sha}"
previous_release=

if [[ -L ${current_link} ]]; then
  previous_release=$(readlink -f "${current_link}")
fi

run_as_zhipet() {
  local workdir=$1
  shift
  runuser -u zhipet -- env \
    HOME=/srv/zhipet \
    PATH=/usr/local/bin:/usr/bin:/bin \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NODE_ENV="${NODE_ENV:-development}" \
    NUXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="${DATABASE_URL:-postgresql://build:build@127.0.0.1:5432/zhipet?schema=public}" \
    NUXT_APP_BASE_URL=/ \
    NUXT_PUBLIC_SITE_URL="${site_url}" \
    NUXT_PUBLIC_FEEDBACK_ENABLED=false \
    NUXT_PUBLIC_APP_DOWNLOAD_ENABLED=false \
    /bin/bash -c 'cd -- "$1"; shift; exec "$@"' bash "${workdir}" "$@"
}

run_as_zhipet "${staging_dir}" pnpm install --frozen-lockfile --prod=false
run_as_zhipet "${staging_dir}" pnpm db:generate
run_as_zhipet "${staging_dir}" pnpm lint
run_as_zhipet "${staging_dir}" pnpm typecheck
NODE_ENV=test run_as_zhipet "${staging_dir}" pnpm test
NODE_ENV=production run_as_zhipet "${staging_dir}" pnpm build

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
    if curl --fail --silent --show-error --max-time 3 "${health_url}" >/dev/null; then
      return 0
    fi
    sleep 1
  done

  return 1
}

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
  fi

  exit 1
fi

trap - ERR
printf '%s\n' \
  "Release staged successfully." \
  "commit=${commit_sha}" \
  "release=${release_dir}" \
  "current=$(readlink -f /srv/zhipet/current)"
