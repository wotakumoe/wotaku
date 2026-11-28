import Vue from '@vitejs/plugin-vue'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { wotakuPlugins } from './src/build/vite/plugin.ts'
import { pagesRoot } from './src/build/paths.ts'

const root = import.meta.dirname

function gitValue(args: string[], fallback: string) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return fallback
  }
}

export default defineConfig(({ command }) => ({
  root,
  publicDir: resolve(pagesRoot, 'public'),
  cacheDir: resolve(root, 'node_modules/.vite'),
  define: {
    __GIT_COMMIT__: JSON.stringify(
      process.env.NODE_ENV === 'development'
        ? 'dev'
        : process.env.GITHUB_SHA || gitValue(['rev-parse', 'HEAD'], 'standalone')
    ),
    __GIT_COMMIT_TS__: Number(
      process.env.NODE_ENV === 'development'
        ? Math.floor(Date.now() / 1000)
        : gitValue(['log', '-1', '--format=%ct', 'HEAD'], '0')
    ),
    __WOTAKU_PAGES__: JSON.stringify(pagesRoot),
    __ASSETS_DIR__: JSON.stringify('assets'),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
  },
  plugins: [
    ...wotakuPlugins(),
    Vue({ include: [/\.vue$/, /\.md$/] }),
    UnoCSS({ configFile: resolve(root, 'unocss.config.ts') })
  ],
  resolve: {
    dedupe: ['vue'],
    alias: { '@': resolve(root, 'src') }
  },
  experimental: { bundledDev: true },
  optimizeDeps: {
    // Data-loader sources import build-only Markdown/icon packs. Explicit
    // runtime entries avoid rescanning/bundling those unused browser graphs.
    noDiscovery: true,
    include: [
      'vue',
      '@vueuse/core',
      '@vueuse/integrations/useFocusTrap',
      'lucide-vue-next',
      'reka-ui',
      'motion-v',
      'floating-vue',
      'minisearch',
      '@vue/devtools-api',
      'mark.js/dist/mark.es6.js',
      'mark.js/src/vanilla.js',
      'medium-zoom',
      'zod'
    ]
  },
  build: {
    cssMinify: 'lightningcss',
    cssCodeSplit: false,
    manifest: true,
    ...(command === 'serve'
      ? {
          rolldownOptions: {
            experimental: { devMode: { hotUpdate: true, lazy: false } }
          }
        }
      : {})
  },
  environments: {
    client: { build: { outDir: resolve(root, 'dist'), ssrManifest: true } },
    ssr: {
      build: {
        ssr: true,
        rolldownOptions: {
          input: {
            server: resolve(root, 'src/build/vite/server.ts'),
            ...(process.env.CI
              ? { opengraph: resolve(root, 'src/build/opengraph/generate.ts') }
              : {})
          }
        },
        outDir: resolve(root, 'node_modules/.ssr'),
        emptyOutDir: true
      }
    }
  },
  builder: {
    sharedConfigBuild: true,
    sharedPlugins: true,
    async buildApp(builder) {
      await builder.build(builder.environments.client)
      await builder.build(builder.environments.ssr)
    }
  },
  server: { host: '0.0.0.0', fs: { allow: [root] } }
}))
