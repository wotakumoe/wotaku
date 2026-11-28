import { randomUUID } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { type Browser, chromium, devices, type Locator, type Page } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'
import { afterAll, beforeAll, expect, test } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const id = `hmr-${randomUUID()}`
const directory = resolve(root, 'src/content/pages', id)
const markdown = resolve(directory, 'index.md')
const component = resolve(directory, 'Probe.vue')
const include = resolve(directory, 'include.md')
const dataFile = resolve(directory, 'value.json')
let server: ViteDevServer
let browser: Browser
let page: Page

async function waitFor(code: string) {
  const started = performance.now()
  await page.waitForFunction(code, undefined, { timeout: 20000 })
  return performance.now() - started
}

async function readableText(element: Locator, minimum = 4.5) {
  const result = await element.evaluate((el) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })!
    const luminance = (pixels: Uint8ClampedArray) => {
      const linear = [...pixels].slice(0, 3).map((channel) => {
        const value = channel / 255
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      })
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
    }
    const ancestors: Element[] = []

    for (let node: Element | null = el; node; node = node.parentElement) {
      ancestors.unshift(node)
    }

    context.fillStyle = '#fff'
    context.fillRect(0, 0, 1, 1)
    let opacity = 1

    for (const node of ancestors) {
      const style = getComputedStyle(node)
      context.fillStyle = style.backgroundColor
      context.fillRect(0, 0, 1, 1)
      opacity *= Number(style.opacity)
    }

    const background = luminance(context.getImageData(0, 0, 1, 1).data)
    const style = getComputedStyle(el)
    context.globalAlpha = opacity
    context.fillStyle = style.color
    context.fillRect(0, 0, 1, 1)
    const foreground = luminance(context.getImageData(0, 0, 1, 1).data)

    return {
      ratio:
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05),
      decoration: style.textDecorationLine,
      underlineColor: style.textDecorationColor
    }
  })
  expect(result.ratio).toBeGreaterThanOrEqual(minimum)
  return result
}

beforeAll(async () => {
  mkdirSync(directory, { recursive: true })
  writeFileSync(include, 'Included before\n')
  writeFileSync(dataFile, '{"label":"Data before"}')
  writeFileSync(
    resolve(directory, 'state.data.ts'),
    `import { readFileSync } from 'node:fs'
export default { watch: ['./value.json'], load: () => JSON.parse(readFileSync(new URL('./value.json', import.meta.url), 'utf8')) }
`
  )
  writeFileSync(
    component,
    `<script setup>import { data } from './state.data'</script>
<template><strong id="probe">Component before</strong><strong id="data">{{ data.label }}</strong></template>`
  )
  writeFileSync(
    markdown,
    `---\ntitle: HMR probe\npageProperties: false\n---\n<script setup>\nimport { ref } from 'vue'\nimport Probe from './Probe.vue'\nconst count = ref(0)\n</script>\n\n# HMR probe\n\n<button id="counter" @click="count++">Count {{ count }}</button>\n\n<Probe />\n\nMarkdown before wotakuHmrBeforeNeedle\n\n<!--@include: ./include.md-->\n`
  )
  writeFileSync(
    resolve(directory, 'links.md'),
    `# Link presentation

Read the [Sentence link](/software) for help.

- [Bare list link](/software) :s: [:src:](https://example.org/source)
- [Described list link](/software) includes instructions.
- [Tooltip list link](/software) <Tooltip title="Metadata">Native speaker metadata</Tooltip>
- [**Formatted list link**](/software)
- 日本語の[Sentence in Japanese](/software)を読む。

- [Loose list link](/software)

- [Other loose link](/software)

| Name | Description |
| --- | --- |
| [Table link](/software) | A separate description |
| Read [Table sentence link](/software) for help | A second description |

::: tip Link guidance
[Callout link](/software)
:::

<Block link="/software">Linked callout</Block>

## See [Linked heading](/software)
`
  )
  server = await createServer({
    root,
    configFile: resolve(root, 'vite.config.ts'),
    server: { port: 0 }
  })
  await server.listen()
  const address = server.httpServer!.address()

  if (!address || typeof address === 'string') {
    throw new Error('No test HTTP port')
  }

  browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2
  })
  context.setDefaultTimeout(90000)
  await context.route('https://**', (route) => route.abort())
  page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  try {
    await page.goto(`http://localhost:${address.port}/${id}`)
  } catch (error) {
    console.error(
      await page.evaluate(
        '({url:location.href,body:document.body.innerText.slice(0,500),resources:performance.getEntriesByType("resource").slice(-10).map(r=>r.name)})'
      )
    )
    console.error(errors)
    throw error
  }

  await page.locator('#counter').waitFor()
  await waitFor(`location.pathname === ${JSON.stringify(`/${id}/`)}`)
  await page.evaluate(`window.__hmrSentinel=${JSON.stringify(id)}`)
}, 120000)

afterAll(async () => {
  try {
    await browser?.close()
  } finally {
    await server?.close()
    rmSync(directory, { recursive: true, force: true })
  }
})

test('Markdown and Vue HMR preserve the browser and local component state', async () => {
  await page.click('#counter')
  expect(await page.textContent('#counter')).toBe('Count 1')
  await page.click('.nav-actions button[aria-label="Search"]')
  await page.locator('#localsearch-input').waitFor()
  await page.fill('#localsearch-input', 'wotakuHmrBeforeNeedle')
  await waitFor(
    `document.querySelector('#localsearch-item-1')?.textContent.includes('HMR probe')`
  )
  await waitFor(
    `document.querySelector('.result .excerpt')?.textContent.includes('wotakuHmrBeforeNeedle')`
  )
  await page.keyboard.press('Escape')
  const markdownStarted = performance.now()
  writeFileSync(
    markdown,
    readFileSync(markdown, 'utf8').replace(
      'Markdown before wotakuHmrBeforeNeedle',
      'Markdown after wotakuHmrAfterNeedle'
    )
  )
  await waitFor(
    `document.querySelector('.wotaku-doc')?.textContent.includes('Markdown after')`
  )
  expect(await page.evaluate('window.__hmrSentinel')).toBe(id)
  expect(await page.textContent('#counter')).toBe('Count 1')
  const markdownMs = performance.now() - markdownStarted

  await page.click('.nav-actions button[aria-label="Search"]')
  await page.locator('#localsearch-input').waitFor()
  await page.fill('#localsearch-input', 'wotakuHmrAfterNeedle')
  await waitFor(
    `document.querySelector('#localsearch-item-1')?.textContent.includes('HMR probe')`
  )
  await page.keyboard.press('Escape')

  writeFileSync(include, 'Included after\n')
  await waitFor(
    `document.querySelector('.wotaku-doc')?.textContent.includes('Included after')`
  )
  expect(await page.textContent('#counter')).toBe('Count 1')

  const componentStarted = performance.now()
  writeFileSync(
    component,
    readFileSync(component, 'utf8').replace('Component before', 'Component after')
  )
  await waitFor(`document.querySelector('#probe')?.textContent === 'Component after'`)
  expect(await page.evaluate('window.__hmrSentinel')).toBe(id)
  expect(await page.textContent('#counter')).toBe('Count 1')
  const componentMs = performance.now() - componentStarted

  writeFileSync(markdown, readFileSync(markdown, 'utf8').replace('ref(0)', 'ref(7)'))
  await waitFor(`document.querySelector('#counter')?.textContent === 'Count 7'`)
  expect(await page.evaluate('window.__hmrSentinel')).toBe(id)

  writeFileSync(dataFile, '{"label":"Data after"}')
  await waitFor(`document.querySelector('#data')?.textContent === 'Data after'`)
  expect(await page.evaluate('window.__hmrSentinel')).toBe(id)

  writeFileSync(
    markdown,
    readFileSync(markdown, 'utf8').replace('title: HMR probe', 'title: Updated HMR title')
  )
  await waitFor(`document.title.startsWith('Updated HMR title')`)
  expect(await page.evaluate('window.__hmrSentinel')).toBe(id)
  console.log(
    JSON.stringify({
      markdownMs,
      componentMs,
      fullReloads: 0,
      templateState: 'Count 1',
      scriptState: 'Count 7'
    })
  )
}, 90000)

