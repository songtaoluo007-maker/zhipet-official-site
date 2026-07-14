#!/usr/bin/env bash

set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run this installer as root." >&2
  exit 1
fi

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(cd -- "${script_dir}/../../.." && pwd)
source_policy=${1:-"${repo_root}/docs/AI_SERVER_CONSTITUTION.md"}
policy_dir=/etc/zhipet-ai
policy_file=${policy_dir}/CONSTITUTION.md
team_users=()

if [[ -n ${ZHIPET_TEAM_USERS:-} ]]; then
  read -r -a team_users <<<"${ZHIPET_TEAM_USERS}"
fi

if [[ ! -f ${source_policy} ]]; then
  echo "Policy file not found: ${source_policy}" >&2
  exit 1
fi

install -d -o root -g root -m 0755 "${policy_dir}"
install -o root -g root -m 0644 "${source_policy}" "${policy_file}"
install -o root -g root -m 0755 "${script_dir}/audit-ai-governance.sh" \
  /usr/local/sbin/zhipet-ai-policy-audit

cat >/etc/profile.d/zhipet-ai-policy.sh <<'EOF'
export ZHIPET_AI_POLICY=/etc/zhipet-ai/CONSTITUTION.md

if [[ $- == *i* ]] && [[ -z ${ZHIPET_AI_POLICY_NOTICE_SHOWN:-} ]]; then
  export ZHIPET_AI_POLICY_NOTICE_SHOWN=1
  printf '%s\n' \
    'ZHIPET SERVER POLICY: AI-assisted work must read' \
    '  /etc/zhipet-ai/CONSTITUTION.md' \
    'Production changes require explicit approval, a rollback plan, and audit output.'
fi
EOF
chmod 0644 /etc/profile.d/zhipet-ai-policy.sh

for user_name in "${team_users[@]}"; do
  if ! user_home=$(getent passwd "${user_name}" | cut -d: -f6); then
    echo "Skipping missing user: ${user_name}" >&2
    continue
  fi

  if [[ -z ${user_home} || ! -d ${user_home} ]]; then
    echo "Skipping user without a home directory: ${user_name}" >&2
    continue
  fi

  if [[ ! -e ${user_home}/AI_SERVER_CONSTITUTION.md && ! -L ${user_home}/AI_SERVER_CONSTITUTION.md ]]; then
    ln -s "${policy_file}" "${user_home}/AI_SERVER_CONSTITUTION.md"
    chown -h "${user_name}:${user_name}" "${user_home}/AI_SERVER_CONSTITUTION.md"
  else
    echo "Preserving existing ${user_home}/AI_SERVER_CONSTITUTION.md"
  fi

  if [[ ! -e ${user_home}/AGENTS.md && ! -L ${user_home}/AGENTS.md ]]; then
    ln -s "${policy_file}" "${user_home}/AGENTS.md"
    chown -h "${user_name}:${user_name}" "${user_home}/AGENTS.md"
  else
    echo "Preserving existing ${user_home}/AGENTS.md"
  fi
done

if ((${#team_users[@]} == 0)); then
  echo 'No per-user policy links requested. Set ZHIPET_TEAM_USERS to a space-separated user list when needed.'
fi

if [[ -d /srv/devteam ]]; then
  if [[ ! -e /srv/devteam/AI_SERVER_CONSTITUTION.md && ! -L /srv/devteam/AI_SERVER_CONSTITUTION.md ]]; then
    ln -s "${policy_file}" /srv/devteam/AI_SERVER_CONSTITUTION.md
  fi
  if [[ ! -e /srv/devteam/AGENTS.md && ! -L /srv/devteam/AGENTS.md ]]; then
    ln -s "${policy_file}" /srv/devteam/AGENTS.md
  fi
fi

sha256sum "${policy_file}" >"${policy_dir}/CONSTITUTION.sha256"
chmod 0644 "${policy_dir}/CONSTITUTION.sha256"

echo "Installed AI governance policy at ${policy_file}."
echo "No user group memberships were changed."
if ! /usr/local/sbin/zhipet-ai-policy-audit; then
  echo "Governance audit reported warnings; review them before granting AI access." >&2
fi
