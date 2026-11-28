import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { preview } from 'vite'
import { expect, test } from 'vitest'
import { treatAsHtml } from '../src/shared/client'

test('asset links stay native while page links use the router', () => {
  for (const path of ['/asset/fav.svg', '/files/book.PDF', '/assets/app.js']) {
    expect(treatAsHtml(path), path).toBe(false)
  }

  for (const path of ['/guides/manga', '/guide.html', '/guide/']) {
    expect(treatAsHtml(path), path).toBe(true)
  }
})

test('preview preserves clean URLs and serves rendered 404s, not the homepage', async () => {
  const root = resolve(import.meta.dirname, '..')
  const scratch = resolve(root, 'node_modules/.tests')
  mkdirSync(scratch, { recursive: true })
  const outDir = mkdtempSync(resolve(scratch, 'routing-test-'))
  mkdirSync(resolve(outDir, 'guide'))
  writeFileSync(resolve(outDir, 'index.html'), '<h1>Home fixture</h1>')
  writeFileSync(resolve(outDir, 'guide/index.html'), '<h1>Guide fixture</h1>')
  writeFileSync(resolve(outDir, '404.html'), '<h1>Not found fixture</h1>')
  const server = await preview({
    root,
    configFile: resolve(root, 'vite.config.ts'),
    build: { outDir },
    environments: { client: { build: { outDir } } },
    preview: { host: '127.0.0.1', port: 0 }
  })

  try {
    const address = server.httpServer.address()

    if (!address || typeof address === 'string') {
      throw new Error('No preview port')
    }

    const origin = `http://127.0.0.1:${address.port}`

    for (const path of ['/guide', '/guide/', '/guide/index.html', '/guide?query=kept']) {
      const response = await fetch(origin + path)
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('<h1>Guide fixture</h1>')
    }

    const home = await fetch(origin + '/')
    expect(home.status).toBe(200)
    expect(await home.text()).toBe('<h1>Home fixture</h1>')
    const missing = await fetch(origin + '/missing-document?query=kept')
    expect(missing.status).toBe(404)
    expect(missing.headers.get('content-type')).toContain('text/html')
    expect(await missing.text()).toBe('<h1>Not found fixture</h1>')
    const asset = await fetch(origin + '/assets/missing-chunk.js')
    expect(asset.status).toBe(404)
    expect(await asset.text()).toBe('')
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()))
    })
    rmSync(outDir, { recursive: true, force: true })
  }
})
