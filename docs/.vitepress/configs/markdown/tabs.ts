import type { MarkdownRenderer } from 'vitepress'
import { getUniqueAnchor, parseTabLabel } from '../../utils/tabAnchors'

function containerPlugin(md: MarkdownRenderer, name: string, options: any) {
  function validateDefault(params: string) {
    return params.trim().split(' ', 2)[0] === name
  }

  function renderDefault(
    tokens: any[],
    idx: number,
    opts: any,
    env: any,
    slf: any
  ) {
    if (tokens[idx].nesting === 1) tokens[idx].attrJoin('class', name)
    return slf.renderToken(tokens, idx, opts, env, slf)
  }

  const minMarkers = 3
  const markerStr = options.marker || ':'
  const markerChar = markerStr.charCodeAt(0)
  const markerLen = markerStr.length
  const validate = options.validate || validateDefault
  const render = options.render || renderDefault

  function container(
    state: any,
    startLine: number,
    endLine: number,
    silent: boolean
  ) {
    let pos
    let autoClosed = false
    let start = state.bMarks[startLine] + state.tShift[startLine]
    let max = state.eMarks[startLine]

    if (markerChar !== state.src.charCodeAt(start)) return false

    for (pos = start + 1; pos <= max; pos++) {
      if (markerStr[(pos - start) % markerLen] !== state.src[pos]) break
    }

    const markerCount = Math.floor((pos - start) / markerLen)
    if (markerCount < minMarkers) return false

    pos -= (pos - start) % markerLen
    const markup = state.src.slice(start, pos)
    const params = state.src.slice(pos, max)

    if (!validate(params, markup)) return false
    if (silent) return true

    let nextLine = startLine
    for (;;) {
      nextLine++
      if (nextLine >= endLine) break

      start = state.bMarks[nextLine] + state.tShift[nextLine]
      max = state.eMarks[nextLine]

      if (start < max && state.sCount[nextLine] < state.blkIndent) break
      if (markerChar !== state.src.charCodeAt(start)) continue
      if (state.sCount[nextLine] - state.blkIndent >= 4) continue

      for (pos = start + 1; pos <= max; pos++) {
        if (markerStr[(pos - start) % markerLen] !== state.src[pos]) break
      }
      if (Math.floor((pos - start) / markerLen) < markerCount) continue

      pos -= (pos - start) % markerLen
      pos = state.skipSpaces(pos)
      if (pos < max) continue

      autoClosed = true
      break
    }

    const oldParent = state.parentType
    const oldLineMax = state.lineMax

    state.parentType = 'container'
    state.lineMax = nextLine

    const tokenOpen = state.push(`container_${name}_open`, 'div', 1)
    tokenOpen.markup = markup
    tokenOpen.block = true
    tokenOpen.info = params
    tokenOpen.map = [startLine, nextLine]

    state.md.block.tokenize(state, startLine + 1, nextLine)

    const tokenClose = state.push(`container_${name}_close`, 'div', -1)
    tokenClose.markup = state.src.slice(start, pos)
    tokenClose.block = true

    state.parentType = oldParent
    state.lineMax = oldLineMax
    state.line = nextLine + (autoClosed ? 1 : 0)

    return true
  }

  md.block.ruler.before('fence', `container_${name}`, container, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules[`container_${name}_open`] = render
  md.renderer.rules[`container_${name}_close`] = render
}

const tabMarkerCode = '='.charCodeAt(0)
const minTabMarkerLen = 2

const ruleBlockTab = (
  state: any,
  startLine: number,
  endLine: number,
  silent: boolean
) => {
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]

  if (state.parentType !== 'container') return false
  if (pos + minTabMarkerLen > max) return false

  const marker = state.src.charCodeAt(pos)
  if (marker !== tabMarkerCode) return false

  const mem = pos
  pos = state.skipChars(pos + 1, marker)
  const tabMarkerLen = pos - mem
  if (tabMarkerLen < minTabMarkerLen - 1) return false
  if (silent) return true

  let nextLine = startLine
  let endStart = mem
  let endPos = pos

  for (;;) {
    nextLine++
    if (nextLine >= endLine) break

    endStart = state.bMarks[nextLine] + state.tShift[nextLine]
    const lineMax = state.eMarks[nextLine]

    if (endStart < lineMax && state.sCount[nextLine] < state.blkIndent) break
    if (state.src.charCodeAt(endStart) !== tabMarkerCode) continue

    const p = state.skipChars(endStart + 1, marker)
    if (p - endStart !== tabMarkerLen) continue

    endPos = p
    break
  }

  const oldParent = state.parentType
  const oldLineMax = state.lineMax

  state.parentType = 'tab'
  state.lineMax = nextLine

  const startToken = state.push('tab_open', 'div', 1)
  startToken.markup = state.src.slice(mem, pos)
  startToken.block = true
  startToken.info = state.src.slice(pos, max).trimStart()
  startToken.map = [startLine, nextLine - 1]

  state.md.block.tokenize(state, startLine + 1, nextLine)

  const endToken = state.push('tab_close', 'div', -1)
  endToken.markup = state.src.slice(endStart, endPos)
  endToken.block = true

  state.parentType = oldParent
  state.lineMax = oldLineMax
  state.line = nextLine

  return true
}

function parseTabsParams(input: string) {
  return { shareStateKey: input.match(/key:(\S+)/)?.[1] }
}

function getTabAnchorCounts(env: any) {
  env.__tabAnchorCounts ??= new Map<string, number>()
  return env.__tabAnchorCounts as Map<string, number>
}

export function tabsMarkdownPlugin(md: MarkdownRenderer) {
  containerPlugin(md, 'tabs', {
    render(tokens: any[], index: number) {
      const token = tokens[index]
      if (token.nesting !== 1) return '</PluginTabs>\n'

      const params = parseTabsParams(token.info)
      const sharedState = params.shareStateKey
        ? ` sharedStateKey="${md.utils.escapeHtml(params.shareStateKey)}"`
        : ''
      return `<PluginTabs${sharedState}>\n`
    }
  })

  md.block.ruler.after('container_tabs', 'tab', ruleBlockTab)

  md.renderer.rules.tab_open = (tokens, index, _options, env) => {
    const parsed = parseTabLabel(tokens[index].info)
    const anchor = parsed.anchor ||
      getUniqueAnchor(parsed.label, getTabAnchorCounts(env))

    return `<PluginTabsTab label="${
      md.utils.escapeHtml(parsed.label)
    }" anchor="${md.utils.escapeHtml(anchor)}">\n`
  }
  md.renderer.rules.tab_close = () => '</PluginTabsTab>\n'
}
