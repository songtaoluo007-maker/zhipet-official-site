# 腾讯云 CVM 部署模板

本目录提供知宠官网在腾讯云 Linux CVM/Lighthouse 上运行所需的最小生产骨架。模板以 Ubuntu 22.04/24.04、Node.js 22、Nginx 和 systemd 为目标；确认实例系统、地域、域名和数据库方案后再执行。本仓库没有执行云端配置，正式部署必须由 deployment owner 从已审核、可追溯的提交执行。

## 架构边界

- Nginx 仅向公网开放 80/443，并将请求转发到只监听 `127.0.0.1:3000` 的 Nuxt Server。
- PostgreSQL 使用腾讯云私有网络地址，不开放公网 5432。
- Web 服务不持有腾讯云 API 密钥。
- SMTP 客户端授权码仅放在 `/etc/zhipet/zhipet.env`，不得进入 Git。
- 邮件投递和数据清理由 systemd timer 执行。
- `/api/live` 是 process probe；`/api/health` 是 dependency readiness，发布与回滚后必须依次检查两者。
- 本地日志轮转与 CLS retention 是两套独立边界，配置见 `observability/README.md`。

## 服务器前提

1. 安全组只向公网开放 80/443；22 仅允许固定管理 IP。
2. 安装 Node.js 22、pnpm 11、Git 和 Nginx，并创建最小权限运行账号：

   ```bash
   sudo bash deploy/tencent-cloud/scripts/bootstrap-runtime.sh
   ```

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

## 构建身份与首次发布

`bootstrap-runtime.sh` 会创建互相隔离的 `zhipet-build` 构建账号和
`zhipet` 运行账号。安装依赖、生成 Prisma Client、检查和生产构建只由
`stage-release.sh` 在临时目录中以 `zhipet-build` 执行；构建通过后再由
root 固化为 `root:zhipet` 只读 release。不要用 `zhipet` 账号运行 pnpm，
也不要在 `/srv/zhipet/current` 内手工修改或重建产物。两个账号只通过
`zhipet-deploy` 组穿越 `/srv/zhipet` 的受控父目录；构建账号不加入
`zhipet` 运行组，不能读取 `/etc/zhipet/zhipet.env` 或运行日志。

复制 `zhipet.env.example` 为 `/etc/zhipet/zhipet.env`，替换所需占位值，并通过 deployment owner 批准的秘密渠道注入空置凭据，再设置权限：

```bash
sudo chown root:zhipet /etc/zhipet/zhipet.env
sudo chmod 640 /etc/zhipet/zhipet.env
```

`ZHIPET_RELEASE_SHA` 通常不由运维人员手填；`scripts/start-production.mjs` 从当前已验证 `.release-commit` 派生并覆盖运行时值。

首次发布必须先安装 systemd 单元定义，但此时不要启动服务或 timer；
`/srv/zhipet/current` 尚不存在：

```bash
sudo cp deploy/tencent-cloud/systemd/* /etc/systemd/system/
sudo systemctl daemon-reload
```

调用发布脚本前，deployment owner 必须先确认最近一次生产备份和可恢复点仍在
目标 RPO 内。仓库尚未接入可机器验证的备份成功信号，因此在该
`production blocker` 关闭前，这一步属于受控人工发布门禁。确认后，将已审核且
已推送的提交部署为 `/srv/zhipet/releases` 下的不可变版本：

```bash
sudo NUXT_PUBLIC_SITE_URL=https://petsense-agent.com \
  bash deploy/tencent-cloud/scripts/stage-release.sh \
  https://github.com/songtaoluo007-maker/zhipet-official-site.git \
  FULL_40_CHARACTER_COMMIT_SHA
```

发布参数必须是远端可追溯的完整 40 位提交哈希，脚本不接受 `main`
等可变分支名，并会拒绝并发发布。脚本会以 `zhipet-build` 在新目录
执行安装、lint、类型检查、单元测试和生产构建。构建目录固化为只读
release 后，脚本先以 `zhipet` 身份和生产环境文件执行
`prisma migrate deploy`；迁移成功后才原子切换 `current`、启动 Web 服务，
并最多执行 20 次双探针检查。迁移失败时不会暴露新 release。探针失败时会
切回上一版本并重复双探针核验；首次发布没有上一版本时，脚本会停止服务并
删除失败的 `current` 链接，不留下可自动重启的失败版本。Git 端点
不可用时，脚本会使用同一提交哈希回退到 GitHub 官方 codeload 源码包。

Nuxt Content 的生产 SQLite 是可重新生成的内容索引，不是业务数据库。
发布构建会把它固定到 Web 服务 `PrivateTmp` 内的
`/tmp/zhipet-content/contents.sqlite`，避免在只读 release 中创建
`contents.sqlite`。该临时索引不进入备份；服务会根据随 release 发布的
内容转储重新生成。

数据库迁移是前向操作，应用回滚不会自动回滚数据库结构。每个迁移必须采用
expand-contract 方式并与上一 release 向后兼容；破坏性 contract 迁移只能在
旧 release 完全退出且恢复方案已演练后单独执行。`/etc/zhipet/zhipet.env`
由 systemd `EnvironmentFile=` 或 Node `--env-file` 解析，禁止在 Bash 中
`source`。数据库 URL 等值可以包含 `&`，直接 `source` 会改变语义。

首次发布脚本通过后，再持久启用 Web 服务与 timers：

```bash
sudo systemctl enable --now zhipet-web.service
sudo systemctl enable --now zhipet-mail.timer zhipet-purge.timer zhipet-ops-status.timer
```

`zhipet-ops-status.timer` 约每 5 分钟以 `zhipet` 身份采样一次，只把有界状态写入 `/var/log/zhipet/status.jsonl`，错误写入 restricted 的 `/var/log/zhipet/status-error.log`。安装后只核对 unit/timer 定义与状态；本仓库任务不启动服务或访问数据库。

