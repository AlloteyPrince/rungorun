import { INDEXNOW_KEY, INDEXNOW_HOST } from './indexNowKey'

export async function submitToIndexNow(urls) {
  const urlList = urls.filter(Boolean)
  if (urlList.length === 0) return { skipped: true }

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList
    })
  })

  return { ok: response.ok, status: response.status }
}
