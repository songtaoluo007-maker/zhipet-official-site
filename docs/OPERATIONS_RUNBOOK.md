# 知宠官网运维与事故 Runbook

本文供已授权运维人员处置生产事件。仓库没有执行任何云端或服务器操作；正式部署、回滚、迁移、服务变更和腾讯云配置均由 deployment owner 在审批后执行。AI 参与服务器操作前必须先阅读 `docs/AI_SERVER_CONSTITUTION.md`。

## 1. 值守目标与分级

| 级别 | 判定示例 | 首次响应目标 | 处置目标 |
| --- | --- | --- | --- |
| P0 | 官网不可用、数据库不可用、可能数据丢失、疑似凭据或敏感数据泄露 | 10 分钟 | 立即止损并持续协调，直到恢复或进入受控降级 |
| P1 | 反馈或邮件处理不可用、重复 5xx、严重性能退化、关键作业持续失败 | 30 分钟 | 2 小时内恢复关键能力或给出经批准的降级方案 |
| P2 | 局部内容/样式故障、单次作业延迟、非关键告警 | 1 个工作日 | 排入受控修复并验证 |

初始数据库恢复目标为 RPO 24h、RTO 2h。事件指挥人负责分级、时间线和升级；deployment owner 负责发布与回滚；数据库恢复只由具备相应权限的负责人执行。至少两名已验证联系人必须能够接收 critical 告警。

## 2. 首次响应

先记录事件编号、UTC 与本地时间、告警规则、影响范围、当前 release 和指挥人。不要先重启或清日志。按只读顺序收集最小证据：

```bash
curl --fail --silent --show-error https://YOUR_DOMAIN/
curl --fail --silent --show-error https://YOUR_DOMAIN/api/live
curl --fail --silent --show-error https://YOUR_DOMAIN/api/health
sudo systemctl status zhipet-web.service --no-pager
sudo systemctl list-timers 'zhipet-*' --all
sudo journalctl -u zhipet-web.service -n 100 --no-pager
readlink -f /srv/zhipet/current
sudo -u zhipet -- /usr/bin/cat -- /srv/zhipet/current/.release-commit

sudo -u zhipet --chdir=/srv/zhipet/current -- \
  /usr/local/bin/node \
  --env-file=/etc/zhipet/zhipet.env \
  scripts/operations-status.mjs
```

`YOUR_DOMAIN` 必须替换为已核验生产域名。`/api/live` 是 process probe；`/api/health` 是 dependency readiness。主页失败而两个探针成功时优先检查 DNS、TLS 与 Nginx；live 失败说明 Web 进程链路异常；live 成功但 health 失败时优先检查依赖，不要把进程存活误报成服务就绪。

查询 CLS 时使用告警时间窗、`requestId`、短 release、service、type、job、status 和已清洗 `errorCode`。不要把完整原始日志、反馈内容、联系人、邮件内容、Cookie、认证头、查询字符串或数据库内容复制到群聊和工单。

`zhipet` 是 `nologin` 账号。运维 CLI 使用 `sudo --chdir` 固定工作目录，并由 Node `--env-file` 直接解析 root 管理、`root:zhipet 0640` 的 `/etc/zhipet/zhipet.env`；不启动登录 shell，也不拼接命令字符串。不得从其他目录运行或依赖当前用户的 `.env`。这些命令要求操作者已有审批权限；本 Runbook 不创建宽泛 sudo，也不授予通配 sudoers。

`.release-commit` 只允许只读核验。普通 JSONL 为 `0640`：应用日志属于 `zhipet` 组，Nginx access 属于 `adm` 组，默认优先通过 CLS 查询。restricted stderr 只允许已验证运维人员按现有 root/`adm` 或受控 `zhipet` 权限查看，不复制到工单或个人设备。`journalctl` 主要用于 `unit lifecycle`；业务事件与计数在 JSONL/CLS，不要把 journal 当作业务日志来源。

## 3. 发布与回滚核验

正式发布只接受已审核、已推送、可追溯的完整 40 位提交哈希，并由 deployment owner 调用 `deploy/tencent-cloud/scripts/stage-release.sh`。调用前必须确认最近成功备份和可恢复点仍在目标 RPO 内；自动备份信号接入前，这是受控人工发布门禁。脚本先固化只读 release，再以运行身份执行 `prisma migrate deploy`；迁移成功后才切换 `current` 并依次检查 `/api/live` 和 `/api/health`。迁移失败时旧版本保持在线；探针失败时会尝试切回上一版本并重复双探针核验。首次发布探针失败时会停止服务并撤销 `current`，不会留下失败版本持续自动重启。

数据库迁移采用 expand-contract 并保持上一 release 可继续运行。应用回滚不会自动回滚数据库结构；不得把破坏性 schema 回退加入自动化发布。

发布后人工验收：

