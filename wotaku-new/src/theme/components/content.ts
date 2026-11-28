/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { useData, useRoute } from '@/theme/shared/client'
import { defineComponent, h, watch } from 'vue'
import { contentUpdatedCallbacks } from '../shared/runtime/utils'

const runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn())

export const Content = defineComponent({
  name: 'WotakuContent',
  props: {
    as: { type: [Object, String], default: 'div' }
  },
  setup(props) {
    const route = useRoute()
    const { frontmatter, site } = useData()
    watch(frontmatter, runCbs, { deep: true, flush: 'post' })
    return () =>
      h(props.as, site.value.contentProps ?? { style: { position: 'relative' } }, [
        route.component
          ? h(route.component, {
              onVnodeMounted: runCbs,
              onVnodeUpdated: runCbs,
              onVnodeUnmounted: runCbs
            })
          : '404 Page Not Found'
      ])
  }
})
