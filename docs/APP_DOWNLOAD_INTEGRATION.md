# App 下载入口接入规范

## 目标

官网只展示经过知宠团队确认的 App 下载地址。页面组件不直接写入商店链接、二维码或安装包地址，所有发布信息通过部署环境变量统一配置。

## 环境变量

```env
NUXT_PUBLIC_APP_DOWNLOAD_ENABLED=false
NUXT_PUBLIC_APP_DOWNLOAD_IOS_URL=
NUXT_PUBLIC_APP_DOWNLOAD_ANDROID_URL=
NUXT_PUBLIC_APP_DOWNLOAD_ALLOWED_HOSTS=apps.apple.com,testflight.apple.com
NUXT_PUBLIC_APP_DOWNLOAD_VERSION=
NUXT_PUBLIC_APP_DOWNLOAD_PUBLISHED_AT=
NUXT_PUBLIC_APP_DOWNLOAD_ANDROID_SHA256=
```

- `NUXT_PUBLIC_APP_DOWNLOAD_ENABLED`：总开关。只有值为 `true` 时才解析下载地址。
- `NUXT_PUBLIC_APP_DOWNLOAD_IOS_URL`：App Store 或 TestFlight 的 HTTPS 地址。
- `NUXT_PUBLIC_APP_DOWNLOAD_ANDROID_URL`：确认后的安卓应用商店或安装包 HTTPS 地址。
- `NUXT_PUBLIC_APP_DOWNLOAD_ALLOWED_HOSTS`：允许的下载域名，使用英文逗号分隔。子域名自动继承授权。
- `NUXT_PUBLIC_APP_DOWNLOAD_VERSION`：公开版本号，可选。
- `NUXT_PUBLIC_APP_DOWNLOAD_PUBLISHED_AT`：公开发布日期，可选，建议使用 `YYYY-MM-DD`。
- `NUXT_PUBLIC_APP_DOWNLOAD_ANDROID_SHA256`：直接提供 APK 时填写 64 位 SHA-256，可选。

## 上线要求

1. 下载地址必须使用 HTTPS，并加入允许域名列表。
2. iOS 优先使用 App Store；测试分发使用 TestFlight，正式入口不得混用测试地址。
3. Android 优先使用经过确认的应用商店。直接分发 APK 时必须保留签名流程，并公布 SHA-256。
4. 二维码必须由同一下载地址生成，不单独维护第二套链接。
5. 商店链接、版本号、发布日期和安装包摘要应在同一次发布中更新。
6. 开启下载前运行 `pnpm lint`、`pnpm typecheck`、`pnpm test` 和 `pnpm generate`。
7. 下架或回滚时先将总开关设为 `false`，再处理旧安装包与商店版本。

## 启用步骤

1. 在部署平台填写下载地址、允许域名和已确认的发布信息。
2. 保持总开关为 `false` 完成预览验证。
3. 确认 iOS、Android 跳转目标和移动端展示无误。
4. 将 `NUXT_PUBLIC_APP_DOWNLOAD_ENABLED` 设置为 `true` 并重新部署。
