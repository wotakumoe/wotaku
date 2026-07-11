<script setup lang="ts">
import { NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { computed } from 'vue'
import MenuTitle from './MenuTitle.vue'
import type { RatingFilter } from './types'

const props = defineProps<{
  modelValue: RatingFilter
  hasSuggestive: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RatingFilter]
}>()

const options = computed(() => {
  const base = [
    { value: 'all', title: 'All', ariaLabel: 'All', text: 'All', name: 'Rating' },
    { value: 'safe', title: 'Safe', ariaLabel: 'Safe', text: 'Safe', name: 'Rating' }
  ]
  if (props.hasSuggestive) {
    base.push({ value: 'suggestive', title: 'Mature', ariaLabel: 'Mature', text: 'Mature', name: 'Rating' })
  }
  base.push({
    value: 'nsfw',
    title: props.hasSuggestive ? 'Adult' : 'NSFW',
    ariaLabel: 'NSFW',
    text: props.hasSuggestive ? 'Adult' : 'NSFW',
    name: 'Rating'
  })
  return base
})

const rating = computed({
  get: () => props.modelValue,
  set: (value: RatingFilter) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="ext-rating" role="radiogroup">
    <MenuTitle icon="i-lucide:shield" title="Rating" />
    <NuInputHorizontalRadioGroup
      v-model="rating"
      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      :options="options"
    />
  </div>
</template>
