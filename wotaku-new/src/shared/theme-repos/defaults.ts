/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { ManaTheme } from './types.ts'

export const DEFAULT_THEME: ManaTheme = {
  name: 'Default',
  colors: {
    accent: '#1782FFFF',
    background: '#131313FF',
    contentTileOverlay: '#0F0F0FEB',
    foregroundOnAccent: '#FFFFFFFF',
    label: '#FFFFFFFF',
    secondaryBackground: '#181818FF',
    secondaryLabel: '#929292FF',
    separator: '#EBEBF52E',
    separatorSubtle: '#EBEBF52E',
    shadow: '#000000FF',
    statusDestructive: '#B82A1BFF',
    statusInfo: '#1A6BAFFF',
    statusPositive: '#15780CFF',
    statusWarning: '#A07D10FF',
    tertiaryBackground: '#282828FF'
  }
}

export const IDENTITY_COLORS = [
  'accent',
  'background',
  'secondaryBackground',
  'tertiaryBackground'
] as const

export const resolveThemeColors = (
  colors?: Record<string, string>
): Record<string, string> => ({ ...DEFAULT_THEME.colors, ...colors })
