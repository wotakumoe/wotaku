/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

export function parseExtRepoAttrs(text: string): Record<string, string> {
  const match = text.match(/\{([^}]*)\}/)

  if (!match) return {}

  const attrs: Record<string, string> = {}

  for (const token of match[1].split(/[\s,]+/).filter(Boolean)) {
    const eq = token.indexOf('=')

    if (eq < 0) {
      attrs[token] = 'true'
      continue
    }

    const key = token.slice(0, eq)
    const value = token.slice(eq + 1)

    if (key && value) attrs[key] = value.replace(/^["']|["']$/g, '')
  }

  return attrs
}
