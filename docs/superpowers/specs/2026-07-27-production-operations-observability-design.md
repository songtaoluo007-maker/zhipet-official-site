# Production Operations And Observability Design

## Scope

Upgrade the latest local ZHIPET website source so a deployment owner can release and operate it safely on Tencent Cloud. This work prepares application code, deployment templates, operational scripts, tests, and handoff documentation only. It does not connect to or modify the current production server, Tencent Cloud resources, DNS, certificates, databases, or alert contacts.

## Goals

- Make the running release identifiable without inspecting generated assets.
- Separate process liveness from dependency readiness and verify both during release.
- Produce structured, privacy-minimized logs that can be collected by Tencent Cloud CLS.
- Bound local and centralized log retention.
- Detect failed or silent mail and retention jobs.
- Provide a small, non-public workflow for reviewing and closing feedback records.
- Give the deployment owner exact monitoring, alerting, backup, recovery, and incident-response steps.
- Preserve the existing immutable-release and automatic-rollback model.

## Non-Goals

- No public or private browser-based admin panel.
- No website account or secondary login system.
- No third-party monitoring platform.
- No direct Terraform or Tencent Cloud API provisioning in this phase.
- No high-availability cluster, CDN, WAF, Redis, or multi-instance rate limiter.
- No production deployment, migration, secret creation, backup execution, or alert-recipient modification.
- No change to public product claims or visual design.

## Current Baseline

The repository already includes:

- Nuxt liveness and database readiness endpoints.
- JSON request logs containing request ID, path, status, and duration.
- PostgreSQL-backed feedback and transactional email outbox records.
- Retry and data-expiry jobs executed by systemd timers.
- Immutable releases selected by full Git commit SHA.
- Health-gated release switching with automatic rollback.
- Nginx rate limiting, application rate limiting, security headers, and least-privilege systemd services.
- A production operations document that lists required alerts but does not provision them.

The remaining gaps are release identity, cross-layer request correlation, bounded file logging, collector-ready formats, job heartbeat visibility, feedback status tooling, explicit alert thresholds, and evidence-based recovery procedures.

## Architecture

```text
Public request
  -> Nginx
       -> request ID
       -> structured access log
       -> Nuxt
            -> request log with the same request ID
            -> /api/live
            -> /api/health
            -> PostgreSQL feedback and email outbox

systemd web/mail/purge services
  -> /var/log/zhipet/*.jsonl and *.log
  -> logrotate
  -> Tencent Cloud LogListener
  -> CLS topics, dashboards, and alerts

Tencent Cloud probes and host metrics
  -> homepage, /api/live, /api/health
  -> CPU, memory, disk, network, process state
  -> verified team contact group
```

## Release Identity

The release script will always write the verified 40-character commit SHA to the release directory after obtaining source code. It will never trust a branch name or an unverified archive.

At runtime:

- `/api/live` returns `status`, `checkedAt`, and a non-sensitive short release identifier.
- Unknown local builds report `release: "development"` or `release: "unknown"`.
- No repository URL, filesystem path, environment variable, secret, hostname, or database information is returned.
- Release logs retain the full SHA for internal audit.

The release script verifies `/api/live` first and `/api/health` second after switching the current symlink. Either failure triggers the existing rollback path. The old release is verified with the same two checks after rollback.

## Request Correlation And Privacy

Nginx creates one request ID and forwards it to Nuxt. Nuxt accepts the forwarded value only when the direct peer is loopback and the value matches the allowed request-ID format; all other requests receive a newly generated UUID.

Nginx and Nuxt logs use that same ID. The public response includes `X-Request-ID`, allowing a user report to be matched to server logs without exposing internal details.

Logs must not contain:

- Cookies, authorization headers, request or response bodies.
- Feedback content or contact details.
- Raw query strings, fragments, form fields, or SMTP credentials.
- Database URLs, filesystem secrets, or cloud API keys.

