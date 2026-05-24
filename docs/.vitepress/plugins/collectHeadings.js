import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export function collectHeadingsPlugin(docsDir) {
  return {
    name: 'collect-h2-headings',
    buildStart() {
      const headings = []
      collectFromDir(docsDir, docsDir, headings)
      writeFileSync(
        join(docsDir, '.vitepress', 'headings.json'),
        JSON.stringify(headings, null, 2)
      )
    }
  }
}

function collectFromDir(baseDir, dir, headings) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      collectFromDir(baseDir, join(dir, entry.name), headings)
    } else if (entry.name.endsWith('.md')) {
      const filePath = join(dir, entry.name)
      const content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      // Derive URL path from file path
      let urlPath = filePath
        .replace(baseDir, '')
        .replace(/\\/g, '/')
        .replace(/\.md$/, '')
        .replace(/\/index$/, '/')
      if (!urlPath.startsWith('/')) urlPath = '/' + urlPath

      for (const line of lines) {
        const match = line.match(/^##\s+(.+)/)
        if (match) {
          const title = match[1].trim()
          const anchor = '#' + title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
          headings.push({ path: urlPath, anchor, title })
        }
      }
    }
  }
}