test('new and removed dev pages update without reloading the reading session', async () => {
  const added = resolve(directory, 'added.md')
  const href = `/${id}/added`
  writeFileSync(added, `# Added page probe\n\n[Return to probe](/${id}/)\n`)
  writeFileSync(markdown, readFileSync(markdown, 'utf8') + `\n[Added page](${href})\n`)
  await page.getByRole('link', { name: 'Added page', exact: true }).waitFor()
  await page.getByRole('link', { name: 'Added page', exact: true }).click()
  await page.locator('.wotaku-doc h1').filter({ hasText: 'Added page probe' }).waitFor()
  expect(await page.evaluate('window.__hmrSentinel')).toBe(id)

  await page.getByRole('link', { name: 'Return to probe', exact: true }).click()
  await page.locator('#counter').waitFor()
  rmSync(added)
  writeFileSync(markdown, readFileSync(markdown, 'utf8') + '\nDeletion processed\n')
  await waitFor(
    `document.querySelector('.wotaku-doc')?.textContent.includes('Deletion processed')`
  )
  await page.getByRole('link', { name: 'Added page', exact: true }).click()
  await page.getByText('404', { exact: true }).waitFor()
  expect(await page.evaluate('window.__hmrSentinel')).toBe(id)
})

test('mobile menu preferences stay exclusive, persist, and preserve classic navigation', async () => {
  const context = await browser.newContext({
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 }
  })
  await context.route('https://**', (route) => route.abort())
  const mobile = await context.newPage()
  const errors: string[] = []
  mobile.on('pageerror', (error) => errors.push(error.message))
  const origin = new URL(page.url()).origin
  const controls = mobile.getByRole('group', { name: 'Mobile site controls' })
  const navigation = controls.getByRole('button', {
    name: 'Navigation',
    exact: true
  })
  const menu = mobile.getByRole('dialog', { name: /^(Site menu|Settings)$/ })
  const settings = menu.getByRole('button', { name: 'Settings', exact: true })
  const preferences = menu.getByRole('region', {
    name: 'Mobile navigation',
    exact: true
  })
  const settle = () =>
    mobile.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        )
    )

  try {
    await mobile.goto(origin + '/websites')
    await navigation.click()
    await settings.click()
    const effects = menu.getByRole('radiogroup').filter({
      has: mobile.getByRole('heading', { name: 'Effects', exact: true })
    })

    for (const value of ['On', 'Off', 'On']) {
      await effects.getByRole('radio', { name: value, exact: true }).check()
      const opacity = await menu.evaluate(async (element) => {
        let minimum = 1

        for (let frame = 0; frame < 24; frame++) {
          await new Promise(requestAnimationFrame)
          minimum = Math.min(minimum, Number(getComputedStyle(element).opacity))
        }

        return minimum
      })
      expect(opacity).toBe(1)
      expect(await settings.getAttribute('aria-pressed')).toBe('true')
    }

    await effects.getByRole('radio', { name: 'Off', exact: true }).check()
    const help = preferences.getByRole('button', {
      name: 'About Menu presentation',
      exact: true
    })
    const helpIcon = help.locator('svg')
    expect(await helpIcon.isVisible()).toBe(true)
    const iconBounds = await helpIcon.boundingBox()
    expect(iconBounds!.width).toBeGreaterThan(8)
    expect(iconBounds!.height).toBeGreaterThan(8)
    await help.tap()
    await mobile.getByRole('tooltip').filter({ hasText: 'without resizing' }).waitFor()
    await mobile.keyboard.press('Escape')
    expect(await menu.isVisible()).toBe(true)

    for (const presentation of ['Floating', 'Full screen', 'Underlay']) {
      await preferences.getByRole('radio', { name: presentation, exact: true }).check()
      expect(
        await preferences.getByRole('radio', { checked: true }).allTextContents()
      ).toHaveLength(3)
      expect(await menu.isVisible()).toBe(true)
      await menu.getByRole('button', { name: 'Close menu', exact: true }).click()
      await menu.waitFor({ state: 'hidden' })
      await settle()
      const before = await mobile.locator('#anime').boundingBox()
      await navigation.click()
      await menu.waitFor()
      await settle()
      const bounds = (await menu.boundingBox())!

      if (presentation === 'Full screen') {
        expect(bounds.y).toBe(0)
        expect(bounds.height).toBe(844)
        expect(
          await menu.getByRole('button', { name: /Expand menu|Reduce menu/ }).count()
        ).toBe(0)
      } else if (presentation === 'Floating') {
        expect(bounds.x).toBe(8)
        expect(bounds.width).toBe(374)
        expect((await mobile.locator('#anime').boundingBox())!.y).toBe(before!.y)
      } else {
        expect(bounds.y).toBe(422)
      }

      await settings.click()
    }

    await preferences.getByRole('radio', { name: 'Tabs', exact: true }).check()
    expect(await settings.getAttribute('aria-pressed')).toBe('true')
    await settings.click()
    expect(await menu.getByRole('tab').allTextContents()).toEqual([
      'Navigation',
      'On this page'
    ])
    expect(await menu.getByRole('navigation', { name: 'On this page' }).count()).toBe(0)
    const pageTab = menu.getByRole('tab', { name: 'On this page', exact: true })
    await menu.getByRole('tab', { name: 'Navigation', exact: true }).focus()
    await mobile.keyboard.press('ArrowRight')
    expect(await pageTab.getAttribute('aria-selected')).toBe('true')
    const toc = menu.getByRole('navigation', {
      name: 'On this page',
      exact: true
    })
    await toc.waitFor()
    expect(await toc.getByRole('link').allTextContents()).toEqual([
      'Anime',
      'Manga',
      'Novels',
      'Live Action',
      'Tokusatsu',
      'Comics'
    ])
    expect(await menu.getByRole('navigation', { name: 'Site navigation' }).count()).toBe(
      0
    )
    await settings.click()
    await settings.click()
    expect(await pageTab.getAttribute('aria-selected')).toBe('true')
    await settings.click()
    await preferences.getByRole('radio', { name: 'Classic', exact: true }).check()
    expect(
      await preferences.getByRole('radio', { name: 'Underlay', exact: true }).count()
    ).toBe(0)
    expect(
      await preferences.getByRole('radio', { name: 'Tabs', exact: true }).count()
    ).toBe(0)
    await menu.getByRole('button', { name: 'Close menu', exact: true }).click()
    await mobile.reload()
    expect(await controls.count()).toBe(0)
    const dropdown = mobile.getByRole('button', {
      name: 'On this page',
      exact: true
    })
    await dropdown.click()
    await mobile
      .getByRole('navigation', { name: 'On this page', exact: true })
      .getByRole('link', { name: /^Manga/ })
      .click()
    await mobile.waitForFunction(() => location.hash === '#manga')
    await mobile.getByRole('button', { name: 'Menu', exact: true }).click()
    await mobile
      .getByRole('navigation', {
        name: 'Sidebar Navigation',
        exact: true
      })
      .waitFor()
    await mobile.keyboard.press('Escape')
    await mobile.getByRole('button', { name: 'Settings', exact: true }).click()
    await preferences.getByRole('radio', { name: 'Island', exact: true }).check()
    expect(
      await preferences.getByRole('radio', { name: 'Tabs', exact: true }).isChecked()
    ).toBe(true)
    expect(
      await preferences.getByRole('radio', { name: 'Underlay', exact: true }).isChecked()
    ).toBe(true)
    await menu.getByRole('button', { name: 'Close menu', exact: true }).click()
    await navigation.click()
    expect(await menu.getByRole('tab').count()).toBe(2)
    await menu.getByRole('button', { name: 'Close menu', exact: true }).click()
    await mobile.setViewportSize({ width: 1280, height: 900 })
    expect(await controls.count()).toBe(0)
    expect(
      await mobile
        .getByRole('region', {
          name: 'Mobile navigation',
          exact: true
        })
        .count()
    ).toBe(0)
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
})

