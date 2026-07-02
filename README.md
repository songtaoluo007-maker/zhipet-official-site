# 知宠 ZHIPET 企业官网

基于 Nuxt 4、Vue 3、TypeScript 和 SCSS 的知宠企业级官方网站工程。

## 本地运行

推荐使用 Node.js 22 或更高版本。当前 Codex 环境使用内置 Node `v24.14.0`。

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
├── layouts
├── pages
└── types
```

## 内容规范

- 不编造企业、客户、团队、地址、电话、资质、备案和业务数据。
- 缺失内容使用“待项目方确认”。
- AI 图片必须标注“AI 概念图，仅供参考”。

## 部署

第一阶段推荐静态预渲染后部署到 Vercel、Cloudflare Pages 或国内对象存储与 CDN。正式国内上线前需要确认域名备案和合规信息。
