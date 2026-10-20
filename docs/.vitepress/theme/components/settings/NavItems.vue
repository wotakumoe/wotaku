<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  ensureNavItemsLoaded,
  isNavItemEnabled,
  toggleNavItem
} from '../../navItemsState'
import type { NavItemKey } from '../../navItemsState'
import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'
import SettingsSelect from './SettingsSelect.vue'

const items: Array<{ key: NavItemKey; title: string; icon: string }> = [
  { key: 'bookmarks', title: 'Bookmarks', icon: 'i-lucide:bookmark' },
  { key: 'random', title: 'Random links', icon: 'i-lucide:dice-5' },
  { key: 'announcements', title: 'Announcements', icon: 'i-lucide:megaphone' },
  { key: 'social', title: 'External links', icon: 'i-lucide:link' }
]

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

ensureNavItemsLoaded()

const rows = computed(() =>
  items.map((item) => ({ ...item, enabled: isNavItemEnabled(item.key) }))
)
</script>

<template>
  <div class="nav-items" space-y-2>
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle title="Menu items" aria-label="Menu items" flex="1" pr-4>
        <template #icon>
          <span i-lucide:panel-top mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Menu items</h4>
        <p text="sm" mb-2 max-w-100>
          Choose which actions appear in the navbar.
        </p>
      </MenuHelp>
    </div>

    <SettingsSelect
      label="Select items"
      aria-label="Navbar items"
      :active="isMenuHelpPoppedUp"
    >
      <button
        v-for="item in rows"
        :key="item.key"
        type="button"
        class="settings-select-row"
        :class="{ 'is-disabled': !item.enabled }"
        :aria-pressed="item.enabled"
        :title="`${item.enabled ? 'Disable' : 'Enable'} ${item.title}`"
        @click="toggleNavItem(item.key)"
      >
        <span
          :class="item.icon"
          class="settings-select-row-icon"
          aria-hidden="true"
        />
        <span class="settings-select-row-title">{{ item.title }}</span>
        <span
          class="settings-select-row-eye"
          :class="item.enabled ? 'i-lucide:eye' : 'i-lucide:eye-off'"
          aria-hidden="true"
        />
      </button>
    </SettingsSelect>
  </div>
</template>
