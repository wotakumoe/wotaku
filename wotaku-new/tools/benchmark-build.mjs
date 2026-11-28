import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const baselineRoot = resolve(root, process.env.BENCH_BASELINE || '.')
const output = resolve(root, process.env.BENCH_OUTPUT || 'benchmark-results')
const runs = Number(process.env.BENCH_RUNS || 3)
mkdirSync(output, { recursive: true })
const results = []
for (const [name, cwd, executable, args] of [
  ...(process.env.BENCH_BASELINE_COMMAND
    ? [['baseline', baselineRoot, '/bin/sh', ['-c', process.env.BENCH_BASELINE_COMMAND]]]
    : []),
  [
    'wotaku',
    root,
    process.execPath,
    ['--max-old-space-size=8192', 'src/build/vite/build.ts']
  ]
]) {
  for (let run = 1; run <= runs; run++) {
    const metrics = join(output, `${name}-${run}.time`)
    const log = join(output, `${name}-${run}.log`)
    const started = performance.now()
    const result = spawnSync(
      '/usr/bin/time',
      ['-v', '-o', metrics, executable, ...args],
      {
        cwd,
        env: { ...process.env, NODE_ENV: 'production' },
        encoding: 'utf8',
        maxBuffer: 32 * 1024 * 1024
      }
    )
    writeFileSync(log, (result.stdout || '') + (result.stderr || ''))
    const time = readFileSync(metrics, 'utf8')
    const row = {
      name,
      run,
      seconds: (performance.now() - started) / 1000,
      maxRSSMiB:
        Number(time.match(/Maximum resident set size \(kbytes\): (\d+)/)?.[1]) / 1024,
      status: result.status,
      signal: result.signal,
      log
    }
    results.push(row)
    writeFileSync(join(output, 'results.json'), JSON.stringify(results, null, 2))
    console.log(JSON.stringify(row))
    if (result.status !== 0) throw new Error(`Build failed; see ${log}`)
  }
}
writeFileSync(join(output, 'results.json'), JSON.stringify(results, null, 2))
for (const name of new Set(results.map((row) => row.name))) {
  const group = results.filter((row) => row.name === name)
  const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
  console.log(
    `${name}: median ${median(group.map((row) => row.seconds)).toFixed(
      2
    )}s; median peak RSS ${median(group.map((row) => row.maxRSSMiB)).toFixed(
      1
    )} MiB (${group.length} runs)`
  )
}
