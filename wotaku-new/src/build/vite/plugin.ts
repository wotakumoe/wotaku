/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import MiniSearch from 'minisearch'
import { existsSync, globSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { loadConfigFromFile, type Plugin, type ViteDevServer } from 'vite'
import { compileScript, parse } from 'vue/compiler-sfc'
import site from '../../shared/site.ts'
import { contentRoot, dataRoot, markdownRoot, pagesRoot } from '../paths.ts'
import { createMarkdownCompiler, repositoryRoot } from '../markdown/compiler.ts'
import {
  collectPageLinks,
  urlSearchDevPlugin,
  writeUrlSearchIndex
} from './url-search-plugin.ts'

const virtualPages = '\0wotaku:pages'
const virtualSearch = '\0wotaku:search'

export function getPages(dir = pagesRoot): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      if (
        entry.name.startsWith('.') ||
        entry.name === 'public' ||
        entry.name === 'sandbox'
      )
        return []

      const file = join(dir, entry.name)

      if (entry.isDirectory()) return getPages(file)

      return entry.name.endsWith('.md') && entry.name !== 'README.md' ? [file] : []
    })
    .sort()
}

export function pageRoute(file: string) {
  return (
    '/' +
    relative(pagesRoot, file)
      .replaceAll('\\', '/')
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')
  )
}

