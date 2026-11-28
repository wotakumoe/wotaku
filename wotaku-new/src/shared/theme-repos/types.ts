/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

export interface ThemeRepoEntry {
  name: string
  url?: string
  src?: string
  raw?: string
}

export interface ManaTheme {
  name: string
  author?: string
  colors: Record<string, string>
  raw?: string
}
