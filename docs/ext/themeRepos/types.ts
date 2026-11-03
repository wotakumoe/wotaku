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
