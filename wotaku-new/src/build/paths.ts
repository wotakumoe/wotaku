/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { resolve } from 'node:path'

export const repositoryRoot = resolve(import.meta.dirname, '../..')
export const contentRoot = resolve(repositoryRoot, 'src/content')
export const pagesRoot = resolve(contentRoot, 'pages')
export const markdownRoot = resolve(repositoryRoot, 'src/build/markdown')
export const dataRoot = resolve(repositoryRoot, 'src/build/data')
