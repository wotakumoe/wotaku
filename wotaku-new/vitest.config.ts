import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 120000,
    hookTimeout: 120000,
    maxWorkers: 1,
    benchmark: { include: ['tests/**/*.bench.ts'] }
  }
})