// A single compiler/result cache serves client, SSR, and search. Build environments
// reuse this plugin instance; no second Markdown render for the search index.
export function wotakuPlugins(): Plugin[] {
  let compiler: ReturnType<typeof createMarkdownCompiler> | undefined
  const getCompiler = () => (compiler ??= createMarkdownCompiler())
  const dataLoads = new Map<string, Promise<string>>()
  const dataDependencies = new Map<string, Set<string>>()
  const markdownDependencies = new Map<string, Set<string>>()
  const devSFC = new Map<string, { signature: string; imports: any }>()
  const rerenderOnly = new Map<string, string[]>()
  const searchHtml = new Map<string, string>()
  let server: ViteDevServer | undefined
  let searchPromise: Promise<string> | undefined
  let searchVersion = 0

  async function compile(source: string, file: string) {
    return (await getCompiler()).compile(source, file)
  }

  async function searchIndex() {
    if (searchPromise) return searchPromise

    searchPromise = (async () => {
      const index = new MiniSearch({
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles']
      })

      for (const file of getPages()) {
        let html = searchHtml.get(file)

        if (html === undefined) {
          const src = readFileSync(file, 'utf8')
          collectPageLinks(src, relative(pagesRoot, file))
          html = (await compile(src, file)).html
          searchHtml.set(file, html)
        }

        const pieces = html.split(
          /<h(\d*).*?>(.*?<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi
        )
        pieces.shift()
        let parents: string[] = []

        for (let i = 0; i < pieces.length; i += 3) {
          const level = Number(pieces[i]) - 1
          const heading = /(.*)<a.*? href="#(.*?)".*?>.*?<\/a>/i.exec(pieces[i + 1])
          const title = (heading?.[1] || '').replace(/<[^>]*>/g, '').trim()
          const text = pieces[i + 2]

          if (!title || !text) continue

          const titles = parents.slice(0, level)
          titles[level] = title
          const filtered = titles.filter(Boolean)
          const anchor = heading?.[2] || ''
          index.add({
            id: pageRoute(file) + (anchor ? '#' + anchor : ''),
            title: filtered.at(-1),
            titles: filtered.slice(0, -1),
            text: text.replace(/<[^>]*>/g, '')
          })

          if (level === 0) parents = [title]
          else parents[level] = title
        }
      }

      return JSON.stringify(index)
    })()
    return searchPromise
  }

  function invalidateVirtual(id: string) {
    const mod = server?.environments.client.moduleGraph.getModuleById(id)

    if (mod && server) {
      server.environments.client.moduleGraph.invalidateModule(mod)
      server.environments.client.hot.send({
        type: 'update',
        updates: [
          {
            type: 'js-update',
            path: mod.url,
            acceptedPath: mod.url,
            timestamp: Date.now()
          }
        ]
      })
    }
  }

  return [
    {
      name: 'wotaku:preview',
      config(_config, { isPreview }) {
        return isPreview ? { appType: 'mpa' } : undefined
      },
      configurePreviewServer({ config, middlewares }) {
        const outDir = resolve(config.root, config.build.outDir)
        const notFound = readFileSync(join(outDir, '404.html'))
        // Run after static files and clean-URL resolution, before Vite's
        // empty 404 handler. Missing assets must not receive an HTML document.
        return () =>
          middlewares.use((req, res, next) => {
            const path = req.url?.split('?')[0]

            if (path?.endsWith('.html') && existsSync(join(outDir, decodeURI(path))))
              return next()

            if (path && existsSync(join(outDir, decodeURI(path), 'index.html'))) {
              req.url = path.replace(/\/$/, '') + '/index.html'
              return next()
            }

            res.statusCode = 404

            if (req.url?.includes('/assets/')) res.end()
            else {
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.end(notFound)
            }
          })
      }
    },
    urlSearchDevPlugin(),
    {
      name: 'wotaku:markdown',
      enforce: 'pre',
      async buildStart() {
        // Initialize before the native bundler scans the full page graph.
        // Config evaluation alone must not create orphan module runners.
        await getCompiler()
      },
      configResolved(config) {
        const plugins = config.plugins as Plugin[]
        const position = plugins.findIndex((p) => p.name === 'unocss:transformers:pre')
        const current = plugins.findIndex((p) => p.name === 'wotaku:markdown')

        if (position >= 0 && current > position) {
          plugins.splice(position, 0, ...plugins.splice(current, 1))
        }
      },
      resolveId(id, importer) {
        if (id === '@wotaku/pages') return virtualPages

        if (id.startsWith('@localSearchIndex')) {
          return virtualSearch + id.slice('@localSearchIndex'.length)
        }

        if (id.endsWith('.data') && importer) {
          return resolve(dirname(importer), id + '.ts')
        }

        const file = id.replace(/^\/@fs/, '')

        if (
          file.startsWith(pagesRoot + '/') &&
          file.endsWith('.md') &&
          !existsSync(file) &&
          existsSync(file.slice(0, -3) + '/index.md')
        ) {
          return file.slice(0, -3) + '/index.md'
        }
      },
      async load(id) {
        if (id === virtualPages) {
          // Bundled dev needs route entries; unbundled dev loads a raw
          // document URL without crawling the page graph for dependencies.
          if (server && !this.environment.config.isBundled) return 'export default {}'

          const bundledDev = server && this.environment.config.isBundled
          const sandbox = join(pagesRoot, 'sandbox')
          const files = getPages()

          if (bundledDev) {
            this.addWatchFile(pagesRoot)

            if (existsSync(sandbox)) files.push(...getPages(sandbox))
          }

          const routes =
            '{' +
            files
              .map(
                (file) =>
                  `${JSON.stringify(pageRoute(file))}:()=>import(${JSON.stringify(file)})`
              )
              .join(',') +
            '}'

          return bundledDev
            ? `const pages = import.meta.hot?.data.pages ?? {}

for (const path of Object.keys(pages)) delete pages[path]

Object.assign(pages, ${routes})

export default pages

if (import.meta.hot) {
  import.meta.hot.data.pages = pages
  import.meta.hot.accept()
}`
            : 'export default ' + routes
        }

        if (id === virtualSearch) {
          await searchIndex()
          return `export default {root:()=>import('@localSearchIndexroot?v=${searchVersion}')}`
        }

        if (id.startsWith(virtualSearch + 'root')) {
          return 'export default ' + JSON.stringify(await searchIndex())
        }

        if (/\.data\.[cm]?[jt]s$/.test(id)) {
          let pending = dataLoads.get(id)

          if (!pending) {
            pending = (async () => {
              const loaded = await loadConfigFromFile(
                {
                  command: 'build',
                  mode: 'production'
                },
                id
              )

              if (!loaded) throw new Error(`Could not load ${id}`)

              const loader = loaded.config as any
              const dependencies = [
                ...loaded.dependencies,
                ...globSync(loader.watch || [], { cwd: dirname(id) }).map((file) =>
                  resolve(dirname(id), file)
                )
              ]

              for (const dep of dependencies) {
                this.addWatchFile(dep)
                const consumers = dataDependencies.get(dep) || new Set<string>()
                consumers.add(id)
                dataDependencies.set(dep, consumers)
              }

              return 'export const data=' + JSON.stringify(await loader.load())
            })()
            dataLoads.set(id, pending)
          }

          return pending
        }
      },
      async transform(source, id) {
        if (!id.endsWith('.md')) return

        const result = await compile(source, id)

        for (const include of result.includes) {
          this.addWatchFile(include)
          const consumers = markdownDependencies.get(include) || new Set<string>()
          consumers.add(id)
          markdownDependencies.set(include, consumers)
        }

        if (server && this.environment.name === 'client') {
          const { descriptor } = parse(result.vueSrc, { filename: id })
          const signature = JSON.stringify(
            [
              descriptor.script,
              descriptor.scriptSetup,
              ...descriptor.styles,
              ...descriptor.customBlocks
            ].map((block) => block && [block.content, block.attrs])
          )
          const previous = devSFC.get(id)

          if (
            previous?.signature === signature &&
            !descriptor.shouldForceReload(previous.imports)
          )
            rerenderOnly.set(id, [id, ...result.includes])
          else rerenderOnly.delete(id)

          devSFC.set(id, {
            signature,
            imports: descriptor.scriptSetup
              ? compileScript(descriptor, { id }).imports
              : {}
          })
        }

        return result.vueSrc
      },
      async configureServer(s) {
        server = s
        await searchIndex()
        s.watcher.add([
          contentRoot,
          resolve(repositoryRoot, 'src/build'),
          resolve(repositoryRoot, 'src/shared')
        ])
        s.httpServer?.once('close', () => {
          void compiler?.then((instance) => instance.dispose())
        })
      },
      async hotUpdate(ctx) {
        const bundled = server!.environments.client.config.isBundled

        if (!bundled && this.environment.name !== 'client') return

        if (bundled) {
          server!.environments.client.hot.send({
            type: 'custom',
            event: 'file-changed',
            data: { file: ctx.file }
          })
        }

        // Rolldown's bundled hook supplies module IDs rather than Vite nodes.
        const additional = new Set(
          bundled
            ? (ctx.modules as unknown as string[])
            : ctx.modules.map((module) => module.id!)
        )
        const graph = server!.environments.client.moduleGraph
        const affected = new Set(markdownDependencies.get(ctx.file) || [])

        if (
          bundled &&
          ctx.type !== 'update' &&
          ctx.file.startsWith(pagesRoot + '/') &&
          ctx.file.endsWith('.md')
        ) {
          additional.add(virtualPages)
        }

        if (
          [
            markdownRoot,
            dataRoot,
            join(contentRoot, 'mirrors'),
            join(contentRoot, 'tooltips'),
            join(repositoryRoot, 'src/shared')
          ].some((dir) => ctx.file.startsWith(dir + '/')) &&
          /\.(md|ts|json)$/.test(ctx.file)
        ) {
          for (const file of getPages()) affected.add(file)
          ;(await getCompiler()).invalidate(ctx.file)
        }

        for (const id of dataDependencies.get(ctx.file) || []) {
          dataLoads.delete(id)

          if (bundled || graph.getModuleById(id)) additional.add(id)
        }

        for (const file of affected) {
          if (bundled || graph.getModuleById(file)) additional.add(file)
        }

        if (
          ctx.file.startsWith(pagesRoot + '/') &&
          ctx.file.endsWith('.md') &&
          ctx.type !== 'delete'
        ) {
          affected.add(ctx.file)
        }

        for (const file of affected) {
          if (file === ctx.file && ctx.type === 'delete') continue

          const result = await compile(
            file === ctx.file && !bundled ? await ctx.read() : readFileSync(file, 'utf8'),
            file
          )
          server!.environments.client.hot.send({
            type: 'custom',
            event: 'wotaku:pageData',
            data: {
              path: '/' + relative(pagesRoot, file),
              pageData: result.pageData
            }
          })
        }

        if (ctx.file.endsWith('.md') || affected.size) {
          // Only affected pages re-render/validate dependencies. Rebuilding
          // MiniSearch from retained HTML must not compile the other 88 pages.
          searchHtml.delete(ctx.file)

          for (const file of affected) searchHtml.delete(file)

          searchPromise = undefined
          searchVersion++
          dataLoads.clear()
          await searchIndex()

          if (bundled) additional.add(virtualSearch)
          else invalidateVirtual(virtualSearch)
          // Vue's own HMR handles the .md component; never request a page reload.
        }

        return bundled
          ? ([...additional] as unknown as typeof ctx.modules)
          : [...additional].map((id) => graph.getModuleById(id)!).filter(Boolean)
      },
      transformIndexHtml(html, context) {
        const tags = context.server
          ? site.head.map(([tag, attrs, children]) => ({
              tag,
              attrs,
              children,
              injectTo: 'head'
            }))
          : []
        tags.push({
          tag: 'script',
          attrs: {},
          children: `(()=>{try{const p=localStorage.getItem('wotaku-theme-appearance')||'auto';if(p==='dark'||(p==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}})()`,
          injectTo: 'head'
        })
        return { html, tags } as any
      },
      generateBundle(_options, bundle) {
        if (this.environment.name !== 'client') return

        const hashMap: Record<string, string> = {}

        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk' && chunk.facadeModuleId?.endsWith('.md')) {
            hashMap[
              relative(pagesRoot, chunk.facadeModuleId).replaceAll('/', '_').toLowerCase()
            ] = '/' + chunk.fileName
          }
        }

        this.emitFile({
          type: 'asset',
          fileName: 'hashmap.json',
          source: JSON.stringify(hashMap)
        })
      },
      async writeBundle(options) {
        if (this.environment.name !== 'client' || !options.dir) return

        await searchIndex()
        mkdirSync(options.dir, { recursive: true })
        writeUrlSearchIndex(options.dir)
      },
      async closeBundle() {
        if (this.environment.name === 'ssr') (await compiler)?.dispose()
      }
    },
    {
      name: 'wotaku:vue-hmr-sfc',
      enforce: 'pre',
      async handleHotUpdate(ctx) {
        // plugin-vue 6 still uses the legacy hook, whose context is separate
        // from Vite 8's hotUpdate context. Feed it the cached compiled SFC.
        if (!ctx.file.endsWith('.md')) return

        const result = await compile(readFileSync(ctx.file, 'utf8'), ctx.file)
        ctx.read = async () => result.vueSrc
      }
    },
    {
      name: 'wotaku:markdown-template-hmr',
      enforce: 'post',
      transform(code, id) {
        // plugin-vue 6 populates its previous-descriptor cache only for .vue.
        // Supply its public rerender marker for genuinely template-only .md
        // updates; script/style/import-usage changes still recreate the SFC.
        if (
          !server ||
          !id.endsWith('.md') ||
          !rerenderOnly.has(id) ||
          this.environment.name !== 'client'
        )
          return

        return (
          code.replace(/^export const _rerender_only = .*$/m, '') +
          `\nexport const _rerender_only = ${JSON.stringify(
            rerenderOnly.get(id)
          )}.includes(__VUE_HMR_RUNTIME__.CHANGED_FILE)\n`
        )
      }
    }
  ]
}
