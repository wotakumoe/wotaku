<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { useRouter, withBase } from 'vitepress'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  feedbackOptions,
  type FeedbackType,
  getFeedbackOption
} from '../../types/Feedback'
import { resolvePrompts } from '../../utils/promptConfig'

const props = defineProps<{
  heading?: string
}>()

const sluggify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/(^-+|-+$)/g, '')
    .substring(0, 60)

const getURL = (heading: string) =>
  `https://wotaku.wiki${withBase(router.route.path)}#${sluggify(heading)}`

const router = useRouter()

/**
 * Resolve the prompt pool once on mount.
 * Re-evaluates reactively if the route changes (SPA navigation).
 */
const promptPool = computed(() => resolvePrompts(router.route.path))

function getPrompt(): string {
  const pool = promptPool.value
  return pool[Math.floor(Math.random() * pool.length)]
}

const loading = ref<boolean>(false)
const error = ref<unknown>(null)
const success = ref<boolean>(false)

// Generate or retrieve stable visitor ID from localStorage
function getVisitorId(): string {
  const key = 'wotaku_visitor_id'
  let id = localStorage.getItem(key)
  if (!id || id.length !== 32) {
    id = crypto.randomUUID().replace(/-/g, '').slice(0, 32)
    localStorage.setItem(key, id)
  }
  return id
}

const isDisabled = computed(() => {
  return (
    !feedback.type ||
    !feedback.content.length ||
    feedback.content.length < 5 ||
    feedback.content.length > 2000
  )
})

// prettier-ignore
const feedback = reactive<
  Pick<FeedbackType, 'content' | 'page'> & Partial<Pick<FeedbackType, 'type' | 'name'>>
>({
  page: getURL(props.heading!),
  content: '',
  name: '',
  type: undefined
})

async function handleSubmit() {
  if (!feedback.type) return
  loading.value = true
  success.value = true
  error.value = null

  const body = {
    content: feedback.content,
    type: feedback.type!,
    page: feedback.page,
    visitorId: getVisitorId(),
    ...(props.heading && { heading: props.heading }),
    ...(feedback.name && { name: feedback.name })
  }

  try {
    const response = await fetch('https://wotaku-feedback.duckling.workers.dev/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    if (data.error) {
      success.value = false
      error.value = data.error
    }
  } catch (err) {
    success.value = false
    error.value = err
  } finally {
    loading.value = false
  }
}

const isCardShown = ref<boolean>(false)
const prompt = computed(() => getPrompt())
const toggleCard = () => {
  isCardShown.value = !isCardShown.value
  if (!isCardShown.value && success.value) {
    success.value = false
    feedback.content = ''
    feedback.type = undefined
    error.value = null
  }
}

const typeOpen = ref<boolean>(false)
const typeRootRef = ref<HTMLDivElement>()
const typePlaceholder = {
  label: 'Feedback type',
  icon: undefined as string | undefined,
  value: undefined
} as const
const selectedType = computed(
  () => (feedback.type ? getFeedbackOption(feedback.type) : undefined) ?? typePlaceholder
)

function selectFeedbackType(type: FeedbackType['type']) {
  feedback.type = type
  typeOpen.value = false
}

function onTypeDocClick(e: MouseEvent) {
  if (typeRootRef.value && !typeRootRef.value.contains(e.target as Node)) {
    typeOpen.value = false
  }
}

// Success celebration: floating twemoji, single ~3s burst with random lanes.
// Pick an icon + depth layer here; size/opacity/timing derive from the layer.
type CelebrateLayer = 'front' | 'mid' | 'back'

const CELEBRATE_ICONS: { icon: string; layer: CelebrateLayer }[] = [
  { icon: 'i-twemoji-red-heart', layer: 'front' },
  { icon: 'i-twemoji-growing-heart', layer: 'front' },
  { icon: 'i-twemoji-green-heart', layer: 'front' },
  { icon: 'i-twemoji-yellow-heart', layer: 'mid' },
  { icon: 'i-twemoji-folded-hands', layer: 'mid' },
  { icon: 'i-twemoji-purple-heart', layer: 'mid' },
  { icon: 'i-twemoji-beating-heart', layer: 'mid' },
  { icon: 'i-twemoji-orange-heart', layer: 'back' },
  { icon: 'i-twemoji-blue-heart', layer: 'back' },
  { icon: 'i-twemoji-brown-heart', layer: 'back' },
  { icon: 'i-twemoji-white-heart', layer: 'back' },
  { icon: 'i-twemoji-black-heart', layer: 'back' },
  { icon: 'i-twemoji-sparkling-heart', layer: 'back' },
  { icon: 'i-twemoji-glowing-star', layer: 'back' }
]

