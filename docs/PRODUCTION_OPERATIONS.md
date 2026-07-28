# 知宠官网生产部署与运营手册

## 1. 生产架构

生产环境使用 Nuxt/Nitro Web Service 承载官网和反馈 API，连接独立托管的 PostgreSQL。GitHub 用于源码、审查和受控发布，不承载数据库。

```text
GitHub main
  -> CI 检查
  -> Nuxt Web Service
       -> PostgreSQL
       -> /api/feedback
       -> /api/live
       -> /api/health
  -> 邮件投递任务 -> SMTP 邮箱服务
  -> 数据到期清理任务
```

官网没有用户账号、登录页或运营后台。知宠团队通过 `petSense@126.com` 接收直接邮件和反馈通知。
`/api/live` 是 process probe，只判断 Web 进程是否响应并返回当前短 release；`/api/health` 是 dependency readiness，用于判断数据库依赖是否就绪。两者不能互相替代。

## 2. 首次部署

1. 创建 Nuxt Web Service、PostgreSQL、邮件投递任务和数据清理任务。
2. 配置最终 HTTPS 域名到 `NUXT_PUBLIC_SITE_URL`。
3. 保持 `NUXT_PUBLIC_FEEDBACK_ENABLED=false` 完成首次构建。
4. 腾讯云模板使用 `stage-release.sh`，由脚本在切换流量前执行
   `pnpm db:migrate:deploy`；其他平台也必须保持“迁移成功后才启动新版本”的顺序。
5. 访问 `/api/live` 确认 Web 进程可用，再访问 `/api/health` 确认数据库状态为 `reachable`。
6. 配置 SMTP 客户端授权码，并手动运行一次 `pnpm mail:deliver`。
7. 验证备份、恢复、日志、LogListener 心跳和邮件告警后，再开启在线反馈。

生产环境禁止运行 `prisma migrate dev`。
生产迁移采用 expand-contract 并保持上一版本可继续运行；应用回滚不会自动
回滚数据库结构。
生产发布必须由 deployment owner 从已审核、已推送、可追溯的完整提交执行；AI 或其他协作者不得直接修改生产构建产物。

## 3. 在线反馈开关

```bash
NUXT_PUBLIC_FEEDBACK_ENABLED=false
```

- `false`：隐藏在线反馈表单，页面提供公开邮箱。
- `true`：开放 `/api/feedback` 与反馈表单。

GitHub Pages 必须保持为 `false`，因为静态托管无法运行 Nuxt Server API。
当前应用限流采用有界的单进程内存存储，并由 Nginx 对反馈入口做第二层限流。扩容为多实例或开放新的高成本接口前，必须改用集中式限流存储，并重新核验可信代理来源。

## 4. 数据保存

每日执行：

```bash
pnpm db:purge-expired
```

任务只删除到期的 `feedback` 和 `email_outbox` 记录。在线反馈最多保存 365 天，待发送邮件最多保存 30 天；邮件投递成功后立即清除收件地址、主题和正文，投递状态最多保留 7 天。

反馈复核与状态变更只使用非公开 CLI，不直接执行 SQL。生产环境必须按 `docs/OPERATIONS_RUNBOOK.md` 固定 `/srv/zhipet/current`、`/etc/zhipet/zhipet.env`、`zhipet` 身份和 `/usr/local/bin/node`；下列仅表示允许的子命令，不是可从任意目录直接复制的生产命令：

```bash
pnpm feedback:ops summary
pnpm feedback:ops list --limit 20
pnpm feedback:ops show <feedback-id>
pnpm feedback:ops set-status <feedback-id> reviewing
pnpm feedback:ops set-status <feedback-id> closed --redact-contact
pnpm feedback:ops set-status <feedback-id> invalid --redact-contact
```

默认使用 summary/list 的元数据输出；只有处理指定记录确有必要时使用 show。`--redact-contact` 会在同一数据库事务中清除联系方式并删除尚未投递的关联通知；若通知正在投递，命令会拒绝并要求稍后重试，不能把联系方式误报为已清除。

## 5. 邮件投递

反馈记录与邮件通知在同一个数据库事务中写入。通知只包含记录编号、记录时间和固定分类，不复制反馈正文或联系方式；处理人员通过受限 CLI 按编号查看原始记录。SMTP 暂时不可用时，邮件任务会指数退避重试，最多尝试 5 次，不影响已保存的反馈。

```bash
MAIL_NOTIFICATION_TO=petSense@126.com
MAIL_ENABLED=true
SMTP_HOST=smtp.126.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=petSense@126.com
SMTP_PASSWORD=
MAIL_FROM=petSense@126.com
```