test('mobile navigation shows the active page TOC, preserves reading position and keeps desktop actions', async () => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true
  })
  await context.route('https://**', (route) => route.abort())
  const mobile = await context.newPage()
  const errors: string[] = []
  mobile.on('pageerror', (error) => errors.push(error.message))
  const origin = new URL(page.url()).origin
  const controls = mobile.getByRole('group', { name: 'Mobile site controls' })
  const navigation = controls.getByRole('button', {
    name: 'Navigation',
    exact: true
  })
  const dialog = mobile.getByRole('dialog', {
    name: /^(Site menu|Settings)$/,
    exact: true
  })

  try {
    await mobile.goto(origin + '/websites')
    await mobile.locator('#anime').waitFor()
    expect(
      await mobile
        .getByRole('navigation', {
          name: 'Sidebar Navigation',
          exact: true
        })
        .count()
    ).toBe(0)
    await navigation.click()
    const toc = dialog.getByRole('navigation', { name: 'On this page' })
    await toc.waitFor()
    expect(await toc.getByRole('link').allTextContents()).toEqual([
      'Anime',
      'Manga',
      'Novels',
      'Live Action',
      'Tokusatsu',
      'Comics'
    ])
    await toc.getByRole('button', { name: 'Bookmark "Manga"', exact: true }).click()
    expect(await dialog.isVisible()).toBe(true)
    await toc.getByRole('link', { name: /^Manga/ }).click()
    await dialog.waitFor({ state: 'hidden' })
    await mobile.waitForFunction(() => location.hash === '#manga')
    const heading = await mobile.locator('#manga').boundingBox()
    expect(heading!.y).toBeGreaterThanOrEqual(0)
    expect(heading!.y + heading!.height).toBeLessThan(422)

    await mobile.evaluate(() => window.scrollTo(0, 650))
    await mobile.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        )
    )
    await controls.waitFor({ state: 'hidden' })
    await mobile.evaluate(() => window.scrollTo(0, 620))
    await mobile.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        )
    )
    expect(await controls.count()).toBe(0)
    await mobile.evaluate(() => window.scrollTo(0, 590))
    await controls.waitFor()

    for (const y of [606, 593, 610, 595]) {
      await mobile.evaluate((y) => window.scrollTo(0, y), y)
      await mobile.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          )
      )
      expect(await controls.isVisible()).toBe(true)
    }

    await mobile.evaluate(() => window.scrollTo(0, 470))
    await controls.waitFor()
    await navigation.click()
    await dialog.waitFor()
    expect(await mobile.evaluate(() => scrollY)).toBe(470)
    await mobile.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    expect(await mobile.evaluate(() => scrollY)).toBe(470)
    expect(await navigation.evaluate((el) => el === document.activeElement)).toBe(true)

    expect(
      await controls.getByRole('button', { name: 'Settings', exact: true }).count()
    ).toBe(0)
    expect(
      await controls.getByRole('button', { name: /Switch to .* theme/ }).count()
    ).toBe(0)
    await navigation.click()
    const settingsAction = dialog.getByRole('button', {
      name: 'Settings',
      exact: true
    })
    await settingsAction.click()
    expect(await settingsAction.getAttribute('aria-pressed')).toBe('true')
    expect(await dialog.getByRole('tab').count()).toBe(0)
    const darkTheme = dialog.getByRole('radio', {
      name: 'Dark',
      exact: true
    })
    const systemTheme = dialog.getByRole('radio', {
      name: 'System',
      exact: true
    })
    const lightTheme = dialog.getByRole('radio', {
      name: 'Light',
      exact: true
    })
    expect(await systemTheme.isChecked()).toBe(true)
    const underlay = await mobile.locator('.mobile-page-surface').boundingBox()
    expect(underlay!.y + underlay!.height).toBeLessThan((await dialog.boundingBox())!.y)
    await darkTheme.check()
    expect(await darkTheme.isChecked()).toBe(true)
    expect(await mobile.locator('html').getAttribute('class')).toContain('dark')
    expect(await mobile.evaluate(() => scrollY)).toBe(470)
    await lightTheme.check()
    await mobile.emulateMedia({ colorScheme: 'dark' })
    expect(await mobile.locator('html').getAttribute('class')).not.toContain('dark')
    await systemTheme.check()
    await mobile.waitForFunction(() =>
      document.documentElement.classList.contains('dark')
    )
    await mobile.emulateMedia({ colorScheme: 'light' })
    await mobile.waitForFunction(
      () => !document.documentElement.classList.contains('dark')
    )
    await lightTheme.check()
    await settingsAction.focus()
    await mobile.keyboard.press('Space')
    expect(await settingsAction.getAttribute('aria-pressed')).toBe('false')
    await toc.waitFor()
    await mobile.keyboard.press('Enter')
    expect(await settingsAction.getAttribute('aria-pressed')).toBe('true')
    await dialog.getByRole('button', { name: 'Expand menu', exact: true }).click()
    expect((await dialog.boundingBox())!.height).toBeGreaterThan(800)
    await dialog.getByRole('button', { name: 'Reduce menu', exact: true }).click()
    expect((await dialog.boundingBox())!.height).toBe(422)

    const help = dialog.getByRole('button', {
      name: 'About Accent Color',
      exact: true
    })
    await help.focus()
    await mobile
      .getByRole('tooltip')
      .filter({
        hasText: 'Sets the accent color'
      })
      .waitFor()
    await mobile.keyboard.press('Escape')
    await mobile
      .getByRole('tooltip')
      .filter({
        hasText: 'Sets the accent color'
      })
      .waitFor({ state: 'hidden' })
    expect(await dialog.isVisible()).toBe(true)
    const background = dialog.getByRole('radiogroup').filter({
      has: mobile.getByRole('heading', {
        name: 'Accent Background',
        exact: true
      })
    })
    const backgroundOff = background.getByRole('radio', {
      name: 'Off',
      exact: true
    })
    await backgroundOff.focus()
    await mobile.keyboard.press('ArrowLeft')
    expect(
      await background.getByRole('radio', { name: 'On', exact: true }).isChecked()
    ).toBe(true)
    await mobile.keyboard.press('ArrowRight')
    expect(await backgroundOff.isChecked()).toBe(true)
    await mobile.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    expect(await navigation.evaluate((el) => el === document.activeElement)).toBe(true)

    await mobile.reload()
    await mobile.locator('#anime').waitFor()
    await mobile.evaluate(() => window.scrollTo(0, 0))
    await navigation.click()
    await settingsAction.click()
    await mobile.locator('.WotakuLocalSearchBox').waitFor({
      state: 'attached'
    })
    await darkTheme.waitFor()
    await mobile.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    expect(errors).toEqual([])

    const narrowContext = await browser.newContext({
      ...devices['Pixel 7'],
      viewport: { width: 320, height: 568 }
    })
    await narrowContext.route('https://**', (route) => route.abort())

    try {
      const narrow = await narrowContext.newPage()
      await narrow.goto(origin + '/faq')
      await narrow.getByRole('button', { name: 'Navigation', exact: true }).tap()
      await narrow.getByRole('button', { name: 'Settings', exact: true }).tap()
      const narrowDialog = narrow.getByRole('dialog', {
        name: 'Settings',
        exact: true
      })
      await narrowDialog.waitFor()
      await narrow.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          )
      )
      const narrowUnderlay = await narrow.locator('.mobile-page-surface').boundingBox()
      expect(narrowUnderlay!.y + narrowUnderlay!.height).toBeLessThan(
        (await narrowDialog.boundingBox())!.y
      )
    } finally {
      await narrowContext.close()
    }

    await controls.getByRole('button', { name: 'Bookmarks', exact: true }).click()
    const bookmarks = mobile.getByRole('dialog', {
      name: 'Bookmarks',
      exact: true
    })
    await bookmarks.getByRole('link', { name: 'Manga', exact: true }).waitFor()
    await bookmarks.getByRole('button', { name: 'Close bookmarks', exact: true }).click()
    await bookmarks.waitFor({ state: 'hidden' })
    await navigation.click()
    await dialog.getByRole('button', { name: 'Search', exact: true }).click()
    await mobile.getByRole('searchbox').waitFor()
    await dialog.waitFor({ state: 'hidden' })
    const searchAction = controls.getByRole('button', {
      name: 'Search',
      exact: true
    })
    expect(
      await searchAction.evaluate((el) => {
        const { x, y, width, height } = el.getBoundingClientRect()
        return el.contains(document.elementFromPoint(x + width / 2, y + height / 2))
      })
    ).toBe(false)
    await mobile.keyboard.press('Escape')
    await mobile.getByRole('searchbox').waitFor({ state: 'hidden' })

    await mobile.goto(origin + '/guides/manga/madokami')
    await navigation.click()
    await dialog.getByRole('navigation', { name: 'On this page' }).waitFor()
    expect(
      await dialog.getByRole('link', { name: 'Madokami', exact: true }).isVisible()
    ).toBe(true)
    await mobile.setViewportSize({ width: 1280, height: 720 })
    await dialog.waitFor({ state: 'hidden' })
    expect(await controls.count()).toBe(0)
    expect(await mobile.getByRole('group', { name: 'Site actions' }).count()).toBe(1)
    expect(await mobile.getByRole('group', { name: 'Site actions' }).isVisible()).toBe(
      true
    )
    expect(
      await mobile.getByRole('button', { name: 'Switch to dark theme' }).count()
    ).toBe(1)
    await mobile.setViewportSize({ width: 820, height: 1180 })
    expect(
      await mobile.getByRole('button', { name: 'On this page', exact: true }).count()
    ).toBe(0)
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 90000)

