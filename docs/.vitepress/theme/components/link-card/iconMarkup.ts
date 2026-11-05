/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
const KNOWN_PREFIXES =
  /^(lucide|mdi|ic|mingcute|material-symbols|simple-icons|uil|octicon|logos|akar-icons|map|bi|streamline-logos|streamline-ultimate|streamline-sharp|iconoir|twemoji)-/

export function renderCardIcon(icon: string) {
  if (!icon.includes(':')) return `<span class="${icon}"></span>`

  return icon.replace(/:([A-Za-z0-9_+-]+):/g, (_, markup) => {
    const cls = KNOWN_PREFIXES.test(markup) ? markup : `twemoji-${markup}`
    return `<span class="i-${cls}"></span>`
  })
}
