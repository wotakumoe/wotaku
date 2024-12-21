// Copyright (c) The Tachiyomi Open Source Project
// SPDX-License-Identifier: MPL-2.0

export function simpleLangName(code: string) {
  if (code === 'all') return 'All'

  const namesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' })
  return capitalize(namesInEnglish.of(code)!, 'en')
}

export function langName(code: string) {
  if (code === 'all') return 'All'

  const namesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' })
  const namesInNative = new Intl.DisplayNames([code], { type: 'language' })
  return `${capitalize(namesInEnglish.of(code)!, 'en')} - ${capitalize(namesInNative.of(code)!, code)}`
}

function capitalize(string: string, locale: string) {
  return string.charAt(0).toLocaleUpperCase(locale) + string.substring(1)
}
