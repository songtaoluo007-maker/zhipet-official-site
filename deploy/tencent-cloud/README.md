# 腾讯云 CVM 部署模板

本目录提供知宠官网在腾讯云 Linux CVM 上运行所需的最小生产骨架。模板以 Ubuntu 22.04/24.04、Node.js 22、Nginx 和 systemd 为目标；确认实例系统、地域、域名和数据库方案后再执行。

## 架构边界

- Nginx 仅向公网开放 80/443，并将请求转发到只监听 `127.0.0.1:3000` 的 Nuxt Server。
- PostgreSQL 使用腾讯云私有网络地址，不开放公网 5432。
- Web 服务不持有腾讯云 API 密钥。
- SMTP 客户端授权码仅放在 `/etc/zhipet/zhipet.env`，不得进入 Git。
- 邮件投递和数据清理由 systemd timer 执行。

## 服务器前提

1. 安全组只向公网开放 80/443；22 仅允许固定管理 IP。
2. 安装 Node.js 22、pnpm 11、Git 和 Nginx，并创建最小权限运行账号：

   ```bash
   sudo bash deploy/tencent-cloud/scripts/bootstrap-runtime.sh
   ```

3. 将已审核且已推送的发布提交部署为 `/srv/zhipet/releases` 下的不可变版本，再将 `/srv/zhipet/current` 原子切换到该版本：

   ```bash
   sudo NUXT_PUBLIC_SITE_URL=https://petsense-agent.com \
     bash deploy/tencent-cloud/scripts/stage-release.sh \
     https://github.com/songtaoluo007-maker/zhipet-official-site.git \
     FULL_40_CHARACTER_COMMIT_SHA
   ```

   该脚本会在新目录执行安装、lint、类型检查、单元测试和生产构建。任一步失败都不会切换 `current`。当服务器无法访问 GitHub Git 端点时，脚本仅在提供完整提交哈希的情况下回退到 GitHub 官方 codeload 源码包。

## AI 操作治理

服务器接入 AI 工具前，先安装仓库中的服务器宪法与审计入口：

```bash
sudo ZHIPET_TEAM_USERS='USER_A USER_B USER_C USER_D' \
  bash deploy/tencent-cloud/scripts/install-ai-governance.sh
sudo ZHIPET_TEAM_USERS='USER_A USER_B USER_C USER_D' \
  /usr/local/sbin/zhipet-ai-policy-audit
```

安装器会将 `docs/AI_SERVER_CONSTITUTION.md` 发布到 `/etc/zhipet-ai`，并为显式提供的团队账号和 `/srv/devteam` 创建规则入口。请将占位用户名替换为服务器实际账号；脚本不会自动发现、记录或调整用户组。

人类账号与 AI 共用身份时无法形成权限隔离。用于 AI 的身份不得加入 `sudo`、`docker` 或 `lxd` 组；如需保留成员的人工管理权限，应为 AI 单独创建可吊销、可审计的受限账号和 SSH 密钥。

## 首次发布

在项目目录执行：

```bash
sudo -u zhipet pnpm install --frozen-lockfile
sudo -u zhipet pnpm db:generate
sudo -u zhipet pnpm lint
sudo -u zhipet pnpm typecheck
sudo -u zhipet pnpm test
sudo -u zhipet pnpm build
```

复制 `zhipet.env.example` 为 `/etc/zhipet/zhipet.env`，替换所有占位值，再设置权限：

```bash
sudo chown root:zhipet /etc/zhipet/zhipet.env
sudo chmod 640 /etc/zhipet/zhipet.env
```

在数据库自动备份已开启且完成一次恢复验证后执行迁移：

```bash
sudo -u zhipet bash -lc 'set -a; source /etc/zhipet/zhipet.env; set +a; pnpm db:migrate:deploy'
```

安装并启动 systemd 单元：

```bash
sudo cp deploy/tencent-cloud/systemd/* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now zhipet-web.service
sudo systemctl enable --now zhipet-mail.timer zhipet-purge.timer
```

将 Nginx 代理片段与站点模板复制到对应目录，替换 `YOUR_DOMAIN` 和证书路径后先验证再重载：

```bash
sudo cp deploy/tencent-cloud/nginx/zhipet-proxy.conf /etc/nginx/snippets/
sudo cp deploy/tencent-cloud/nginx/zhipet.conf.template /etc/nginx/sites-available/zhipet.conf
sudo nginx -t
sudo systemctl reload nginx
```

域名尚未解析或证书尚未实际签发时，先使用
`nginx/zhipet-http-bootstrap.conf.template`。该配置仅用于域名验证和证书签发，
会发送 `X-Robots-Tag: noindex, nofollow`，不得作为长期线上配置。证书文件安装完成后，
再切换到 `nginx/zhipet.conf.template`，并确认 HTTP 会永久重定向到 HTTPS。

## 上线顺序

1. 保持 `NUXT_PUBLIC_FEEDBACK_ENABLED=false` 和 `MAIL_ENABLED=false`，先验证页面、HTTPS、`/api/health`、日志和数据库连接。
2. 完成数据库自动备份与恢复演练。
3. 单独启用邮件投递并投递一封测试邮件。
4. 最后启用在线反馈，验证限流、入库、邮件投递和到期清理。
5. 观察至少 24 小时，再进行正式域名切换。

## 日常检查

```bash
systemctl status zhipet-web.service
systemctl list-timers 'zhipet-*'
journalctl -u zhipet-web.service -n 100 --no-pager
curl --fail --silent https://YOUR_DOMAIN/api/health
```

备案主体、域名、证书、数据库备份和告警均确认前，不应开启正式公网流量。