test('sentence and callout links stay underlined while link-only entries stay quiet', async () => {
  const origin = new URL(page.url()).origin

  for (const colorScheme of ['light', 'dark'] as const) {
    const context = await browser.newContext({ colorScheme, reducedMotion: 'reduce' })

    try {
      await context.route('https://**', (route) => route.abort())
      const reader = await context.newPage()
      await reader.goto(`${origin}/${id}/links`)

      for (const name of [
        'Sentence link',
        'Described list link',
        'Sentence in Japanese',
        'Table sentence link',
        'Callout link'
      ]) {
        const link = reader.getByRole('link', { name, exact: true })
        await link.waitFor()
        expect((await readableText(link)).decoration).toBe('underline')
      }

      for (const name of [
        'Bare list link',
        'Tooltip list link',
        'Formatted list link',
        'Loose list link',
        'Table link',
        'Linked heading'
      ]) {
        expect(
          (await readableText(reader.getByRole('link', { name, exact: true }))).decoration
        ).toBe('none')
      }

      expect(
        (await readableText(reader.getByText('Linked callout', { exact: true })))
          .decoration
      ).toBe('underline')

      const bare = reader.getByRole('link', { name: 'Bare list link', exact: true })
      await bare.hover()
      expect((await readableText(bare)).decoration).toBe('underline')
      await reader.mouse.move(0, 0)
      await reader.getByRole('link', { name: 'Sentence link', exact: true }).focus()
      await reader.keyboard.press('Tab')
      expect(await bare.evaluate((el) => el === document.activeElement)).toBe(true)
      expect((await readableText(bare)).decoration).toBe('underline')
    } finally {
      await context.close()
    }
  }
})

