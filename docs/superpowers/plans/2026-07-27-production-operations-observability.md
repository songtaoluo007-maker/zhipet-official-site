# Production Operations And Observability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the latest local ZHIPET website source for identifiable releases, dual health verification, privacy-minimized structured logging, bounded log retention, feedback operations, and a complete Tencent Cloud operations handoff.

**Architecture:** Keep Nuxt, Nginx, systemd, PostgreSQL, and the existing immutable release model. Add small pure helpers for release and request identity, emit JSON-line operational events, send service output to bounded files suitable for Tencent Cloud LogListener, and provide local CLI tools plus runbooks without introducing a public admin service.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Nitro/H3, Node.js 22, Prisma/PostgreSQL, Nginx, systemd, logrotate, Vitest, Playwright, Tencent Cloud CLS and Cloud Monitor.

## Global Constraints

- Do not connect to or modify the current production server or Tencent Cloud resources.
- Do not read, print, copy, or commit production secrets or production data.
- Do not add a public or private browser-based admin panel.
- Do not add website accounts, third-party monitoring, Terraform, CDN, WAF, Redis, or multi-instance infrastructure.
- Do not add product claims or change public visual design.
- Do not log cookies, authorization, request bodies, feedback text, contact details, query strings, SMTP credentials, database URLs, or cloud keys.
- Reuse the existing feedback schema; this phase introduces no database migration.
- Preserve immutable full-SHA releases and automatic rollback.
- Run lint, typecheck, unit tests, relevant end-to-end tests, shell syntax checks, and a production build.
- Do not create a Git commit unless the user explicitly authorizes it.

## File Map

### Runtime Identity And Correlation

- Create `server/domain/release-id.ts`: validate full release SHAs and produce a public short label.
- Create `server/domain/request-id.ts`: validate and resolve trusted reverse-proxy request IDs.
- Create `scripts/start-production.mjs`: load `.release-commit` into `ZHIPET_RELEASE_SHA` before starting Nitro.
- Modify `server/api/live.get.ts`: return a bounded public release label.
- Modify `server/middleware/request-observability.ts`: reuse a trusted Nginx request ID and emit normalized JSON.
- Modify `deploy/tencent-cloud/nginx/zhipet-proxy.conf`: forward Nginx `$request_id`.

### Release And Service Configuration

- Modify `deploy/tencent-cloud/scripts/stage-release.sh`: always persist the verified SHA and check both liveness and readiness.
- Modify `deploy/tencent-cloud/systemd/zhipet-web.service`: start through the production wrapper, bound restart storms, and route logs.
- Modify `deploy/tencent-cloud/systemd/zhipet-mail.service`: route logs to dedicated files.
- Modify `deploy/tencent-cloud/systemd/zhipet-purge.service`: route logs to dedicated files.
- Modify `deploy/tencent-cloud/scripts/bootstrap-runtime.sh`: install logrotate and create least-privilege log files.

### Operational Logging

- Create `scripts/lib/operations-log.mjs`: build and emit sanitized JSON-line job events.
- Modify `scripts/deliver-email-outbox.mjs`: emit started, completed, and failed events without message or recipient data.
- Modify `scripts/purge-expired-data.mjs`: emit started, completed, and failed events.
- Modify `deploy/tencent-cloud/nginx/zhipet.conf.template`: add privacy-minimized JSON access logs.
- Create `deploy/tencent-cloud/logrotate/zhipet`: bound local application and Nginx logs.

### Feedback Operations

- Create `scripts/lib/feedback-operations.mjs`: parse CLI commands and validate status transitions.
- Create `scripts/manage-feedback.mjs`: metadata-first feedback summary, listing, lookup, transition, and optional contact redaction.
- Create `scripts/operations-status.mjs`: output non-sensitive queue and feedback health counters.
- Modify `package.json`: add `feedback:ops` and `ops:status` scripts.

### Tests And Documentation

