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

  it('uses GitHub Actions releases that run on the current hosted runtime', () => {
    const workflow = readProjectFile('.github/workflows/pages.yml')

    expect(workflow).toContain(
      'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1',
    )
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
