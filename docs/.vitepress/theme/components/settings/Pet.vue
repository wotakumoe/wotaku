<script setup lang="ts">
import {
  NuInputHighlight,
  NuInputHorizontalRadioGroup,
  NuVerticalTransition
} from '@nolebase/ui'
import { useStorage } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { PetCharacterStorageKey, PetStorageKey } from '../../constants'
import {
  defaultPetKey,
  petCharacters,
  spriteIconStyle,
  type PetCharacter
} from '../../pets'
import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const petEnabled = useStorage(PetStorageKey, false)
const petCharacter = useStorage(PetCharacterStorageKey, defaultPetKey)

const open = ref(false)
const rootRef = ref<HTMLDivElement>()

// Drives the animated sprite previews (e.g. Oneko's two-frame sleep).
const frameTick = ref(0)
let frameTimer: ReturnType<typeof setInterval> | null = null

const selectedOption = computed(
  () =>
    petCharacters.find((o) => o.key === petCharacter.value) ?? petCharacters[0]
)

function iconStyle(option: PetCharacter) {
  return option.icon.type === 'sprite'
    ? spriteIconStyle(option.icon, 24, frameTick.value)
    : undefined
}

function select(key: string) {
  petCharacter.value = key
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

const fieldOptions = computed(() => [
  {
    value: true,
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Pet Toggle Switch'
  },
  {
    value: false,
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Pet Toggle Switch'
  }
])

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  frameTimer = setInterval(() => {
    frameTick.value += 1
  }, 400)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  if (frameTimer) clearInterval(frameTimer)
})
</script>

<template>
  <div ref="rootRef" space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle title="Pet" aria-label="Pet" flex="1" pr-4>
        <template #icon>
          <span i-lucide:cat mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Pet</h4>
        <p text="sm" mb-2 max-w-100>
          <span>Gives you a cute companion that follows your cursor. Pick your
            favorite character.</span>
        </p>
      </MenuHelp>
    </div>

    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="petEnabled"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        :options="fieldOptions"
      />
    </NuInputHighlight>

    <NuVerticalTransition :duration="200">
      <div v-show="petEnabled" class="pet-select" :class="{ 'pet-select--open': open }">
        <button
          type="button"
          class="pet-trigger"
          aria-haspopup="listbox"
          :aria-expanded="open"
          :aria-label="`Pet: ${selectedOption.label}`"
          @click="open = !open"
        >
          <span
            v-if="selectedOption.icon.type === 'image'"
            class="pet-icon"
          >
            <img :src="selectedOption.icon.src" :alt="selectedOption.label" />
          </span>
          <span v-else class="pet-icon" :style="iconStyle(selectedOption)" />
          <span class="pet-label">{{ selectedOption.label }}</span>
          <span
            class="pet-chevron i-lucide:chevron-down"
            :class="{ 'pet-chevron--open': open }"
            aria-hidden="true"
          />
        </button>

        <NuVerticalTransition :duration="200">
          <div v-show="open" class="pet-options" role="listbox">
            <button
              v-for="option in petCharacters"
              :key="option.key"
              type="button"
              role="option"
              class="pet-btn"
              :class="{ 'pet-btn--selected': petCharacter === option.key }"
              :aria-selected="petCharacter === option.key"
              :aria-label="option.label"
              @click="select(option.key)"
            >
              <span v-if="option.icon.type === 'image'" class="pet-icon">
                <img :src="option.icon.src" :alt="option.label" />
              </span>
              <span v-else class="pet-icon" :style="iconStyle(option)" />
              <span class="pet-label">{{ option.label }}</span>
            </button>
          </div>
        </NuVerticalTransition>
      </div>
    </NuVerticalTransition>
  </div>
</template>

<style scoped>
.pet-select {
  position: relative;
}

.pet-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 2px solid var(--vp-c-divider);
  background: var(--wk-c-menu-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.pet-trigger:hover {
  border-color: var(--vp-c-brand-1);
}

.pet-select--open .pet-trigger {
  border-color: var(--vp-c-brand-1);
}

.pet-chevron {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.pet-chevron--open {
  transform: rotate(180deg);
}

.pet-options {
  margin-top: 6px;
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-2);
}

.pet-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--vp-c-text-1);
  font-size: 13px;
  width: 100%;
  transition: background-color 0.15s;
}

.pet-btn:hover {
  background-color: var(--vp-c-bg-soft);
}

.pet-btn--selected {
  background-color: var(--vp-c-brand-soft);
}

.pet-btn--selected .pet-label {
  font-weight: 600;
}

.pet-btn--selected:hover {
  background-color: var(--vp-c-brand-soft);
}

.pet-label {
  flex: 1;
  text-align: left;
}

.pet-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pet-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
