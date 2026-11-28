/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { aliases } from '../markdown/emoji.ts'

const PLATFORMS: Record<string, string> = {
  and: 'Android',
  ios: 'iOS / iPadOS',
  win: 'Windows',
  app: 'MacOS',
  lin: 'Linux',
  bsd: 'BSD',
  cmd: 'CLI / TUI',
  web: 'Website / Web-based'
}

export interface PlatformInfo {
  icon: string
  label: string
}

export default {
  watch: ['../markdown/emoji.ts'],
  load(): Record<string, PlatformInfo> {
    const result: Record<string, PlatformInfo> = {}

    for (const [token, label] of Object.entries(PLATFORMS)) {
      const icon = aliases[token]

      if (icon) result[token] = { icon, label }
    }

    return result
  }
}
