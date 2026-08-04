export default defineEventHandler(async (event) => {
  const { urls } = await readBody(event)

  if (!Array.isArray(urls) || urls.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'urls array required' })
  }

  return submitToIndexNow(urls)
})
