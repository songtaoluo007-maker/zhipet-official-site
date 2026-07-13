# 腾讯云 CVM 部署模板

本目录提供知宠官网在腾讯云 Linux CVM 上运行所需的最小生产骨架。模板以 Ubuntu 22.04/24.04、Node.js 22、Nginx 和 systemd 为目标；确认实例系统、地域、域名和数据库方案后再执行。

## 架构边界

- Nginx 仅向公网开放 80/443，并将请求转发到只监听 `127.0.0.1:3000` 的 Nuxt Server。
- PostgreSQL 使用腾讯云私有网络地址，不开放公网 5432。
- Web 服务不持有腾讯云 API 密钥。
- SMTP 客户端授权码仅放在 `/etc/zhipet/zhipet.env`，不得进入 Git。
- 邮件投递和数据清理由 systemd timer 执行。

## 服务器前提

1. 安全组只向公网开放 80/443；22 仅允许固定管理 IP。
2. 安装 Node.js 22、pnpm 11、Git 和 Nginx。
3. 创建系统用户与目录：

   ```bash
   sudo adduser --system --group --home /srv/zhipet zhipet
   sudo mkdir -p /srv/zhipet/current /etc/zhipet /etc/nginx/ssl /var/www/letsencrypt
   sudo chown -R zhipet:zhipet /srv/zhipet
   ```

4. 将已审核且已推送的发布提交部署到 `/srv/zhipet/current`。

## 首次发布

在项目目录执行：

```bash
sudo -u zhipet pnpm install --frozen-lockfile
sudo -u zhipet pnpm db:generate
sudo -u zhipet pnpm lint
sudo -u zhipet pnpm typecheck
sudo -u zhipet pnpm test
sudo -u zhipet pnpm build
```

复制 `zhipet.env.example` 为 `/etc/zhipet/zhipet.env`，替换所有占位值，再设置权限：

```bash
sudo chown root:zhipet /etc/zhipet/zhipet.env
sudo chmod 640 /etc/zhipet/zhipet.env
```

在数据库自动备份已开启且完成一次恢复验证后执行迁移：

```bash
sudo -u zhipet bash -lc 'set -a; source /etc/zhipet/zhipet.env; set +a; pnpm db:migrate:deploy'
```

安装并启动 systemd 单元：

```bash
sudo cp deploy/tencent-cloud/systemd/* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now zhipet-web.service
sudo systemctl enable --now zhipet-mail.timer zhipet-purge.timer
```

将 Nginx 代理片段与站点模板复制到对应目录，替换 `YOUR_DOMAIN` 和证书路径后先验证再重载：

```bash
sudo cp deploy/tencent-cloud/nginx/zhipet-proxy.conf /etc/nginx/snippets/
sudo cp deploy/tencent-cloud/nginx/zhipet.conf.template /etc/nginx/sites-available/zhipet.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 上线顺序

1. 保持 `NUXT_PUBLIC_FEEDBACK_ENABLED=false` 和 `MAIL_ENABLED=false`，先验证页面、HTTPS、`/api/health`、日志和数据库连接。
2. 完成数据库自动备份与恢复演练。
3. 单独启用邮件投递并投递一封测试邮件。
4. 最后启用在线反馈，验证限流、入库、邮件投递和到期清理。
5. 观察至少 24 小时，再进行正式域名切换。

## 日常检查

```bash
systemctl status zhipet-web.service
systemctl list-timers 'zhipet-*'
journalctl -u zhipet-web.service -n 100 --no-pager
curl --fail --silent https://YOUR_DOMAIN/api/health
```

备案主体、域名、证书、数据库备份和告警均确认前，不应开启正式公网流量。
