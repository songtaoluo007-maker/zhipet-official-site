import { spawnSync } from 'node:child_process'
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

const readPolicyBlock = (policy: string, firstPath: string) => {
  const start = policy.indexOf(firstPath)
  const end = policy.indexOf('}', start)

  expect(start).toBeGreaterThan(-1)
  expect(end).toBeGreaterThan(start)

  return policy.slice(start, end + 1)
}

const readNginxServerBlocks = (config: string) => {
  const blocks: string[] = []
  const serverStart = /\bserver\s*\{/g
  let match: RegExpExecArray | null

  while ((match = serverStart.exec(config)) !== null) {
    const openBrace = config.indexOf('{', match.index)
    let depth = 0
    let end = openBrace
    for (; end < config.length; end += 1) {
      if (config[end] === '{') depth += 1
      if (config[end] === '}') depth -= 1
      if (depth === 0 && end > openBrace) break
    }
    blocks.push(config.slice(match.index, end + 1))
    serverStart.lastIndex = end + 1
  }

  return blocks
}

const unquoteMarkdownCell = (value: string) => value.trim().replace(/^`|`$/g, '')

const readMarkdownTable = (document: string, header: string) => {
  const lines = document.split(/\r?\n/)
  const headerIndex = lines.indexOf(header)
  expect(headerIndex).toBeGreaterThan(-1)

  const rows: string[][] = []
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.startsWith('|')) break
    rows.push(line.slice(1, -1).split('|').map(unquoteMarkdownCell))
  }
  return rows
}

