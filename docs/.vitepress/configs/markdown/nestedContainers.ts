import type { MarkdownRenderer } from 'vitepress'

const MARKER = ':'
const MIN_MARKERS = 3

const NESTABLE_CONTAINER_NAMES = new Set([
  'tabs',
  'tip',
  'info',
  'warning',
  'danger',
  'details',
  'scrapetable',
  'steps',
  'left',
  'center',
  'right',
  'justify',
  'v-pre',
  'raw',
  'code-group'
])

const OVERRIDDEN_CONTAINER_NAMES = [
  'tabs',
  'tip',
  'info',
  'warning',
  'danger',
  'details',
  'left',
  'center',
  'right',
  'justify',
  'v-pre',
  'raw',
  'code-group'
]

function parseColonFence(state: any, line: number) {
  let pos = state.bMarks[line] + state.tShift[line]
  const max = state.eMarks[line]

  if (state.src[pos] !== MARKER) return null

  const start = pos
  while (pos < max && state.src[pos] === MARKER) pos++

  const markerCount = pos - start
  if (markerCount < MIN_MARKERS) return null

  const markup = state.src.slice(start, pos)
  const params = state.src.slice(pos, max)
  const trimmedParams = params.trim()
  const name = trimmedParams.match(/^([A-Za-z][\w-]*)\b/)?.[1]?.toLowerCase()

  return { markerCount, markup, name, params, trimmedParams }
}

function isFenceClose(fence: ReturnType<typeof parseColonFence>) {
  return fence !== null && fence.trimmedParams === ''
}

function isNestableFenceOpen(fence: ReturnType<typeof parseColonFence>) {
  return fence !== null &&
    fence.name !== undefined &&
    NESTABLE_CONTAINER_NAMES.has(fence.name)
}

function createNestedContainerRule(name: string) {
  return (state: any, startLine: number, endLine: number, silent: boolean) => {
    const openingFence = parseColonFence(state, startLine)
    if (!openingFence) return false

    const paramsName = openingFence.trimmedParams
      .split(/\s+/, 1)[0]
      ?.toLowerCase()
    if (paramsName !== name) return false

    if (silent) return true

    let nextLine = startLine
    let autoClosed = false
    const markerStack = [openingFence.markerCount]

    for (;;) {
      nextLine++
      if (nextLine >= endLine) break

      const start = state.bMarks[nextLine] + state.tShift[nextLine]
      const max = state.eMarks[nextLine]

      if (start < max && state.sCount[nextLine] < state.blkIndent) break
      if (state.sCount[nextLine] - state.blkIndent >= 4) continue

      const fence = parseColonFence(state, nextLine)
      if (!fence) continue

      if (isFenceClose(fence)) {
        const currentMarkerCount = markerStack[markerStack.length - 1]
        if (fence.markerCount < currentMarkerCount) continue

        markerStack.pop()
        if (markerStack.length === 0) {
          autoClosed = true
          break
        }
        continue
      }

      if (isNestableFenceOpen(fence)) markerStack.push(fence.markerCount)
    }

    const oldParent = state.parentType
    const oldLineMax = state.lineMax

    state.parentType = 'container'
    state.lineMax = nextLine

    const tokenOpen = state.push(`container_${name}_open`, 'div', 1)
    tokenOpen.markup = openingFence.markup
    tokenOpen.block = true
    tokenOpen.info = openingFence.params
    tokenOpen.map = [startLine, nextLine]

    state.md.block.tokenize(state, startLine + 1, nextLine)

    const tokenClose = state.push(`container_${name}_close`, 'div', -1)
    tokenClose.markup = autoClosed
      ? parseColonFence(state, nextLine)?.markup ?? openingFence.markup
      : openingFence.markup
    tokenClose.block = true

    state.parentType = oldParent
    state.lineMax = oldLineMax
    state.line = nextLine + (autoClosed ? 1 : 0)

    return true
  }
}

export function nestedContainersPlugin(md: MarkdownRenderer) {
  for (const name of OVERRIDDEN_CONTAINER_NAMES) {
    try {
      md.block.ruler.at(`container_${name}`, createNestedContainerRule(name), {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
      })
    } catch {
      // Some containers are provided by optional plugins. Skip the ones that
      // are not registered in the current markdown-it instance.
    }
  }
}
