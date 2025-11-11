/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import z from 'zod'

export const FeedbackSchema = z.object({
  message: z.string().min(5).max(1000),
  type: z.enum([
    'submit',
    'update',
    'report',
    'suggestion',
    'appreciation',
    'other'
  ]),
  page: z.string().url(),
  // For heading based feedback
  heading: z.string().min(3).max(20).optional()
})

export interface Option {
  label: string
  value: FeedbackType['type']
}

export const feedbackOptions: Option[] = [
  {
    label: '➕ Submit link',
    value: 'submit'
  },
  {
    label: '❗ Update link',
    value: 'update'
  },
  {
    label: '❌ Report bad / dead link',
    value: 'report'
  },
  {
    label: '💡 Suggest edit',
    value: 'suggestion'
  },
  {
    label: '❤ Love the wiki',
    value: 'appreciation'
  },
  { label: '💬 Something else', value: 'other' }
]

export function getFeedbackOption(
  value: FeedbackType['type']
): Option | undefined {
  return feedbackOptions.find((option) => option.value === value)
}

export type FeedbackType = z.infer<typeof FeedbackSchema>