describe('deployment hardening', () => {
  it('serializes release attempts before creating a staging checkout', () => {
    const script = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')
    const lockPosition = script.indexOf('flock --nonblock')
    const clonePosition = script.indexOf('git clone')

    expect(lockPosition).toBeGreaterThan(-1)
    expect(lockPosition).toBeLessThan(clonePosition)
  })

  it('requires an immutable full commit SHA for every release path', () => {
    const script = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')

    expect(script).toContain('A full 40-character commit SHA is required.')
    expect(script).not.toContain('git_ref=${2:-main}')
  })

  it('persists the verified release SHA for every source acquisition path', () => {
    const script = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')
    const buildPosition = script.indexOf('pnpm build')
    const releaseIdentityPosition = script.indexOf(
      'printf \'%s\\n\' "${commit_sha}" >"${staging_dir}/.release-commit"',
    )

    expect(script).toContain('printf \'%s\\n\' "${commit_sha}" >"${staging_dir}/.release-commit"')
    expect(script).toContain('chmod 0440 "${staging_dir}/.release-commit"')
    expect(script).toContain('commit_sha=${git_ref}')
    expect(releaseIdentityPosition).toBeGreaterThan(buildPosition)
  })

  it('keeps immutable releases separate from the unprivileged build identity', () => {
    const bootstrap = readProjectFile(
      'deploy/tencent-cloud/scripts/bootstrap-runtime.sh',
    )
    const release = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')
    const deploymentGuide = readProjectFile('deploy/tencent-cloud/README.md')

    expect(bootstrap).toContain('addgroup --system zhipet-deploy')
    expect(bootstrap).toContain('adduser zhipet zhipet-deploy')
    expect(bootstrap).toContain('adduser zhipet-build zhipet-deploy')
    expect(bootstrap).not.toContain('adduser zhipet-build zhipet\n')
    expect(bootstrap).toContain(
      'install -d -o root -g zhipet-deploy -m 0750 /srv/zhipet',
    )
    expect(bootstrap).toContain(
      'install -d -o root -g zhipet-deploy -m 0750 /srv/zhipet/releases',
    )
    expect(bootstrap).toContain(
      'install -d -o zhipet-build -g zhipet-build -m 0700 /srv/zhipet/build-home',
    )
    expect(bootstrap).toContain(
      'install -d -o root -g zhipet -m 0750 /etc/zhipet',
    )
    expect(release).toContain(
      'install -d -o root -g zhipet-deploy -m 0750 "${release_root}"',
    )
    expect(release).toContain('runuser -u zhipet-build -- env')
    expect(release).toContain('HOME=/srv/zhipet/build-home')
    expect(release).toContain(
      'chown -R --no-dereference root:zhipet "${staging_dir}"',
    )
    expect(release).toContain(
      'chmod -R u=rwX,g=rX,o= "${staging_dir}"',
    )
    expect(release).not.toContain(
      'chown zhipet:zhipet "${staging_dir}/.release-commit"',
    )
    expect(deploymentGuide).toContain('zhipet-build')
    expect(deploymentGuide).not.toContain('sudo -u zhipet pnpm')
  })

  it('documents a bootstrappable first-release order', () => {
    const deploymentGuide = readProjectFile('deploy/tencent-cloud/README.md')
    const environmentReady = deploymentGuide.indexOf(
      'sudo chmod 640 /etc/zhipet/zhipet.env',
    )
    const unitsInstalled = deploymentGuide.indexOf(
      'sudo cp deploy/tencent-cloud/systemd/* /etc/systemd/system/',
    )
    const releaseStarted = deploymentGuide.indexOf(
      'bash deploy/tencent-cloud/scripts/stage-release.sh',
    )
    const timersEnabled = deploymentGuide.indexOf(
      'sudo systemctl enable --now zhipet-mail.timer',
    )

    expect(environmentReady).toBeGreaterThan(-1)
    expect(unitsInstalled).toBeGreaterThan(environmentReady)
    expect(releaseStarted).toBeGreaterThan(unitsInstalled)
    expect(timersEnabled).toBeGreaterThan(releaseStarted)
  })

  it('uses a release-aware startup wrapper and verifies both health gates', () => {
    const script = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')
    const service = readProjectFile('deploy/tencent-cloud/systemd/zhipet-web.service')

    expect(service).toContain('scripts/start-production.mjs')
    expect(script).toContain('liveness_url=http://127.0.0.1:3000/api/live')
    expect(script).toContain('readiness_url=http://127.0.0.1:3000/api/health')
    expect(script).toContain('"${liveness_url}"')
    expect(script).toContain('"${readiness_url}"')
  })

  it('deploys database migrations before exposing the new release', () => {
    const script = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')
    const migratePosition = script.indexOf('--run db:migrate:deploy')
    const switchPosition = script.indexOf('switch_current "${release_dir}"')

    expect(script).toContain('runuser -u zhipet --')
    expect(script).toContain('runuser -u zhipet -- env -i')
    expect(script).toContain('mktemp -d /tmp/zhipet-migrate.XXXXXX')
    expect(script).toContain('XDG_CACHE_HOME="${migration_home}/cache"')
    expect(script).toContain('--env-file=/etc/zhipet/zhipet.env')
    expect(migratePosition).toBeGreaterThan(-1)
    expect(switchPosition).toBeGreaterThan(migratePosition)
  })

  it('withdraws a failed first release instead of leaving it restartable', () => {
    const script = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')
    const noRollbackBranch = script.slice(
      script.indexOf('No previous release is available for automatic rollback.'),
    )

    expect(noRollbackBranch).toContain('systemctl stop zhipet-web.service')
    expect(noRollbackBranch).toContain('rm -f -- "${current_link}"')
  })

  it('keeps the runtime content database outside immutable releases', () => {
    const nuxtConfig = readProjectFile('nuxt.config.ts')
    const release = readProjectFile('deploy/tencent-cloud/scripts/stage-release.sh')
    const service = readProjectFile('deploy/tencent-cloud/systemd/zhipet-web.service')
    const deploymentGuide = readProjectFile('deploy/tencent-cloud/README.md')

    expect(nuxtConfig).toContain('NUXT_CONTENT_DATABASE_PATH')
    expect(nuxtConfig).toContain('filename: contentRuntimeDatabase')
    expect(release).toContain(
      'content_database_path=/tmp/zhipet-content/contents.sqlite',
    )
    expect(release).toContain(
      'NUXT_CONTENT_DATABASE_PATH="${content_database_path}"',
    )
    expect(service).toContain('PrivateTmp=true')
    expect(deploymentGuide).toContain('/tmp/zhipet-content/contents.sqlite')
  })

  it('overwrites untrusted forwarded address chains at the public proxy', () => {
    const proxyConfig = readProjectFile('deploy/tencent-cloud/nginx/zhipet-proxy.conf')

    expect(proxyConfig).toContain('proxy_set_header X-Forwarded-For $remote_addr;')
    expect(proxyConfig).not.toContain('$proxy_add_x_forwarded_for')
  })

  it('generates its own request ID at the public proxy', () => {
    const proxyConfig = readProjectFile('deploy/tencent-cloud/nginx/zhipet-proxy.conf')
    const securityHeaders = readProjectFile(
      'deploy/tencent-cloud/nginx/zhipet-security-headers.conf',
    )
    const nginx = readProjectFile('deploy/tencent-cloud/nginx/zhipet.conf.template')
    const bootstrapNginx = readProjectFile(
      'deploy/tencent-cloud/nginx/zhipet-http-bootstrap.conf.template',
    )
    const productionHttpServer = readNginxServerBlocks(nginx).find((block) =>
      block.includes('listen 80;'),
    )

    expect(proxyConfig).toContain('proxy_set_header X-Request-ID $request_id;')
    expect(proxyConfig).toContain('proxy_hide_header X-Request-ID;')
    expect(proxyConfig).not.toMatch(/^\s*add_header\b/m)
    expect(proxyConfig).not.toContain('$http_x_request_id')
    expect(securityHeaders).toContain(
      'add_header X-Request-ID $request_id always;',
    )
    expect(productionHttpServer).toContain(
      'add_header X-Request-ID $request_id always;',
    )
    expect(
      bootstrapNginx.match(/add_header X-Request-ID \$request_id always;/g),
    ).toHaveLength(3)
  })

  it('writes collector-ready logs with bounded local retention', () => {
    const nginx = readProjectFile('deploy/tencent-cloud/nginx/zhipet.conf.template')
    const bootstrapNginx = readProjectFile(
      'deploy/tencent-cloud/nginx/zhipet-http-bootstrap.conf.template',
    )
    const bootstrap = readProjectFile('deploy/tencent-cloud/scripts/bootstrap-runtime.sh')
    const webService = readProjectFile('deploy/tencent-cloud/systemd/zhipet-web.service')
    const mailService = readProjectFile('deploy/tencent-cloud/systemd/zhipet-mail.service')
    const purgeService = readProjectFile('deploy/tencent-cloud/systemd/zhipet-purge.service')
    const statusService = readProjectFile('deploy/tencent-cloud/systemd/zhipet-ops-status.service')
    const statusTimer = readProjectFile('deploy/tencent-cloud/systemd/zhipet-ops-status.timer')
    const logrotate = readProjectFile('deploy/tencent-cloud/logrotate/zhipet')

    const serverBlocks = readNginxServerBlocks(nginx)
    expect(serverBlocks).toHaveLength(2)
    const httpServer = serverBlocks.find((block) => block.includes('listen 80;'))
    const httpsServer = serverBlocks.find((block) => block.includes('listen 443 ssl http2;'))

    expect(httpServer).toBeDefined()
    expect(httpsServer).toBeDefined()
    for (const server of [httpServer, httpsServer]) {
      expect(server).toContain('access_log /var/log/zhipet/nginx-access.jsonl zhipet_json;')
      expect(server).toContain('error_log /var/log/zhipet/nginx-error.log error;')
      expect(server).not.toContain('/var/log/nginx/')
    }
    const bootstrapServers = readNginxServerBlocks(bootstrapNginx)
    expect(bootstrapServers).toHaveLength(1)
    expect(bootstrapServers[0]).toContain(
      'access_log /var/log/zhipet/nginx-access.jsonl zhipet_json;',
    )
    expect(bootstrapServers[0]).toContain('error_log /var/log/zhipet/nginx-error.log error;')
    expect(bootstrapServers[0]).not.toContain('/var/log/nginx/')
    expect(bootstrapNginx).toContain('"path":"$uri"')
    expect(bootstrapNginx).not.toContain('$request_uri')
    expect(bootstrapNginx).not.toMatch(/\$request(?=[",}\s])/)
    expect(bootstrapNginx).not.toContain('$remote_addr')
    expect(bootstrapNginx).not.toContain('$http_referer')
    expect(bootstrapNginx).not.toContain('$http_user_agent')
    expect(bootstrapNginx).not.toContain('$http_cookie')
    expect(bootstrapNginx).not.toContain('$http_authorization')
    expect(nginx).toContain('"path":"$uri"')
    expect(nginx).toContain('return 301 https://$host$uri$is_args$args;')
    expect(nginx).not.toContain('$request_uri')
    expect(nginx).not.toMatch(/\$request(?=[",}\s])/)
    expect(nginx).not.toContain('$remote_addr')
    expect(nginx).not.toContain('$http_referer')
    expect(nginx).not.toContain('$http_user_agent')
    expect(nginx).not.toContain('$http_cookie')
    expect(nginx).not.toContain('$http_authorization')

    expect(webService).toContain('StandardOutput=append:/var/log/zhipet/web.jsonl')
    expect(webService).toContain('StandardError=append:/var/log/zhipet/web-error.log')
    expect(webService).toContain('StartLimitIntervalSec=60')
    expect(webService).toContain('StartLimitBurst=5')
    expect(webService).toContain('Restart=on-failure')
    expect(webService).toContain('RestartSec=5')
    expect(mailService).toContain('StandardOutput=append:/var/log/zhipet/mail.jsonl')
    expect(mailService).toContain('StandardError=append:/var/log/zhipet/mail-error.log')
    expect(purgeService).toContain('StandardOutput=append:/var/log/zhipet/purge.jsonl')
    expect(purgeService).toContain('StandardError=append:/var/log/zhipet/purge-error.log')
    expect(statusService).toContain('Type=oneshot')
    expect(statusService).toContain('User=zhipet')
    expect(statusService).toContain('Group=zhipet')
    expect(statusService).toContain('WorkingDirectory=/srv/zhipet/current')
    expect(statusService).toContain('EnvironmentFile=/etc/zhipet/zhipet.env')
    expect(statusService).toContain(
      'ExecStart=/usr/local/bin/node /srv/zhipet/current/scripts/operations-status.mjs',
    )
    expect(statusService).toContain('StandardOutput=append:/var/log/zhipet/status.jsonl')
    expect(statusService).toContain('StandardError=append:/var/log/zhipet/status-error.log')
    for (const hardening of [
      'UMask=0077',
      'NoNewPrivileges=true',
      'PrivateTmp=true',
      'ProtectSystem=full',
      'ProtectHome=true',
      'ProtectKernelTunables=true',
      'ProtectKernelModules=true',
      'ProtectControlGroups=true',
      'RestrictSUIDSGID=true',
    ]) {
      expect(statusService).toContain(hardening)
    }
    expect(statusTimer).toContain('OnUnitActiveSec=5min')
    expect(statusTimer).toContain('OnBootSec=1min')
    expect(statusTimer).toContain('AccuracySec=30s')
    expect(statusTimer).not.toContain('Persistent=true')
    expect(statusTimer).toContain('Unit=zhipet-ops-status.service')
    expect(statusTimer).toContain('WantedBy=timers.target')

    expect(bootstrap).toContain('logrotate')
    expect(bootstrap).toContain('script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)')
    expect(bootstrap).toContain('deployment_root=$(cd -- "${script_dir}/.." && pwd)')
    expect(bootstrap).toContain('logrotate_source="${deployment_root}/logrotate/zhipet"')
    expect(bootstrap).toContain('log_directory=/var/log/zhipet')

    const directoryGuardPosition = bootstrap.indexOf('if [[ -L ${log_directory}')
    const directoryInstallPosition = bootstrap.indexOf(
      'install -d -o root -g zhipet -m 0750 "${log_directory}"',
    )

    expect(directoryGuardPosition).toBeGreaterThan(-1)
    expect(directoryInstallPosition).toBeGreaterThan(directoryGuardPosition)
    expect(bootstrap).toContain(
      '-L ${log_directory} || ( -e ${log_directory} && ! -d ${log_directory} )',
    )
    expect(bootstrap).toContain('Refusing unsafe log directory: ${log_directory}')
    expect(bootstrap).not.toContain('install -d -o zhipet -g zhipet -m 0750 /var/log/zhipet')
    expect(bootstrap).toMatch(/-L \$\{log_path\}.*! -f \$\{log_path\}/)
    expect(bootstrap.indexOf('if [[ -L ${log_path}')).toBeLessThan(
      bootstrap.indexOf('chown zhipet:zhipet "${log_path}"'),
    )
    expect(bootstrap).toContain(
      'install -o root -g root -m 0644 "${logrotate_source}" /etc/logrotate.d/zhipet',
    )
    expect(bootstrap).toContain('logrotate --debug /etc/logrotate.d/zhipet')
    expect(bootstrap).toContain(
      'web.jsonl web-error.log mail.jsonl mail-error.log purge.jsonl purge-error.log status.jsonl status-error.log',
    )
    expect(bootstrap).toContain('install -o zhipet -g zhipet -m 0640 /dev/null "${log_path}"')
    expect(bootstrap).toContain('chown zhipet:zhipet "${log_path}"')
    expect(bootstrap).toContain('chmod 0640 "${log_path}"')
    expect(bootstrap).toContain('nginx-access.jsonl nginx-error.log')
    expect(bootstrap).toContain('install -o root -g adm -m 0640 /dev/null "${log_path}"')

    const applicationLogs = readPolicyBlock(logrotate, '/var/log/zhipet/web.jsonl')
    const nginxLogs = readPolicyBlock(logrotate, '/var/log/zhipet/nginx-access.jsonl')

    for (const policy of [applicationLogs, nginxLogs]) {
      expect(policy).toMatch(/^\s*daily$/m)
      expect(policy).toMatch(/^\s*maxsize 20M$/m)
      expect(policy).not.toMatch(/^\s*size 20M$/m)
      expect(policy).toMatch(/^\s*rotate 7$/m)
      expect(policy).toMatch(/^\s*compress$/m)
      expect(policy).toMatch(/^\s*delaycompress$/m)
    }

    expect(logrotate.match(/^\s*maxsize 20M$/gm)).toHaveLength(2)
    expect(logrotate).not.toMatch(/^\s*size 20M$/m)
    expect(applicationLogs).toMatch(/^\s*copytruncate$/m)
    expect(applicationLogs).toContain('/var/log/zhipet/status.jsonl')
    expect(applicationLogs).toContain('/var/log/zhipet/status-error.log')
    expect(applicationLogs).not.toMatch(/^\s*sharedscripts$/m)
    expect(nginxLogs).not.toMatch(/^\s*copytruncate$/m)
    expect(nginxLogs).toMatch(/^\s*create 0640 root adm$/m)
    expect(nginxLogs).toMatch(/^\s*sharedscripts$/m)
    expect(nginxLogs).toContain('/usr/bin/systemctl is-active --quiet nginx.service')
    expect(nginxLogs).toContain(
      '/usr/bin/systemctl kill --kill-whom=main --signal=USR1 nginx.service',
    )
    expect(nginxLogs).not.toContain('|| true')

    for (const unit of [webService, mailService, purgeService, statusService]) {
      expect(unit).not.toContain('MemoryMax=')
      expect(unit).not.toContain('CPUQuota=')
    }
  })

  it('documents exact CLS topic, path, parser, index, and access contracts', () => {
    const observabilityGuide = readProjectFile('deploy/tencent-cloud/observability/README.md')

    expect(
      readMarkdownTable(observabilityGuide, '| 主题 | 用途 | CLS retention |').map(
        ([topic, , retention]) => [topic, retention],
      ),
    ).toEqual([
      ['zhipet-access', '14 days'],
      ['zhipet-operations', '30 days'],
      ['zhipet-audit', '180 days'],
      ['zhipet-error-restricted', '7 days'],
    ])

    expect(
      readMarkdownTable(observabilityGuide, '| 采集配置 | 主题 | 路径 | 解析方式 |').map(
        ([, topic, path, parser]) => [path, topic, parser],
      ),
    ).toEqual([
      ['/var/log/zhipet/nginx-access.jsonl', 'zhipet-access', 'JSON 提取'],
      ['/var/log/zhipet/web.jsonl', 'zhipet-access', 'JSON 提取'],
      ['/var/log/zhipet/mail.jsonl', 'zhipet-operations', 'JSON 提取'],
      ['/var/log/zhipet/purge.jsonl', 'zhipet-operations', 'JSON 提取'],
      ['/var/log/zhipet/status.jsonl', 'zhipet-operations', 'JSON 提取'],
      ['/var/log/zhipet/nginx-error.log', 'zhipet-error-restricted', '单行文本'],
      ['/var/log/zhipet/web-error.log', 'zhipet-error-restricted', '单行文本'],
      ['/var/log/zhipet/mail-error.log', 'zhipet-error-restricted', '单行文本'],
      ['/var/log/zhipet/purge-error.log', 'zhipet-error-restricted', '单行文本'],
      ['/var/log/zhipet/status-error.log', 'zhipet-error-restricted', '单行文本'],
    ])

    const indexedFields = readMarkdownTable(observabilityGuide, '| 字段 | CLS 类型 | 用途 |').map(
      ([field, type]) => [field, type],
    )
    expect(indexedFields).toEqual(
      expect.arrayContaining([
        ['durationMs', 'double'],
        ['durationSeconds', 'double'],
        ['upstreamDurationSeconds', 'text'],
        ['failedCount', 'long'],
        ['oldestPendingEmailAgeSeconds', 'long'],
        ['databaseConnected', 'text'],
        ['feedbackPending', 'long'],
        ['emailOutboxPending', 'long'],
      ]),
    )

    for (const field of ['__TIMESTAMP__', '__FILENAME__', '__SOURCE__', '__HOSTNAME__']) {
      expect(observabilityGuide).toContain(field)
    }
    expect(observabilityGuide).toContain('关闭全文索引')
    expect(observabilityGuide).toContain('`__CONTENT__` 不做全文检索')
    expect(observabilityGuide).toContain('只授予至少两名身份已验证运维人员所在的最小权限组')
    expect(observabilityGuide).not.toContain('只建立 `timestamp`、`host`、`sourceFile`、`severity`')
    for (const url of [
      'https://cloud.tencent.com/document/product/614/50922',
      'https://cloud.tencent.com/document/product/614/55281',
      'https://cloud.tencent.com/document/product/614/17419',
    ]) {
      expect(observabilityGuide).toContain(url)
    }
    expect(observabilityGuide).toContain(
      'type=job_completed AND job=mail_delivery AND failedCount>0',
    )
    expect(observabilityGuide).toContain('oldestPendingEmailAgeSeconds>600')
    expect(observabilityGuide).toContain('databaseConnected=false')
    expect(observabilityGuide).toContain('emailOutboxPending')
    expect(observabilityGuide).toContain('emailOutboxFailed>0')
    expect(observabilityGuide).toContain('12 分钟没有 `operations_status`')
    expect(observabilityGuide).toContain('5 分钟没有 `mail_delivery`')
    expect(observabilityGuide).not.toContain('database.connected')
    expect(observabilityGuide).not.toContain('emailOutbox.PENDING')
  })

  it('keeps the configured production log path set equal to the collector whitelist', () => {
    const deploymentFiles = [
      'deploy/tencent-cloud/nginx/zhipet.conf.template',
      'deploy/tencent-cloud/nginx/zhipet-http-bootstrap.conf.template',
      'deploy/tencent-cloud/systemd/zhipet-web.service',
      'deploy/tencent-cloud/systemd/zhipet-mail.service',
      'deploy/tencent-cloud/systemd/zhipet-purge.service',
      'deploy/tencent-cloud/systemd/zhipet-ops-status.service',
    ].map(readProjectFile)
    const configuredPaths = [
      ...new Set(
        deploymentFiles
          .flatMap((file) => file.match(/\/var\/log\/zhipet\/[a-z0-9.-]+/g) ?? [])
          .sort(),
      ),
    ]
    const expectedPaths = [
      '/var/log/zhipet/mail-error.log',
      '/var/log/zhipet/mail.jsonl',
      '/var/log/zhipet/nginx-access.jsonl',
      '/var/log/zhipet/nginx-error.log',
      '/var/log/zhipet/purge-error.log',
      '/var/log/zhipet/purge.jsonl',
      '/var/log/zhipet/status-error.log',
      '/var/log/zhipet/status.jsonl',
      '/var/log/zhipet/web-error.log',
      '/var/log/zhipet/web.jsonl',
    ]
    const bootstrap = readProjectFile('deploy/tencent-cloud/scripts/bootstrap-runtime.sh')
    const bootstrapPaths = [
      ...new Set(
        [...bootstrap.matchAll(/for (?:application|nginx)_log in ([^;]+); do/g)]
          .flatMap((match) => match[1].trim().split(/\s+/))
          .map((name) => `/var/log/zhipet/${name}`)
          .sort(),
      ),
    ]
    const logrotatePaths = [
      ...new Set(
        (
          readProjectFile('deploy/tencent-cloud/logrotate/zhipet').match(
            /\/var\/log\/zhipet\/[a-z0-9.-]+/g,
          ) ?? []
        ).sort(),
      ),
    ]
    const collectorPaths = readMarkdownTable(
      readProjectFile('deploy/tencent-cloud/observability/README.md'),
      '| 采集配置 | 主题 | 路径 | 解析方式 |',
    )
      .map(([, , path]) => path)
      .sort()

    expect(configuredPaths).toEqual(expectedPaths)
    expect(bootstrapPaths).toEqual(expectedPaths)
    expect(logrotatePaths).toEqual(expectedPaths)
    expect(collectorPaths).toEqual(expectedPaths)
  })

  it('documents executable production CLI context and the backup monitoring gap', () => {
    const runbook = readProjectFile('docs/OPERATIONS_RUNBOOK.md')
    const deploymentGuide = readProjectFile('deploy/tencent-cloud/README.md')
    const productionOperations = readProjectFile('docs/PRODUCTION_OPERATIONS.md')

    for (const document of [runbook, deploymentGuide]) {
      expect(document).toContain('sudo -u zhipet --chdir=/srv/zhipet/current --')
      expect(document).toContain('--env-file=/etc/zhipet/zhipet.env')
      expect(document).not.toContain('/bin/bash -c')
      expect(document).not.toContain('source /etc/zhipet/zhipet.env')
      expect(document).toContain('scripts/operations-status.mjs')
      expect(document).toContain('scripts/manage-feedback.mjs summary')
      expect(document).toContain('/srv/zhipet/current/.release-commit')
      expect(document).toContain('nologin')
      expect(document).toContain('unit lifecycle')
      expect(document).toContain('JSONL/CLS')
      expect(document).toContain('restricted')
      expect(document).toContain('不创建宽泛 sudo')
    }

    for (const document of [runbook, deploymentGuide, productionOperations]) {
      expect(document).toContain('production blocker')
      expect(document).toContain('daily manual review gap')
      expect(document).toContain('托管数据库原生备份成功事件或指标')
      expect(document).toContain('经审批的备份作业脱敏成功事件')
    }
  })

  it('loads the production environment template with Node env-file semantics', () => {
    const environment = { ...process.env }
    delete environment.DATABASE_URL
    delete environment.ZHIPET_RELEASE_SHA

    const probe = spawnSync(
      process.execPath,
      [
        '--env-file=deploy/tencent-cloud/zhipet.env.example',
        '-e',
        [
          "const expected = 'postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_PRIVATE_DB_HOST:5432/zhipet?schema=public&sslmode=require'",
          'if (process.env.DATABASE_URL !== expected) process.exit(1)',
          "if (process.env.ZHIPET_RELEASE_SHA !== '') process.exit(2)",
        ].join(';'),
      ],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        env: environment,
      },
    )

    expect(probe.status).toBe(0)
    expect(probe.stdout).toBe('')
    expect(probe.stderr).toBe('')
    expect(readProjectFile('deploy/tencent-cloud/zhipet.env.example')).toContain(
      'Do not source it from Bash',
    )
  })

  it('executes the production CLI contract without shell-reinterpreting arguments', () => {
    const bashExecutable =
      process.platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : 'bash'
    const temporaryRoot = mkdtempSync(join(tmpdir(), 'zhipet-cli-contract-'))
    const contractRoot = join(temporaryRoot, 'contract root')
    const binDirectory = join(contractRoot, 'bin')
    const appDirectory = join(contractRoot, 'app')
    const configDirectory = join(contractRoot, 'config')
    const probePath = join(appDirectory, 'probe.mjs')
    const environmentPath = join(configDirectory, 'zhipet.env')
    const injectionMarker = join(contractRoot, 'command-injected')

    mkdirSync(binDirectory, { recursive: true })
    mkdirSync(appDirectory, { recursive: true })
    mkdirSync(configDirectory, { recursive: true })

    writeFileSync(
      join(binDirectory, 'sudo'),
      [
        '#!/usr/bin/env bash',
        'set -euo pipefail',
        '[[ "$#" -ge 4 ]]',
        '[[ "$1" == "-u" && "$2" == "zhipet" ]]',
        'shift 2',
        '[[ "$1" == --chdir=* ]]',
        'workdir=${1#--chdir=}',
        'shift',
        '[[ "$1" == "--" ]]',
        'shift',
        'cd -- "$workdir"',
        'exec "$@"',
        '',
      ].join('\n'),
      'utf8',
    )
    chmodSync(join(binDirectory, 'sudo'), 0o755)
    writeFileSync(
      environmentPath,
      [
        'DATABASE_URL=postgresql://user:password@db:5432/zhipet?schema=public&sslmode=require',
        'ZHIPET_RELEASE_SHA=',
        '',
      ].join('\n'),
      'utf8',
    )
    writeFileSync(
      probePath,
      [
        "if (process.argv[2] === '__fail__') process.exit(23)",
        'process.stdout.write(JSON.stringify({',
        '  cwd: process.cwd(),',
        '  databaseUrl: process.env.DATABASE_URL,',
        '  release: process.env.ZHIPET_RELEASE_SHA,',
        '  args: process.argv.slice(2),',
        '}))',
        '',
      ].join('\n'),
      'utf8',
    )

    const runContract = ({
      args = [],
      chdir = '$PWD/app',
      envFile = '$PWD/config/zhipet.env',
    }: {
      args?: string[]
      chdir?: string
      envFile?: string
    } = {}) =>
      spawnSync(
        bashExecutable,
        [
          '-c',
          [
            'export PATH="$PWD/bin:$PATH"',
            `sudo -u zhipet --chdir="${chdir}" -- \\`,
            `  node --env-file="${envFile}" "$PWD/app/probe.mjs" "$@"`,
          ].join('\n'),
          'zhipet-cli-contract',
          ...args,
        ],
        {
          cwd: contractRoot,
          encoding: 'utf8',
        },
      )

    try {
      const literalArguments = ['argument with spaces', 'semi;colon', '$(touch command-injected)']
      const success = runContract({ args: literalArguments })

      expect(success.status).toBe(0)
      expect(success.stderr).toBe('')
      expect(JSON.parse(success.stdout)).toEqual({
        cwd: appDirectory,
        databaseUrl: 'postgresql://user:password@db:5432/zhipet?schema=public&sslmode=require',
        release: '',
        args: literalArguments,
      })
      expect(existsSync(injectionMarker)).toBe(false)

      expect(runContract({ chdir: '$PWD/missing' }).status).not.toBe(0)
      expect(runContract({ envFile: '$PWD/config/missing.env' }).status).not.toBe(0)
      expect(runContract({ args: ['__fail__'] }).status).toBe(23)
    } finally {
      rmSync(temporaryRoot, { force: true, recursive: true })
    }
  })

  it('keeps release environment derivation explicit for every production entrypoint', () => {
    const localEnvironment = readProjectFile('.env.example')
    const productionEnvironment = readProjectFile('deploy/tencent-cloud/zhipet.env.example')
    const wrapper = readProjectFile('scripts/start-production.mjs')
    const statusService = readProjectFile('deploy/tencent-cloud/systemd/zhipet-ops-status.service')
    const deploymentGuide = readProjectFile('deploy/tencent-cloud/README.md')

    expect(localEnvironment).toMatch(/^ZHIPET_RELEASE_SHA=$/m)
    expect(productionEnvironment).toMatch(/^ZHIPET_RELEASE_SHA=$/m)
    expect(wrapper).toContain("resolve(process.cwd(), '.release-commit')")
    expect(wrapper).toContain('process.env.ZHIPET_RELEASE_SHA = releaseSha')
    expect(statusService).toContain('EnvironmentFile=/etc/zhipet/zhipet.env')
    expect(statusService).toContain('WorkingDirectory=/srv/zhipet/current')
    expect(deploymentGuide).toContain(
      'enable --now zhipet-mail.timer zhipet-purge.timer zhipet-ops-status.timer',
    )
  })

  it('uses GitHub Actions releases that run on the current hosted runtime', () => {
    const workflow = readProjectFile('.github/workflows/pages.yml')

    expect(workflow).toContain('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1')
    expect(workflow).toContain(
      'pnpm/action-setup@0ebf47130e4866e96fce0953f49152a61190b271 # v6.0.9',
    )
    expect(workflow).toContain(
      'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0',
    )
    expect(workflow).toContain(
      'actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6.0.0',
    )
    expect(workflow).toContain(
      'actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0',
    )
    expect(workflow).toContain(
      'actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5.0.0',
    )
  })
})
