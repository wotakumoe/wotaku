import { type ExtensionRepoData, loadScheme } from './shared'

export declare const data: ExtensionRepoData

export default {
  watch: ['../../**/*.md'],
  async load(): Promise<ExtensionRepoData> {
    return loadScheme('aidoku')
  }
}
