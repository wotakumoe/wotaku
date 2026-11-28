/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'
import Authors from '../components/Authors.vue'
import Block from '../components/Block.vue'
import Collapsible from '../components/Collapsible.vue'
import CrossAppSupport from '../components/cross-app-support/CrossAppSupport.vue'
import Fb from '../components/Fb.vue'
import Feedback from '../components/Feedback.vue'
import Highlight from '../components/Highlight.vue'
import LibrarySize from '../components/LibrarySize.vue'
import LinkInline from '../components/LinkInline.vue'
import MirrorTooltip from '../components/MirrorTooltip.vue'
import ScrapeTable from '../components/ScrapeTable.vue'
import Tooltip from '../components/Tooltip.vue'

const ExtensionRepos = defineAsyncComponent(() =>
  import('../components/extension-repos/index').then((m) => m.ExtensionRepos)
)

const ThemeRepos = defineAsyncComponent(() =>
  import('../components/theme-repos/index').then((m) => m.ThemeRepos)
)

export function registerGlobalComponents(app: App) {
  app.component('LinkInline', LinkInline)
  app.component('hl', Highlight)
  app.component('Block', Block)
  app.component('Authors', Authors)
  app.component('Tooltip', Tooltip)
  app.component('MirrorTooltip', MirrorTooltip)
  app.component('LibrarySize', LibrarySize)
  app.component('Feedback', Feedback)
  app.component('fb', Fb)
  app.component('Collapsible', Collapsible)
  app.component('ScrapeTable', ScrapeTable)
  app.component('CrossAppSupport', CrossAppSupport)
  app.component('ExtensionRepos', ExtensionRepos)
  app.component('ThemeRepos', ThemeRepos)
}