将 Nginx 代理片段与站点模板复制到对应目录，替换 `YOUR_DOMAIN` 和证书路径后先验证再重载：

```bash
sudo cp deploy/tencent-cloud/nginx/zhipet-proxy.conf /etc/nginx/snippets/
sudo cp deploy/tencent-cloud/nginx/zhipet-security-headers.conf /etc/nginx/snippets/
sudo cp deploy/tencent-cloud/nginx/zhipet.conf.template /etc/nginx/sites-available/zhipet.conf
sudo nginx -t
sudo systemctl reload nginx
```

代理片段会覆盖外部传入的 `X-Forwarded-For` 和 `X-Request-ID`，由 Nginx 为每个请求生成统一 ID，并在代理响应中隐藏上游同名头后返回该 ID。HTTP 重定向也直接返回 Nginx ID，因此 301、429、502 与正常应用响应都能和 access log 对齐。应用仅在连接来自本机反向代理时读取转发头。若未来在 Nginx 前增加 CDN 或 WAF，必须先按服务商地址段配置并验证 Nginx `real_ip` 信任边界，不能直接恢复为追加任意客户端转发链。

域名尚未解析或证书尚未实际签发时，先使用
`nginx/zhipet-http-bootstrap.conf.template`。该配置仅用于域名验证和证书签发，
会发送 `X-Robots-Tag: noindex, nofollow`，不得作为长期线上配置。证书文件安装完成后，
再切换到 `nginx/zhipet.conf.template`，并确认 HTTP 会永久重定向到 HTTPS。

`bootstrap-runtime.sh` 会安装仓库管理的 logrotate 策略并预创建 `/var/log/zhipet` 白名单文件。首次上线前，deployment owner 还必须：

1. 记录目标机 `logrotate.timer` 的实际 cadence；`maxsize 20M` 只在 timer 或人工调用 logrotate 时评估。
2. 先核对策略、Nginx 配置、文件类型/权限和 inode，再做一次 controlled forced rotation。
3. 确认 Nginx systemd `USR1` reopen 成功、新 inode 获得新写入、LogListener 继续采集；`USR1` 失败必须作为可见失败处理。
4. 按 `observability/README.md` 创建四个 CLS 主题、白名单采集、最小索引、心跳与 Cloud Monitor 告警。当前仓库不代表这些云端步骤已经完成。

仓库目前没有可验证的备份成功信号。明确数据库产品并接入“托管数据库原生备份成功事件或指标”或“经审批的备份作业脱敏成功事件”，完成隔离验证后，才能启用 24 小时无成功备份告警。接入前这是 `production blocker`，同时存在 `daily manual review gap`，deployment owner 必须在受控控制台每日人工核对；不得用普通 operations/audit 日志伪造来源。

## 上线顺序

1. 保持 `NUXT_PUBLIC_FEEDBACK_ENABLED=false` 和 `MAIL_ENABLED=false`，先验证页面、HTTPS、process probe `/api/live`、dependency readiness `/api/health`、日志和数据库连接。
2. 完成数据库自动备份与恢复演练。
3. 单独启用邮件投递并投递一封测试邮件。
4. 最后启用在线反馈，验证限流、入库、邮件投递和到期清理。
5. 观察至少 24 小时，再进行正式域名切换。

## 日常检查

```bash
sudo systemctl status zhipet-web.service --no-pager
sudo systemctl list-timers 'zhipet-*' --all
curl --fail --silent https://YOUR_DOMAIN/api/live
curl --fail --silent https://YOUR_DOMAIN/api/health
```

生产数据库 CLI 必须固定工作目录、环境文件、Node 路径和运行身份。`zhipet` 是 `nologin` 账号；`sudo --chdir` 直接执行 Node，不启动登录 shell，也不拼接命令字符串：

```bash
sudo -u zhipet --chdir=/srv/zhipet/current -- \
  /usr/local/bin/node \
  --env-file=/etc/zhipet/zhipet.env \
  scripts/operations-status.mjs

sudo -u zhipet --chdir=/srv/zhipet/current -- \
  /usr/local/bin/node \
  --env-file=/etc/zhipet/zhipet.env \
  scripts/manage-feedback.mjs summary
```

反馈子命令和 `<feedback-id>` 必须作为 Node 命令后的独立参数，例如将最后一个 `summary` 改为 `list --limit 20` 或 `show VERIFIED_FEEDBACK_ID`；不得通过 `bash -c` 或字符串拼接转发参数。任一 cwd、env 或目标命令错误都会由 `sudo`/Node 以非零状态直接返回。

`.release-commit` 可由已有授权的身份使用 `sudo -u zhipet -- /usr/bin/cat -- /srv/zhipet/current/.release-commit` 只读核验。普通 JSONL 为 `0640`：应用日志属于 `zhipet` 组，Nginx access 属于 `adm` 组；优先在 CLS 查询，不为便利新增组或权限。restricted stderr 仅供已验证运维人员按现有审批使用 root/`adm` 或受控 `zhipet` 读取，内容不得复制到工单。`journalctl` 主要提供 `unit lifecycle`，业务事件以 JSONL/CLS 为准。

这些示例假定操作者已有组织批准的 sudo 能力；本模板不创建宽泛 sudo 规则，也不建议为 CLI 新增通配 sudoers 条目。

备案主体、域名、证书、数据库备份和告警均确认前，不应开启正式公网流量。
反馈复核与状态更新必须使用上面的固定身份/目录/env CLI，不得直接执行 SQL。事故分级、周期检查、恢复演练和复盘见 `../../docs/OPERATIONS_RUNBOOK.md`。
