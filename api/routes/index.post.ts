/**
*  All Rights Reserved
*
*  Copyright (c) 2025 taskylizard
*
*  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
*/
import { fetcher } from 'itty-fetcher'
import {
  FeedbackSchema,
  getFeedbackOption
} from '../../docs/.vitepress/types/Feedback'

export default defineEventHandler(async (event) => {
  const { message, page, type, heading } = await readValidatedBody(
    event,
    FeedbackSchema.parseAsync
  )
  const env = useRuntimeConfig(event)

  const fields = [
    {
      name: 'Page',
      value: page,
      inline: true
    },
    {
      name: 'Message',
      value: message,
      inline: false
    }
  ]

  if (heading) {
    fields.unshift({
      name: 'Section',
      value: heading,
      inline: true
    })
  }

  // FIXME: somehow this is not working, but it worked before
  // const path = 'feedback'
  //
  // const { success } = await env.MY_RATE_LIMITER.limit({ key: path })
  // if (!success) {
  //   return new Response('429 Failure – global rate limit exceeded', {
  //     status: 429
  //   })
  // }

  await fetcher()
    .post(env.WEBHOOK_URL, {
      username: 'Feedback',
      embeds: [
        {
          color: 3447003,
          title: getFeedbackOption(type)!.label,
          fields
        }
      ]
    })
    .catch((error) => {
      throw new Error(error)
    })

  return { status: 'ok' }
})
