/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { MarkdownExit } from 'markdown-exit'

/**
 * Type-only boundary for compatible third-party markdown-it plugins.
 * Preserve their options and rest arguments without casting the parser itself.
 */
export function compatiblePlugin<Args extends unknown[]>(
  plugin: (md: never, ...args: Args) => void
): (md: MarkdownExit, ...args: Args) => void {
  return plugin as (md: MarkdownExit, ...args: Args) => void
}
