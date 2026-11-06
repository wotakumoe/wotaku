import type { InjectionKey, Ref } from 'vue'

export const DECK_MINI_KEY: InjectionKey<Ref<boolean>> = Symbol(
  'card-deck-mini'
)
