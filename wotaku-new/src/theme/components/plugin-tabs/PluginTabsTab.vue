<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed, inject, nextTick, watch } from 'vue'
import { mediumZoomSymbol } from '../../composables/medium-zoom'
import { useIsPrint } from '../../composables/plugin-tabs/use-tabs'
import { useTabsRenderAll, useTabsSingleState } from '../../shared/plugin-tabs/state'

defineOptions({ name: 'PluginTabsTab' })

const props = defineProps<{
  anchor: string
  label: string
}>()

const { selected, uid } = useTabsSingleState()
const isPrint = useIsPrint()
const renderAll = useTabsRenderAll()
const isActive = computed(
  () => selected.value === props.label || Boolean(isPrint.value) || renderAll
)

const zoom = inject(mediumZoomSymbol)
watch(isActive, async (active) => {
  if (active) {
    await nextTick()
    zoom?.refresh()
  }
})
const panelId = computed(() => `panel-${props.anchor}-${uid}`)
const buttonId = computed(() => `tab-${props.anchor}-${uid}`)
</script>

<template>
  <div
    v-if="isActive"
    :id="panelId"
    class="plugin-tabs--content"
    role="tabpanel"
    tabindex="0"
    :data-tab-anchor="anchor"
    :aria-labelledby="buttonId"
    :data-is-print="isPrint || undefined"
  >
    <slot />
  </div>
</template>
