declare module 'mark.js/dist/mark.es6.js' {
  import type Mark from 'mark.js'
  const mark: typeof Mark
  export default mark
}

declare const __GIT_COMMIT__: string
declare const __GIT_COMMIT_TS__: number
