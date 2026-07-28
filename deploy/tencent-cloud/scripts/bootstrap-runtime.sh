#!/usr/bin/env bash

set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run this bootstrap as root." >&2
  exit 1
fi

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
deployment_root=$(cd -- "${script_dir}/.." && pwd)
logrotate_source="${deployment_root}/logrotate/zhipet"
log_directory=/var/log/zhipet

if [[ ! -f ${logrotate_source} ]]; then
  echo "Missing logrotate policy: ${logrotate_source}" >&2
  exit 1
fi

node_version=${NODE_VERSION:-22.23.1}
node_base_url="https://nodejs.org/dist/v${node_version}"
machine_arch=$(uname -m)

case ${machine_arch} in
  x86_64)
    node_arch=x64
    ;;
  aarch64 | arm64)
    node_arch=arm64
    ;;
  *)
    echo "Unsupported architecture: ${machine_arch}" >&2
    exit 1
    ;;
esac

archive="node-v${node_version}-linux-${node_arch}.tar.xz"
install_root=/opt/nodejs
version_dir="${install_root}/node-v${node_version}-linux-${node_arch}"
download_dir=$(mktemp -d)

cleanup() {
  rm -rf -- "${download_dir}"
}
trap cleanup EXIT

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends ca-certificates curl git logrotate nginx procps util-linux xz-utils

curl --fail --show-error --silent --location --proto '=https' --tlsv1.2 \
  "${node_base_url}/${archive}" -o "${download_dir}/${archive}"
curl --fail --show-error --silent --location --proto '=https' --tlsv1.2 \
  "${node_base_url}/SHASUMS256.txt" -o "${download_dir}/SHASUMS256.txt"

(
  cd "${download_dir}"
  grep " ${archive}$" SHASUMS256.txt | sha256sum --check --strict -
)

install -d -o root -g root -m 0755 "${install_root}"
if [[ ! -d ${version_dir} ]]; then
  tar -xJf "${download_dir}/${archive}" -C "${install_root}"
fi
ln -sfn "${version_dir}" "${install_root}/current"

for executable in node npm npx corepack; do
  ln -sfn "${install_root}/current/bin/${executable}" "/usr/local/bin/${executable}"
done

corepack enable --install-directory /usr/local/bin
corepack prepare pnpm@11.7.0 --activate

if ! getent group zhipet >/dev/null; then
  addgroup --system zhipet
fi
if ! getent group zhipet-deploy >/dev/null; then
  addgroup --system zhipet-deploy
fi
if ! id zhipet >/dev/null 2>&1; then
  adduser --system --ingroup zhipet --home /srv/zhipet --shell /usr/sbin/nologin zhipet
fi
if ! getent group zhipet-build >/dev/null; then
  addgroup --system zhipet-build
fi
if ! id zhipet-build >/dev/null 2>&1; then
  adduser --system --ingroup zhipet-build --home /srv/zhipet/build-home \
    --shell /usr/sbin/nologin zhipet-build
fi

if ! id -nG zhipet | tr ' ' '\n' | grep -qx zhipet-deploy; then
  adduser zhipet zhipet-deploy
fi
if ! id -nG zhipet-build | tr ' ' '\n' | grep -qx zhipet-deploy; then
  adduser zhipet-build zhipet-deploy
fi

install -d -o root -g zhipet-deploy -m 0750 /srv/zhipet
install -d -o root -g zhipet-deploy -m 0750 /srv/zhipet/releases
chown -R --no-dereference root:zhipet /srv/zhipet/releases
chmod -R u=rwX,g=rX,o= /srv/zhipet/releases
chown root:zhipet-deploy /srv/zhipet/releases
chmod 0750 /srv/zhipet/releases
install -d -o zhipet-build -g zhipet-build -m 0700 /srv/zhipet/build-home
install -d -o root -g zhipet -m 0750 /etc/zhipet

if [[ -L ${log_directory} || ( -e ${log_directory} && ! -d ${log_directory} ) ]]; then
  echo "Refusing unsafe log directory: ${log_directory}" >&2
  exit 1
fi
install -d -o root -g zhipet -m 0750 "${log_directory}"

install -d -o root -g root -m 0755 /var/www/letsencrypt

for application_log in web.jsonl web-error.log mail.jsonl mail-error.log purge.jsonl purge-error.log status.jsonl status-error.log; do
  log_path="${log_directory}/${application_log}"
  if [[ -L ${log_path} || ( -e ${log_path} && ! -f ${log_path} ) ]]; then
    echo "Refusing unsafe log path: ${log_path}" >&2
    exit 1
  fi
  if [[ ! -e ${log_path} ]]; then
    install -o zhipet -g zhipet -m 0640 /dev/null "${log_path}"
  else
    chown zhipet:zhipet "${log_path}"
    chmod 0640 "${log_path}"
  fi
done

for nginx_log in nginx-access.jsonl nginx-error.log; do
  log_path="${log_directory}/${nginx_log}"
  if [[ -L ${log_path} || ( -e ${log_path} && ! -f ${log_path} ) ]]; then
    echo "Refusing unsafe log path: ${log_path}" >&2
    exit 1
  fi
  if [[ ! -e ${log_path} ]]; then
    install -o root -g adm -m 0640 /dev/null "${log_path}"
  else
    chown root:adm "${log_path}"
    chmod 0640 "${log_path}"
  fi
done

install -o root -g root -m 0644 "${logrotate_source}" /etc/logrotate.d/zhipet
logrotate --debug /etc/logrotate.d/zhipet

echo "Runtime bootstrap complete."
node --version
pnpm --version
nginx -v
stat -c '%n | owner=%U:%G | mode=%a' \
  /srv/zhipet /srv/zhipet/releases /srv/zhipet/build-home \
  /etc/zhipet /var/log/zhipet