- Create `tests/unit/release-id.spec.ts`.
- Create `tests/unit/request-id.spec.ts`.
- Create `tests/unit/operations-log.spec.ts`.
- Create `tests/unit/feedback-operations.spec.ts`.
- Modify `tests/unit/deployment-hardening.spec.ts`.
- Modify `tests/e2e/security.spec.ts`.
- Create `deploy/tencent-cloud/observability/README.md`.
- Create `docs/OPERATIONS_RUNBOOK.md`.
- Modify `docs/PRODUCTION_OPERATIONS.md`.
- Modify `deploy/tencent-cloud/README.md`.
- Modify `.env.example` and `deploy/tencent-cloud/zhipet.env.example`.

---

### Task 1: Release Identity And Dual Health Gates

**Files:**
- Create: `server/domain/release-id.ts`
- Create: `scripts/start-production.mjs`
- Modify: `server/api/live.get.ts`
- Modify: `deploy/tencent-cloud/scripts/stage-release.sh`
- Modify: `deploy/tencent-cloud/systemd/zhipet-web.service`
- Modify: `.env.example`
- Modify: `deploy/tencent-cloud/zhipet.env.example`
- Create: `tests/unit/release-id.spec.ts`
- Modify: `tests/unit/deployment-hardening.spec.ts`
- Modify: `tests/e2e/security.spec.ts`

**Interfaces:**
- Produces: `parseReleaseSha(value: string | undefined): string | undefined`
- Produces: `getPublicReleaseId(value: string | undefined, fallback: 'development' | 'unknown'): string`
- Produces: `/api/live -> { status: 'ok'; release: string; checkedAt: string }`
- Consumes later: the `release` field is added to application and job logs.

- [ ] **Step 1: Write failing release-ID unit tests**

```ts
import { describe, expect, it } from 'vitest'
import {
  getPublicReleaseId,
  parseReleaseSha,
} from '../../server/domain/release-id'

describe('release identity', () => {
  it('accepts only a full lowercase Git SHA', () => {
    const sha = 'c35adf55d27ea17e24a945f95f124677e3362d54'
    expect(parseReleaseSha(sha)).toBe(sha)
    expect(parseReleaseSha('main')).toBeUndefined()
    expect(parseReleaseSha('c35adf5')).toBeUndefined()
    expect(parseReleaseSha('../secret')).toBeUndefined()
  })

  it('exposes only a short non-sensitive label', () => {
    expect(
      getPublicReleaseId(
        'c35adf55d27ea17e24a945f95f124677e3362d54',
        'unknown',
      ),
    ).toBe('c35adf55d27e')
    expect(getPublicReleaseId(undefined, 'development')).toBe('development')
  })
})
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run:

```bash
pnpm vitest run tests/unit/release-id.spec.ts
```

Expected: FAIL because `server/domain/release-id.ts` does not exist.

- [ ] **Step 3: Implement the pure release-ID helper**

```ts
const fullGitShaPattern = /^[0-9a-f]{40}$/

export const parseReleaseSha = (value: string | undefined) => {
  const normalized = value?.trim()
  return normalized && fullGitShaPattern.test(normalized)
    ? normalized
    : undefined
}

export const getPublicReleaseId = (
  value: string | undefined,
  fallback: 'development' | 'unknown',
) => parseReleaseSha(value)?.slice(0, 12) ?? fallback
```

- [ ] **Step 4: Add the release label to `/api/live`**

Use the helper without exposing paths or environment values:

```ts
const release = getPublicReleaseId(
  process.env.ZHIPET_RELEASE_SHA,
  import.meta.dev ? 'development' : 'unknown',
)
```

Return `release` beside the existing status and timestamp.

- [ ] **Step 5: Add the production startup wrapper**

`scripts/start-production.mjs` must:

```js
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const fullGitShaPattern = /^[0-9a-f]{40}$/
const releaseFile = resolve(process.cwd(), '.release-commit')
const releaseSha = (await readFile(releaseFile, 'utf8').catch(() => '')).trim()

