/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { resolveTitleFromToken } from '@mdit-vue/shared'
import type { MarkdownEnv, PageData } from '@/theme/shared/client'
import { execFile, execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

import { promisify } from 'node:util'
import { createServer } from 'vite'
import { slash } from '../../shared/client.ts'
import {
  contentRoot,
  dataRoot,
  markdownRoot,
  pagesRoot,
  repositoryRoot
} from '../paths.ts'
import contentHistory from '../../content/history.json' with { type: 'json' }
import { processIncludes } from './includes.ts'
import {
  createMarkdownRenderer,
  disposeMarkdownRenderer,
  type MarkdownRenderer
} from './renderer.ts'

export { repositoryRoot, pagesRoot } from '../paths.ts'
const exec = promisify(execFile)

export interface MarkdownCompileResult {
  html: string
  vueSrc: string
  pageData: PageData
  includes: string[]
}

export interface MarkdownCompiler {
  compile(source: string, file: string): Promise<MarkdownCompileResult>
  invalidate(file?: string): void
  dispose(): void
}

function filesUnder(directory: string): string[] {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .flatMap((entry) => {
        const file = path.join(directory, entry.name)
        return entry.isDirectory() ? filesUnder(file) : [file]
      })
      .sort()
  } catch {
    return []
  }
}

// Always inspect bytes: filesystems can give same-size consecutive writes
// identical mtime AND ctime, even when requested as nanosecond BigInts.
// Missing files have a distinct fingerprint so creation invalidates includes.
function fingerprint(files: Iterable<string>) {
  const hash = createHash('sha256')

  for (const file of [...new Set(files)].sort()) {
    let digest = 'missing'

    try {
      digest = createHash('sha256').update(readFileSync(file)).digest('hex')
    } catch {
      // Wotaku deliberately leaves unavailable Markdown includes intact.
    }

    hash.update(file).update('\0').update(digest).update('\0')
  }

  return hash.digest('hex')
}

function configFiles() {
  return [
    ...filesUnder(markdownRoot),
    ...filesUnder(dataRoot).filter((file) => /\.(ts|json)$/.test(file)),
    ...filesUnder(path.join(repositoryRoot, 'src/shared')),
    ...filesUnder(path.join(contentRoot, 'tooltips')),
    ...filesUnder(path.join(contentRoot, 'mirrors'))
  ]
}