```bash
readlink -f /srv/zhipet/current
sudo -u zhipet -- /usr/bin/cat -- /srv/zhipet/current/.release-commit
curl --fail --silent --show-error https://YOUR_DOMAIN/api/live
curl --fail --silent --show-error https://YOUR_DOMAIN/api/health
systemctl status zhipet-web.service --no-pager
```

确认 live 返回的短 release 与已验证提交前 12 位一致，health 表示依赖就绪，主页和关键静态资源可访问，Nginx 与应用请求日志使用同一 `requestId`。回滚后重复全部核验，并确认 `current` 指向旧 release。若旧版本双探针仍失败，升级为 P0，不连续盲目重启。

## 4. 服务、timer、作业与队列

当前 systemd 计划：

- `zhipet-mail.timer`：启动后 2 分钟首次运行，之后约每 1 分钟运行，`AccuracySec=10s`。
- `zhipet-purge.timer`：每天 03:30，最多 10 分钟随机延迟，`Persistent=true`。
- `zhipet-ops-status.timer`：启动后约 1 分钟首次运行，之后约每 5 分钟运行，`AccuracySec=30s`，输出有界状态采样。

诊断命令：

```bash
sudo systemctl list-timers 'zhipet-*' --all
sudo systemctl status zhipet-mail.timer zhipet-mail.service --no-pager
sudo systemctl status zhipet-purge.timer zhipet-purge.service --no-pager
sudo systemctl status zhipet-ops-status.timer zhipet-ops-status.service --no-pager
sudo journalctl -u zhipet-mail.service -n 100 --no-pager
sudo journalctl -u zhipet-purge.service -n 100 --no-pager
```

`journalctl` 只用于确认 timer/service 的 unit lifecycle。邮件与清理业务事件查询对应 JSONL/CLS；status 采样查询 `/var/log/zhipet/status.jsonl` 或 CLS。邮件 worker 失败使用 `type=job_failed AND job=mail_delivery`；单封邮件终态失败使用 `type=job_completed AND job=mail_delivery AND failedCount>0`，持久失败状态使用 `type=operations_status AND emailOutboxFailed>0`。积压规则使用 `type=operations_status AND oldestPendingEmailAgeSeconds>600`，并查询一层字段 `emailOutboxPending` 判断规模。约 5 分钟采样可支撑超过 10 分钟积压告警；连续 5 分钟没有 `mail_delivery` 终态事件、12 分钟没有 `operations_status`、processing 持续 20 分钟或清理作业连续 36 小时无 `job_completed` 也应告警。

反馈操作只使用受限服务账号和以下 CLI，不直接执行 SQL：

```bash
sudo -u zhipet --chdir=/srv/zhipet/current -- \
  /usr/local/bin/node \
  --env-file=/etc/zhipet/zhipet.env \
  scripts/manage-feedback.mjs summary
```

把 `summary` 替换为下列独立参数之一：`list --limit 20`、`show VERIFIED_FEEDBACK_ID`、`set-status VERIFIED_FEEDBACK_ID reviewing`、`set-status VERIFIED_FEEDBACK_ID closed --redact-contact` 或 `set-status VERIFIED_FEEDBACK_ID invalid --redact-contact`。参数必须作为 Node 命令后的独立 argv，不得通过 `bash -c` 或字符串拼接转发。默认使用 summary/list 的元数据视图；邮件通知只给出记录编号、时间和分类，只有处理单条反馈确有必要时使用 show。终态后不再需要联系信息时使用显式 `--redact-contact`；该操作会事务化删除尚未投递的关联通知，若返回通知正在投递则等待 worker 完成后重试。

生产环境文件只由 systemd `EnvironmentFile=` 或 Node `--env-file` 解析，
禁止在 Bash 中 `source`；数据库 URL 等值可能包含 `&` 等 shell 控制字符。

## 5. 备份与恢复

生产数据库备份必须在应用服务器之外、不同故障域保存，且备份权限与日常部署权限分离。仓库目前没有可验证备份成功信号；接入前这是 `production blocker`，并存在 `daily manual review gap`，不能声称 24 小时自动告警已可配置。

deployment owner 明确数据库产品后，必须接入托管数据库原生备份成功事件或指标，或经审批的备份作业脱敏成功事件。先验证成功语义、事件时间、缺失窗口、权限和隐私字段，再启用 24 小时无成功证据告警。接入前每天在受控数据库控制台人工确认 RPO 窗口内的成功备份与可恢复点；audit topic 不绑定普通发布、operations 或虚构 backup 来源。

备份证据只记录：

- 备份引用、开始/完成时间、状态、加密状态和故障域。
- 核验人、核验时间、对应告警状态。
- 恢复演练目标、持续时间、行数/约束等汇总校验、双探针结果和清理确认。

证据不得包含导出文件、表内容、反馈正文、联系人、邮件信息、连接地址或凭据。

