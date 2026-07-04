# 知宠 ZHIPET 企业官网

基于 Nuxt 4、Vue 3、TypeScript 和 SCSS 的知宠企业级官方网站工程。

## 在线预览

GitHub Pages 地址：[知宠 ZHIPET 官网](https://songtaoluo007-maker.github.io/zhipet-official-site/)

> 当前仓库使用 `gh-pages` 分支发布静态官网。推送源码到 `main` 后，需要将 `.output/public` 的静态产物同步到 `gh-pages` 分支。

## 当前进度

- 已完成工程初始化、基础设计 Token、布局壳层和轻量 UI Kit。
- 已实现首页：首页包含品牌首屏、知宠在做什么、核心产品、解决方案、示范案例、品牌与团队、统一 CTA。
- 已实现产品中心与详情页：智能项圈、知宠 App、健康管理平台。
- 已实现解决方案中心与详情页：家庭养宠、宠物医院、宠物门店。
- 已实现企业内容页：关于知宠、合作伙伴、客户案例、资讯中心。
- 已实现转化与合规占位页：联系我们、预约演示、隐私政策、服务条款。
- 已补充上线基础能力：动态 `robots.txt`、动态 `sitemap.xml`、品牌化 404/错误页。
- 已补充安全与组件工程加固：基础安全响应头、Canonical 域名配置、链接 URL 防护、移动端菜单焦点管理。
- 已补充 SEO 与分享基础：全站 canonical、Open Graph/Twitter 分享图、WebSite/Organization 结构化数据、favicon 与 manifest。
- 已接入内容运营能力：资讯列表与详情页读取 `content/news/*.md`，支持 Markdown 草稿预览和静态预渲染。
- 已补充性能基础配置：静态资源压缩、构建产物缓存头、图片断点与密度配置。
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

## 资讯内容运营

资讯内容放在 `content/news/`，每篇 Markdown 会生成一个 `/news/文件名` 页面，并出现在资讯中心列表。

```markdown
---
title: 文章标题待项目方确认
description: 文章摘要待项目方确认。
category: 产品动态
publishedLabel: 发布日期待项目方确认
status: 正文待项目方确认
order: 4
---

## 内容定位

正文待项目方确认。
```

正式发布前不要填写未经确认的发布日期、作者、客户、合作机构、准确率、资质编号、联系方式或备案信息。

## 内容规范

- 不编造企业、客户、团队、地址、电话、资质、备案和业务数据。
- 缺失内容使用“待项目方确认”。
- AI 图片或概念图必须标注“AI 概念图，仅供参考”。
- 示范案例和概念验证项目不得冒充真实客户案例。
- 联系、预约、隐私政策和服务条款当前均为占位状态，不代表正式业务接口或法律文本。

## 部署

当前仓库已配置 GitHub Pages 自动部署：

- Source：`gh-pages` 分支根目录
- 静态产物：`.output/public`
- 构建命令：`pnpm generate`
- GitHub Pages 子路径：`/zhipet-official-site/`

正式域名确认后填写 `NUXT_PUBLIC_SITE_URL`，并同步调整 GitHub Pages 域名配置；`robots.txt` 和 `sitemap.xml` 会优先使用该配置生成 Canonical URL。正式国内上线前需要确认域名备案和合规信息。
