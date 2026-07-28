# 腾讯云可观测性交接

本文是部署负责人在腾讯云控制台和目标 Lighthouse/CVM 上执行的配置清单。仓库只提供配置依据，当前任务没有连接服务器、CLS、Cloud Monitor、数据库或联系人，也不代表以下云端资源已经创建。

执行任何服务器操作前先阅读 `docs/AI_SERVER_CONSTITUTION.md`。正式部署、云端配置和验证只能由 deployment owner 使用已审核、可追溯的发布提交执行。

## 1. CLS 主题与留存

在与生产实例相同的地域创建日志集和四个独立主题，并记录日志集、主题、地域、创建人和复核人。留存按自然日配置：

| 主题 | 用途 | CLS retention |
| --- | --- | --- |
| `zhipet-access` | Nginx 与 Nuxt 请求、性能事件 | `14 days` |
| `zhipet-operations` | 邮件、清理、健康与服务作业事件 | `30 days` |
| `zhipet-audit` | 经核验的发布、回滚、备份验证、恢复演练和特权操作事件 | `180 days` |
| `zhipet-error-restricted` | 可能包含非结构化上下文的错误流 | `7 days` |

`rotate 7` 是服务器本地保留七个轮转文件，不等于 `7 days`，也不替代上述 CLS retention。不得把本地轮转数量写成云端留存天数。

`zhipet-audit` 只接收具有明确来源和操作者的审计事件。仓库当前没有专用审计日志文件；部署负责人确认受审来源前保持该主题无采集绑定，不得为了填充主题而复制访问日志或错误日志。

## 2. LogListener 安装与白名单

1. 在 CLS 控制台为目标 Lighthouse/CVM 选择官方安装流程，核验下载来源、包校验信息、目标地域和最小权限后安装 LogListener。
2. 在机器组中只绑定经核验的生产实例；不在文档、工单或截图中记录真实实例标识或账号标识。
3. 确认 LogListener 进程状态和机器组心跳后，再创建采集配置。
4. 采集路径必须使用下列完整白名单，不得使用 `/var/log/zhipet/*`、`/var/log/*` 或用户家目录通配：

| 采集配置 | 主题 | 路径 | 解析方式 |
| --- | --- | --- | --- |
| access-json | `zhipet-access` | `/var/log/zhipet/nginx-access.jsonl` | JSON 提取 |
| access-json | `zhipet-access` | `/var/log/zhipet/web.jsonl` | JSON 提取 |
| operations-json | `zhipet-operations` | `/var/log/zhipet/mail.jsonl` | JSON 提取 |
| operations-json | `zhipet-operations` | `/var/log/zhipet/purge.jsonl` | JSON 提取 |
| operations-json | `zhipet-operations` | `/var/log/zhipet/status.jsonl` | JSON 提取 |
| restricted-error | `zhipet-error-restricted` | `/var/log/zhipet/nginx-error.log` | 单行文本 |
| restricted-error | `zhipet-error-restricted` | `/var/log/zhipet/web-error.log` | 单行文本 |
| restricted-error | `zhipet-error-restricted` | `/var/log/zhipet/mail-error.log` | 单行文本 |
| restricted-error | `zhipet-error-restricted` | `/var/log/zhipet/purge-error.log` | 单行文本 |
| restricted-error | `zhipet-error-restricted` | `/var/log/zhipet/status-error.log` | 单行文本 |

所有 `*.jsonl` 配置启用 JSON 提取和 parse-failure upload。解析失败事件进入同一目标主题并带解析失败标记，以便告警，不能静默丢弃。所有 `*.log` 使用单行采集，不尝试把多行堆栈拆成 JSON。

应用标准错误文件和 `nginx-error.log` 只能进入 `zhipet-error-restricted`，不得同时进入 access、operations 或 audit。Nginx 使用 `error` 级别，以捕获上游超时、拒绝连接等常见故障；这类单行可能带有原始请求上下文，因此必须遵守 7 天留存、关闭全文索引、禁止复制到工单的限制。该主题只授予至少两名身份已验证运维人员所在的最小权限组；其他开发、分析和报表身份默认无权访问。

## 3. 索引

`zhipet-access` 与 `zhipet-operations` 按真实 JSON 键建立下列键值索引，不开启自动新增字段。数值计数使用 `long`，可能含小数的 Nginx 请求耗时使用 `double`。`upstreamDurationSeconds` 保持 `text`，因为 Nginx 可能输出 `-` 或多个 upstream 值。