至少每季度执行一次隔离恢复演练：选择已核验备份，恢复到无公网入口、与生产凭据隔离的临时数据库；记录起止时间；用汇总计数和约束检查完整性；用隔离应用执行 `/api/live` 与 `/api/health`；验证 RPO 24h、RTO 2h；完成后确认临时数据库、临时访问和恢复介质按审批清理。不得把演练恢复到生产数据库上覆盖验证。

## 6. 周期检查

### Daily

- 分别查看主页、`/api/live`、`/api/health` 和 critical 告警。
- 检查 Web 服务、LogListener 心跳、邮件/清理 timer 最近与下次运行。
- 检查 `zhipet-ops-status.timer` 与最新 `operations_status`，确认数据库连接、反馈状态计数、邮件队列和最老 pending 年龄。
- 在真实备份成功信号接入前执行 `daily manual review gap`：由 deployment owner 在受控控制台确认最近备份仍在 24 小时 RPO 内。
- 检查磁盘与 `/var/log/zhipet` 增长，不把本地 `rotate 7` 当成 CLS 留存。

### Weekly

- 复核 5xx、P95、重启次数、作业失败、解析失败上传和告警噪声。
- 用本页固定身份/目录/env 的 feedback CLI 处理待办；新反馈目标为 1 个工作日内复核，适用时 3 个工作日内分类或关闭。
- 核验 Nginx、Web 和 CLS 的 `requestId` 关联；抽样只用无个人信息事件。
- 在隔离验收或维护窗口核对 301、429 和受控上游不可用产生的 502 均返回单个 `X-Request-ID`，且与 Nginx access log 一致；不得为制造 502 停止生产服务。
- 检查域名解析、apex/`www` HTTPS 与证书剩余时间。

### Monthly

- 复核备份成功证据、恢复权限、容量预测与失败告警。
- 检查依赖更新、Node.js、Nginx、OS 安全更新；先在隔离环境验证，再走发布审批。
- 检查数据库容量 70%/85% 阈值、主机 CPU/内存/磁盘趋势和腾讯云成本/预算告警。
- 复核 CLS 四主题留存、索引、restricted 权限、LogListener 白名单和实际 `logrotate.timer` cadence。
- 核验至少两名告警联系人仍有效，测试通知不改变生产流量。

### Quarterly

- 完成一次隔离数据库恢复演练并核对 RPO 24h、RTO 2h。
- 在维护窗口完成受控 logrotate forced rotation 与 Nginx `USR1` reopen 验证。
- 演练发布失败、自动回滚与新旧 release 双探针核验。
- 复核域名续费、证书自动续期、依赖/Node/Nginx/OS 生命周期、数据库容量计划、云成本和权限清单。
- 抽查事故复盘行动项、隐私证据清理和 restricted 运维组成员。

## 7. 常见处置路径

**主页失败，双探针正常：** 检查 DNS、证书、Nginx 配置与上游代理，不切换数据库。

**live 失败：** 检查 Web service 状态、重启循环、当前 release、端口和应用 stderr。若与刚发布相关，由 deployment owner 走受控回滚。

**live 正常，health 失败：** 检查数据库服务状态、容量、网络和最近变更；不得输出连接信息。按 P0/P1 影响分级。

**邮件队列积压：** 用本页固定身份/目录/env 的 operations-status 命令确认年龄和数量，检查 status/mail timer、`failedCount`、`job_failed` 与脱敏错误码。不要重复启动多个 worker，也不要直接修改队列表。

**清理心跳缺失：** 检查 timer 与 `job_completed` 时间，确认 `Persistent=true` 是否补跑；未经审批不手工删除数据。

**日志停止：** 检查文件权限、inode、Nginx `USR1` 结果、LogListener 心跳和解析失败。保留轮转文件；restricted 错误流只供已验证运维组访问。

**备份超出 RPO：** 立即升级，暂停增加高风险写入或迁移，先恢复备份链路并评估当前可恢复点。

## 8. 隐私与证据

证据采用最小化原则：优先保存事件编号、时间窗、状态码、计数、耗时、requestId、短 release、job、状态和脱敏错误码。截图先裁剪并遮盖账号标识、实例标识、主机名、个人信息和连接信息。原始日志与数据库导出留在受控系统内，不下载到个人设备，不提交 Git。

疑似敏感数据或凭据泄露按 P0 处理：限制传播、保留访问审计、由有权限人员轮换受影响凭据并确认撤销。复盘中描述数据类别与范围，不粘贴实际内容。

## 9. 复盘模板

```text
事件编号：
级别与判定依据：
开始、发现、响应、缓解、恢复时间：
事件指挥人 / deployment owner / 参与人：
用户影响与持续时间：
受影响 release：
主页、/api/live、/api/health 证据摘要：
关键 requestId / job / 脱敏 errorCode：
时间线：
直接原因：
促成因素：
哪些检测有效，哪些检测延迟：
缓解、回滚与双探针核验结果：
数据完整性、RPO、RTO 结论：
隐私与证据清理确认：
行动项、负责人、截止日期、验证方式：
```
