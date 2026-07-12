<script setup lang="ts">
import { NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { computed } from 'vue'
import MenuTitle from './MenuTitle.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const options = [
  { value: 'on', title: 'On', ariaLabel: 'On', text: 'ON', name: 'ShowBroken' },
  { value: 'off', title: 'Off', ariaLabel: 'Off', text: 'OFF', name: 'ShowBroken' }
]

const showBroken = computed({
  get: () => props.modelValue ? 'on' : 'off',
  set: (value: string) => emit('update:modelValue', value === 'on')
})
</script>

<template>
  <div class="ext-broken" role="radiogroup">
    <MenuTitle icon="i-lucide:unlink" title="Show broken urls" />
    <NuInputHorizontalRadioGroup
      v-model="showBroken"
      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      :options="options"
    />
  </div>
</template>
