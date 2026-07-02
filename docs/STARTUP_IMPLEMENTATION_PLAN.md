# ZHIPET Official Site Startup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first engineering foundation for the ZHIPET enterprise website before implementing full pages.

**Architecture:** Create a Nuxt 4, Vue 3, TypeScript, SCSS, and Nuxt Content project with a lightweight official-site UI kit. The first implementation phase focuses on project setup, design tokens, layout shell, base UI, restrained motion, and tests; it must not generate the whole website in one pass.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Vite, SCSS, Nuxt Content, Nuxt Image, Nuxt Fonts, Nuxt SEO/Sitemap, Vitest, Playwright, ESLint, Prettier, pnpm.

---

## 1. Confirmed User Requirements

- Work must start from a plan first; implementation begins only after user approval.
- The project is the ZHIPET enterprise official website, not an e-commerce site and not a SaaS admin dashboard.
- Visual tone: warm, professional, trustworthy, restrained, technology-aware, pet-friendly, enterprise-grade.
- Avoid full-screen technology blue, neon gradients, excessive glassmorphism, dense floating cards, meaningless particles, AI-dashboard mimicry, and fake business data.
- Use Nuxt 4, Vue 3, TypeScript, SCSS, Nuxt Content, Nuxt Image, Nuxt Fonts, SEO/Sitemap, Vitest, Playwright, pnpm.
- Do not use Element Plus, Ant Design Vue, Naive UI, Three.js, particle backgrounds, or complex scroll libraries for this official site.
- Do not invent company data, customer data, team members, certificates, addresses, phone numbers, registration numbers, user counts, sales claims, or partnerships.
- Product images, logo concepts, pet scenes, and other visual assets may be AI-generated for the early phase, but must be clearly marked as concept/reference material.
- Team portraits, certificates, phone numbers, addresses, and registration numbers should not be generated as if real. Use abstract placeholders or text states such as "待项目方确认".
- The first phase should upgrade the component foundation more comprehensively than the initial minimal plan.
- Animations are allowed only as a restrained system: sticky header feedback, button feedback, image fade/slide, section reveal, mobile menu/dialog transitions, and reduced-motion support.
- Do not implement the complete home page or all inner pages in the first phase.

## 2. Current Environment Check