export async function createMarkdownCompiler(): Promise<MarkdownCompiler> {
  // Reload configuration and its dependency graph in an isolated runner so
  // loadTooltips/loadMirrors caches cannot survive configuration/data changes.
  const runner = await createServer({
    root: repositoryRoot,
    configFile: false,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true, watch: null, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] }
  })
  const cache = new Map<
    string,
    {
      file: string
      dependencies: Set<string>
      dependencyHash: string
      result: MarkdownCompileResult
    }
  >()
  const timestamps = new Map<string, Promise<number>>()
  let md: MarkdownRenderer | undefined
  let configurationHash = ''
  let gitHash = ''
  let forceReload = false
  let disposed = false
  let queue: Promise<unknown> = Promise.resolve()
  let generation = 0

  function gitPath(option: string) {
    try {
      return path.resolve(
        repositoryRoot,
        execFileSync('git', ['rev-parse', option], {
          cwd: repositoryRoot,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore']
        }).trim()
      )
    } catch {
      return undefined
    }
  }

  const gitDirectory = gitPath('--git-dir')
  const gitCommonDirectory = gitPath('--git-common-dir')

  async function reloadConfiguration(hash: string) {
    if (md) disposeMarkdownRenderer(md)

    md = undefined
    runner.moduleGraph.invalidateAll()
    const [{ configureMarkdown }, { aliases, defs }] = await Promise.all([
      runner.ssrLoadModule('/src/build/markdown/config.ts'),
      runner.ssrLoadModule('/src/build/markdown/emoji.ts')
    ])
    md = await createMarkdownRenderer(pagesRoot, {
      emoji: { defs, shortcuts: aliases },
      config: configureMarkdown
    })
    configurationHash = hash
    forceReload = false
    cache.clear()
  }

  function currentGitHash() {
    if (!gitDirectory || !gitCommonDirectory) return 'standalone'

    const head = path.join(gitDirectory, 'HEAD')
    const value = readFileSync(head, 'utf8').trim()
    const files = [head, path.join(gitCommonDirectory, 'packed-refs')]

    if (value.startsWith('ref: ')) {
      files.push(path.join(gitCommonDirectory, value.slice(5)))
    }

    return fingerprint(files)
  }

  function lastUpdated(file: string): Promise<number> {
    let timestamp = timestamps.get(file)

    if (!timestamp) {
      timestamp = (async () => {
        try {
          statSync(file)
        } catch {
          return 0
        }

        const history = contentHistory[
          slash(path.relative(pagesRoot, file)) as keyof typeof contentHistory
        ] as { sourceHash: string; lastUpdated?: number } | undefined
        // Preserve the imported content's real dates until it acquires local history.
        if (
          history?.sourceHash ===
          createHash('sha256').update(readFileSync(file)).digest('hex')
        )
          return history.lastUpdated || 0

        if (!gitDirectory) return history?.lastUpdated || 0

        const { stdout } = await exec(
          'git',
          ['log', '-1', '--pretty=%ai', '--', path.basename(file)],
          {
            cwd: path.dirname(file)
          }
        )
        return stdout.trim() ? +new Date(stdout.trim()) : history?.lastUpdated || 0
      })()
      timestamps.set(file, timestamp)
    }

    return timestamp
  }

  async function compile(source: string, file: string): Promise<MarkdownCompileResult> {
    if (disposed) throw new Error('Markdown compiler has been disposed')

    if (!path.isAbsolute(file)) {
      throw new Error('Markdown file must be absolute')
    }

    const relativePath = slash(path.relative(pagesRoot, file))

    if (relativePath.startsWith('../') || relativePath === '..') {
      throw new Error('Markdown file must be inside the shared docs directory')
    }

    const startedGeneration = generation
    const nextConfigurationHash = fingerprint(configFiles())

    if (!md || forceReload || configurationHash !== nextConfigurationHash) {
      await reloadConfiguration(nextConfigurationHash)
    }

    const nextGitHash = currentGitHash()

    if (gitHash !== nextGitHash) {
      gitHash = nextGitHash
      timestamps.clear()
      cache.clear()
    }

    const key = createHash('sha256')
      .update(file)
      .update('\0')
      .update(source)
      .update('\0')
      .update(configurationHash)
      .update('\0')
      .update(gitHash)
      .digest('hex')
    const cached = cache.get(key)

    if (cached && cached.dependencyHash === fingerprint(cached.dependencies)) {
      // Return independent objects: callers must not mutate cached page data.
      return structuredClone(cached.result)
    }

    let params
    const originalSource = source
    source = source.replace(
      /^__WOTAKU_PARAMS_START([^]+?)__WOTAKU_PARAMS_END__/,
      (_, json) => {
        params = JSON.parse(json)
        return ''
      }
    )
    const includes: string[] = []
    const dependencies = new Set<string>()
    source = processIncludes(md!, pagesRoot, source, file, includes, true, dependencies)
    const env: MarkdownEnv = {
      path: file,
      realPath: file,
      relativePath,
      cleanUrls: true,
      includes,
      localeIndex: 'root'
    }
    const rendered = md!.renderAsync(source, env)
    // The sync plugin path has read snippets by the time renderAsync returns
    // its promise. Snapshot before waiting for Shiki or git subprocesses.
    for (const include of includes) dependencies.add(include)

    const dependencyHash = fingerprint(dependencies)
    const html = await rendered
    const { frontmatter = {}, headers = [], title = '', sfcBlocks } = env
    const pageData: PageData = {
      title: inferTitle(md!, frontmatter, title),
      titleTemplate: frontmatter.titleTemplate as string | boolean | undefined,
      description: inferDescription(frontmatter),
      frontmatter,
      headers,
      params,
      relativePath,
      filePath: relativePath
    }

    if (frontmatter.lastUpdated !== false) {
      pageData.lastUpdated =
        frontmatter.lastUpdated instanceof Date
          ? +frontmatter.lastUpdated
          : await lastUpdated(file)
    }

    const vueSrc = [
      ...injectPageDataCode(
        sfcBlocks?.scripts.map((block) => block.content) ?? [],
        pageData
      ),
      `<template><div>${html}</div></template>`,
      ...(sfcBlocks?.styles.map((block) => block.content) ?? []),
      ...(sfcBlocks?.customBlocks.map((block) => block.content) ?? [])
    ].join('\n')

    if (
      !disposed &&
      (generation !== startedGeneration ||
        dependencyHash !== fingerprint(dependencies) ||
        configurationHash !== fingerprint(configFiles()) ||
        gitHash !== currentGitHash())
    ) {
      return compile(originalSource, file)
    }

    const result = { html, vueSrc, pageData, includes }

    if (!disposed && generation === startedGeneration) {
      cache.set(key, { file, dependencies, dependencyHash, result })
      // Bound retained compiled documents, including superseded HMR versions.
      if (cache.size > 1024) cache.delete(cache.keys().next().value!)
    }

    return structuredClone(result)
  }

  try {
    await reloadConfiguration(fingerprint(configFiles()))
  } catch (error) {
    if (md) disposeMarkdownRenderer(md)

    await runner.close()
    throw error
  }

  return {
    compile(source, file) {
      // Existing plugins are synchronous and reentrant, but highlighting and
      // module-graph reloads must not share state across concurrent compiles.
      const result = queue.then(() => compile(source, file))
      queue = result.catch(() => {})
      return result
    },
    invalidate(file) {
      generation++

      if (
        !file ||
        [dataRoot, markdownRoot, path.join(repositoryRoot, 'src/shared')].some(
          (directory) => slash(file).startsWith(slash(directory) + '/')
        )
      ) {
        forceReload = true
        cache.clear()
      } else {
        for (const [key, entry] of cache) {
          if (entry.file === file || entry.dependencies.has(file)) {
            cache.delete(key)
          }
        }
      }

      timestamps.clear()
    },
    dispose() {
      if (disposed) return

      disposed = true
      cache.clear()
      timestamps.clear()
      void queue.then(() => {
        if (md) disposeMarkdownRenderer(md)

        return runner.close()
      })
    }
  }
}