| 字段 | CLS 类型 | 用途 |
| --- | --- | --- |
| `timestamp` | `text` | 事件产生时间 |
| `level` | `text` | 结构化日志级别 |
| `service` | `text` | 有界服务名 |
| `type` | `text` | `http_request`、作业事件或 `operations_status` |
| `requestId` | `text` | 请求关联 |
| `release` | `text` | 已验证提交的短标识或 `unknown` |
| `path` | `text` | 不含查询字符串的规范化路径 |
| `statusCode` | `long` | HTTP 状态码 |
| `durationMs` | `double` | Nuxt 请求或作业耗时 |
| `durationSeconds` | `double` | Nginx 请求耗时 |
| `upstreamDurationSeconds` | `text` | Nginx upstream 原始有界值 |
| `job` | `text` | 作业名 |
| `status` | `text` | 有界终态或采样状态 |
| `errorCode` | `text` | 已清洗的有界错误码 |
| `failedCount` | `long` | 邮件投递终态失败数 |
| `oldestPendingEmailAgeSeconds` | `long` | 最老待发邮件年龄 |
| `databaseConnected` | `text` | 数据库连接布尔值的可查询表示 |
| `feedbackPending` | `long` | 待处理反馈数量 |
| `feedbackReviewing` | `long` | 处理中反馈数量 |
| `feedbackInvalid` | `long` | 无效反馈数量 |
| `feedbackClosed` | `long` | 已关闭反馈数量 |
| `emailOutboxPending` | `long` | 待发邮件数量 |
| `emailOutboxProcessing` | `long` | 投递中邮件数量 |
| `emailOutboxSent` | `long` | 已投递邮件数量 |
| `emailOutboxFailed` | `long` | 终态失败邮件数量 |

不要索引查询字符串、请求体、响应体、Cookie、认证头、IP、联系方式、反馈内容或邮件内容。

`zhipet-error-restricted` 的单行日志没有自定义 `timestamp`、`host`、`sourceFile` 或 `severity` 字段。该主题关闭全文索引，不创建字段提取扩展，只依赖 CLS 内置键值字段：`__TIMESTAMP__`（采集时间）、`__FILENAME__`（文件路径）、`__SOURCE__`（来源 IP）和 LogListener 2.7.4 及以上提供的 `__HOSTNAME__`。`__CONTENT__` 不做全文检索；事故定位使用时间窗和内置来源字段，由已验证运维组在受控界面查看原始单行，不复制到工单。

配置依据：

