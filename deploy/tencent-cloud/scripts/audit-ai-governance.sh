#!/usr/bin/env bash

set -u

policy_file=/etc/zhipet-ai/CONSTITUTION.md
team_users=()
warning_count=0

if [[ -n ${ZHIPET_TEAM_USERS:-} ]]; then
  read -r -a team_users <<<"${ZHIPET_TEAM_USERS}"
fi

pass() {
  printf 'PASS  %s\n' "$1"
}

warn() {
  warning_count=$((warning_count + 1))
  printf 'WARN  %s\n' "$1"
}

if [[ -r ${policy_file} ]]; then
  pass "Policy is readable: ${policy_file}"
else
  warn "Policy is missing or unreadable: ${policy_file}"
fi

if [[ -r /etc/zhipet-ai/CONSTITUTION.sha256 ]] && \
  (cd / && sha256sum --check /etc/zhipet-ai/CONSTITUTION.sha256 >/dev/null 2>&1); then
  pass 'Policy checksum matches the installed manifest'
else
  warn 'Policy checksum is missing or does not match'
fi

if [[ -d /srv/devteam ]]; then
  shared_mode=$(stat -c '%a' /srv/devteam 2>/dev/null || true)
  shared_group=$(stat -c '%G' /srv/devteam 2>/dev/null || true)
  if [[ ${shared_mode} == 2770 && ${shared_group} == devteam ]]; then
    pass '/srv/devteam uses devteam group and mode 2770'
  else
    warn "/srv/devteam expected group=devteam mode=2770; found group=${shared_group:-unknown} mode=${shared_mode:-unknown}"
  fi
else
  warn '/srv/devteam does not exist'
fi

for user_name in "${team_users[@]}"; do
  if ! id_output=$(id "${user_name}" 2>/dev/null); then
    warn "Missing team user: ${user_name}"
    continue
  fi

  if [[ ${id_output} == *'(sudo)'* || ${id_output} == *'(docker)'* || ${id_output} == *'(lxd)'* ]]; then
    warn "${user_name} has root-equivalent group membership: ${id_output}"
  else
    pass "${user_name} has no sudo/docker/lxd membership"
  fi

  user_home=$(getent passwd "${user_name}" | cut -d: -f6)
  if [[ -r ${user_home}/AI_SERVER_CONSTITUTION.md ]]; then
    pass "${user_name} has a policy entry in the home directory"
  else
    warn "${user_name} is missing the home policy entry"
  fi
done

if ((${#team_users[@]} == 0)); then
  warn 'No team users were supplied; set ZHIPET_TEAM_USERS to audit per-user policy links and group memberships'
fi

if [[ -e /etc/zhipet/zhipet.env ]]; then
  env_mode=$(stat -c '%a' /etc/zhipet/zhipet.env 2>/dev/null || true)
  if [[ ${env_mode} == 640 || ${env_mode} == 600 ]]; then
    pass "/etc/zhipet/zhipet.env mode is ${env_mode}"
  else
    warn "/etc/zhipet/zhipet.env should use mode 640 or 600; found ${env_mode:-unknown}"
  fi
fi

printf 'SUMMARY warnings=%d\n' "${warning_count}"

if ((warning_count > 0)); then
  exit 2
fi
