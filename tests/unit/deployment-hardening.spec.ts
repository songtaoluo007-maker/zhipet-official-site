import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path: string) =>
  readFileSync(resolve(process.cwd(), path), 'utf8')

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

  it('overwrites untrusted forwarded address chains at the public proxy', () => {
    const proxyConfig = readProjectFile('deploy/tencent-cloud/nginx/zhipet-proxy.conf')

    expect(proxyConfig).toContain('proxy_set_header X-Forwarded-For $remote_addr;')
    expect(proxyConfig).not.toContain('$proxy_add_x_forwarded_for')
  })
})