if (fullGitShaPattern.test(releaseSha)) {
  process.env.ZHIPET_RELEASE_SHA = releaseSha
}

await import('../.output/server/index.mjs')
```

Change `zhipet-web.service` to execute this wrapper.

- [ ] **Step 6: Persist the verified SHA on both source acquisition paths**

After Git checkout or codeload validation, `stage-release.sh` must always write:

```bash
printf '%s\n' "${commit_sha}" >"${staging_dir}/.release-commit"
chown root:zhipet "${staging_dir}/.release-commit"
chmod 0440 "${staging_dir}/.release-commit"
```

Remove the duplicate fallback-only write.

- [ ] **Step 7: Replace the single health gate with dual checks**

Define:

```bash
liveness_url=http://127.0.0.1:3000/api/live
readiness_url=http://127.0.0.1:3000/api/health
```

The restart function must wait for both endpoints. Rollback must call the same function so an old release is verified identically.

- [ ] **Step 8: Extend deployment and E2E tests**

Add assertions that:

- `.release-commit` is always written from `commit_sha`.
- the web service runs `scripts/start-production.mjs`.
- release switching checks both `/api/live` and `/api/health`.
- `/api/live` returns `status`, `release`, and `cache-control: no-store`.
- a production response never includes the full 40-character SHA.

- [ ] **Step 9: Run focused verification**

```bash
pnpm vitest run tests/unit/release-id.spec.ts tests/unit/deployment-hardening.spec.ts
pnpm exec playwright test tests/e2e/security.spec.ts --project=desktop
bash -n deploy/tencent-cloud/scripts/stage-release.sh
```

Expected: all pass.

- [ ] **Step 10: Prepare the review boundary**

Review:

```bash
git diff --check
git diff -- server/domain/release-id.ts server/api/live.get.ts scripts/start-production.mjs deploy/tencent-cloud
```

Proposed commit message if the user later authorizes commits:

```text
feat(ops): identify releases and verify dual health probes
```

---

### Task 2: Trusted Request Correlation

**Files:**
- Create: `server/domain/request-id.ts`
- Modify: `server/middleware/request-observability.ts`
- Modify: `deploy/tencent-cloud/nginx/zhipet-proxy.conf`
- Create: `tests/unit/request-id.spec.ts`
- Modify: `tests/unit/deployment-hardening.spec.ts`

**Interfaces:**
- Consumes: `isLoopbackAddress(address)` from `server/domain/rate-limit.ts`
- Produces: `resolveRequestId(input: RequestIdInput): string`
- Produces: normalized request log fields shared with CLS documentation.

- [ ] **Step 1: Write failing request-ID tests**

```ts
import { describe, expect, it } from 'vitest'
import { resolveRequestId } from '../../server/domain/request-id'

