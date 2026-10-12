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
