const fullGitShaPattern = /^[0-9a-f]{40}$/

export const parseReleaseSha = (value: string | undefined): string | undefined => {
  const normalized = value?.trim()

  return normalized && fullGitShaPattern.test(normalized)
    ? normalized
    : undefined
}

export const getPublicReleaseId = (
  value: string | undefined,
  fallback: 'development' | 'unknown',
): string => parseReleaseSha(value)?.slice(0, 12) ?? fallback
