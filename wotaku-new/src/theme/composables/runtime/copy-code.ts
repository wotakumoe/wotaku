/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { inBrowser } from '@/theme/shared/client'

const shellRE = /language-(shellscript|shell|bash|sh|zsh)/
const ignoredNodes = ['.wotaku-copy-ignore', '.diff.remove'].join(', ')

export function useCopyCode() {
  if (inBrowser) {
    const timeoutIdMap: WeakMap<HTMLElement, NodeJS.Timeout> = new WeakMap()
    window.addEventListener('click', (e) => {
      const el = e.target as HTMLElement

      if (el.matches('div[class*="language-"] > button.copy')) {
        const parent = el.parentElement
        const sibling = el.nextElementSibling?.nextElementSibling // <pre> tag
        if (!parent || !sibling) {
          return
        }

        const isShell = shellRE.test(parent.className)

        // Clone the node and remove the ignored nodes
        const clone = sibling.cloneNode(true) as HTMLElement
        clone.querySelectorAll(ignoredNodes).forEach((node) => node.remove())
        // remove extra newlines left after removing ignored nodes (affecting textContent because it is inside `<pre>`)
        // doesn't affect the newlines already in the code because they are rendered as `\n<span class="line"></span>`
        clone.innerHTML = clone.innerHTML.replace(/\n+/g, '\n')

        let text = clone.textContent || ''

        if (isShell) {
          text = text.replace(/^ *(\$|>) /gm, '').trim()
        }

        const feedback = parent.querySelector<HTMLElement>('.code-copy-feedback')!
        clearTimeout(timeoutIdMap.get(el))
        el.classList.remove('copied')
        feedback.classList.add('visually-hidden')
        feedback.textContent = ''

        void copyToClipboard(text)
          .then(() => {
            el.classList.add('copied')
            feedback.textContent = 'Copied to clipboard'
            const timeoutId = setTimeout(() => {
              el.classList.remove('copied')
              timeoutIdMap.delete(el)
            }, 2000)
            timeoutIdMap.set(el, timeoutId)
          })
          .catch(() => {
            feedback.classList.remove('visually-hidden')
            feedback.textContent = "Couldn't copy. Select the code and copy it manually."
            feedback.scrollIntoView({ block: 'nearest' })
          })
      }
    })
  }
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }

  const element = document.createElement('textarea')
  const previouslyFocusedElement = document.activeElement

  element.value = text

  // Prevent keyboard from showing on mobile
  element.setAttribute('readonly', '')

  element.style.contain = 'strict'
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.fontSize = '12pt' // Prevent zooming on iOS

  const selection = document.getSelection()
  const originalRange = selection
    ? selection.rangeCount > 0 && selection.getRangeAt(0)
    : null

  document.body.appendChild(element)
  element.select()

  // Explicit selection workaround for iOS
  element.selectionStart = 0
  element.selectionEnd = text.length

  let copied = false

  try {
    copied = document.execCommand('copy')
  } finally {
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      ;(previouslyFocusedElement as HTMLElement).focus()
    }
  }

  if (!copied) throw new Error('Clipboard copy failed')
}
