import type { MarkdownRenderer } from 'vitepress'

function getLineText(state: any, line: number) {
  const startPos = state.bMarks[line] + state.tShift[line]
  const maxPos = state.eMarks[line]
  const lineText = state.src.slice(startPos, maxPos)

  return lineText.replace(/:::\s+steps/, ':::steps')
}

export default function markdownSteps(md: MarkdownRenderer) {
  md.block.ruler.before(
    'paragraph',
    'steps',
    (state, startLine, endLine, silent) => {
      const lineText = getLineText(state, startLine)

      if (!lineText.startsWith(':::steps')) return false

      const titleMatch = lineText.slice(8).trim()
      const hasTitle = titleMatch.length > 0

      if (silent) return true

      let nextLine = startLine + 1
      let openBlocks = 1
      let token

      token = state.push('steps_open', 'div', 1)
      token.block = true
      token.attrs = [['class', 'steps']]

      if (hasTitle) {
        token = state.push('paragraph_open', 'p', 1)
        token.attrs = [['class', 'custom-title']]
        token = state.push('text', '', 0)
        token.content = titleMatch
        token = state.push('paragraph_close', 'p', -1)
      }

      while (nextLine < endLine) {
        const nextLineText = getLineText(state, nextLine)

        if (nextLineText.startsWith(':::')) {
          if (nextLineText === ':::') {
            openBlocks--
            if (openBlocks === 0) break
          } else {
            openBlocks++
          }
        }

        nextLine++
      }

      state.md.block.tokenize(state, startLine + 1, nextLine)

      token = state.push('steps_close', 'div', -1)
      token.block = true

      state.line = nextLine + 1

      return true
    }
  )

  md.renderer.rules.steps_open = () => '<div class="steps">\n'
  md.renderer.rules.steps_close = () => '</div>\n'
}
