import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const source = resolve(import.meta.dirname, '../src')
const fix = process.argv.includes('--fix')
const body = `All Rights Reserved

Copyright (c) 2026 taskylizard

All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.`

function codeFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (directory === source && entry.name === 'content') return []

    const path = join(directory, entry.name)

    return entry.isDirectory()
      ? codeFiles(path)
      : /\.(?:[cm]?js|tsx?|vue|s?css)$/.test(entry.name)
        ? [path]
        : []
  })
}

const missing = []
const files = codeFiles(source)

for (const file of files) {
  const original = readFileSync(file, 'utf8')
  const header = file.endsWith('.vue')
    ? `<!--\n${body
        .split('\n')
        .map((line) => `  ${line}`.trimEnd())
        .join('\n')}\n-->`
    : `/**\n${body
        .split('\n')
        .map((line) => ` * ${line}`.trimEnd())
        .join('\n')}\n */`
  const code = original.replace(
    /^(?:\/\*\*[\s\S]*?All Rights Reserved[\s\S]*?\*\/|<!--[\s\S]*?All Rights Reserved[\s\S]*?-->)\s*/,
    ''
  )
  const updated = `${header}\n\n${code}`

  if (original === updated) continue

  if (fix) writeFileSync(file, updated)
  else missing.push(file)
}

if (missing.length) {
  console.error(`Missing or outdated copyright headers:\n${missing.join('\n')}`)
  process.exitCode = 1
} else {
  console.log(
    `Copyright headers ${fix ? 'updated' : 'verified'} in ${files.length} source files; content excluded.`
  )
}
