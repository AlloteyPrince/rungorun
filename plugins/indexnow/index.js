import { INDEXNOW_KEY, INDEXNOW_HOST } from '../../server/utils/indexNowKey.js'

export default {
  onSuccess: async ({ constants }) => {
    const siteUrl = constants.URL || `https://${INDEXNOW_HOST}`

    try {
      const sitemapRes = await fetch(`${siteUrl}/sitemap.xml`)
      const xml = await sitemapRes.text()
      const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])

      if (urls.length === 0) return

      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: INDEXNOW_HOST,
          key: INDEXNOW_KEY,
          keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
          urlList: urls
        })
      })
    } catch (err) {
      console.warn('IndexNow submission failed:', err.message)
    }
  }
}