describe('request identity', () => {
  it('accepts the Nginx ID only from loopback', () => {
    expect(resolveRequestId({
      remoteAddress: '127.0.0.1',
      forwardedRequestId: '0123456789abcdef0123456789abcdef',
      generatedRequestId: 'generated-id',
    })).toBe('0123456789abcdef0123456789abcdef')
  })

  it('replaces untrusted or malformed values', () => {
    expect(resolveRequestId({
      remoteAddress: '203.0.113.10',
      forwardedRequestId: '0123456789abcdef0123456789abcdef',
      generatedRequestId: 'generated-id',
    })).toBe('generated-id')
    expect(resolveRequestId({
      remoteAddress: '127.0.0.1',
      forwardedRequestId: '../../secret',
      generatedRequestId: 'generated-id',
    })).toBe('generated-id')
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
pnpm vitest run tests/unit/request-id.spec.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement request-ID resolution**

Accept UUIDs and Nginx 32-character hex request IDs, capped at 64 characters:

```ts
const forwardedRequestIdPattern =
  /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i
```

Return the forwarded ID only when `isLoopbackAddress(remoteAddress)` and the pattern matches.

- [ ] **Step 4: Wire Nginx and Nuxt**

Add to `zhipet-proxy.conf`:

```nginx
proxy_set_header X-Request-ID $request_id;
```

In the middleware, read `x-request-id`, resolve it against the direct socket address, set the response header, and keep using a generated UUID as fallback.

- [ ] **Step 5: Normalize the request log schema**

Emit exactly:

```ts
{
  timestamp,
  level: 'info',
  service: 'zhipet-web',
  type: 'http_request',
  requestId,
  release,
  method,
  path,
  statusCode,
  durationMs,
}
```

Use pathname only. Do not add query, headers, IP, referrer, user agent, or body.

- [ ] **Step 6: Extend static deployment tests**

Assert that the proxy passes `$request_id` and does not pass any client-provided request-ID chain.

- [ ] **Step 7: Run focused verification**

```bash
pnpm vitest run tests/unit/request-id.spec.ts tests/unit/deployment-hardening.spec.ts
pnpm typecheck
```

Expected: all pass.

- [ ] **Step 8: Prepare the review boundary**

Proposed commit message if authorized:

```text
feat(ops): correlate proxy and application requests
```

---

### Task 3: Structured Job Events

**Files:**
- Create: `scripts/lib/operations-log.mjs`
- Modify: `scripts/deliver-email-outbox.mjs`
- Modify: `scripts/purge-expired-data.mjs`
- Create: `tests/unit/operations-log.spec.ts`

**Interfaces:**
- Consumes: an explicit release SHA, `ZHIPET_RELEASE_SHA`, or the validated `.release-commit` file in that order.
- Produces: `createOperationEntry(input)` and `emitOperationLog(input)`.
- Produces: `job_started`, `job_completed`, and `job_failed` JSON-line events.

- [ ] **Step 1: Write failing log-sanitization tests**

```ts
import { describe, expect, it } from 'vitest'
import { createOperationEntry } from '../../scripts/lib/operations-log.mjs'

describe('operation logs', () => {
  it('keeps the schema bounded and excludes arbitrary sensitive fields', () => {
    const entry = createOperationEntry({
      type: 'job_completed',
      job: 'mail_delivery',
      status: 'complete',
      durationMs: 120,
      counts: { sent: 1, failed: 0 },
      releaseSha: 'c35adf55d27ea17e24a945f95f124677e3362d54',
    })

    expect(entry).toMatchObject({
      service: 'zhipet-operations',
      type: 'job_completed',
      job: 'mail_delivery',
      release: 'c35adf55d27e',
    })
    expect(JSON.stringify(entry)).not.toContain('recipient')
    expect(JSON.stringify(entry)).not.toContain('message')
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
pnpm vitest run tests/unit/operations-log.spec.ts
```

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement the bounded operations logger**

The helper accepts only:

- `type`
- `job`
- `status`
- `durationMs`
- numeric `counts`
- sanitized `errorCode`
- release SHA

It adds an ISO timestamp and writes one JSON object followed by `\n`. It must not spread arbitrary input properties into the output.

When no explicit SHA is provided, it resolves the release from `ZHIPET_RELEASE_SHA` and then the read-only `.release-commit` file in the current release directory. Invalid or missing values become `unknown`. This ensures mail and purge jobs have a release label even though they do not start through the web wrapper.

- [ ] **Step 4: Instrument mail delivery**

Emit:

- `job_started` before database work.
- `job_completed` with processed, sent, deferred, and failed counts.
- `job_failed` on configuration, database, or SMTP worker failure.

Per-email events may contain outbox ID, template, attempt number, status, and sanitized error code. They must not contain recipient, subject, or body.

- [ ] **Step 5: Instrument data purge**

Emit:

- `job_started`
- `job_completed` with deleted feedback and outbox counts
- `job_failed` with sanitized error code

Preserve non-zero exit behavior and always disconnect Prisma.

- [ ] **Step 6: Run focused verification**

```bash
pnpm vitest run tests/unit/operations-log.spec.ts tests/unit/mail-outbox.spec.ts
node --check scripts/lib/operations-log.mjs
node --check scripts/deliver-email-outbox.mjs
node --check scripts/purge-expired-data.mjs
```

Expected: all pass.

- [ ] **Step 7: Prepare the review boundary**

Proposed commit message if authorized:

```text
feat(ops): emit structured maintenance job events
```

---

### Task 4: Collector-Ready Logs And Local Retention

**Files:**
- Modify: `deploy/tencent-cloud/nginx/zhipet.conf.template`
- Modify: `deploy/tencent-cloud/scripts/bootstrap-runtime.sh`
- Modify: `deploy/tencent-cloud/systemd/zhipet-web.service`
- Modify: `deploy/tencent-cloud/systemd/zhipet-mail.service`
- Modify: `deploy/tencent-cloud/systemd/zhipet-purge.service`
- Create: `deploy/tencent-cloud/logrotate/zhipet`
- Modify: `tests/unit/deployment-hardening.spec.ts`

**Interfaces:**
- Consumes: JSON lines emitted by Tasks 2 and 3.
- Produces: stable `/var/log/zhipet` file paths used by LogListener.

- [ ] **Step 1: Add failing deployment-template assertions**

Assert:

```ts
expect(webService).toContain('StandardOutput=append:/var/log/zhipet/web.jsonl')
expect(webService).toContain('StandardError=append:/var/log/zhipet/web-error.log')
expect(logrotate).toContain('rotate 7')
expect(logrotate).toContain('maxsize 20M')
expect(nginx).toContain('access_log /var/log/zhipet/nginx-access.jsonl zhipet_json;')
expect(nginx).not.toContain('$request_uri')
```

- [ ] **Step 2: Run the deployment test and verify failure**

```bash
pnpm vitest run tests/unit/deployment-hardening.spec.ts
```

Expected: FAIL on missing service output and logrotate configuration.

- [ ] **Step 3: Add privacy-minimized Nginx JSON logging**

At HTTP scope in the site template:

```nginx
log_format zhipet_json escape=json
    '{"timestamp":"$time_iso8601",'
    '"level":"info",'
    '"service":"zhipet-nginx",'
    '"type":"http_request",'
    '"requestId":"$request_id",'
    '"method":"$request_method",'
    '"path":"$uri",'
    '"statusCode":$status,'
    '"durationSeconds":$request_time,'
    '"upstreamDurationSeconds":"$upstream_response_time"}';
```

Set access and error files in the HTTPS server. Do not log `$request`, `$request_uri`, IP address, referrer, user agent, cookie, or authorization.

- [ ] **Step 4: Route each systemd service to dedicated files**

Use:

```ini
StandardOutput=append:/var/log/zhipet/web.jsonl
StandardError=append:/var/log/zhipet/web-error.log
```

Apply equivalent mail and purge paths. For the web unit, add:

```ini
StartLimitIntervalSec=60
StartLimitBurst=5
Restart=on-failure
RestartSec=5
```

Do not hard-code CPU or memory limits until the production instance size is confirmed.

- [ ] **Step 5: Pre-create files during runtime bootstrap**

Install `logrotate`, create the directory, and create application files as
`zhipet:zhipet` with mode `0640`. The service may append to its own application
logs; release files remain root-owned and read-only. Create Nginx files as
`root:adm` with mode `0640`.

- [ ] **Step 6: Add logrotate policy**

Application files:

```text
daily
maxsize 20M
rotate 7
compress
delaycompress
missingok
notifempty
copytruncate
```

Nginx files use the same bounds and reopen logs by sending `USR1` to the main Nginx systemd process in a `postrotate` block. Do not use `copytruncate` for Nginx, and do not hide a failed reopen.

- [ ] **Step 7: Run focused verification**

```bash
pnpm vitest run tests/unit/deployment-hardening.spec.ts
bash -n deploy/tencent-cloud/scripts/bootstrap-runtime.sh
```

If a Linux validation environment is available:

```bash
systemd-analyze verify deploy/tencent-cloud/systemd/*.service
```

Expected: tests and shell parsing pass; note explicitly if Windows prevents systemd validation.

- [ ] **Step 8: Prepare the review boundary**

Proposed commit message if authorized:

```text
feat(ops): bound and structure production logs
```

---

### Task 5: Non-Public Feedback Operations

**Files:**
- Create: `scripts/lib/feedback-operations.mjs`
- Create: `scripts/manage-feedback.mjs`
- Create: `scripts/operations-status.mjs`
- Modify: `package.json`
- Create: `tests/unit/feedback-operations.spec.ts`

**Interfaces:**
- Produces commands:
  - `pnpm feedback:ops summary`
  - `pnpm feedback:ops list --limit 20`
  - `pnpm feedback:ops show <feedback-id>`
  - `pnpm feedback:ops set-status <feedback-id> reviewing`
  - `pnpm feedback:ops set-status <feedback-id> closed --redact-contact`
  - `pnpm feedback:ops set-status <feedback-id> invalid --redact-contact`
  - `pnpm ops:status`
- Reuses: existing Prisma `FeedbackStatus` and `handledAt`; no migration.

- [ ] **Step 1: Write failing command and transition tests**

```ts
import { describe, expect, it } from 'vitest'
import {
  parseFeedbackCommand,
  resolveFeedbackTransition,
} from '../../scripts/lib/feedback-operations.mjs'

describe('feedback operations', () => {
  it('parses metadata-only list commands', () => {
    expect(parseFeedbackCommand(['list', '--limit', '20'])).toEqual({
      kind: 'list',
      limit: 20,
    })
  })

  it('allows review and terminal transitions but not reopening', () => {
    expect(resolveFeedbackTransition('PENDING', 'reviewing')).toEqual({
      status: 'REVIEWING',
      handledAt: null,
    })
    expect(() => resolveFeedbackTransition('CLOSED', 'reviewing')).toThrow(
      'Closed feedback cannot be reopened',
    )
  })

  it('requires explicit terminal status before contact redaction', () => {
    expect(() =>
      parseFeedbackCommand([
        'set-status',
        'feedback_123',
        'reviewing',
        '--redact-contact',
      ]),
    ).toThrow('Contact can be redacted only for a terminal status')
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
pnpm vitest run tests/unit/feedback-operations.spec.ts
```

Expected: FAIL because the operations module does not exist.

- [ ] **Step 3: Implement strict CLI parsing**

Requirements:

- Reject unknown commands, flags, statuses, missing IDs, invalid limits, and limits above 100.
- Map `reviewing`, `closed`, and `invalid` to Prisma enum values.
- Never accept raw SQL or arbitrary field names.
- Terminal transitions set `handledAt` to the current time.
- Closed and invalid records cannot be reopened.

- [ ] **Step 4: Implement metadata-first database operations**

`summary` returns counts by status and age buckets.

`list` selects only:

```ts
{
  id: true,
  category: true,
  status: true,
  createdAt: true,
  handledAt: true,
}
```

`show` is the only command allowed to select message and contact.

`set-status` performs one validated update. `--redact-contact` writes `contact: null` only for `CLOSED` or `INVALID`.

- [ ] **Step 5: Implement non-sensitive operations status**

`pnpm ops:status` outputs JSON containing:

- database connectivity
- feedback counts by status
- email outbox counts by status
- oldest pending email age in seconds or `null`
- current timestamp

It must not select or print feedback text, recipient, subject, body, or contact.

- [ ] **Step 6: Add package scripts**

```json
{
  "feedback:ops": "node scripts/manage-feedback.mjs",
  "ops:status": "node scripts/operations-status.mjs"
}
```

- [ ] **Step 7: Run focused verification**

```bash
pnpm vitest run tests/unit/feedback-operations.spec.ts
node --check scripts/lib/feedback-operations.mjs
node --check scripts/manage-feedback.mjs
node --check scripts/operations-status.mjs
```

Do not run write commands against production. For local integration, use only a disposable development database.

- [ ] **Step 8: Prepare the review boundary**

Proposed commit message if authorized:

```text
feat(ops): add private feedback operations commands
```

---

### Task 6: Tencent Cloud Handoff And Incident Runbook

**Files:**
- Create: `deploy/tencent-cloud/observability/README.md`
- Create: `docs/OPERATIONS_RUNBOOK.md`
- Modify: `docs/PRODUCTION_OPERATIONS.md`
- Modify: `deploy/tencent-cloud/README.md`
- Modify: `.env.example`
- Modify: `deploy/tencent-cloud/zhipet.env.example`
- Modify: `deploy/tencent-cloud/scripts/bootstrap-runtime.sh`
- Modify: `deploy/tencent-cloud/logrotate/zhipet`
- Create: `deploy/tencent-cloud/systemd/zhipet-ops-status.service`
- Create: `deploy/tencent-cloud/systemd/zhipet-ops-status.timer`
- Modify: `tests/unit/deployment-hardening.spec.ts`

**Interfaces:**
- Consumes: log paths, release label, health endpoints, CLI commands, and job event names from Tasks 1-5.
- Produces: an exact deployment-owner checklist without credentials.

- [ ] **Step 1: Add a documentation coverage test**

Check that the observability guide contains:

```ts
for (const required of [
  'zhipet-access',
  'zhipet-operations',
  'zhipet-audit',
  'zhipet-error-restricted',
  '/api/live',
  '/api/health',
  'LogListener',
  'logrotate.timer',
  'forced rotation',
  'nginx-error.log',
  '7 days',
  '14 days',
  '30 days',
  '180 days',
]) {
  expect(observabilityGuide).toContain(required)
}
```

- [ ] **Step 2: Run the deployment test and verify failure**

```bash
pnpm vitest run tests/unit/deployment-hardening.spec.ts
```

Expected: FAIL because the observability guide is absent.

- [ ] **Step 3: Write the Tencent Cloud observability guide**

Document exact console work:

- Create four CLS topics with the approved retention periods, including the restricted `zhipet-error-restricted` topic with seven-day retention.
- Install LogListener on the Lighthouse/CVM instance.
- Bind only the listed `/var/log/zhipet` files.
- Use JSON extraction for `*.jsonl` and single-line collection for `*.log`.
- Enable parse-failure upload.
- Index timestamp, level, service, type, requestId, release, path, statusCode, duration, job, status, and sanitized errorCode.
- Bind `nginx-error.log` and application stderr files only to `zhipet-error-restricted`; grant access only to the verified operations group, disable full-text indexing, and use the real CLS built-ins `__TIMESTAMP__`, `__FILENAME__`, `__SOURCE__`, and `__HOSTNAME__` rather than invented custom fields.
- Record the effective `logrotate.timer` cadence, explain that `maxsize 20M` is evaluated at that cadence, and run one controlled forced rotation that verifies Nginx switches to the new file after `USR1`.
- Configure LogListener heartbeat monitoring.
- Configure Cloud Monitor probes and host thresholds.
- Create a two-person verified contact group.
- Send test alerts without changing production traffic.

Do not include SecretId, SecretKey, instance IDs, account IDs, database URLs, or email authorization codes.

- [ ] **Step 4: Write the operations and incident runbook**

Include:

- daily, weekly, monthly, quarterly checks
- P0/P1/P2 classification
- first-response commands
- release and rollback verification
- queue and timer diagnosis
- backup evidence and quarterly restore drill
- certificate, domain, dependency, Node, Nginx, OS, database capacity, and cost checks
- evidence handling that excludes personal data
- post-incident template

- [ ] **Step 5: Reconcile existing documentation**

Update old docs so:

- `/api/live` is the process probe.
- `/api/health` is dependency readiness.
- both are checked after deployment.
- local log and CLS retention periods are consistent everywhere.
- the restricted error stream consistently uses seven-day retention, limited access, and minimal indexing.
- the deployment checklist includes the effective logrotate cadence and controlled rotate/reopen verification.
- feedback operations use the new CLI, not direct SQL.
- production deployment remains the responsibility of the deployment owner.

- [ ] **Step 6: Document release environment behavior**

Add `ZHIPET_RELEASE_SHA=` to example files with a comment that operators normally do not set it manually; the production wrapper derives it from the verified release file.

- [ ] **Step 7: Run focused verification**

```bash
pnpm vitest run tests/unit/deployment-hardening.spec.ts
rg -n "T[B]D|T[O]DO|YOUR_SECRET|SecretKey|SMTP_PASSWORD=.*[^=]" \
  docs deploy/tencent-cloud .env.example
```

Expected: tests pass and no real secret value is present. Template placeholders such as `YOUR_DOMAIN` may remain only where the deployment guide explicitly requires replacement.

- [ ] **Step 8: Prepare the review boundary**

Proposed commit message if authorized:

```text
docs(ops): add monitoring and incident handoff
```

---

### Task 7: Full Verification And Handoff

**Files:**
- Review all files changed by Tasks 1-6.
- Update `README.md` only if the new operator commands need discoverability.

**Interfaces:**
- Produces: one clean local change set ready for the deployment owner or a later Git commit.

- [ ] **Step 1: Run formatting and static validation**

```bash
pnpm lint
pnpm typecheck
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Run the complete unit suite**

```bash
pnpm test
```

Expected: all unit tests pass.

- [ ] **Step 3: Run shell and Node syntax validation**

```bash
bash -n deploy/tencent-cloud/scripts/*.sh
node --check scripts/start-production.mjs
node --check scripts/lib/operations-log.mjs
node --check scripts/lib/feedback-operations.mjs
node --check scripts/manage-feedback.mjs
node --check scripts/operations-status.mjs
```

Expected: all files parse successfully.

- [ ] **Step 4: Run end-to-end tests**

```bash
pnpm test:e2e
```

Expected: all desktop and mobile projects pass. If a local port is occupied, stop only the project-owned process or use the configured reusable server; do not terminate unrelated processes.

- [ ] **Step 5: Run the production build**

```bash
pnpm build
```

Expected: Nuxt/Nitro production build completes.

- [ ] **Step 6: Review privacy and secret boundaries**

```bash
test -n "${SECURITY_SCAN_PATTERN_FILE:-}" &&
rg -l -f "$SECURITY_SCAN_PATTERN_FILE" \
  . \
  -g '!node_modules/**' \
  -g '!.nuxt*/**' \
  -g '!.output/**' \
  -g '!dist/**' \
  -g '!pnpm-lock.yaml'

rg -n \
  "Secret(Id|Key)[[:space:]]*[:=]|SMTP_PASSWORD[[:space:]]*=[[:space:]]*[^#[:space:]]+" \
  . \
  -g '!node_modules/**' \
  -g '!.nuxt*/**' \
  -g '!.output/**' \
  -g '!dist/**' \
  -g '!pnpm-lock.yaml'
```

`SECURITY_SCAN_PATTERN_FILE` must point to an approved known-value list stored
outside the repository. Expected: no actual credential values. Generic
documentation field names and explicit template placeholders are acceptable
only after manual review.

- [ ] **Step 7: Review scope and changed files**

```bash
git status --short
git diff --stat
git diff --name-only
```

Confirm that no current production files, generated artifacts, unrelated UI files, or database migrations changed.

- [ ] **Step 8: Prepare deployment-owner handoff**

Report:

- changed files
- commands and results
- release and rollback behavior
- required Tencent Cloud console actions
- settings that still need production values
- explicit statement that production was not modified
- exact full commit SHA after a later authorized commit

- [ ] **Step 9: Stop before Git or production actions**

Do not stage, commit, push, deploy, migrate, restart services, configure CLS, or change alert recipients without a separate explicit user request.
