import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const fullGitShaPattern = /^[0-9a-f]{40}$/
const releaseFile = resolve(process.cwd(), '.release-commit')
const releaseSha = (await readFile(releaseFile, 'utf8').catch(() => '')).trim()

if (fullGitShaPattern.test(releaseSha)) {
  process.env.ZHIPET_RELEASE_SHA = releaseSha
}

await import('../.output/server/index.mjs')
