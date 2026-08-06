// app/utils/seo.ts
// Single source of truth for site-wide SEO constants.
// Import these instead of hardcoding the domain/name/image in individual pages.

export const SITE_URL = 'https://rungorun.store'
export const SITE_NAME = 'Run Go Run'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`
export const DEFAULT_LOGO_IMAGE = `${SITE_URL}/apple-touch-icon.png`
export const DEFAULT_DESCRIPTION =
  "Engineered running gear built for Accra's heat and hustle. Vests, armbands, shorts, and gear made for runners who earn it every day. Shop rungorun.store."

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