const LAYER_STYLE = {
  front: { minSize: 24, maxSize: 30, minOpacity: 0.95, maxOpacity: 1, z: 2, blur: '0px', minDuration: 1.9, maxDuration: 2.1 },
  mid: { minSize: 16, maxSize: 22, minOpacity: 0.8, maxOpacity: 0.9, z: 0, blur: '0px', minDuration: 2, maxDuration: 2.3 },
  back: { minSize: 12, maxSize: 15, minOpacity: 0.4, maxOpacity: 0.55, z: 0, blur: '1px', minDuration: 2.1, maxDuration: 2.3 }
} as const

interface CelebrationParticle {
  icon: string
  left: string
  delay: string
  duration: string
  size: string
  opacity: string
  z: number
  blur: string
}

function makeParticle(
  def: (typeof CELEBRATE_ICONS)[number],
  index: number,
  randomize: boolean
): CelebrationParticle {
  const style = LAYER_STYLE[def.layer]
  const pick = (min: number, max: number) =>
    randomize ? min + Math.random() * (max - min) : (min + max) / 2
  return {
    icon: def.icon,
    left: randomize
      ? `${(2 + Math.random() * 92).toFixed(1)}%`
      : `${(((index + 0.5) / CELEBRATE_ICONS.length) * 100).toFixed(1)}%`,
    delay: `${pick(0, 0.7).toFixed(2)}s`,
    duration: `${pick(style.minDuration, style.maxDuration).toFixed(2)}s`,
    size: `${Math.round(pick(style.minSize, style.maxSize))}px`,
    opacity: `${pick(style.minOpacity, style.maxOpacity).toFixed(2)}`,
    z: style.z,
    blur: style.blur
  }
}

const celebrationIcons = ref<CelebrationParticle[]>(
  CELEBRATE_ICONS.map((def, i) => makeParticle(def, i, false))
)

function rollCelebration() {
  celebrationIcons.value = CELEBRATE_ICONS.map((def, i) => makeParticle(def, i, true))
}

watch(success, (v) => {
  if (v) rollCelebration()
})

onMounted(() => {
  document.addEventListener('click', onTypeDocClick, true)
  if (success.value) rollCelebration()
})
onUnmounted(() => document.removeEventListener('click', onTypeDocClick, true))
</script>

<template>
  <template v-if="props.heading">
    <button
      @click="toggleCard()"
      class="bg-$vp-c-default-soft text-primary border-$vp-c-default-soft hover:border-primary ml-3 inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md border-2 border-solid px-1.5 py-3.5 text-sm font-medium transition-all duration-300 sm:h-6"
      style="vertical-align: middle"
    >
      <span
        :class="isCardShown === false ? `i-lucide:mail` : `i-lucide:mail-x`"
      />
    </button>
  </template>
  <template v-else>
    <button
      class="bg-$vp-c-default-soft text-primary px2 py1 border-$vp-c-default-soft hover:border-primary mt-2 select-none rounded border-2 border-solid font-bold transition-all duration-300"
      @click="toggleCard()"
    >
      <span
        :class="isCardShown === false
        ? `i-lucide:mail mr-2`
        : `i-lucide:mail-x mr-2`"
      />
      <span>Send Feedback</span>
    </button>
  </template>

  <Transition name="fade" mode="out-in">
    <div v-if="isCardShown" class="feedback-wrap">
      <Transition name="fade" mode="out-in">
        <div v-if="!success">
          <textarea
            v-model="feedback.content"
            autofocus
            class="feedback-textarea"
            :placeholder="prompt"
          />

          <div class="feedback-row">
            <input
              v-model="feedback.name"
              maxlength="50"
              class="feedback-name"
              placeholder="Name (optional)"
            />
            <div
              ref="typeRootRef"
              class="fb-type-select"
              :class="{ 'fb-type-select--open': typeOpen }"
            >
              <button
                type="button"
                class="fb-type-trigger"
                :class="{ 'fb-type-trigger--placeholder': !feedback.type }"
                aria-haspopup="listbox"
                :aria-expanded="typeOpen"
                :aria-label="`Feedback type: ${selectedType.label}`"
                @click="typeOpen = !typeOpen"
              >
                <span v-if="selectedType.icon" :class="selectedType.icon" class="fb-type-icon" aria-hidden="true" />
                <span class="fb-type-label">{{ selectedType.label }}</span>
                <span
                  class="fb-type-chevron i-lucide:chevron-down"
                  :class="{ 'fb-type-chevron--open': typeOpen }"
                  aria-hidden="true"
                />
              </button>

              <div v-show="typeOpen" class="fb-type-options" role="listbox">
                <button
                  v-for="item in feedbackOptions"
                  :key="item.value"
                  type="button"
                  role="option"
                  class="fb-type-option"
                  :class="{ 'fb-type-option--selected': feedback.type === item.value }"
                  :aria-selected="feedback.type === item.value"
                  :aria-label="item.label"
                  @click="selectFeedbackType(item.value)"
                >
                  <span :class="item.icon" class="fb-type-icon" aria-hidden="true" />
                  <span class="fb-type-label">{{ item.label }}</span>
                </button>
              </div>
            </div>
            <button
              type="submit"
              class="feedback-send"
              :disabled="isDisabled || loading"
              @click="handleSubmit()"
            >
              {{ loading ? 'Sending...' : 'Send' }}
              <span class="i-lucide:mail-check" />
            </button>
          </div>
          <p v-if="error" class="text-red-400 text-sm mt-1">
            Failed to send: {{ String(error) }}
          </p>
          <div class="tip custom-block mt-2">
            <p class="custom-block-title">README</p>
            <p>
              Read the
              <a href="https://i.wotaku.wiki/p/rules" target="_blank" rel="noopener noreferrer"><strong>RULES</strong></a>
              before submitting URLs. If you want a reply to your feedback,
              feel free to join our
              <a href="https://discord.gg/wZMuSGpZ8s" target="_blank" rel="noopener noreferrer">Discord server.</a>
            </p>
          </div>
        </div>
        <div v-else class="feedback-success">
          <p class="heading">Thanks for your feedback!</p>
          <span
            v-for="(item, i) in celebrationIcons"
            :key="i"
            class="fb-celebrate"
            :class="item.icon"
            aria-hidden="true"
            :style="{
              left: item.left,
              width: item.size,
              height: item.size,
              zIndex: item.z,
              filter: `blur(${item.blur})`,
              '--fb-peak': item.opacity,
              animationDelay: item.delay,
              animationDuration: item.duration
            }"
          />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped lang="css">