test('reading typography loads Allo locally and keeps code monospace', async () => {
  const context = await browser.newContext()

  try {
    await context.route('https://**', (route) => route.abort())
    const reader = await context.newPage()
    await reader.goto(new URL('/guides/manga/cubari', page.url()).href)
    await reader.getByText('# Comic metadata', { exact: true }).waitFor()
    const typography = await reader.evaluate(async () => {
      await document.fonts.ready
      const italic = await document.fonts.load('italic 400 16px Allo')

      return {
        body: getComputedStyle(document.body).fontFamily,
        code: getComputedStyle(document.querySelector('pre code')!).fontFamily,
        regularLoaded: [...document.fonts].some(
          (font) =>
            font.family === 'Allo' && font.style === 'normal' && font.status === 'loaded'
        ),
        italicLoaded: italic.some((font) => font.status === 'loaded')
      }
    })
    expect(typography.body.split(',')[0]).toBe('Allo')
    expect(typography.code).toContain('monospace')
    expect(typography.code).not.toContain('Allo')
    expect(typography.regularLoaded).toBe(true)
    expect(typography.italicLoaded).toBe(true)
  } finally {
    await context.close()
  }
})

test('reading links and Install actions remain legible with appearance preferences', async () => {
  const origin = new URL(page.url()).origin

  for (const colorScheme of ['light', 'dark'] as const) {
    for (const accent of ['ayanami', 'suisei', 'fubuki']) {
      const context = await browser.newContext({ colorScheme, reducedMotion: 'reduce' })

      try {
        await context.route('https://**', (route) => route.abort())
        await context.addInitScript((accent) => {
          localStorage.setItem('preference-accent-color', accent)
          localStorage.setItem('preference-accent-bg', 'true')
          localStorage.setItem('preference-accent-bg-strength', '100')
        }, accent)
        const reader = await context.newPage()
        await reader.goto(origin + '/software')
        const link = reader.getByRole('link', { name: 'KOReader', exact: true })
        await link.waitFor()
        const directoryLink = await readableText(link)
        expect(directoryLink.decoration).toBe('none')
        const callout = reader
          .getByRole('link', {
            name: 'All the extensions can be found here',
            exact: true
          })
          .first()
        await readableText(callout)
        const calloutText = reader
          .getByText('All the extensions can be found here', {
            exact: true
          })
          .first()
        const cue = await readableText(calloutText)
        expect(cue.decoration).toBe('underline')
        expect(cue.underlineColor).not.toBe('rgba(0, 0, 0, 0)')
        const color = await callout.evaluate((el) => getComputedStyle(el).color)
        await callout.hover()
        await readableText(callout)
        expect(await callout.evaluate((el) => getComputedStyle(el).color)).toBe(color)

        const pager = reader.getByRole('navigation', { name: 'Pager', exact: true })
        const previous = pager.getByText('Websites', { exact: true })
        const next = pager.getByText('Misc-sites', { exact: true })

        for (const title of [previous, next]) {
          await title.scrollIntoViewIfNeeded()
          await readableText(title)
          await title.hover()
          await readableText(title)
        }

        await reader.goto(origin + '/websites')
        const warning = reader.locator('.wotaku-doc details').filter({
          has: reader.getByText('Before we start', { exact: true })
        })
        await warning.locator('summary').click()
        await readableText(warning.locator('summary'))
        const guidance = warning.getByRole('link', { name: 'Nyaa', exact: true })
        await guidance.waitFor()
        await readableText(guidance)
        await guidance.hover()
        await readableText(guidance)

        await reader.goto(origin + '/guides/manga/madokami')
        await reader.getByRole('tab', { name: 'FMD 2', exact: true }).click()
        await readableText(reader.getByText('.webp', { exact: true }))

        await reader.goto(origin + '/guides/manga/cubari')
        const comment = reader.getByText('# Comic metadata', { exact: true })
        await comment.scrollIntoViewIfNeeded()
        expect(await comment.isVisible()).toBe(true)
        await readableText(comment)

        await reader.goto(origin + '/ext/mihon')
        await readableText(reader.locator('.ext-btn-install').first())
      } finally {
        await context.close()
      }
    }
  }
}, 90000)

test('directory cards expose destinations as keyboard-accessible links', async () => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })

  try {
    await context.route('https://**', (route) => route.abort())
    const reader = await context.newPage()
    await reader.goto(new URL('/ext/', page.url()).href)
    const mihon = reader.getByRole('main').getByRole('link', {
      name: 'Mihon',
      exact: true
    })
    await mihon.waitFor()
    expect(await mihon.getAttribute('href')).toBe('/ext/mihon')
    await mihon.focus()
    await reader.keyboard.press('Tab')
    await reader.keyboard.press('Shift+Tab')
    expect(await mihon.evaluate((el) => el === document.activeElement)).toBe(true)
    expect(await mihon.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe(
      'none'
    )
    await reader.keyboard.press('Enter')
    await reader.waitForURL('**/ext/mihon')
    await reader
      .getByRole('main')
      .getByRole('heading', { name: /^Mihon/, level: 2 })
      .waitFor()
    expect(await reader.title()).toContain('Mihon')
  } finally {
    await context.close()
  }
})

test('informational link tooltips support keyboard focus and pointer inspection', async () => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })

  try {
    await context.route('https://**', (route) => route.abort())
    const reader = await context.newPage()
    await reader.goto(new URL('/software', page.url()).href)
    const source = reader.getByRole('link', { name: 'Source Code', exact: true }).first()
    await source.waitFor()
    await source.focus()
    await reader.keyboard.press('Tab')
    await reader.keyboard.press('Shift+Tab')
    const tooltip = reader.getByRole('tooltip', { name: 'Source Code', exact: true })
    await tooltip.waitFor()
    expect(await source.evaluate((el) => el === document.activeElement)).toBe(true)
    await reader.keyboard.press('Escape')
    await tooltip.waitFor({ state: 'hidden' })
    expect(await source.evaluate((el) => el === document.activeElement)).toBe(true)

    await reader.keyboard.press('Tab')
    await source.hover()
    await tooltip.waitFor()
    await tooltip.hover()
    await reader.waitForFunction(
      () => document.querySelector('[role="tooltip"]:hover') !== null
    )
    expect(await tooltip.count()).toBe(1)
    await reader.keyboard.press('Escape')
    await tooltip.waitFor({ state: 'hidden' })

    await source.hover()
    await tooltip.waitFor()
    await reader.mouse.move(10, 300)
    await tooltip.waitFor({ state: 'hidden' })
    await source.focus()
    await tooltip.waitFor()
    await reader.keyboard.press('Tab')
    await tooltip.waitFor({ state: 'hidden' })
  } finally {
    await context.close()
  }
})

