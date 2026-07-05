# 知宠 ZHIPET 企业官网

基于 Nuxt 4、Vue 3、TypeScript 和 SCSS 的知宠企业级官方网站工程。

## 在线预览

GitHub Pages 地址：[知宠 ZHIPET 官网](https://songtaoluo007-maker.github.io/zhipet-official-site/)

> 当前仓库使用 `gh-pages` 分支发布静态官网。推送源码到 `main` 后，需要将 `.output/public` 的静态产物同步到 `gh-pages` 分支。

## 当前进度

- 已升级为 V2 官网结构：首页、产品、解决方案、健康研究院、关于我们、帮助中心、预约演示、登录注册、隐私政策和服务条款。
- 已重构首页叙事：围绕“更懂陪伴，更守护健康”，强调安全防走失、健康趋势观察和 AI 状态解释边界。
- 已重构产品中心：一个核心主模块，两种安装方式，四类产品形态均以“待项目方确认”标记未确认参数。
- 已重构解决方案：家庭养宠、宠物医院、宠物门店/机构三类场景，不展示未确认客户、合作 Logo 或落地数据。
- 已新增健康研究院：文章列表、分类筛选、文章详情、风险边界提示和相关阅读。
- 已新增帮助中心与静态登录注册页：客服、反馈、账号体系和鉴权接口均为前端占位。
- 已保留旧入口兼容：`/news`、旧资讯详情、`/partners`、`/contact` 等旧路由会引导至 V2 页面。
- 已补充上线基础能力：动态 `robots.txt`、动态 `sitemap.xml`、品牌化 404/错误页、安全响应头、Canonical、分享图、结构化数据、favicon 与 manifest。
- 当前使用概念视觉资产，页面均标注“AI 概念图，仅供参考”。真实产品图、Logo、团队、资质、联系方式、备案信息和业务接口仍需项目方确认。

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

## 健康研究院内容运营

研究院内容放在 `content/research/`，每篇 Markdown 会生成一个 `/research/文件名` 页面，并出现在健康研究院列表。

```markdown
---
title: 文章标题待项目方确认
description: 文章摘要待项目方确认。
category: 产品动态
publishedLabel: 发布日期待项目方确认
status: 正文待项目方确认
tags:
  - 标签待项目方确认
order: 4
---

## 内容定位

正文待项目方确认。
```

正式发布前不要填写未经确认的发布日期、作者、客户、合作机构、模型准确率、数据规模、资质编号、联系方式或备案信息。

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
