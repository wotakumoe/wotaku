export type NavBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

interface NavActionBase {
  hideBelow?: NavBreakpoint
}

export interface NavSearchAction extends NavActionBase {
  type: 'search'
}

export interface NavAppearanceAction extends NavActionBase {
  type: 'appearance'
}

export interface NavSettingsAction extends NavActionBase {
  type: 'settings'
}

export interface NavBookmarksAction extends NavActionBase {
  type: 'bookmarks'
}

export interface NavAnnouncementAction extends NavActionBase {
  type: 'announcement'
}

export interface NavLinkAction extends NavActionBase {
  type: 'link'
  icon: string
  link: string
  label: string
}

export type NavAction =
  | NavSearchAction
  | NavAppearanceAction
  | NavSettingsAction
  | NavBookmarksAction
  | NavAnnouncementAction
  | NavLinkAction

export const navActions: NavAction[] = [
  { type: 'appearance' },
  { type: 'search' },
  { type: 'bookmarks' },
  { type: 'announcement' },
  { type: 'settings' },
  {
    type: 'link',
    icon: 'github',
    link: 'https://github.com/wotakumoe/Wotaku',
    label: 'GitHub'
  },
  {
    type: 'link',
    icon: 'discord',
    link: 'https://discord.gg/vShRGx8ZBC',
    label: 'Discord'
  }
]
