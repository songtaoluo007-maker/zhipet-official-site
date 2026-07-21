# 知宠官网生产部署与运营手册

## 1. 生产架构

生产环境使用 Nuxt/Nitro Web Service 承载官网和反馈 API，连接独立托管的 PostgreSQL。GitHub 用于源码、审查和自动部署，不承载数据库。

```text
GitHub main
  -> CI 检查
  -> Nuxt Web Service
       -> PostgreSQL
       -> /api/feedback
       -> /api/health
  -> 邮件投递任务 -> SMTP 邮箱服务
  -> 数据到期清理任务
```

官网没有用户账号、登录页或运营后台。知宠团队通过 `petSense@126.com` 接收直接邮件和反馈通知。

## 2. 首次部署

1. 创建 Nuxt Web Service、PostgreSQL、邮件投递任务和数据清理任务。
2. 配置最终 HTTPS 域名到 `NUXT_PUBLIC_SITE_URL`。
3. 保持 `NUXT_PUBLIC_FEEDBACK_ENABLED=false` 完成首次构建。
4. 执行 `pnpm db:migrate:deploy`。
5. 访问 `/api/live` 确认 Web 进程可用，再访问 `/api/health` 确认数据库状态为 `reachable`。
6. 配置 SMTP 客户端授权码，并手动运行一次 `pnpm mail:deliver`。
7. 验证备份、恢复、日志和邮件告警后，再开启在线反馈。

生产环境禁止运行 `prisma migrate dev`。

## 3. 在线反馈开关

```bash
NUXT_PUBLIC_FEEDBACK_ENABLED=false
```

- `false`：隐藏在线反馈表单，页面提供公开邮箱。
- `true`：开放 `/api/feedback` 与反馈表单。

GitHub Pages 必须保持为 `false`，因为静态托管无法运行 Nuxt Server API。

## 4. 数据保存

每日执行：

```bash
pnpm db:purge-expired
```

任务只删除到期的 `feedback` 和 `email_outbox` 记录。在线反馈最多保存 365 天，待发送邮件最多保存 30 天；邮件投递成功后立即清除收件地址、主题和正文，投递状态最多保留 7 天。

## 5. 邮件投递

反馈记录与邮件通知在同一个数据库事务中写入。SMTP 暂时不可用时，邮件任务会指数退避重试，最多尝试 5 次，不影响已保存的反馈。

```bash
MAIL_NOTIFICATION_TO=petSense@126.com
MAIL_ENABLED=true
SMTP_HOST=smtp.126.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=petSense@126.com
SMTP_PASSWORD=<客户端授权码>
MAIL_FROM=petSense@126.com
```

`SMTP_PASSWORD` 必须使用邮箱服务生成的客户端授权码，不得使用网页登录密码，也不得提交 Git。Web Service 只需要 `MAIL_NOTIFICATION_TO`；SMTP 密钥只配置给邮件投递任务。

## 6. 备份与恢复

接收真实反馈前，生产数据库必须具备自动备份或时间点恢复能力：

- 备份与生产数据库位于不同故障域。
- 备份权限与日常部署权限分离。
- 至少每季度执行一次恢复演练。
- 数据库导出文件不得提交 Git 或放入公开存储。

免费数据库实例只适合部署验证，不应承载正式用户反馈。

## 7. 日志与监控

请求日志只记录 `requestId`、方法、路径、状态码、耗时和时间戳，不记录 Cookie、联系方式或反馈正文。

至少配置以下告警：

- `/api/live` 连续失败
- `/api/health` 连续失败
- HTTP 5xx 比例异常
- 数据库连接失败
- 邮件队列失败或持续积压
- 数据清理任务连续失败
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
