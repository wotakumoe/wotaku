/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
// https://nitro.unjs.io/config
export default defineNitroConfig({
  compatibilityDate: '2024-12-16',
  runtimeConfig: {
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    op: { url: process.env.OP_URL, id: process.env.OP_ID }
  },
  srcDir: 'api',
  routeRules: {
    '/': {
      cors: false
    }
  }
})
