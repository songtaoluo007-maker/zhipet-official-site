# 知宠官网项目交接记忆

更新时间：2026-07-28

本文只保存已验证、可公开或可供团队内部协作的项目事实。不得在此记录密码、
客户端授权码、云密钥、数据库连接串、个人聊天内容或未确认的产品能力。

## 1. 项目定位

- 技术栈：Nuxt 4、Vue 3、TypeScript、Prisma、PostgreSQL。
- 官网负责品牌展示、产品与解决方案说明、研究内容、应用下载入口、邮箱联系和
  意见反馈。
- 官网不再提供用户账号、登录、注册或运营后台。账号体系属于未来 App，不要求
  用户在官网重复登录。
- 对外主体统一使用“知宠团队”。不公开项目阶段、内部进度、运营者姓名、未确认
  地址、电话、资质、合作机构或业务数据。

## 2. 内容与产品边界

- 不把 AI 分析描述成宠物语言逐字翻译。
- AI 结果必须使用“可能”“推测”“趋势”“风险提示”等概率表达，并展示依据与
  不确定性。
- 未经确认，不宣称设备具有医疗级生命体征能力，不编造准确率、数据规模或客户
  案例。
- 研究内容应引用可核验的现实论文与公开文献，不冒充原创研究成果。
- 公开页面不得出现内部 TODO、草案后缀、项目阶段或竞争敏感进展。

## 3. 当前系统设计

- 反馈记录与邮件发件箱在同一数据库事务中创建。
- 邮件通知只包含记录编号、时间和固定分类，不复制反馈正文或联系方式。
- 反馈处理使用受限 CLI；终态联系方式脱敏会和待投递邮件状态进行事务化协调。
- `/api/live` 只表示进程存活并返回安全的短 release。
- `/api/health` 表示数据库依赖是否就绪。
- Nuxt Content 的运行时 SQLite 是可再生成索引，生产环境写入 systemd
  `PrivateTmp`，不写入不可变 release。

## 4. 发布与回滚

- 正式发布只接受已审核并推送的完整 40 位 Git 提交哈希。
- `zhipet-build` 只负责安装、检查和构建；`zhipet` 只负责运行和受控运维命令。
- release 固化为 `root:zhipet` 只读目录，`current` 使用原子符号链接切换。
- 数据库迁移在切换 `current` 前执行；迁移失败时旧版本继续运行。
- 新版本双探针失败时回滚旧版本；首次发布失败时停止服务并撤销 `current`。
- 数据库迁移采用 expand-contract。应用回滚不会自动回滚数据库结构。

## 5. 日志与可观测性

- Nginx 和应用使用统一请求 ID，外部传入的转发链和请求 ID 不被直接信任。
- 应用、邮件、清理、运维状态和 Nginx 日志写入 `/var/log/zhipet`。
- 本地日志使用 logrotate 限制大小和保留周期；CLS 采集、索引、访问控制和告警
  规则记录在 `deploy/tencent-cloud/observability/README.md`。
- `operations_status` 只输出有界计数和连接状态，不输出反馈正文、联系人、邮件
  主题或正文。

## 6. 已验证状态

本轮在 Windows 本地主工作区验证：

- ESLint 通过。
- Nuxt TypeScript 检查通过。
- 33 个测试文件、162 条单元测试通过。
- Nuxt 生产构建通过。
- Playwright 45 条通过，1 条仅桌面适用的用例在移动项目中按设计跳过。
- 所有部署 Shell 脚本和 Node CLI 通过语法检查。
- 敏感信息扫描未发现真实凭据；测试中只使用显式假值。
- 独立只读审查结论为 PASS。

## 7. 仍需真实服务器验收

- 在 Ubuntu 执行 `systemd-analyze verify` 和 `nginx -t`。
- 验证构建账号无法读取生产环境文件和运行日志，运行账号无法修改 release。
- 演练首次发布失败、普通回滚、数据库迁移失败和日志轮转。
- 验证 301、429、受控 502 的请求 ID、安全响应头和日志关联。
- 配置并验证 CLS 索引、LogListener 心跳、缺失事件告警和邮件积压告警。
- 接入真实托管数据库备份成功信号，并完成隔离恢复演练。在此之前，自动备份
  告警仍是 production blocker，必须保留每日人工核验。

## 8. 关键文件

- `AGENTS.md`：长期开发和服务器操作约束。
- `docs/OPERATIONS_RUNBOOK.md`：生产运行、故障处理、备份与恢复。
- `docs/PRODUCTION_OPERATIONS.md`：生产架构和运营说明。
- `deploy/tencent-cloud/README.md`：腾讯云发布步骤。
- `deploy/tencent-cloud/scripts/stage-release.sh`：不可变发布与回滚。
- `deploy/tencent-cloud/observability/README.md`：CLS 和告警配置。

## 9. 清理后恢复本地环境

以下目录属于可再生成内容，可以在磁盘清理时删除：

- `node_modules`
- `.nuxt`
- `.output`
- `dist`
- `.pnpm-store`
- 已完成且不再使用的 `.worktrees` 工作区

恢复开发环境：

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

提交前至少执行：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```