- Current workspace root: `D:\`
- `D:\` is not currently a Git repository.
- Recommended project path: `D:\zhipet-official-site`
- System default Node points to DevEco Studio Node `v18.20.1`, which is not suitable for Nuxt 4.
- Codex bundled Node is available at:

```text
C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
```

- Codex bundled Node version checked: `v24.14.0`
- Nuxt 4 official docs require Node.js `22.x or newer`.
- Preferred package manager: bundled `pnpm.cmd`

## 3. Execution Boundaries

- Phase 1 creates the project foundation only.
- No complete homepage implementation in Phase 1.
- No complete product, solution, case, about, news, contact, or demo page implementation in Phase 1.
- No fake "submit success" form pretending to be real business processing.
- No Git commit unless the user explicitly requests it.
- Network access for dependency installation must be requested separately.
- AI asset generation must be requested separately and must produce clearly labeled concept/reference assets.

## 4. File and Directory Plan

Target project root:

```text
D:\zhipet-official-site
```

Planned foundation files:

```text
D:\zhipet-official-site\PROJECT_SPEC.md
D:\zhipet-official-site\AGENTS.md
D:\zhipet-official-site\README.md
D:\zhipet-official-site\.env.example
D:\zhipet-official-site\nuxt.config.ts
D:\zhipet-official-site\vitest.config.ts
D:\zhipet-official-site\playwright.config.ts
D:\zhipet-official-site\eslint.config.mjs
D:\zhipet-official-site\prettier.config.mjs
D:\zhipet-official-site\package.json
D:\zhipet-official-site\tsconfig.json
```

Planned app structure:

```text
D:\zhipet-official-site\app\app.vue
D:\zhipet-official-site\app\assets\styles\_tokens.scss
D:\zhipet-official-site\app\assets\styles\_mixins.scss
D:\zhipet-official-site\app\assets\styles\_reset.scss
D:\zhipet-official-site\app\assets\styles\_typography.scss
D:\zhipet-official-site\app\assets\styles\_animations.scss
D:\zhipet-official-site\app\assets\styles\main.scss
D:\zhipet-official-site\app\components\base\BaseButton.vue
D:\zhipet-official-site\app\components\base\BaseIconButton.vue
D:\zhipet-official-site\app\components\base\BaseLink.vue
D:\zhipet-official-site\app\components\base\BaseTag.vue
D:\zhipet-official-site\app\components\base\BaseImage.vue
D:\zhipet-official-site\app\components\base\BaseContainer.vue
D:\zhipet-official-site\app\components\base\BaseInput.vue
D:\zhipet-official-site\app\components\forms\FormField.vue
D:\zhipet-official-site\app\components\layout\AppHeader.vue
D:\zhipet-official-site\app\components\layout\MobileMenu.vue
D:\zhipet-official-site\app\components\layout\AppFooter.vue
D:\zhipet-official-site\app\components\common\SectionHeading.vue
D:\zhipet-official-site\app\components\common\PageHero.vue
D:\zhipet-official-site\app\components\common\CTASection.vue
D:\zhipet-official-site\app\composables\useNavigation.ts
D:\zhipet-official-site\app\composables\useScrollReveal.ts
D:\zhipet-official-site\app\composables\useSiteConfig.ts
D:\zhipet-official-site\app\layouts\default.vue
D:\zhipet-official-site\app\pages\index.vue
D:\zhipet-official-site\app\types\site.ts
D:\zhipet-official-site\app\types\ui.ts
```

Planned test structure:

```text
D:\zhipet-official-site\tests\unit\BaseButton.spec.ts
D:\zhipet-official-site\tests\unit\BaseInput.spec.ts
D:\zhipet-official-site\tests\unit\navigation.spec.ts
D:\zhipet-official-site\tests\e2e\smoke.spec.ts
```

## 5. UI Kit Upgrade Plan

### 5.1 Base UI

- `BaseButton`
  - Variants: `primary`, `secondary`, `ghost`, `text`
  - Sizes: `sm`, `md`, `lg`
  - Supports: `to`, `href`, `type`, `loading`, `disabled`, left icon slot, right icon slot, full-width mobile behavior
  - Required states: default, hover, active, focus-visible, disabled, loading

- `BaseIconButton`
  - Used for menu, close, carousel arrows, and utility actions
  - Requires `aria-label`
  - Supports size and variant

- `BaseLink`
  - Normalizes Nuxt internal links and external links
  - External links open with safe attributes

- `BaseTag`
  - Used for capability tags, status tags, reference labels, and "AI 概念图，仅供参考"

- `BaseImage`
  - Wraps `NuxtImg`
  - Requires `alt`
  - Supports aspect ratio, radius, lazy loading, priority loading, and optional concept/reference label

- `BaseContainer`
  - Widths: `narrow`, `default`, `wide`
  - Centralizes responsive side padding

### 5.2 Form UI

- `FormField`
  - Owns label, helper text, error text, required mark, and field ID wiring

- `BaseInput`
  - Supports text, email, tel, and other standard input types
  - Supports disabled, invalid, helper text, autocomplete, and clear focus styles

Future form components:

- `BaseTextarea`
- `BaseSelect`
- `BaseCheckbox`
- `FormMessage`
- `FormActions`

These future components should be added with the demo/contact form phase, not as empty components in Phase 1.

### 5.3 Navigation and Layout

- `AppHeader`
  - Desktop height: 72px
  - Sticky behavior with subtle border and background blur after scroll
  - Current navigation item uses underline, not a filled pill
  - Data comes from `useNavigation.ts`

- `MobileMenu`
  - Drawer style
  - 44px minimum touch targets
  - Escape key and close button support

- `AppFooter`
  - Uses verified site config
  - Missing contact, address, registration number, QR code, and social accounts must render as "待项目方确认"

### 5.4 Page-Level Components

- `SectionHeading`
  - Supports title, description, alignment, and action slot

- `PageHero`
  - Shared inner-page hero structure
  - Supports breadcrumb slot, label, H1, intro text, actions, tags, and media slot

- `CTASection`
  - Reusable bottom conversion section
  - Default copy:

```text
携手知宠，为更多宠物带来健康守护
预约产品演示，了解适合您的合作方案
```

## 6. Button System Decision

Allowed button families:

```text
PrimaryButton
SecondaryButton
GhostButton
TextLink
IconButton
```

Usage rules:

- Each module should have at most one primary action.
- Primary buttons are for conversion actions such as "预约演示".
- Secondary buttons are for product or solution navigation.
- Ghost buttons are for softer actions on light/image backgrounds.
- Text links are for inline or card-level navigation.
- Icon buttons are for menu, close, directional, or utility actions.
- Do not create one-off button styles inside page components.

## 7. Motion System Decision

Allowed in Phase 1:

- Sticky header transition
- Button hover and arrow movement
- Image fade-in and slight upward movement
- Section reveal with opacity and `translateY(12px)`
- Mobile menu transition
- Dialog/accordion transition foundations

Not allowed:

- Three.js scenes
- Particle backgrounds
- Cursor-following effects
- Forced smooth scrolling
- Large parallax sections
- Long loading screens
- All cards flying in at once

Motion tokens:

```scss
:root {
  --motion-duration-fast: 180ms;
  --motion-duration-base: 280ms;
  --motion-duration-slow: 480ms;
  --motion-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Reduced motion support:

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 8. AI Concept Asset Policy

Allowed concept assets:

- Temporary ZHIPET logo concept
- Smart collar concept render
- Pet and owner lifestyle image
- App/device ecosystem illustration
- Hospital/store scenario concept images

Required labeling:

```text
AI 概念图，仅供参考
```

Not allowed as realistic generated proof:

- Fake team portraits
- Fake certificates
- Fake registration numbers
- Fake QR codes
- Fake phone numbers
- Fake addresses
- Fake partner logos
- Fake customer authorization materials

For these items, use:

```text
待项目方确认
```

or abstract placeholder imagery that cannot be mistaken as real proof.

## 9. Phase 1 Tasks

### Task 1: Create Nuxt 4 Project

**Files:**

- Create: `D:\zhipet-official-site\package.json`
- Create: `D:\zhipet-official-site\nuxt.config.ts`
- Create: `D:\zhipet-official-site\app\app.vue`

- [ ] **Step 1: Request network approval**

Run the Nuxt project creation and dependency installation only after the user approves network access.

Expected: dependencies install successfully using bundled Node `v24.14.0` and bundled `pnpm.cmd`.

- [ ] **Step 2: Verify Nuxt version and Node version**

Run:

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --version
pnpm --version
pnpm nuxt --version
```

Expected:

```text
Node >= 22
pnpm available
Nuxt 4 available
```

- [ ] **Step 3: Create minimal app shell**

Create `app\app.vue` with:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 4: Run build smoke check**

Run:

```powershell
pnpm build
```

Expected: build completes without TypeScript or Nuxt config errors.

### Task 2: Add Project Documentation

**Files:**

- Create: `D:\zhipet-official-site\PROJECT_SPEC.md`
- Create: `D:\zhipet-official-site\AGENTS.md`
- Create: `D:\zhipet-official-site\README.md`
- Create: `D:\zhipet-official-site\.env.example`

- [ ] **Step 1: Write `PROJECT_SPEC.md`**

Include the ZHIPET website goals, technology choices, design system, page map, content rules, SEO, accessibility, performance, testing, and deployment standards from the provided project specification.

- [ ] **Step 2: Write `AGENTS.md`**

Include:

```md
# 知宠官网 Codex 开发规则

## 项目目标

开发一个基于 Nuxt 4、Vue 3 和 TypeScript 的知宠企业官网。

## 核心原则

1. 不编造产品、公司、客户、团队、地址、电话、资质和数据。
2. 缺失内容使用 TODO 或“待项目方确认”标记。
3. AI 生成素材必须标注“AI 概念图，仅供参考”。
4. 优先复用组件，不复制页面代码。
5. 使用 TypeScript，禁止 any。
6. 保持页面克制，避免卡片过密。
7. 不安装后台型 UI 组件库。
8. 不加入 Three.js、粒子和强制平滑滚动。
9. 每个页面必须响应式。
10. 每次修改后运行 lint、typecheck 和相关测试。
11. 未经允许不修改无关文件。
12. 未经允许不自动提交 Git。

## 设计规则

- 最大内容宽度 1200px。
- 使用暖白、深咖和金棕色。
- 普通卡片默认无阴影。
- 每个模块最多一个主按钮。
- 每个内页控制在 5–7 个核心模块。
- 模块上下间距桌面端不少于 96px。
- 页面必须支持 prefers-reduced-motion。
```

- [ ] **Step 3: Write `README.md`**

Include local setup, scripts, project structure, content rules, and deployment notes.

- [ ] **Step 4: Write `.env.example`**

Include empty keys only:

```text
NUXT_PUBLIC_SITE_URL=
CONTACT_FORM_ENDPOINT=
DEMO_FORM_ENDPOINT=
```

### Task 3: Add Design Tokens and Global Styles

**Files:**

- Create: `D:\zhipet-official-site\app\assets\styles\_tokens.scss`
- Create: `D:\zhipet-official-site\app\assets\styles\_mixins.scss`
- Create: `D:\zhipet-official-site\app\assets\styles\_reset.scss`
- Create: `D:\zhipet-official-site\app\assets\styles\_typography.scss`
- Create: `D:\zhipet-official-site\app\assets\styles\_animations.scss`
- Create: `D:\zhipet-official-site\app\assets\styles\main.scss`

- [ ] **Step 1: Add color, spacing, radius, shadow, and motion tokens**

Use the approved warm brand palette:

```scss
:root {
  --color-brand-900: #2f241b;
  --color-brand-800: #443326;
  --color-brand-700: #66503c;
  --color-accent-600: #b7792b;
  --color-accent-500: #c88a38;
  --color-accent-300: #e8c894;
  --color-accent-100: #f6ead8;
  --color-bg: #faf8f4;
  --color-surface: #ffffff;
  --color-surface-soft: #f6f1e9;
  --color-text: #241d18;
  --color-text-secondary: #6d655e;
  --color-border: #e8e0d5;
  --color-success: #568267;
  --color-danger: #b85f55;
  --container-default: 1200px;
  --container-wide: 1320px;
  --radius-button: 8px;
  --radius-card: 12px;
  --motion-duration-fast: 180ms;
  --motion-duration-base: 280ms;
  --motion-duration-slow: 480ms;
  --motion-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

- [ ] **Step 2: Add reduced motion block**

Use the reduced-motion CSS from Section 7.

- [ ] **Step 3: Wire styles into Nuxt config**

Configure global SCSS in `nuxt.config.ts`.

- [ ] **Step 4: Run style import check**

Run:

```powershell
pnpm build
```

Expected: SCSS compiles successfully.

### Task 4: Implement Base UI Kit

**Files:**

- Create: `D:\zhipet-official-site\app\components\base\BaseButton.vue`
- Create: `D:\zhipet-official-site\app\components\base\BaseIconButton.vue`
- Create: `D:\zhipet-official-site\app\components\base\BaseLink.vue`
- Create: `D:\zhipet-official-site\app\components\base\BaseTag.vue`
- Create: `D:\zhipet-official-site\app\components\base\BaseImage.vue`
- Create: `D:\zhipet-official-site\app\components\base\BaseContainer.vue`
- Create: `D:\zhipet-official-site\app\types\ui.ts`

- [ ] **Step 1: Define shared UI types**

Define button variants, sizes, tag tones, image radius options, and container widths in `app\types\ui.ts`.

- [ ] **Step 2: Implement `BaseButton`**

Implement variants, sizes, link support, loading, disabled, and slots.

- [ ] **Step 3: Implement `BaseIconButton`**

Require `ariaLabel` prop and render a button with icon slot.

- [ ] **Step 4: Implement `BaseLink`**

Render internal links with `NuxtLink`; render external links with safe attributes.

- [ ] **Step 5: Implement `BaseTag`**

Support concept/reference, neutral, accent, success, and warning tones.

- [ ] **Step 6: Implement `BaseImage`**

Wrap `NuxtImg`, enforce `alt`, and optionally show concept label.

- [ ] **Step 7: Implement `BaseContainer`**

Centralize max width and responsive side padding.

### Task 5: Implement Form Foundation

**Files:**

- Create: `D:\zhipet-official-site\app\components\forms\FormField.vue`
- Create: `D:\zhipet-official-site\app\components\base\BaseInput.vue`

- [ ] **Step 1: Implement `FormField`**

Support label, helper text, error text, required state, and slot.

- [ ] **Step 2: Implement `BaseInput`**

Support `modelValue`, `type`, `placeholder`, `disabled`, `invalid`, `autocomplete`, and accessible IDs.

- [ ] **Step 3: Verify keyboard focus**

Run the app and confirm focus-visible styles are visible on inputs.

### Task 6: Implement Layout Components

**Files:**

- Create: `D:\zhipet-official-site\app\components\layout\AppHeader.vue`
- Create: `D:\zhipet-official-site\app\components\layout\MobileMenu.vue`
- Create: `D:\zhipet-official-site\app\components\layout\AppFooter.vue`
- Create: `D:\zhipet-official-site\app\composables\useNavigation.ts`
- Create: `D:\zhipet-official-site\app\composables\useSiteConfig.ts`
- Create: `D:\zhipet-official-site\app\layouts\default.vue`
- Create: `D:\zhipet-official-site\app\types\site.ts`

- [ ] **Step 1: Add navigation data**

Use:

```text
首页
产品
解决方案
合作伙伴
关于我们
资讯中心
联系我们
```

- [ ] **Step 2: Add site config**

Use "待项目方确认" for address, phone, registration number, QR code, and verified company details.

- [ ] **Step 3: Implement `AppHeader`**

Desktop header with sticky state and reserved mobile menu trigger.

- [ ] **Step 4: Implement `MobileMenu`**

Drawer menu with close button, keyboard-friendly links, and 44px touch targets.

- [ ] **Step 5: Implement `AppFooter`**

Render product, solution, about, contact, policy, and terms sections without fake data.

- [ ] **Step 6: Implement default layout**

Wrap pages with `AppHeader`, main content, and `AppFooter`.

### Task 7: Implement Page-Level Components

**Files:**

- Create: `D:\zhipet-official-site\app\components\common\SectionHeading.vue`
- Create: `D:\zhipet-official-site\app\components\common\PageHero.vue`
- Create: `D:\zhipet-official-site\app\components\common\CTASection.vue`

- [ ] **Step 1: Implement `SectionHeading`**

Support title, description, alignment, eyebrow avoidance by default, and action slot.

- [ ] **Step 2: Implement `PageHero`**

Support H1, intro, actions, tags, and media slot. Do not include dense stats by default.

- [ ] **Step 3: Implement `CTASection`**

Use approved CTA copy and buttons.

### Task 8: Add Motion Composable

**Files:**

- Create: `D:\zhipet-official-site\app\composables\useScrollReveal.ts`
- Modify: `D:\zhipet-official-site\app\assets\styles\_animations.scss`

- [ ] **Step 1: Implement `useScrollReveal`**

Use IntersectionObserver and return a directive-like helper for section reveal.

- [ ] **Step 2: Respect reduced motion**

If `prefers-reduced-motion: reduce` is active, content should render without reveal delay.

- [ ] **Step 3: Add CSS utility classes**

Add classes for reveal initial state and visible state.

### Task 9: Add Basic Tests

**Files:**

- Create: `D:\zhipet-official-site\tests\unit\BaseButton.spec.ts`
- Create: `D:\zhipet-official-site\tests\unit\BaseInput.spec.ts`
- Create: `D:\zhipet-official-site\tests\unit\navigation.spec.ts`
- Create: `D:\zhipet-official-site\tests\e2e\smoke.spec.ts`

- [ ] **Step 1: Test `BaseButton`**

Assert variant classes, disabled state, loading state, and link rendering.

- [ ] **Step 2: Test `BaseInput`**

Assert model updates, invalid state, disabled state, and accessible attributes.

- [ ] **Step 3: Test navigation config**

Assert required navigation items exist and no empty href is used.

- [ ] **Step 4: Add smoke e2e test**

Assert the landing route loads, header exists, footer exists, and no horizontal overflow is present.

### Task 10: Verification

**Files:**

- Modify only if verification reveals issues.

- [ ] **Step 1: Run lint**

Run:

```powershell
pnpm lint
```

Expected: no lint errors.

- [ ] **Step 2: Run typecheck**

Run:

```powershell
pnpm typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 3: Run unit tests**

Run:

```powershell
pnpm test
```

Expected: all unit tests pass.

- [ ] **Step 4: Run build**

Run:

```powershell
pnpm build
```

Expected: production build succeeds.

- [ ] **Step 5: Run e2e smoke test**

Run:

```powershell
pnpm test:e2e
```

Expected: smoke test passes in desktop and mobile viewport.

## 10. Dependencies To Install

Expected dependencies:

```text
nuxt
vue
typescript
@nuxt/content
@nuxt/image
@nuxt/fonts
sass
vitest
@vue/test-utils
playwright
eslint
prettier
```

SEO/Sitemap module choice should be finalized during setup based on current Nuxt 4 compatibility.

## 11. Risks and Decisions Needed

- Network access is required to install dependencies.
- AI image generation requires separate approval and should happen after the UI foundation is ready or when the first visual page is implemented.
- Form persistence destination is not decided yet: options include email service, database, Feishu/enterprise form integration, or a temporary server-side storage mechanism.
- Real company identity information is not available yet and must remain marked as "待项目方确认".
- If the user wants visual concepts before coding pages, a separate design-concept approval phase should be inserted before homepage implementation.

## 12. Approval Gate

Implementation can start only after the user approves this plan.

Recommended execution mode after approval:

```text
Inline Execution
```

Reason: Phase 1 is a tightly coupled engineering foundation. It is better to execute in one session with clear checkpoints, then run verification once the foundation is assembled.