function injectPageDataCode(tags: string[], data: PageData) {
  const scriptRE = /<\/script>/
  const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/
  const scriptClientRE = /<\s*script[^>]*\bclient\b[^>]*/
  const code = `\nexport const __pageData = JSON.parse(${JSON.stringify(
    JSON.stringify(data)
  )})`
  const index = tags.findIndex(
    (tag) => scriptRE.test(tag) && !scriptSetupRE.test(tag) && !scriptClientRE.test(tag)
  )
  const isUsingTS = tags.some((tag) => /<\s*script[^>]*\blang=['"]ts['"][^>]*/.test(tag))

  if (index > -1) {
    const tag = tags[index]
    const hasDefault =
      /((?:^|\n|;)\s*)export(\s*)default/.test(tag) ||
      /((?:^|\n|;)\s*)export(.+)as(\s*)default/.test(tag)
    tags[index] = tag.replace(
      scriptRE,
      code +
        (hasDefault
          ? ''
          : `\nexport default {name:${JSON.stringify(data.relativePath)}}`) +
        '</script>'
    )
  } else {
    tags.unshift(
      `<script ${isUsingTS ? 'lang="ts"' : ''}>${code}\nexport default {name:${JSON.stringify(
        data.relativePath
      )}}</script>`
    )
  }

  return tags
}

function inferTitle(
  md: MarkdownRenderer,
  frontmatter: Record<string, unknown>,
  title: string
) {
  if (typeof frontmatter.title === 'string') {
    const token = md.parseInline(frontmatter.title, {})[0]

    if (token) {
      return resolveTitleFromToken(token, {
        shouldAllowHtml: false,
        shouldEscapeText: false
      })
    }
  }

  return title
}

function inferDescription(frontmatter: Record<string, unknown>): string {
  if (frontmatter.description !== undefined) {
    return frontmatter.description as string
  }

  const head = frontmatter.head as [string, Record<string, string>][] | undefined
  return (
    head?.find(
      ([tag, attrs]) => tag === 'meta' && attrs.name === 'description' && attrs.content
    )?.[1].content || ''
  )
}
