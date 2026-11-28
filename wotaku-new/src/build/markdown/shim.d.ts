/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

declare module 'markdown-it-regexp' {
  import type { PluginSimple } from 'markdown-exit'

  function regexp(
    pattern: RegExp,
    replacer: (
      match: RegExpExecArray,
      utils: { escape: (html: unknown) => string }
    ) => string
  ): PluginSimple

  export = regexp
}