test('search fields keep their names after typing and remain readable on phones', async () => {
  for (const width of [393, 1280]) {
    const context = await browser.newContext({
      ...(width === 393 ? devices['iPhone 13'] : {}),
      viewport: { width, height: 852 },
      reducedMotion: 'reduce'
    })

    try {
      await context.route('https://**', (route) => route.abort())
      const reader = await context.newPage()
      await reader.goto(new URL('/ext/mihon', page.url()).href)
      const extensions = reader.getByRole('textbox', { name: 'Search all extensions' })
      await extensions.waitFor()

      if (width === 393) {
        expect(
          await extensions.evaluate((el) =>
            Number.parseFloat(getComputedStyle(el).fontSize)
          )
        ).toBeGreaterThanOrEqual(16)
      }

      await extensions.fill('nonexistent-extension-afk')
      expect(await extensions.inputValue()).toBe('nonexistent-extension-afk')
      expect(await extensions.count()).toBe(1)
      await reader.getByRole('button', { name: 'Clear search', exact: true }).click()
      expect(await extensions.inputValue()).toBe('')

      await reader.goto(new URL('/ext/mana', page.url()).href)
      await reader.locator('.theme-repos input').waitFor()
      const themes = reader.getByRole('textbox', { name: 'Search themes', exact: true })
      expect(await themes.count()).toBe(1)

      if (width === 393) {
        expect(
          await themes.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize))
        ).toBeGreaterThanOrEqual(16)
      }

      await themes.fill('nonexistent-theme-afk')
      expect(await themes.inputValue()).toBe('nonexistent-theme-afk')
      expect(await themes.count()).toBe(1)
      await reader
        .locator('.theme-repos')
        .getByRole('button', { name: 'Clear search', exact: true })
        .click()
      expect(await themes.inputValue()).toBe('')

      await reader.goto(new URL('/software', page.url()).href)
      await reader.getByRole('button', { name: 'Search', exact: true }).first().click()
      const search = reader.getByRole('searchbox', { name: 'Search', exact: true })
      await readableText(reader.getByText('Looking for something?', { exact: true }))
      await search.fill('nonexistent-extension-afk')
      const noResults = reader.getByText("Couldn't find anything, try again?", {
        exact: true
      })
      await noResults.waitFor()
      await readableText(noResults)
      await search.fill('KOReader')
      expect(await search.inputValue()).toBe('KOReader')
      expect(await search.count()).toBe(1)
      await reader.getByRole('button', { name: 'Search settings', exact: true }).click()
      const help = reader.getByRole('button', { name: 'Search mode help' })
      await help.waitFor()
      await reader.waitForTimeout(200)
      await readableText(help.locator('svg'), 3)
      const target = (await help.boundingBox())!
      expect(target.width).toBeGreaterThanOrEqual(24)
      expect(target.height).toBeGreaterThanOrEqual(24)
      await help.click()
      await reader.getByText('Choose how queries are matched against content.').waitFor()
      await reader.keyboard.press('Escape')
      await reader.keyboard.press('Escape')
    } finally {
      await context.close()
    }
  }
})

test('repository actions identify their repository and variant on phones and desktop', async () => {
  for (const width of [393, 1280]) {
    const context = await browser.newContext({
      ...(width === 393 ? devices['iPhone 13'] : {}),
      viewport: { width, height: 852 },
      permissions: ['clipboard-read', 'clipboard-write'],
      reducedMotion: 'reduce'
    })

    try {
      await context.route('https://**', (route) => route.abort())
      const reader = await context.newPage()
      await reader.goto(new URL('/ext/mihon', page.url()).href)
      await reader.locator('.ext-repo-row').first().waitFor()
      const install = reader.getByRole('link', { name: 'Install Keiyoushi', exact: true })
      expect(await install.count()).toBe(1)
      expect(await install.getAttribute('href')).toBe(
        'mihon://extension-store?url=https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.pb'
      )
      await reader
        .getByRole('button', { name: 'Copy Keiyoushi URL', exact: true })
        .click()
      expect(await reader.evaluate(() => navigator.clipboard.readText())).toBe(
        'https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.pb'
      )
      expect(await reader.getByRole('status').allTextContents()).toContain(
        'Copied to clipboard'
      )
      const session = await context.newCDPSession(reader)
      const { targetInfo } = await session.send('Target.getTargetInfo')

      for (const allowWithoutSanitization of [false, true]) {
        await session.send('Browser.setPermission', {
          permission: { name: 'clipboard-write', allowWithoutSanitization },
          setting: 'denied',
          origin: new URL(reader.url()).origin,
          browserContextId: targetInfo.browserContextId
        })
      }

      await reader
        .getByRole('button', { name: 'Copy Keiyoushi URL', exact: true })
        .click()
      const failure = reader.getByRole('status').filter({ hasText: "Couldn't copy." })
      await failure.waitFor()
      expect(await failure.isVisible()).toBe(true)
      await context.clearPermissions()
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await reader
        .getByRole('button', { name: 'Copy Keiyoushi URL', exact: true })
        .click()
      expect(await failure.count()).toBe(0)
      expect(await reader.evaluate(() => navigator.clipboard.readText())).toBe(
        'https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.pb'
      )
      expect(await reader.getByRole('status').allTextContents()).toContain(
        'Copied to clipboard'
      )
      const browse = reader.getByRole('button', {
        name: 'Browse Keiyoushi extensions',
        exact: true
      })
      expect(await browse.getAttribute('aria-expanded')).toBe('false')
      await browse.click()
      expect(await browse.getAttribute('aria-expanded')).toBe('true')
      await browse.click()
      expect(await browse.getAttribute('aria-expanded')).toBe('false')

      await reader.goto(new URL('/ext/mangayomi', page.url()).href)
      const manga = reader.getByRole('link', {
        name: 'Install Gato404 (Manga)',
        exact: true
      })
      await manga.waitFor()
      await reader
        .getByRole('button', { name: 'Copy Gato404 (Manga) URL', exact: true })
        .click()
      expect(await reader.evaluate(() => navigator.clipboard.readText())).toBe(
        'https://raw.githubusercontent.com/gato404/kegareta-sauces/refs/heads/main/index.json'
      )
      expect(await reader.getByRole('status').allTextContents()).toContain(
        'Copied to clipboard'
      )
      expect(
        await reader
          .getByRole('link', {
            name: 'Install Gato404 (Manga) via LiveContainer (iOS)',
            exact: true
          })
          .count()
      ).toBe(1)
    } finally {
      await context.close()
    }
  }
})

