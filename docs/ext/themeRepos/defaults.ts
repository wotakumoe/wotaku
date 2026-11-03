import type { ManaTheme } from './types'

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

export const resolveThemeColors = (
  colors?: Record<string, string>
): Record<string, string> => ({ ...DEFAULT_THEME.colors, ...(colors ?? {}) })
