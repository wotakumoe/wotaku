import { aliases } from '../../../configs/markdown/emoji'

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
  watch: ['../../../configs/markdown/emoji.ts'],
  load(): Record<string, PlatformInfo> {
    const result: Record<string, PlatformInfo> = {}
    for (const [token, label] of Object.entries(PLATFORMS)) {
      const icon = aliases[token]
      if (icon) result[token] = { icon, label }
    }
    return result
  }
}
