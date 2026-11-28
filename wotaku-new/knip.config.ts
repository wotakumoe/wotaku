import type { KnipConfig } from 'knip'

export default {
  entry: [
    'src/build/vite/{build,server}.ts',
    'src/build/markdown/config.ts',
    'src/build/opengraph/generate.ts',
    'src/content/pages/**/*.md',
    'src/theme/shared/workers/search-worker.ts'
  ],
  project: [
    'src/**/*.{ts,tsx,vue,scss,sass}',
    'src/content/pages/**/*.md',
    'tools/**/*.{ts,mjs}',
    '*.ts'
  ],
  compilers: {
    // The in-house Markdown compiler extracts SFC scripts, not JS code fences.
    md: (source) =>
      [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
        .map((match) => match[1])
        .join('\n')
  },
  paths: {
    '@/*': ['src/*']
  },
  ignoreDependencies: [
    // These import IDs are served by the local Vite plugin, not npm packages.
    '@wotaku/pages',
    /^@localSearchIndex/,
    // Vite resolves its CSS minifier by name.
    'lightningcss'
  ],
  ignoreIssues: { '**/*.data.ts': ['exports'] },
  ignoreExportsUsedInFile: true
} satisfies KnipConfig
