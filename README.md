# 知宠 ZHIPET 企业官网

基于 Nuxt 4、Vue 3、TypeScript 和 SCSS 的知宠企业级官方网站工程。

## 当前进度

- 已完成工程初始化、基础设计 Token、布局壳层和轻量 UI Kit。
- 已实现首页：首页包含品牌首屏、知宠在做什么、核心产品、解决方案、示范案例、品牌与团队、统一 CTA。
- 已实现产品中心与详情页：智能项圈、知宠 App、健康管理平台。
- 已实现解决方案中心与详情页：家庭养宠、宠物医院、宠物门店。
- 已实现企业内容页：关于知宠、合作伙伴、客户案例、资讯中心。
- 已实现转化与合规占位页：联系我们、预约演示、隐私政策、服务条款。
- 已补充上线基础能力：动态 `robots.txt`、动态 `sitemap.xml`、品牌化 404/错误页。
- 已补充安全与组件工程加固：基础安全响应头、Canonical 域名配置、链接 URL 防护、移动端菜单焦点管理。
- 已将启动实施方案归档到 `docs/STARTUP_IMPLEMENTATION_PLAN.md`。
- 当前使用概念视觉资产，页面均标注“AI 概念图，仅供参考”。真实产品图、Logo、团队、资质、联系方式和备案信息仍需项目方确认。

## 本地运行

推荐使用 Node.js 22 或更高版本。当前 Codex 环境使用内置 Node `v24.14.0`。

[打开本地预览页面](http://127.0.0.1:3000/)

> 该链接需要先在本机启动开发服务。若要分享给其他人直接访问，需要先部署到公网预览环境。

```bash
pnpm install
pnpm dev
```

## 常用命令

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## 项目结构

```text
app/
├── assets/styles
├── components/base
├── components/common
├── components/forms
├── components/layout
├── composables
├── data
├── layouts
├── pages
└── types
```

## 内容规范

- 不编造企业、客户、团队、地址、电话、资质、备案和业务数据。
- 缺失内容使用“待项目方确认”。
- AI 图片或概念图必须标注“AI 概念图，仅供参考”。
- 示范案例和概念验证项目不得冒充真实客户案例。
- 联系、预约、隐私政策和服务条款当前均为占位状态，不代表正式业务接口或法律文本。

## 部署

第一阶段推荐部署到 Vercel、Cloudflare Pages 或国内支持 Nuxt/Nitro 的平台。正式域名确认后填写 `NUXT_PUBLIC_SITE_URL`，`robots.txt` 和 `sitemap.xml` 会优先使用该配置生成 Canonical URL；未配置时回退到当前请求域名。正式国内上线前需要确认域名备案和合规信息。
