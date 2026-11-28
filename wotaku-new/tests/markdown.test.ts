import { randomUUID } from 'node:crypto'
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import path from 'node:path'
import { deserialize } from 'node:v8'
import { gunzipSync } from 'node:zlib'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import {
  repositoryRoot,
  createMarkdownCompiler,
  pagesRoot,
  type MarkdownCompiler,
  type MarkdownCompileResult,
  repositoryRoot as packageRoot
} from '../src/build/markdown/compiler'

function publishedFiles(directory = pagesRoot): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.name.startsWith('.')) return []

      const file = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        // Identical to srcExclude: ['README.md', 'sandbox/**/*.md'].
        return file === path.join(pagesRoot, 'sandbox') ? [] : publishedFiles(file)
      }

      return file !== path.join(pagesRoot, 'README.md') && file.endsWith('.md')
        ? [file]
        : []
    })
    .sort()
}

const pages = publishedFiles()
let compiler: MarkdownCompiler
let scratch: string
const transientSharedFiles = new Set<string>()

interface BaselineRecord {
  source: string
  relativePath: string
  result: MarkdownCompileResult
}

// Captured independently before the renderer refactor. V8 deserialization keeps
// Date, undefined and non-finite metadata values intact; never record from here.
const baseline: BaselineRecord[] = deserialize(
  gunzipSync(readFileSync(new URL('./fixtures/markdown-baseline.v8.gz', import.meta.url)))
)
// Keep the independent snapshot immutable; relocate only its component imports.
for (const record of baseline) {
  for (const [from, to] of [
    [
      'src/site/theme/components/link-card/Card.vue',
      'src/theme/components/link-card/LinkCard.vue'
    ],
    [
      'src/site/theme/components/link-card/Grid.vue',
      'src/theme/components/link-card/LinkCardGrid.vue'
    ],
    [
      'src/site/theme/components/Contributors.vue',
      'src/theme/components/Contributors.vue'
    ],
    [
      'src/site/theme/components/HomeFeatures.vue',
      'src/theme/components/home/HomeFeatures.vue'
    ],
    ['src/site/theme/components/DevOnly.vue', 'src/theme/components/DevOnly.vue'],
    ['src/site/configs/constants', 'src/shared/constants']
  ]) {
    record.source = record.source.replaceAll(from, to)
    record.result.vueSrc = record.result.vueSrc.replaceAll(from, to)
  }

  record.source = record.source.replace(/(?:\.\.\/)+src\/(theme|shared)\//g, '@/$1/')
  record.result.vueSrc = record.result.vueSrc.replace(
    /(?:\.\.\/)+src\/(theme|shared)\//g,
    '@/$1/'
  )

  // Preserve the independent render baseline apart from intentional accessibility changes.
  for (const key of ['html', 'vueSrc'] as const) {
    record.result[key] = record.result[key].replaceAll(
      '--shiki-dark:#6A737D',
      '--shiki-dark:var(--wotaku-c-text-3)'
    )
    record.result[key] = record.result[key].replaceAll(
      /<span class=(\\?")icon-tip\1 data-tip=\1(.+?)\1 tabindex=\1-1\1>/g,
      (_, quote, label) =>
        `<span class=${quote}icon-tip${quote} data-tip=${quote}${label}${quote} role=${quote}img${quote} aria-label=${quote}${label}${quote} tabindex=${quote}-1${quote}>`
    )
    record.result[key] = record.result[key].replaceAll(
      /(<div class=(\\?")language-[^]*?<\/pre>\n)/g,
      (_, block, quote) =>
        `${block}<p class=${quote}code-copy-feedback visually-hidden${quote} role=${quote}status${quote}></p>`
    )
  }
}

const baselineKey = (relativePath: string, source: string) =>
  JSON.stringify([relativePath, source])
const expectations = new Map(
  baseline.map((record) => [
    baselineKey(record.relativePath, record.source),
    record.result
  ])
)

function captured(source: string, file: string): MarkdownCompileResult {
  const relativePath = path.relative(pagesRoot, file).replace(/\\/g, '/')
  const expected = expectations.get(baselineKey(relativePath, source))

  if (!expected) {
    throw new Error(
      `No independent Markdown baseline for ${relativePath} and this exact source`
    )
  }

  return expected
}

function withoutProseClass(html: string) {
  return html.replace(/ class="([^"]*)"/g, (attribute, value: string) => {
    const classes = value.split(/\s+/)

    if (!classes.includes('prose-link')) return attribute

    const remaining = classes.filter((name) => name !== 'prose-link').join(' ')
    return remaining ? ` class="${remaining}"` : ''
  })
}

beforeAll(async () => {
  expect(pages).toHaveLength(89)
  expect(baseline).toHaveLength(97)
  expect(expectations.size).toBe(baseline.length)
  expect(
    baseline
      .filter((record) => record.relativePath !== '__markdown-fixture.md')
      .map((record) => record.relativePath)
      .sort()
  ).toEqual(
    pages.map((file) => path.relative(pagesRoot, file).replace(/\\/g, '/')).sort()
  )
  const scratchRoot = path.join(packageRoot, 'node_modules/.tests')
  mkdirSync(scratchRoot, { recursive: true })
  scratch = mkdtempSync(path.join(scratchRoot, 'markdown-tests-'))
  compiler = await createMarkdownCompiler()
})

afterAll(() => {
  compiler?.dispose()

  for (const file of transientSharedFiles) rmSync(file, { force: true })

  if (scratch) rmSync(scratch, { recursive: true, force: true })
})

describe(`exact published Markdown parity (${pages.length} actual pages)`, () => {
  test.each(pages.map((file) => [path.relative(pagesRoot, file), file]))(
    '%s',
    async (_, file) => {
      const source = readFileSync(file, 'utf8')
      // Published docs presently have no includes; don't silently skip a new one.
      expect(source).not.toMatch(/<!--\s*@include:/)
      const expected = captured(source, file)
      const actual = await compiler.compile(source, file)
      expect(withoutProseClass(actual.html)).toBe(expected.html)
      expect(actual.pageData).toEqual(expected.pageData)
      expect(withoutProseClass(actual.vueSrc)).toBe(expected.vueSrc)
      expect(actual.includes).toEqual(expected.includes)
    }
  )
})

const fixture = `---
title: '**Asymmetric** & <i>entities</i>'
description: 'Exact <meta> & description'
lastUpdated: false
---
# Fallback title :s:

## Before &amp; after {#explicit-id}

||normal **pill**|| !||warning|| x||danger|| [||linked||](https://example.org/a)

> [!WARNING]
> Alert with **strong** and :yes:.

::: tip Custom title
Container with [relative](./other.md#A%20B).
:::

::: tabs
== First :yes: {#first}
Text unique to the first tab.
::: details Nested detail
Second **nested** paragraph.
:::
== Second
<Collapsible title="Nested item">

Exactly one custom component body.

</Collapsible>
:::

Outside tabs after reset.

::: code-group
\`\`\`js:line-numbers=7 {2} [One.js]
const alpha = 'different' // [!code focus]
const beta = 2 // [!code ++]

console.log(alpha, beta) // [!code warning]
\`\`\`
\`\`\`html [Two.html]
<section title="escaped &amp; attribute">Body</section>
\`\`\`
:::

\`\`\`text-vue
{{ asymmetricValue }} & <tag>
\`\`\`

^[**inline**](tooltip *content*) ==l:OpenComic== ==OpenComic==

| Left | Right |
| --- | --- |
| :yes: | &amp; &#8203; |

<CustomExample :values="[1, 3, 7]" />

<script lang="ts">
export const ordinary = 'preserved'
export default { name: 'AsymmetricFixture' }
</script>

<script setup lang="ts">
const asymmetricValue = 'setup preserved'
</script>

<style scoped>
.asymmetric { color: red; }
</style>
`

describe('asymmetric plugins and Vue SFC contract', () => {
  test('fences, Shiki notations, alerts, nested tabs, custom components, entities and SFC blocks', async () => {
    const file = path.join(pagesRoot, '__markdown-fixture.md')
    const expected = captured(fixture, file)
    const actual = await compiler.compile(fixture, file)
    expect({
      ...actual,
      html: withoutProseClass(actual.html),
      vueSrc: withoutProseClass(actual.vueSrc)
    }).toEqual(expected)
    expect(actual.html).not.toContain('[object Promise]')
    expect(actual.html).not.toContain('::wotaku-highlight::')
    expect(actual.vueSrc).toContain('export const ordinary')
    expect(actual.vueSrc).toContain('<script setup lang="ts">')
    expect(actual.vueSrc).toContain('<style scoped>')
  })

  test.each([
    '<script>\nexport const ordinary = 1\n</script>',
    '<script setup lang="ts">\nconst setupOnly = 1\n</script>',
    '<script>\nconst config = {}; export { config as default }\n</script>',
    ''
  ])('injects named page data without corrupting script form: %s', async (script) => {
    const file = path.join(pagesRoot, '__markdown-fixture.md')
    const source = `---\nlastUpdated: false\n---\n# Title\n\n${script}\n`
    expect(await compiler.compile(source, file)).toEqual(captured(source, file))
  })

  test('frontmatter dates and description from head metadata', async () => {
    const file = path.join(pagesRoot, '__markdown-fixture.md')
    const source =
      '---\ntitle: "**Title** :yes:"\nlastUpdated: 2025-01-02\nhead:\n  - [meta, {name: description, content: Head description}]\n---\n# Other title\n'
    expect(await compiler.compile(source, file)).toEqual(captured(source, file))
  })
})

describe('dependency-aware compilation cache', () => {
  const file = path.join(pagesRoot, '__markdown-fixture.md')
  const prefix = '---\nlastUpdated: false\n---\n'

  test('source edits and independent cached values', async () => {
    const source = `${prefix}# Initial\n`
    const first = await compiler.compile(source, file)
    first.pageData.frontmatter.title = 'caller mutation'
    first.includes.push('caller mutation')
    const second = await compiler.compile(source, file)
    expect(second.pageData.frontmatter.title).toBeUndefined()
    expect(second.includes).toEqual([])
    const changed = await compiler.compile(`${prefix}# Changed\n`, file)
    expect(changed.html).toContain('Changed')
    expect(changed.html).not.toBe(second.html)
  })

  test('nested, root-relative, range and heading includes preserve original semantics', async () => {
    const inner = path.join(scratch, 'inner.md')
    const outer = path.join(scratch, 'outer.md')
    writeFileSync(inner, '---\ntitle: Not the page title\n---\nNested text.\n')
    writeFileSync(
      outer,
      `---\ntitle: Discard this\n---\n## Included\n\n<!-- @include: ./inner.md -->\n`
    )
    const source = `${prefix}# Parent\n\n<!-- @include: ${outer} -->\n`
    // Includes use path.join (not resolve): use a path relative to the doc.
    const relativeSource = source.replace(outer, path.relative(pagesRoot, outer))
    const expected = captured(
      `${prefix}# Parent\n\n\n## Included\n\n\nNested text.\n\n`,
      file
    )
    const actual = await compiler.compile(relativeSource, file)
    expect(actual.html).toBe(expected.html)
    expect(actual.pageData).toEqual(expected.pageData)
    expect(actual.includes).toEqual([outer, inner])

    const regions = path.join(scratch, 'regions.md')
    writeFileSync(
      regions,
      '# Root\n\n## Part\n\nSelected text.\n\n## Other\n\nNot selected.\n'
    )
    const regionPath = path.relative(pagesRoot, regions)
    const selected = await compiler.compile(
      `${prefix}<!-- @include: ${regionPath}#part -->\n`,
      file
    )
    expect(selected.html).toBe(captured(`${prefix}\nSelected text.\n`, file).html)
    const ranged = await compiler.compile(
      `${prefix}<!-- @include: ${regionPath}{5,5} -->\n`,
      file
    )
    expect(ranged.html).toBe('<p>Selected text.</p>\n')
    const rootInclude = await compiler.compile(
      `${prefix}<!-- @include: @/${path.relative(pagesRoot, inner)} -->\n`,
      file
    )
    expect(rootInclude.html).toBe('<p>Nested text.</p>\n')
  })

  test('changed/deleted/new includes cannot return cached HTML, even without invalidate()', async () => {
    const include = path.join(scratch, 'mutable.md')
    const source = `${prefix}<!-- @include: ${path.relative(pagesRoot, include)} -->\n`
    const missing = await compiler.compile(source, file)
    expect(missing.includes).toEqual([])
    writeFileSync(include, 'First include.\n')
    expect((await compiler.compile(source, file)).html).toContain('First include.')
    writeFileSync(include, 'Other include.\n')
    expect((await compiler.compile(source, file)).html).toContain('Other include.')
    compiler.invalidate(include)
    expect((await compiler.compile(source, file)).html).toContain('Other include.')
    rmSync(include)
    expect(await compiler.compile(source, file)).toEqual(missing)
  })

  test('code snippets are include dependencies too', async () => {
    const snippet = path.join(scratch, 'snippet.txt')
    writeFileSync(snippet, 'first snippet\n')
    const source = `${prefix}<<< ${path.relative(pagesRoot, snippet)}\n`
    const actual = await compiler.compile(source, file)
    // The source contains a random scratch path, so this case has no captured
    // oracle. Assert highlighted text, not Shiki's incidental span nesting.
    const highlightedText = (html: string) => {
      expect(html).toMatch(/<pre\b[^>]*class="shiki(?: |")/)
      const code = html.match(/<code>([\s\S]*?)<\/code>/)?.[1]
      expect(code).toBeDefined()
      expect(code).toContain('class="line"')
      const entities: Record<string, string> = {
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        amp: '&'
      }
      return code!
        .replace(/<[^>]*>/g, '')
        .replace(/&#x([0-9a-f]+);/gi, (_, value) =>
          String.fromCodePoint(parseInt(value, 16))
        )
        .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
        .replace(/&(lt|gt|quot|apos|amp);/g, (_, name) => entities[name])
    }
    expect(highlightedText(actual.html)).toBe('first snippet')
    expect(actual.html).not.toContain('::wotaku-highlight::')
    expect(actual.html).not.toContain('[object Promise]')
    expect(highlightedText(actual.vueSrc)).toBe('first snippet')
    expect(actual.pageData).toEqual({
      title: '',
      titleTemplate: undefined,
      description: '',
      frontmatter: { lastUpdated: false },
      headers: [],
      params: undefined,
      relativePath: '__markdown-fixture.md',
      filePath: '__markdown-fixture.md'
    })
    expect(actual.includes).toEqual([snippet])
    writeFileSync(snippet, 'other snippet\n')
    const changed = await compiler.compile(source, file)
    expect(highlightedText(changed.html)).toBe('other snippet')
    expect(changed.html).not.toContain('first snippet')
    expect(changed.includes).toEqual([snippet])
  })

  test.each(['tooltips', 'mirrors'])(
    'shared %s data reloads, bypassing original permanent process caches',
    async (kind) => {
      const id = `__markdown-test-${randomUUID()}`
      const sharedFile = path.join(repositoryRoot, 'src/content', kind, `${id}.md`)
      transientSharedFiles.add(sharedFile)

      try {
        const marker = kind === 'tooltips' ? `==${id}==` : `==m:${id}==`
        const source = `${prefix}${marker}\n`
        const data = (value: string) =>
          kind === 'tooltips'
            ? `${value}\n`
            : `---\ntitle: ${value}\n---\nhttps://example.org/${value}\n`
        writeFileSync(sharedFile, data('initial-shared'))
        const initial = await compiler.compile(source, file)
        expect(initial.html).toContain('initial-shared')
        writeFileSync(sharedFile, data('changed-shared'))
        compiler.invalidate(sharedFile)
        const changed = await compiler.compile(source, file)
        expect(changed.html).toContain('changed-shared')
        expect(changed.html).not.toContain('initial-shared')
        writeFileSync(sharedFile, data('automatic-shared'))
        expect((await compiler.compile(source, file)).html).toContain('automatic-shared')
      } finally {
        rmSync(sharedFile, { force: true })
        transientSharedFiles.delete(sharedFile)
        compiler.invalidate(sharedFile)
      }
    }
  )

  test('concurrent callers do not mix highlighted output', async () => {
    const results = await Promise.all(
      ['unique-first', 'unique-second'].map((value) =>
        compiler.compile(`${prefix}\`\`\`txt\n${value}\n\`\`\`\n`, file)
      )
    )
    expect(results[0].html).toContain('unique-first')
    expect(results[0].html).not.toContain('unique-second')
    expect(results[1].html).toContain('unique-second')
    expect(results[1].html).not.toContain('unique-first')
  })

  test('invalidate without a file resets config and compiled output', async () => {
    const source = `${prefix}# Stable\n`
    const expected = await compiler.compile(source, file)
    compiler.invalidate()
    expect(await compiler.compile(source, file)).toEqual(expected)
  })

  test('absolute shared-doc path is required', async () => {
    await expect(compiler.compile('# Invalid', 'relative.md')).rejects.toThrow('absolute')
    await expect(
      compiler.compile('# Invalid', path.join(scratch, 'outside.md'))
    ).rejects.toThrow('shared docs')
  })
})
