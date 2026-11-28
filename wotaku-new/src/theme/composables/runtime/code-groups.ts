/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { inBrowser, onContentUpdated } from '@/theme/shared/client'

export function useCodeGroups() {
  if (import.meta.env.DEV) {
    onContentUpdated(() => {
      document.querySelectorAll('.wotaku-code-group > .blocks').forEach((el) => {
        Array.from(el.children).forEach((child) => {
          child.classList.remove('active')
        })
        el.children[0].classList.add('active')
      })
    })
  }

  if (inBrowser) {
    window.addEventListener('click', (e) => {
      const el = e.target as HTMLInputElement

      if (el.matches('.wotaku-code-group input')) {
        // input <- .tabs <- .wotaku-code-group
        const group = el.parentElement?.parentElement

        if (!group) return

        const i = Array.from(group.querySelectorAll('input')).indexOf(el)

        if (i < 0) return

        const blocks = group.querySelector('.blocks')

        if (!blocks) return

        const current = Array.from(blocks.children).find((child) =>
          child.classList.contains('active')
        )

        if (!current) return

        const next = blocks.children[i]

        if (!next || current === next) return

        current.classList.remove('active')
        next.classList.add('active')

        const label = group?.querySelector(`label[for="${el.id}"]`)
        label?.scrollIntoView({ block: 'nearest' })
      }
    })
  }
}
