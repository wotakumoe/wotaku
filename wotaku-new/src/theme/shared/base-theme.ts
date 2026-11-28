/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import '../styles/base/fonts.css'
import '../styles/base/vars.css'
import '../styles/base/base.css'
import '../styles/base/icons.css'
import '../styles/base/utils.css'
import '../styles/base/components/custom-block.css'
import '../styles/base/components/wotaku-code.css'
import '../styles/base/components/wotaku-code-group.css'
import '../styles/base/components/wotaku-doc.css'

import type { Theme } from './runtime/theme'
import Badge from '../components/badge/Badge.vue'
import Layout from '../components/layout/BaseLayout.vue'

export default {
  Layout,
  enhanceApp: ({ app }) => {
    app.component('Badge', Badge)
  }
} satisfies Theme
