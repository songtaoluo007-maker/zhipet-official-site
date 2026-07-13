# 知宠 ZHIPET 官网

基于 Nuxt 4、Vue 3、TypeScript、SCSS、Prisma 和 PostgreSQL 的知宠宠物健康科技官网。

官网用于介绍知宠的产品、解决方案、研究内容与使用边界，对外保留两种联络方式：

- 邮箱联系我们：`petSense@126.com`
- 意见问题反馈：`/help#feedback`

官网不提供用户注册或登录。软件 App 如后续上线，其账号体系、数据规则和用户协议将独立建设，避免用户在官网二次登录。

- 维护团队：知宠团队
- 在线预览：[知宠 ZHIPET 官网](https://songtaoluo007-maker.github.io/zhipet-official-site/)

## 功能概览

- 首页、产品、解决方案、健康研究院、项目介绍、联系页、帮助中心、隐私说明和使用条款。
- 响应式导航、移动菜单、返回顶部、Canonical、分享图、结构化数据、动态 `robots.txt` 与 `sitemap.xml`。
- 健康研究院 Markdown 内容、分类筛选、文章详情、风险边界提示和相关阅读。
- 意见反馈经 Nuxt Server API 校验后写入 PostgreSQL，并与邮件通知一起事务化写入 `email_outbox`。
- 独立邮件投递任务使用 SMTP 客户端授权码发送反馈通知，失败时重试，成功后清除邮件正文和收件地址。
- 数据到期清理任务只处理反馈记录和邮件出站记录。

## 本地运行

推荐使用 Node.js 22 或更高版本。首次运行先从 `.env.example` 创建 `.env`，并确保 Docker Desktop 已启动。

```bash
pnpm install
pnpm db:dev
pnpm db:migrate
pnpm dev
```

本地地址：[http://127.0.0.1:3000/](http://127.0.0.1:3000/)

`dev`、`typecheck`、`build` 和 `generate` 使用彼此隔离的 Nuxt 构建目录，避免并行任务改写开发服务正在使用的 Nuxt Content 索引。

## 常用命令

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm generate

pnpm db:dev
pnpm db:down
pnpm db:generate
pnpm db:migrate
pnpm db:migrate:deploy
pnpm db:studio
pnpm db:purge-expired
pnpm mail:deliver
```

## 项目结构

```text
app/
├── app.vue
├── error.vue
├── assets/styles/          # 全站 Token、排版、布局和动效样式
├── components/
│   ├── base/               # Button、Icon、Image、Input 等基础组件
│   ├── common/             # 跨页面展示组件
│   ├── corporate/          # 隐私说明与使用条款组件
│   ├── forms/              # 反馈表单字段组件
│   ├── home/               # 首页叙事模块
│   ├── layout/             # 导航、页脚、移动菜单、返回顶部
│   ├── products/           # 产品详情模块
│   └── solutions/          # 解决方案详情模块
├── composables/            # SEO、页面行为与配置组合式逻辑
├── data/                   # 导航、产品、方案和官网结构化内容
├── layouts/                # Nuxt 页面布局
├── pages/                  # 官网文件路由，不包含账号或后台页面
├── types/                  # 站点内容和 UI 类型
└── utils/                  # 前端辅助函数

content/research/           # 健康研究院 Markdown 内容
prisma/                     # Feedback、EmailOutbox 模型与版本化迁移
public/                     # favicon、manifest 和视觉素材
server/
├── api/                    # 反馈、健康检查等 Nitro 接口
├── domain/                 # 反馈输入校验与通用验证规则
├── middleware/             # 请求追踪与结构化日志
├── routes/                 # robots.txt 与 sitemap.xml
└── utils/                  # Prisma、限流、邮件队列等基础设施
shared/                     # 前后端共享常量和反馈类型
scripts/                    # 数据清理与邮件投递任务
tests/
├── unit/                   # Vitest 单元测试
└── e2e/                    # Playwright 冒烟测试

docs/                       # 项目说明和生产运营文档
.github/workflows/          # GitHub Pages 检查与部署
```

## 数据边界

- 在线反馈仅采集反馈分类、正文、可选联系方式和隐私说明确认信息。
- 反馈最多保存 365 天，待发送邮件最多保存 30 天。
- 邮件发送成功后立即清除队列中的收件地址、主题和正文，只保留不含反馈内容的投递状态最多 7 天。
- `pnpm db:purge-expired` 删除到期反馈和邮件记录。
- 官网不保存账号、密码、会话、家庭成员、宠物档案、订阅邮箱或产品交流申请。
- 个人信息权利请求通过公开邮箱受理，一般在 15 个工作日内完成处理或说明进度。

## 部署边界

GitHub Pages 只能托管静态页面，不能运行 `server/api` 或连接 PostgreSQL。Pages 构建使用 `NUXT_PUBLIC_FEEDBACK_ENABLED=false`，访客仍可通过公开邮箱联系知宠团队。

需要开放在线反馈时，应部署完整 Nuxt Server、PostgreSQL、邮件投递任务和数据清理任务。仓库根目录 `render.yaml` 提供首个部署模板，生产环境确认数据库备份、HTTPS、SMTP 客户端授权码与监控后，再设置：

```bash
NUXT_PUBLIC_FEEDBACK_ENABLED=true
```

生产迁移、备份、邮件和发布检查见 [生产部署与运营手册](docs/PRODUCTION_OPERATIONS.md)。

腾讯云 Linux CVM 的 Nginx、systemd、定时任务和环境变量模板见 [腾讯云部署模板](deploy/tencent-cloud/README.md)。