Operational logs may contain method, normalized path, status, duration, service, event type, timestamp, release ID, job counts, sanitized error codes, and request ID.

## Local Log Files

Application services continue to emit newline-delimited JSON to standard output. systemd sends standard output and standard error to dedicated files under `/var/log/zhipet`:

- `web.jsonl`
- `web-error.log`
- `mail.jsonl`
- `mail-error.log`
- `purge.jsonl`
- `purge-error.log`
- `status.jsonl`
- `status-error.log`
- `nginx-access.jsonl`
- `nginx-error.log`

The runtime bootstrap creates the directory with least-privilege ownership. A repository-managed logrotate template uses daily rotation with `maxsize 20M`, keeps seven rotations, compresses old files, and tolerates missing or empty files. `maxsize` is evaluated only when the host logrotate schedule runs, so deployment acceptance records that cadence and performs a controlled rotate/reopen check. Total local usage is bounded by that policy and a disk alert; logs are not retained indefinitely on the application server.

Nginx access logs use JSON escaping and log only the normalized URI path, not the query string. Error logs remain separate because they may not be valid JSON.

## CLS Collection And Retention

The repository documents four CLS topics:

1. `zhipet-access`
   - Nginx and Nuxt request/performance events.
   - Retention: 14 days.
2. `zhipet-operations`
   - Mail delivery, purge jobs, and bounded operations-status events.
   - Retention: 30 days.
3. `zhipet-audit`
   - Release, rollback, backup verification, recovery drill, and privileged operational events.
   - Retention: 180 days.
4. `zhipet-error-restricted`
   - Nginx and application standard-error streams that can contain unstructured operational context.
   - Retention: 7 days.
   - Access is limited to the verified operations group, full-text indexing is disabled, and source metadata uses only the real CLS built-ins `__TIMESTAMP__`, `__FILENAME__`, `__SOURCE__`, and `__HOSTNAME__`.

The deployment owner installs Tencent Cloud LogListener, binds only the required file paths, enables JSON extraction with parse-failure upload, creates field indexes, and configures collector-heartbeat monitoring. Cloud credentials are created and stored outside the repository with minimum required permissions.

## Health And Alert Model

### External Availability

- Homepage: one-minute probe; alert after three consecutive failures.
- `/api/live`: one-minute probe; alert after two consecutive failures.
- `/api/health`: one-minute probe; alert after three consecutive failures.
- TLS certificate: warnings at 30, 14, and 7 days before expiry.
- Apex and `www` DNS/HTTPS behavior are tested separately.

### Host And Service

- Disk usage warning at 80% for 10 minutes; critical at 90%.
- Memory warning at 85% for 10 minutes; critical at 95%.
- CPU warning at 85% for 15 minutes.
- Web process inactive or restart loop: critical.
- LogListener heartbeat missing for two minutes: warning, then critical after five minutes.
- Database capacity warning at 70%, critical at 85%.

### Application And Jobs

- HTTP 5xx: at least five events and at least 5% of requests in five minutes.
- P95 request duration above two seconds for ten minutes.
- Email delivery terminal failure count above zero.
- Oldest pending email older than ten minutes.
- Purge job has no successful completion event for 36 hours.
- Database backup has no successful completion evidence within its RPO window.
  This alert cannot be enabled until the deployment owner validates a real
  managed-database backup-success event/metric or an approved redacted backup
  event; until then this is a production blocker with a daily manual review gap.

Alerts go to a named team contact group with at least two verified recipients. Email and WeChat are enabled initially. Critical alerts unacknowledged for ten minutes are escalated to the secondary owner. SMS or telephone alerts are reserved for repeated critical failures to control noise and cost.

## Scheduled Job Visibility

Mail and purge scripts emit:

- `job_started`
- `job_completed`
- `job_failed`

Each event includes the job name, start and finish time, duration, release ID, processed counts, and a sanitized error code. It never includes email addresses, messages, or deleted record contents.

