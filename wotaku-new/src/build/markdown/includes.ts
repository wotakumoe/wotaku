/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import matter from 'gray-matter'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { slash } from '../../shared/client.ts'
import type { MarkdownRenderer } from './renderer.ts'
import { findRegion } from './plugins/snippet.ts'

export function processIncludes(
  md: MarkdownRenderer,
  srcDir: string,
  src: string,
  file: string,
  includes: string[],
  cleanUrls: boolean,
  dependencies: Set<string> = new Set(),
  ancestors: Set<string> = new Set([file])
): string {
  return src.replace(/<!--\s*@include:\s*(.*?)\s*-->/g, (match, value: string) => {
    if (!value.length) return match

    const range = value.match(/\{(\d*),(\d*)\}$/)
    const region = value.match(/(#[^\s{]+)/)
    const hasMeta = !!(region || range)

    if (hasMeta) {
      value = value.slice(0, -((region?.[0].length || 0) + (range?.[0].length || 0)))
    }

    const includePath = slash(
      value[0] === '@'
        ? path.join(srcDir, value.slice(value[1] === '/' ? 2 : 1))
        : path.join(path.dirname(file), value)
    )
    // Missing includes are dependencies too: creating one must invalidate HTML.
    dependencies.add(includePath)

    try {
      if (ancestors.has(includePath)) {
        throw new Error('Circular Markdown include')
      }

      let content = readFileSync(includePath, 'utf8')

      if (region) {
        const regionName = region[0].slice(1)
        const lines = content.split(/\r?\n/)
        let { start, end } = findRegion(lines, regionName) ?? {}

        if (start === undefined) {
          const tokens = md
            .parse(content, {
              path: includePath,
              relativePath: slash(path.relative(srcDir, includePath)),
              cleanUrls
            })
            .filter((token) => token.type === 'heading_open' && token.map)
          const index = tokens.findIndex((token) => token.attrGet('id') === regionName)
          const token = tokens[index]

          if (token) {
            start = token.map![1]
            const level = parseInt(token.tag.slice(1))

            for (let i = index + 1; i < tokens.length; i++) {
              if (parseInt(tokens[i].tag.slice(1)) <= level) {
                end = tokens[i].map![0]
                break
              }
            }
          }
        }

        content = lines.slice(start, end).join('\n')
      }

      if (range) {
        const [, startLine, endLine] = range
        content = content
          .split(/\r?\n/)
          .slice(
            startLine ? parseInt(startLine) - 1 : undefined,
            endLine ? parseInt(endLine) : undefined
          )
          .join('\n')
      }

      if (!hasMeta && path.extname(includePath) === '.md') {
        content = matter(content).content
      }

      includes.push(includePath)
      return processIncludes(
        md,
        srcDir,
        content,
        includePath,
        includes,
        cleanUrls,
        dependencies,
        new Set([...ancestors, includePath])
      )
    } catch {
      return match
    }
  })
}
