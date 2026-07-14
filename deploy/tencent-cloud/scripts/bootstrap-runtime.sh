#!/usr/bin/env bash

set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run this bootstrap as root." >&2
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
apt-get install -y --no-install-recommends ca-certificates curl git nginx xz-utils

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
if ! id zhipet >/dev/null 2>&1; then
  adduser --system --ingroup zhipet --home /srv/zhipet --shell /usr/sbin/nologin zhipet
fi

install -d -o zhipet -g zhipet -m 0750 /srv/zhipet
install -d -o zhipet -g zhipet -m 0750 /srv/zhipet/releases
install -d -o root -g zhipet -m 0750 /etc/zhipet
install -d -o zhipet -g zhipet -m 0750 /var/log/zhipet
install -d -o root -g root -m 0755 /var/www/letsencrypt

echo "Runtime bootstrap complete."
node --version
pnpm --version
nginx -v
stat -c '%n | owner=%U:%G | mode=%a' \
  /srv/zhipet /srv/zhipet/releases /etc/zhipet /var/log/zhipet

