export interface PromptRule {
  pattern: string
  prompts: string[]
  includeDefault?: boolean
}

export const DEFAULT_PROMPTS: string[] = [
  "Tips: Starring our GitHub repo increases the chances of your feedback being accepted twofold.",
  "Tips: Keep your feedback precise.",
  "Tips: Don't ask us questions as we can't really answer you here, join our Discord instead.",
  "Tips: You should read rules before submitting links.",
  "Tips: English, motherf**ker, do you speak it?!",
  "Fun fact: Meme is evil and has almost taken over the wiki.",
  "Fun fact: Bloat ≠ quality.",
  "Damn! We got a visitor!"
]

export const PAGE_PROMPT_CONFIG: PromptRule[] = [
  {
    pattern: "/ext/*",
    prompts: [
      "Fun fact: We don't maintain any extension repos, complaining to us won't solve your issue.",
      "Fun fact: We can't really add or fix any type of extensions.",
      "Tips: Visit the extensions homepage to see which apps support which extension systems."
    ]
  },
  {
    pattern: "/websites",
    includeDefault: true,
    prompts: [
      "Tips: If you are submitting a scraper site, mention all the sources.",
    ]
  },
  {
    pattern: "/japan/*",
    prompts: [
      "We're in urgent need of some solid contributions right now, especially on the software side of things."
    ]
  }
]

function matchPattern(pattern: string, path: string): boolean {
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2)
    return path === base || path.startsWith(base + "/") || path.startsWith(base)
  }
  return path === pattern
}

export function resolvePrompts(path: string): string[] {
  const matched = PAGE_PROMPT_CONFIG.find((rule) =>
    matchPattern(rule.pattern, path)
  )

  if (!matched) return DEFAULT_PROMPTS

  return matched.includeDefault
    ? [...matched.prompts, ...DEFAULT_PROMPTS]
    : matched.prompts
}