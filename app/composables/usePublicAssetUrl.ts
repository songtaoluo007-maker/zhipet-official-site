import { resolvePublicAssetUrl } from '~/utils/public-asset-url'

export const usePublicAssetUrl = () => {
  const baseURL = typeof useRuntimeConfig === 'function' ? useRuntimeConfig().app.baseURL : '/'

  return (source: string) => resolvePublicAssetUrl(source, baseURL)
}
