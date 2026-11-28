/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { type ExtensionRepoData, loadScheme } from './loader.ts'

export declare const data: ExtensionRepoData

export default {
  watch: ['../../../content/pages/**/*.md'],
  async load(): Promise<ExtensionRepoData> {
    return loadScheme('shosetsu')
  }
}
