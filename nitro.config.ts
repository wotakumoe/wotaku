//https://nitro.unjs.io/config
export default defineNitroConfig({
  compatibilityDate: '2024-12-16',
  runtimeConfig: {
    WEBHOOK_URL: process.env.WEBHOOK_URL
  },
  srcDir: 'api',
  routeRules: {
    '/': {
      cors: false
    }
  }
})
