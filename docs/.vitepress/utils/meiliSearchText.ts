const EXACT_TOKEN_PREFIX = 'l'
const EXACT_TOKEN_SEPARATOR = 'x'

function getSearchTokens(value: string) {
  return value
    .toLowerCase()
    .match(/[\p{L}\p{N}]+/gu) ?? []
}

function encodeExactToken(token: string) {
  return [
    EXACT_TOKEN_PREFIX,
    Array.from(token).length,
    EXACT_TOKEN_SEPARATOR,
    token
  ].join('')
}

export function toExactSearchText(...values: (string | string[])[]) {
  return values
    .flat()
    .flatMap(getSearchTokens)
    .map(encodeExactToken)
    .join(' ')
}