- [CLS 索引配置与内置字段](https://cloud.tencent.com/document/product/614/50922)
- [LogListener 服务日志与采集监控](https://cloud.tencent.com/document/product/614/55281)
- [JSON 提取模式采集](https://cloud.tencent.com/document/product/614/17419)

完成后用不含个人信息的测试事件核对字段类型、时间解析、主题路由和 parse-failure upload。索引变更只对后续写入生效，因此测试必须发生在索引保存之后。

## 4. 心跳与采集告警

为 LogListener 机器组配置心跳监控：

- 心跳缺失 2 分钟：warning。
- 心跳缺失 5 分钟：critical。
- JSON 解析失败持续出现或采集延迟异常：warning，并检查格式与文件权限。
- 告警必须标出机器组、采集配置和最后心跳时间，但证据中不保存真实实例标识。

每次 logrotate 验证、LogListener 升级和实例重启后，都确认新文件仍持续写入且 CLS 延迟恢复正常。

## 5. Cloud Monitor

### 外部探针

三个探针必须分开创建，不能用一个 URL 代替另两个：

| 探针 | 含义 | 周期与阈值 |
| --- | --- | --- |
| 主页 HTTPS | 用户入口、DNS、TLS、Nginx 与应用链路 | 1 分钟；连续失败 3 次告警 |
| `/api/live` | process probe，只判断 Web 进程及当前 release 响应 | 1 分钟；连续失败 2 次告警 |
| `/api/health` | dependency readiness，判断数据库依赖是否就绪 | 1 分钟；连续失败 3 次告警 |

另建证书到期告警，提前 30、14、7 天通知；分别核验 apex 与 `www` 的 DNS 和 HTTPS 行为。

### 主机、服务、作业、队列与备份

- CPU：持续 15 分钟高于 85% 告警。
- 内存：持续 10 分钟高于 85% warning；高于 95% critical。
- 磁盘：持续 10 分钟高于 80% warning；高于 90% critical。
- 数据库容量：达到 70% warning；达到 85% critical。
- `zhipet-web.service` inactive 或进入重启循环：critical。
- HTTP 5xx：5 分钟内至少 5 次且占请求至少 5% 时告警。
- P95 请求耗时：持续 10 分钟高于 2 秒时告警。
- 邮件 worker 自身失败：`type=job_failed AND job=mail_delivery` 告警。
- 邮件终态失败：`type=job_completed AND job=mail_delivery AND failedCount>0` 告警；不得用 `job_failed` 代替这条规则。
- 持久终态失败：`type=operations_status AND emailOutboxFailed>0` 告警，直到队列状态被核验处理；这条规则防止一次性的 worker 事件遗漏后失去可见性。
- 邮件作业心跳：连续 5 分钟没有 `mail_delivery` 的 `job_completed` 或 `job_failed` 终态事件时告警。
- 数据库采样失败：`type=operations_status AND databaseConnected=false` 告警。
- 状态采样心跳：连续 12 分钟没有 `operations_status` 时告警，避免数据库、反馈与邮件队列规则一起静默失效。
- 邮件积压：`type=operations_status AND oldestPendingEmailAgeSeconds>600` 告警，并在结果中查询 `emailOutboxPending` 判断规模。
- 投递状态卡住：`type=operations_status AND emailOutboxProcessing>0` 持续 20 分钟时告警；不要因单次正常投递中的采样触发。
- `data_purge` 连续 36 小时没有 `job_completed`：告警。

作业告警查询使用 `job_started`、`job_completed`、`job_failed`，并按 `job`、`status`、`release` 和已清洗 `errorCode` 聚合。缺失事件规则必须使用 CLS 的定时告警和无数据触发能力，先用隔离测试确认窗口语义，不能把“查询返回零行”误配置为正常。`zhipet-ops-status.timer` 约每 5 分钟运行一次，输出到 `/var/log/zhipet/status.jsonl`；因此 `oldestPendingEmailAgeSeconds>600` 最迟会在下一个采样与采集周期暴露。采样只输出数据库连通性、状态计数和最老 pending 年龄，不包含反馈正文、联系人、收件人、主题或邮件正文。

### 备份信号缺口

仓库当前没有可验证的备份成功信号，不能据此配置“24 小时内无成功备份”的自动告警。此项在接入前是 `production blocker`，并存在 `daily manual review gap`：deployment owner 必须每天在数据库产品的受控控制台人工核对最近成功备份及可恢复点，证据只记录脱敏引用、时间和状态。

明确数据库产品后，deployment owner 必须二选一接入：托管数据库原生备份成功事件或指标；或经审批的备份作业脱敏成功事件。先在隔离条件下验证成功语义、事件时间、缺失窗口、权限和不含数据库内容/连接信息，再启用 24 小时告警。未经验证不得把发布、回滚或普通 operations 日志复制到 `zhipet-audit` 充当备份来源，也不实现虚构 backup 脚本。

## 6. 联系人与测试告警

建立命名明确的生产运维联系人组，至少加入两名身份已验证、已确认值班责任的联系人。初始启用邮件和微信通知；critical 告警 10 分钟未确认时升级给第二负责人。启用短信或电话前先评估必要性、噪声和成本。

使用云平台的“测试通知”能力，或绑定到隔离测试目标的临时规则，逐一验证 warning、critical 和升级链路。测试告警不得停止生产服务、修改 DNS、切换证书、阻断数据库、写入生产队列或改变生产流量。记录发送时间、规则、接收渠道、两名接收人的确认和清理结果。

## 7. logrotate cadence 与 forced rotation

目标机上的实际 cadence 由系统安装的 `logrotate.timer` 决定，不能假定一定是每天。部署负责人先记录以下只读结果：

```bash
systemctl cat logrotate.timer
systemctl list-timers logrotate.timer --all
systemctl status logrotate.timer --no-pager
```

交接证据记录 `OnCalendar`、上次触发、下次触发、时区和复核时间。策略中的 `daily` 与 `maxsize 20M` 都只在 timer 或人工调用 logrotate 时评估；文件达到 20 MiB 不会自行立即轮转。如果实际 cadence 不能满足磁盘风险目标，应先审查 timer 调整及回滚方案，再由 deployment owner 另行授权实施。

```text
effective logrotate.timer OnCalendar：
上次触发 / 下次触发 / 时区：
记录人 / 复核人 / 记录时间：
```

在维护窗口做一次 controlled forced rotation：

1. 先检查 `/etc/logrotate.d/zhipet` 与仓库模板一致，目标都是普通文件；运行 `sudo logrotate --debug /etc/logrotate.d/zhipet`、`sudo nginx -t`，并用 `stat` 记录当前文件 inode、大小和所有者。
2. 确认 `zhipet-web.service`、Nginx 和 LogListener 正常，CLS 当前没有持续积压；保留上述基线证据。
3. 执行 `sudo logrotate --force --verbose /etc/logrotate.d/zhipet`，完整记录退出码和输出。此命令会触发 Nginx 的 systemd `USR1` reopen；若 `USR1` 失败，配置没有 `|| true`，forced rotation 必须以可见失败结束。
4. 再次用 `stat` 核对活动 Nginx 文件为新 inode，轮转文件仍存在且权限正确。请求一个不含查询参数的已知安全探针，然后确认新行写入新的 `nginx-access.jsonl`，应用 JSONL 也继续写入。
5. 检查 Nginx、logrotate 和 LogListener 状态及 CLS 新事件时间。任何 reopen、权限、采集或解析失败都停止验收，不删除轮转文件，并按 `docs/OPERATIONS_RUNBOOK.md` 升级。

本节是待由部署负责人执行的服务器步骤；本次文档任务没有运行这些命令。

## 8. 完成交接

- 四主题、留存、权限和索引均由另一名运维人员复核。
- 采集路径与本页白名单逐项一致，restricted 错误流没有旁路。
- 主页、process probe `/api/live`、dependency readiness `/api/health` 分别通过。
- 心跳、主机、服务、作业和队列告警均完成无生产流量变更的测试。
- 备份成功信号未接入时，交接保持 `production blocker` 和 `daily manual review gap`；接入并验证真实来源后才能测试 24 小时告警。
- 实际 logrotate cadence 与 controlled forced rotation 证据已归档。
- 交接记录只保存时间、规则、发布号、状态和脱敏错误码，不保存凭据、个人数据或数据库内容。
