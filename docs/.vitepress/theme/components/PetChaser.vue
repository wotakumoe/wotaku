<script setup lang="ts">
import { useStorage } from '@vueuse/core'

import { PetCharacterStorageKey, PetStorageKey } from '../constants'
import { defaultPetKey, petCharacters } from '../pets'
import FollowChaser from './FollowChaser.vue'
import OnekoChaser from './OnekoChaser.vue'

const petEnabled = useStorage(PetStorageKey, false)
const petCharacter = useStorage(PetCharacterStorageKey, defaultPetKey)

const chaserCharacters = petCharacters.filter((c) => c.behavior === 'chaser')

function isActive(key: string) {
  return petEnabled.value && petCharacter.value === key
}
</script>

<template>
  <FollowChaser
    v-for="c in chaserCharacters"
    :key="c.key"
    :active="isActive(c.key)"
    :src="c.src!"
    :alt="c.label"
  />
  <OnekoChaser :active="isActive('oneko')" />
</template>