test('repository filters return keyboard focus after selection and nested dismissal', async () => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })

  try {
    await context.route('https://**', (route) => route.abort())
    const reader = await context.newPage()
    await reader.goto(new URL('/ext/mihon', page.url()).href)
    const filters = reader.getByRole('button', { name: 'Filters', exact: true })
    await filters.waitFor()
    await filters.focus()
    await reader.keyboard.press('Enter')
    const language = reader.getByRole('button', {
      name: 'Language: All languages',
      exact: true
    })
    await language.waitFor()
    expect(await language.evaluate((el) => el === document.activeElement)).toBe(true)
    await reader.keyboard.press('Enter')
    const languages = reader.getByRole('listbox', { name: 'Language', exact: true })
    await languages.waitFor()
    await languages.getByRole('option', { name: 'English', exact: true }).focus()
    await reader.keyboard.press('Enter')
    const selected = reader.getByRole('button', {
      name: 'Language: English',
      exact: true
    })
    await selected.waitFor()
    expect(await selected.evaluate((el) => el === document.activeElement)).toBe(true)
    expect(await filters.getAttribute('aria-expanded')).toBe('true')

    await reader.keyboard.press('Enter')
    await languages.waitFor()
    await reader.keyboard.press('Escape')
    await languages.waitFor({ state: 'hidden' })
    expect(await filters.getAttribute('aria-expanded')).toBe('true')
    expect(await selected.evaluate((el) => el === document.activeElement)).toBe(true)
    await reader.keyboard.press('Escape')
    expect(await filters.getAttribute('aria-expanded')).toBe('false')
    expect(await filters.evaluate((el) => el === document.activeElement)).toBe(true)
  } finally {
    await context.close()
  }
})

test('cross-app choices stay readable while comparing supported repositories', async () => {
  const payload = {
    version: 1,
    repos: {
      aniyomi: { name: 'Aniyomi', icon: null, href: '/ext/aniyomi' },
      mihon: { name: 'Mihon', icon: null, href: '/ext/mihon' }
    },
    apps: [
      {
        id: 'animetail',
        name: 'Animetail',
        platforms: ['and'],
        icon: null,
        repos: ['aniyomi'],
        notes: []
      },
      {
        id: 'anymex',
        name: 'Anymex',
        platforms: ['and', 'ios', 'win', 'app', 'lin'],
        icon: null,
        repos: ['aniyomi', 'mihon'],
        notes: []
      }
    ]
  }

  for (const width of [393, 1280]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({
        ...(width < 768 ? devices['iPhone 13'] : {}),
        viewport: { width, height: 852 },
        colorScheme,
        reducedMotion: 'reduce'
      })

      try {
        await context.route('https://**', (route) => route.abort())
        await context.route(
          'https://wotaku-ext.duckling.workers.dev/data.json',
          (route) => route.fulfill({ json: payload })
        )
        const reader = await context.newPage()
        await reader.goto(new URL('/ext/', page.url()).href)
        const animetail = reader.getByRole('button', { name: /Animetail/ })
        const anymex = reader.getByRole('button', { name: /Anymex/ })
        await animetail.waitFor()
        expect(
          await animetail.getByRole('img', { name: 'Android', exact: true }).count()
        ).toBe(1)

        for (const platform of ['Android', 'iOS / iPadOS', 'Windows', 'MacOS', 'Linux']) {
          expect(
            await anymex.getByRole('img', { name: platform, exact: true }).count()
          ).toBe(1)
        }

        await readableText(anymex.getByText('Anymex', { exact: true }))
        await readableText(anymex.getByText('2 types', { exact: true }))
        if (width < 768) await animetail.tap()
        else await animetail.click()
        await reader.getByRole('region', { name: 'Animetail supported repos' }).waitFor()
        await readableText(anymex.getByText('Anymex', { exact: true }))
        await readableText(anymex.getByText('2 types', { exact: true }))
        if (width < 768) await anymex.tap()
        else await anymex.click()
        const details = reader.getByRole('region', { name: 'Anymex supported repos' })
        await details.waitFor()
        await readableText(animetail.getByText('Animetail', { exact: true }))
        await readableText(animetail.getByText('1 type', { exact: true }))
        expect(
          await details.getByRole('link', { name: /Mihon/ }).getAttribute('href')
        ).toBe('/ext/mihon')
        await details.getByRole('button', { name: 'Close', exact: true }).focus()
        await reader.keyboard.press('Enter')
        await details.waitFor({ state: 'hidden' })
        expect(await anymex.evaluate((el) => el === document.activeElement)).toBe(true)
        await reader.keyboard.press('Enter')
        await details.waitFor()
        await details.getByRole('link', { name: /Mihon/ }).focus()
        await reader.keyboard.press('Escape')
        await details.waitFor({ state: 'hidden' })
        expect(await anymex.evaluate((el) => el === document.activeElement)).toBe(true)
      } finally {
        await context.close()
      }
    }
  }
})

test('read announcements remain legible and can be reopened', async () => {
  for (const width of [393, 1280]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({
        ...(width < 768 ? devices['iPhone 13'] : {}),
        viewport: { width, height: 852 },
        colorScheme,
        reducedMotion: 'reduce'
      })

      try {
        await context.route('https://**', (route) => route.abort())
        const reader = await context.newPage()
        await reader.goto(new URL('/software', page.url()).href)
        await reader.getByRole('button', { name: 'Announcements', exact: true }).click()
        const announcements = reader.getByRole('dialog', {
          name: 'Announcements',
          exact: true
        })
        const post = announcements.getByRole('button', {
          name: 'Improvement: Tabs & Collapsible Links',
          exact: true
        })
        await post.waitFor()
        await readableText(post.getByText('Tabs & Collapsible Links', { exact: true }))
        const markRead = announcements.getByRole('button', { name: 'Mark all as read' })
        await markRead.click()
        expect(await markRead.isDisabled()).toBe(true)
        await reader.waitForTimeout(200)
        await readableText(post.getByText('Tabs & Collapsible Links', { exact: true }))
        await post.click()
        await reader.getByRole('dialog', { name: 'Tabs & Collapsible Links' }).waitFor()
        await reader.keyboard.press('Escape')
        await reader.reload()
        await reader.getByRole('button', { name: 'Announcements', exact: true }).click()
        expect(await markRead.isDisabled()).toBe(true)
        await readableText(post.getByText('Tabs & Collapsible Links', { exact: true }))
      } finally {
        await context.close()
      }
    }
  }
})

test('Escape closes Bookmarks and returns focus to its trigger', async () => {
  for (const width of [393, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 852 } })

    try {
      await context.route('https://**', (route) => route.abort())
      const reader = await context.newPage()
      await reader.goto(new URL('/software', page.url()).href)
      const trigger = reader.getByRole('button', { name: 'Bookmarks', exact: true })
      const bookmarks = reader.getByRole('dialog', { name: 'Bookmarks', exact: true })

      for (const saved of [false, true]) {
        if (saved) {
          await reader.evaluate(() =>
            localStorage.setItem(
              'wotaku-bookmarks',
              JSON.stringify([{ title: 'Android', anchor: 'android', path: '/software' }])
            )
          )
          await reader.reload()
        }

        await trigger.focus()
        await reader.keyboard.press('Enter')
        await bookmarks.waitFor()

        if (saved) {
          await bookmarks.getByRole('link', { name: 'Android', exact: true }).focus()
        }

        await reader.keyboard.press('Escape')
        expect(await trigger.getAttribute('aria-expanded')).toBe('false')
        await bookmarks.waitFor({ state: 'hidden' })
        expect(await trigger.evaluate((el) => el === document.activeElement)).toBe(true)
      }
    } finally {
      await context.close()
    }
  }
})

