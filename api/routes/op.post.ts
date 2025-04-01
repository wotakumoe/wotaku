import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event).op

  try {
    const target = joinURL(config.url, 'track')

    const headers = {
      'X-Forwarded-For': getRequestIP(event, { xForwardedFor: true }),
      'Content-Type': 'application/json',
      'openpanel-client-id': config.id,
    }

    headers['openpanel-sdk-name'] = 'nitro'
    headers['openpanel-sdk-version'] = '1.0.0'

    return proxyRequest(event, target, {
      headers,
    })
  }
  catch (error) {
    console.error(error)

    throw createError({
      statusCode: 502,
      message: 'Failed to proxy request',
    })
  }
})