Shell-level failures still reach the dedicated error file and produce a non-zero exit code, preserving systemd failure status. The operations runbook includes commands for checking the latest timer execution and CLS heartbeat.

A dedicated least-privilege oneshot emits bounded `operations_status` JSON
about every five minutes. It reports database connectivity, status counts, and
the oldest pending-mail age without selecting feedback text, contacts,
recipients, subjects, or message bodies.

## Feedback Operations

The public workflow remains:

```text
Validated submission
  -> Feedback row
  -> EmailOutbox row in the same transaction
  -> SMTP delivery worker
  -> Team mailbox
```

A local, server-side CLI provides:

- Aggregate counts by status and age.
- Metadata-only listing of pending feedback.
- Explicit lookup of one record when authorized.
- Validated transitions from `PENDING` to `REVIEWING`, `CLOSED`, or `INVALID`.
- `handledAt` recording on terminal states.
- Optional contact redaction after handling.

The default listing does not print feedback content or contact details. The CLI is not exposed through HTTP, does not add a website login, and runs only under the restricted service account with the production environment file.

Operational targets:

- Review new feedback within one business day.
- Classify or close it within three business days when practical.
- Remove contact information when it is no longer required.
- Keep the existing maximum retention as an upper bound, not a reason to retain resolved personal data unnecessarily.

## Backup And Recovery

Repository documentation defines, but does not execute, production backups:

- Initial target RPO: 24 hours.
- Initial target RTO: 2 hours.
- Automated database backups stored outside the application server.
- Backup access separated from routine deployment access.
- Daily manual review until a validated automatic success signal exists, then
  periodic backup-success review and a 24-hour missing-success alert.
- Quarterly restore into an isolated temporary database.
- Restore evidence records backup ID, time, operator, target, duration, row-count checks, application health result, and cleanup confirmation without recording database contents.

The release owner must not enable real feedback until one restore has completed successfully.
Until the real backup-success signal is validated, backup alerting remains a
production blocker and documentation must not invent an audit or operations
event as evidence.

## Incident Process

The runbook defines:

1. Confirm the alert and record the start time.
2. Check external probe, process, database, disk, and release identity.
3. Use request ID and release ID to query CLS.
4. Roll back application code when the new release is implicated.
5. Preserve evidence without copying personal data into chat or tickets.
6. Notify the team of user impact and recovery.
7. Write a short post-incident record for any critical incident.

Incidents are classified:

- P0: site unavailable, data loss, suspected secret exposure, or database unavailable.
- P1: feedback or email processing unavailable, repeated 5xx, severe performance degradation.
- P2: partial visual/content failure, single delayed job, non-critical operational warning.

## System Hardening Adjustments

The existing systemd sandbox remains. The web service gains bounded restart behavior to prevent endless rapid restart loops. Resource limits that depend on the actual server size are documented but not hard-coded before the deployment owner confirms available memory and CPU.

OS patching, Node.js updates, Nginx updates, dependency updates, domain renewal, certificate renewal, database capacity, and cloud cost are added to the recurring operations checklist.

## Validation

Local validation includes:

- Unit tests for trusted request-ID propagation and fallback generation.
- Unit tests for release-ID normalization and liveness output.
- Unit tests for feedback CLI parsing and state-transition rules.
- Tests proving operational logs omit feedback content and contact details.
- Deployment hardening tests for full-SHA release identity, dual health checks, log paths, log rotation, and service restrictions.
- Shell syntax validation for all deployment scripts.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.

The handoff checklist requires the deployment owner to verify the public probes, headers, release ID, CLS ingestion, alert delivery, timer completion, backup restore, and rollback on a staging or maintenance deployment before switching production traffic.

## Rollback

All application and deployment-template changes remain reversible through Git. No generated production artifact is edited manually. The feedback CLI reuses the existing status and `handledAt` fields, so this phase introduces no database migration. Production rollout is performed later by the deployment owner using a reviewed full commit SHA and the existing release script.