test('guide code copying keeps keyboard focus after feedback resets', async () => {
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write']
  })

  try {
    await context.route('https://**', (route) => route.abort())
    const reader = await context.newPage()
    await reader.goto(new URL('/guides/manga/cubari', page.url()).href)
    await reader.getByRole('tab', { name: 'Metadata', exact: true }).click()
    const metadata = reader
      .getByRole('tabpanel')
      .filter({ hasText: 'The given metadata' })
    const copy = metadata.getByRole('button', { name: /Copy Code|Copied/ })
    await copy.focus()
    await reader.keyboard.press('Enter')
    expect(await reader.evaluate(() => navigator.clipboard.readText())).toBe(
      'title: Comic Title\ndescription: Comic Description\nartist: Artist Name\nauthor: Author Name\ncover: https://example.com/image.jpg\ngroups: Uploader Name'
    )
    await reader.waitForTimeout(2200)
    expect(await copy.evaluate((el) => el === document.activeElement)).toBe(true)
  } finally {
    await context.close()
  }
})

test('guide code copying reports denied permission and allows retry', async () => {
  for (const width of [393, 1280]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({
        ...(width === 393 ? devices['iPhone 13'] : {}),
        viewport: { width, height: 852 },
        colorScheme,
        permissions: ['clipboard-read', 'clipboard-write'],
        reducedMotion: 'reduce'
      })

      try {
        await context.route('https://**', (route) => route.abort())
        const reader = await context.newPage()
        const errors: string[] = []
        reader.on('pageerror', (error) => errors.push(error.message))
        await reader.goto(new URL('/guides/manga/cubari', page.url()).href)
        await reader.getByRole('tab', { name: 'Metadata', exact: true }).click()
        const metadata = reader
          .getByRole('tabpanel')
          .filter({ hasText: 'The given metadata' })
        const copy = metadata.getByRole('button', { name: /Copy Code|Copied/ })
        await copy.focus()
        await reader.keyboard.press('Enter')
        const session = await context.newCDPSession(reader)
        const { targetInfo } = await session.send('Target.getTargetInfo')

        for (const allowWithoutSanitization of [false, true]) {
          await session.send('Browser.setPermission', {
            permission: { name: 'clipboard-write', allowWithoutSanitization },
            setting: 'denied',
            origin: new URL(reader.url()).origin,
            browserContextId: targetInfo.browserContextId
          })
        }

        await reader.keyboard.press('Enter')
        const failure = metadata.getByRole('status').filter({ hasText: "Couldn't copy." })
        await failure.waitFor({ timeout: 3000 })
        expect(await failure.textContent()).toBe(
          "Couldn't copy. Select the code and copy it manually."
        )
        await reader.waitForTimeout(2200)
        expect(await failure.isVisible()).toBe(true)
        await readableText(failure)
        const failureBox = (await failure.boundingBox())!
        expect(failureBox.y).toBeGreaterThanOrEqual(0)
        expect(failureBox.y + failureBox.height).toBeLessThanOrEqual(852)
        expect(await copy.evaluate((el) => el === document.activeElement)).toBe(true)
        expect(errors).toEqual([])
        await context.clearPermissions()
        await context.grantPermissions(['clipboard-read', 'clipboard-write'])
        await reader.keyboard.press('Enter')
        expect(await reader.evaluate(() => navigator.clipboard.readText())).toBe(
          'title: Comic Title\ndescription: Comic Description\nartist: Artist Name\nauthor: Author Name\ncover: https://example.com/image.jpg\ngroups: Uploader Name'
        )
        expect(await failure.count()).toBe(0)
        expect(await metadata.getByRole('status').textContent()).toBe(
          'Copied to clipboard'
        )
      } finally {
        await context.close()
      }
    }
  }
}, 90000)

test('browser history follows pages and reading tabs without invisible stops', async () => {
  const origin = new URL(page.url()).origin

  for (const width of [393, 1280]) {
    const context = await browser.newContext({
      ...(width === 393 ? devices['iPhone 13'] : {}),
      viewport: { width, height: 852 },
      reducedMotion: 'reduce'
    })

    try {
      await context.route('https://**', (route) => route.abort())
      const reader = await context.newPage()

      for (const route of ['/guides/manga/cubari', '/software']) {
        await reader.goto(origin + route)
        await reader.getByRole('button', { name: 'Search', exact: true }).first().click()
        const search = reader.getByRole('searchbox', { name: 'Search', exact: true })
        await search.waitFor()
        await reader.keyboard.press('Escape')
        await search.waitFor({ state: 'hidden' })
      }

      await reader.goBack()
      await reader.waitForURL('**/guides/manga/cubari', { timeout: 5000 })
      const metadata = reader.getByRole('tab', { name: 'Metadata', exact: true })
      const folders = reader.getByRole('tab', { name: 'Files and folders', exact: true })
      await metadata.click()
      await reader.waitForURL('**?t=metadata')
      await reader.reload()
      await reader.waitForFunction(
        () =>
          document
            .querySelector('[role="tab"][data-tab-anchor="metadata"]')
            ?.getAttribute('aria-selected') === 'true'
      )
      await folders.click()
      await reader.waitForURL('**?t=files-and-folders')
      await reader.goBack()
      await reader.waitForURL('**?t=metadata')
      await reader.waitForFunction(
        () =>
          document
            .querySelector('[role="tab"][data-tab-anchor="metadata"]')
            ?.getAttribute('aria-selected') === 'true',
        undefined,
        { timeout: 5000 }
      )
      expect(await metadata.getAttribute('aria-selected')).toBe('true')
      expect(
        await reader.getByText('groups: Uploader Name', { exact: true }).isVisible()
      ).toBe(true)
      await reader.goForward()
      await reader.waitForURL('**?t=files-and-folders')
      await reader.waitForFunction(
        () =>
          document
            .querySelector('[role="tab"][data-tab-anchor="files-and-folders"]')
            ?.getAttribute('aria-selected') === 'true'
      )
      expect(await folders.getAttribute('aria-selected')).toBe('true')

      await reader.keyboard.press('/')
      const search = reader.getByRole('searchbox', { name: 'Search', exact: true })
      await search.waitFor()
      await reader.goBack()
      await search.waitFor({ state: 'hidden' })
      await reader.waitForURL('**?t=metadata')
      await reader.waitForFunction(
        () =>
          document
            .querySelector('[role="tab"][data-tab-anchor="metadata"]')
            ?.getAttribute('aria-selected') === 'true'
      )
      expect(await metadata.getAttribute('aria-selected')).toBe('true')
    } finally {
      await context.close()
    }
  }
}, 90000)
