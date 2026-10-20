<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  ensureDisabledPagesLoaded,
  isGroupDisabled,
  randomPageGroups,
  toggleGroup
} from '../../randomLinksState'
import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'
import SettingsSelect from './SettingsSelect.vue'

const ICON_PREFIXES =
  /^(lucide|mdi|ic|mingcute|material-symbols|simple-icons|uil|octicon|logos|akar-icons|map|bi|streamline-logos|streamline-ultimate|streamline-sharp|iconoir)-/

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

ensureDisabledPagesLoaded()

const rows = computed(() =>
  randomPageGroups.map((group) => ({
    group,
    disabled: isGroupDisabled(group),
    iconClass: iconClass(group.icon)
  }))
)

function iconClass(icon: string) {
  const name = icon.match(/^:(.+):$/)?.[1]
  if (!name) return 'i-lucide:file-text'
  return ICON_PREFIXES.test(name) ? `i-${name}` : `i-twemoji-${name}`
}
</script>

<template>
  <div class="random-links" space-y-2>
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle title="Random links" aria-label="Random links" flex="1" pr-4>
        <template #icon>
          <span i-lucide:dice-5 mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Random links</h4>
        <p text="sm" mb-2 max-w-100>
          Choose which pages the navbar dice picks links from.
        </p>
      </MenuHelp>
    </div>

    <SettingsSelect
      label="Select pages"
      aria-label="Pages included in random links"
      :active="isMenuHelpPoppedUp"
    >
      <button
        v-for="row in rows"
        :key="row.group.key"
        type="button"
        class="settings-select-row"
        :class="{ 'is-disabled': row.disabled }"
        :aria-pressed="!row.disabled"
        :title="`${row.disabled ? 'Enable' : 'Disable'} ${row.group.title}`"
        @click="toggleGroup(row.group)"
      >
        <span
          :class="row.iconClass"
          class="settings-select-row-icon"
          aria-hidden="true"
        />
        <span class="settings-select-row-title">{{ row.group.title }}</span>
        <span
          class="settings-select-row-eye"
          :class="row.disabled ? 'i-lucide:eye-off' : 'i-lucide:eye'"
          aria-hidden="true"
        />
      </button>
    </SettingsSelect>
  </div>
</template>