`SMTP_PASSWORD` 必须使用邮箱服务生成的客户端授权码，不得使用网页登录密码，也不得提交 Git。Web Service 只需要 `MAIL_NOTIFICATION_TO`；SMTP 密钥只配置给邮件投递任务。

## 6. 备份与恢复

接收真实反馈前，生产数据库必须具备自动备份或时间点恢复能力：

- 备份与生产数据库位于不同故障域。
- 备份权限与日常部署权限分离。
- 初始目标为 RPO 24h、RTO 2h。
- 至少每季度恢复到隔离临时数据库并执行一次恢复演练。
- 数据库导出文件不得提交 Git 或放入公开存储。

免费数据库实例只适合部署验证，不应承载正式用户反馈。
备份证据只保存备份引用、时间、状态、核验人、汇总校验、双探针结果和清理确认，不保存数据库内容、连接信息或个人数据。

仓库当前没有可验证的备份成功信号。明确数据库产品并接入托管数据库原生备份成功事件或指标，或经审批的备份作业脱敏成功事件，完成隔离验证后才能启用 24 小时告警。接入前这是 `production blocker`，并存在 `daily manual review gap`：deployment owner 每天在受控控制台人工核对最近成功备份和可恢复点。不得让 audit topic 绑定普通发布/operations 日志或虚构 backup 脚本来冒充备份成功。

## 7. 日志与监控

请求日志只记录 `requestId`、方法、规范化路径、状态码、耗时、release 和时间戳，不记录查询字符串、Cookie、认证头、联系方式或反馈正文。

服务器本地 `/var/log/zhipet` 使用 logrotate 的 `daily`、`maxsize 20M` 和 `rotate 7`。`rotate 7` 表示七个本地轮转文件，不是七天，也不替代 CLS retention。CLS 使用四个独立主题：

- `zhipet-access`：14 days。
- `zhipet-operations`：30 days。
- `zhipet-audit`：180 days。
- `zhipet-error-restricted`：7 days，只允许已验证运维组访问，关闭全文索引，仅使用 CLS 内置 `__TIMESTAMP__`、`__FILENAME__`、`__SOURCE__`、`__HOSTNAME__` 定位来源；`__CONTENT__` 不做全文检索。

restricted 错误流只收 `/var/log/zhipet/nginx-error.log`、应用 `*-error.log` 与 `status-error.log`，不得复制到其他主题。Nginx 的 `error` 级日志用于捕获上游超时和拒绝连接，可能带原始请求上下文，只能按 restricted 权限和 7 天留存处理。`durationSeconds` 使用 numeric/double 索引；`upstreamDurationSeconds` 使用 text，因为值可能为 `-` 或包含多个 upstream。完整 LogListener 白名单、索引、心跳、Cloud Monitor 阈值和 controlled forced rotation 步骤见 `deploy/tencent-cloud/observability/README.md`。

`zhipet-ops-status.timer` 约每 5 分钟把有界 `operations_status` 写入 `status.jsonl`，成功和失败都包含 `service`、`type`、`status`、`release`。关键状态全部使用一层固定字段，CLS 可直接查询 `oldestPendingEmailAgeSeconds`、`databaseConnected` 和 `emailOutboxPending`，不包含反馈正文、联系人或邮件内容。

至少配置以下告警：

- 主页 HTTPS 连续失败
- process probe `/api/live` 连续失败
- dependency readiness `/api/health` 连续失败
- HTTP 5xx 比例异常
- 数据库连接失败
- 邮件 worker `job_failed`、`job_completed` 的 `failedCount>0`、`operations_status` 的 `emailOutboxFailed>0`，或持续积压/卡在 processing
- 5 分钟没有 `mail_delivery` 终态事件，或 12 分钟没有 `operations_status`
- 数据清理任务连续失败
- LogListener 心跳中断
- Web 服务 inactive 或重启循环
- 已接入并验证真实备份成功信号后，24 小时内无成功备份证据
- 数据库容量接近上限

## 8. 发布检查

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

发布失败时保留上一稳定版本。数据库迁移采用向前修复策略；删除表或其他不可逆迁移必须先完成备份并验证恢复路径。

发布脚本切换新版本后依次核验 `/api/live` 与 `/api/health`；任一失败会尝试回滚，并对旧版本重复双探针核验。发布后 deployment owner 仍需人工检查主页、两个探针、当前 `.release-commit`、服务状态和日志关联。

日常、每周、每月、季度检查，P0/P1/P2 首次响应，队列诊断、备份恢复与复盘模板见 `docs/OPERATIONS_RUNBOOK.md`。
