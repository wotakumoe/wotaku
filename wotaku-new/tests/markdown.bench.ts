import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { afterAll, beforeAll, test } from 'vitest'
import {
  createMarkdownCompiler,
  pagesRoot,
  type MarkdownCompiler
} from '../src/build/markdown/compiler'

function publishedFiles(directory = pagesRoot): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.name.startsWith('.')) return []

      const file = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return file === path.join(pagesRoot, 'sandbox') ? [] : publishedFiles(file)
      }

      return file !== path.join(pagesRoot, 'README.md') && file.endsWith('.md')
        ? [file]
        : []
    })
    .sort()
}

const documents = publishedFiles().map((file) => ({
  file,
  source: readFileSync(file, 'utf8')
}))
const bytes = documents.reduce((sum, doc) => sum + Buffer.byteLength(doc.source), 0)
let cold: MarkdownCompiler
let warm: MarkdownCompiler
let coldIterations = 0
let warmIterations = 0
let coldPages = 0
let warmPages = 0
let coldHtmlBytes = 0
let warmHtmlBytes = 0

beforeAll(async () => {
  cold = await createMarkdownCompiler()
  warm = await createMarkdownCompiler()
  // Initialization and the first warm-cache population are outside timing.
  for (const doc of documents) await warm.compile(doc.source, doc.file)
})

afterAll(() => {
  cold?.dispose()
  warm?.dispose()
  console.log(
    JSON.stringify(
      {
        documentsPerIteration: documents.length,
        sourceBytesPerIteration: bytes,
        cold: {
          iterations: coldIterations,
          compiledPages: coldPages,
          htmlBytes: coldHtmlBytes
        },
        warm: {
          iterations: warmIterations,
          cachedPages: warmPages,
          htmlBytes: warmHtmlBytes
        }
      },
      null,
      2
    )
  )
})

test(`shared published Markdown: ${documents.length} documents, ${bytes} source bytes per iteration`, async ({
  bench
}) => {
  const uncached = bench(
    'cold parse: uncached compilation (configuration/Shiki already initialized)',
    {
      writeResult: 'node_modules/.bench/markdown-uncached.json',
      beforeEach() {
        // Evict only document results. No configuration/highlighter teardown is
        // conflated with parsing, and eviction itself is outside the timing.
        for (const doc of documents) cold.invalidate(doc.file)
      }
    },
    async () => {
      coldIterations++

      for (const doc of documents) {
        const result = await cold.compile(doc.source, doc.file)
        coldPages++
        coldHtmlBytes += Buffer.byteLength(result.html)
      }
    }
  )

  const cached = bench(
    'warm cache: identical source and validated include/config/git dependencies',
    { writeResult: 'node_modules/.bench/markdown-cached.json' },
    async () => {
      warmIterations++

      for (const doc of documents) {
        const result = await warm.compile(doc.source, doc.file)
        warmPages++
        warmHtmlBytes += Buffer.byteLength(result.html)
      }
    }
  )
  await bench.compare(uncached, cached, { time: 2000, iterations: 8 })
})
