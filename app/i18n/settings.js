export const fallbackLng = 'en'
export const supportedLngs = ['en', 'te', 'hi', 'ta']
export const defaultNS = 'common'

export function getOptions (lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}