.btn {
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  transition: border-color 0.25s, background-color 0.25s;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
  padding: 0.375rem 0.75rem;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
}

.btn:hover {
  border-color: var(--vp-c-brand);
}

.btn-primary {
  color: #fff;
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.btn-primary:hover {
  background-color: var(--vp-c-brand-darker);
  border-color: var(--vp-c-brand-darker);
}

.heading {
  font-size: 1.2rem;
  font-weight: 700;
}

.desc {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.prompt-text {
  display: block;
  font-size: 10px;
  color: var(--vp-c-text-2);
  opacity: 0.75;
}

.feedback-wrap {
  width: 100%;
  margin-top: 1rem;
}

.feedback-textarea,
.feedback-name,
.fb-type-trigger {
  border: 2px solid var(--vp-c-brand-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.feedback-textarea:hover,
.feedback-name:hover,
.fb-type-trigger:hover {
  border-color: var(--vp-c-brand-1);
}

.feedback-textarea:focus,
.feedback-name:focus,
.fb-type-select--open .fb-type-trigger {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.feedback-textarea {
  width: 100%;
  min-height: 160px;
  padding: 0.75rem 0.9rem;
  resize: vertical;
}

.feedback-textarea::placeholder {
  font-size: 14px;
  color: var(--vp-c-text-2);
  opacity: 0.55;
}

.feedback-name::placeholder {
  font-size: 14px;
  color: var(--vp-c-text-2);
  opacity: 0.55;
}

.feedback-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-top: 8px;
  align-items: stretch;
}

@media (max-width: 640px) {
  .feedback-row {
    grid-template-columns: 1fr;
  }
}

.feedback-name {
  width: 100%;
  padding: 0.5rem 0.75rem;
  line-height: 1.4;
}

.fb-type-select {
  position: relative;
  width: 100%;
}

.fb-type-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 0.5rem 0.75rem;
  line-height: 1.4;
  cursor: pointer;
}

.fb-type-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.fb-type-label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fb-type-trigger--placeholder .fb-type-icon,
.fb-type-trigger--placeholder .fb-type-label {
  opacity: 0.55;
}

.fb-type-chevron {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.fb-type-chevron--open {
  transform: rotate(180deg);
}

.fb-type-options {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  padding: 4px;
  border-radius: 12px;
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-2);
}

.fb-type-option {
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

.fb-type-option:hover,
.fb-type-option:focus-visible {
  background-color: var(--vp-c-brand-soft);
  outline: none;
}

.fb-type-option--selected {
  background-color: var(--vp-c-brand-soft);
}

.fb-type-option--selected .fb-type-label {
  font-weight: 600;
}

.feedback-send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 12px;
  background-color: var(--vp-c-brand-1);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  transition: filter 0.25s, opacity 0.25s;
}

:global(html.dark) .feedback-send {
  color: #000;
}

.feedback-send:hover:not(:disabled) {
  filter: brightness(1.1);
}

.feedback-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feedback-success {
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 12px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 120px;
  padding: 1rem;
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
  position: relative;
  overflow: hidden;
}

.feedback-success .heading {
  margin: 0;
  position: relative;
  z-index: 1;
}

.fb-celebrate {
  position: absolute;
  bottom: -28px;
  opacity: 0;
  pointer-events: none;
  animation-name: fb-float-up;
  animation-timing-function: linear;
  animation-iteration-count: 1;
}

@keyframes fb-float-up {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  15% {
    opacity: var(--fb-peak, 0.9);
  }
  70% {
    opacity: var(--fb-peak, 0.9);
  }
  100% {
    transform: translateY(-160px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fb-celebrate {
    animation: none;
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>