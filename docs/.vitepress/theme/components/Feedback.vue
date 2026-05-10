<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { useRouter, withBase } from 'vitepress'
import { computed, reactive, ref } from 'vue'
import {
  feedbackOptions,
  type FeedbackType,
  getFeedbackOption
} from '../../types/Feedback'

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

const prompts = [
  "Tips: Starring our GitHub repo increases the chances of your feedback being accepted twofold.",
  "Tips: Keep your feedback precise.",
  "Tips: Don't ask us questions as we can't really answer you here, join our Discord instead.",
  "Tips: If you are submitting a scraper site, mention all the sources.",
  "Tips: English, motherf**ker, do you speak it?!",
  "Fun fact: We don't maintain any extension repos, complaining to us won't solve your issue.",
  "Fun fact: We can't really add or fix any type of extensions.",
  "Fun fact: Meme is evil and has almost taken over the wiki.",
  "Fun fact: Bloat ≠ quality.",
  "Damn! We got a visitor!"
]

function getPrompt() {
  return prompts[Math.floor(Math.random() * prompts.length)]
}

const loading = ref<boolean>(false)
const error = ref<unknown>(null)
const success = ref<boolean>(false)

const isDisabled = computed(() => {
  return (
    !feedback.message.length ||
    feedback.message.length < 5 ||
    feedback.message.length > 1000
  )
})

const router = useRouter()
// prettier-ignore
const feedback = reactive<
  Pick<FeedbackType, 'message' | 'page'> & Partial<Pick<FeedbackType, 'type'>>
>({
  page: getURL(props.heading!),
  message: ''
})

const selectedOption = ref(feedbackOptions[0])

async function handleSubmit(type?: FeedbackType['type']) {
  if (type) {
    feedback.type = type
    selectedOption.value = getFeedbackOption(type)!
  }
  loading.value = true

  const body: FeedbackType = {
    message: feedback.message,
    type: feedback.type!,
    page: feedback.page,
    ...(props.heading && { heading: props.heading })
  }

  try {
    const response = await fetch('https://wotaku.tasky.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    if (data.error) {
      error.value = data.error
      return
    }
    if (data.status === 'ok') {
      success.value = true
    }
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
}

const isCardShown = ref<boolean>(false)
const helpfulText = props.heading
  ? 'What do you think about this section?'
  : 'What do you think about this page?'
const prompt = computed(() => getPrompt())
const toggleCard = () => (isCardShown.value = !isCardShown.value)
</script>

<template>
  <template v-if="props.heading">
    <button
      @click="toggleCard()"
      class="bg-$vp-c-default-soft text-primary border-$vp-c-default-soft hover:border-primary ml-3 inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md border-2 border-solid px-1.5 py-3.5 text-sm font-medium transition-all duration-300 sm:h-6"
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
    <div
      v-if="isCardShown"
      class="border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 m-[2rem 0] mt-4 border-2 border-solid px-6 pt-3 pb-6"
    >
      <Transition name="fade" mode="out-in">
        <div v-if="!feedback.type">
          <p class="heading">
            {{ helpfulText }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in feedbackOptions"
              :key="item.value"
              class="bg-bg border-$vp-c-default-soft hover:border-primary mt-2 select-none rounded border-2 border-solid font-bold transition-all duration-250 rounded-lg text-[14px] font-500 leading-normal m-0 px-3 py-1.5 text-center align-middle whitespace-nowrap"
              @click="handleSubmit(item.value)"
            >
              <span :class="[item.icon, 'mr-1 inline-block align-middle']" />
              <span class="align-middle">{{ item.label }}</span>
            </button>
          </div>
        </div>
        <div v-else-if="feedback.type && !success" class="pt-2">
          <div class="mb-3">
            <span class="text-[22px] font-bold flex items-center gap-2">
              <span :class="getFeedbackOption(feedback.type)?.icon" />
              {{ getFeedbackOption(feedback.type)?.label }}
            </span>
          </div>

          <div v-if="feedback.type === 'submit'" class="mb-2 text-sm">
            <details>
              <summary class="flex items-center gap-1">
                <span class="i-lucide-arrow-right arrow-right" />
                <span class="i-lucide-arrow-down arrow-down" />
                <span class="i-lucide-shield-x bg-cerise-400" />
                Things we won't add in the wiki
              </summary>
              <ol>
                <li>
                  Websites that are only or primarily for generative AI
                  (Chatbot, roleplaying bot, ai art generator etc.)
                </li>
                <li>
                  Sites that
                  <ul>
                    <li>imitate other websites</li>
                    <li>have very small libraries</li>
                    <li>only feature MTL'd works</li>
                    <li>are mostly paywalled</li>
                    <li>sell unofficial merch</li>
                    <li>exlusively sell sex toys</li>
                  </ul>
                </li>
                <li>Adult content sites similar to OnlyFans</li>
                <li>
                  Software that's too general (for example Windows OS related or
                  Tweaking for privacy)
                </li>
                <li>Sites focused on lolicon or furry stuff</li>
                <li>
                  Sites scraping only a couple popular sources
                </li>
                <li>
                  Sites scraping the servers of other scrapers
                </li>
                <li>
                  Sites found in the Unsafe lists of
                  <a
                    href="https://privateers.wiki/unsafe"
                    class="text-primary text-underline font-semibold"
                  >
                    Privateersclub
                  </a>
                  and/or
                  <a
                    href="https://rentry.org/pgames#untrusted-sites"
                    class="text-primary text-underline font-semibold"
                  >
                    r/PiratedGames
                  </a>
                  .
                </li>
              </ol>
            </details>
            <details>
              <summary class="flex items-center gap-1">
                <span class="i-lucide-arrow-right arrow-right" />
                <span class="i-lucide-arrow-down arrow-down" />
                <span class="i-lucide-shield-alert bg-yellow-400" />
                Things we will try to avoid
              </summary>
              <ol>
                <li>Closed source software (with good FOSS alternatives)</li>
                <li>
                  Sites that only use hosters such Katfile, Nitroflare,
                  DDownload and Rapidgator
                </li>
                <li>
                  Sites that aren't primarily for anime but have it as a side
                  product
                </li>
                <li>Things that are too niche and/or have a small userbase</li>
              </ol>
            </details>
          </div>
          <textarea
            v-model="feedback.message"
            autofocus
            class="feedback-textarea bg-$vp-c-bg-alt text-$vp-c-text-2 w-full h-[100px] border border-$vp-c-divider rounded px-3 py-1.5 border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 border-2 border-solid"
            :placeholder="prompt"
          />
          <p class="desc mb-2">
            If you want a reply to your feedback, feel free to mention a contact
            in the message or join our
            <a
              class="text-primary text-underline font-semibold"
              href="https://discord.gg/wZMuSGpZ8s"
            >
              Discord.
            </a>
          </p>
          <div class="flex flex-row gap-2">
            <button
              class="bg-$vp-c-default-soft text-primary border-$vp-c-default-soft inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md border-2 border-solid px-1.5 py-3.5 text-sm font-medium transition-all duration-300 sm:h-6"
              @click="feedback.type = undefined"
            >
              <span class="i-lucide:arrow-left-from-line">close</span>
            </button>
            <button
              type="submit"
              style="background-color: #438afe; border-color: #438afe;" class="border rounded-lg transition-colors duration-250 inline-flex items-center gap-1 text-14px font-500 leading-1.5 px-3 py-1.5 text-center align-middle whitespace-nowrap disabled:opacity-50 text-white hover:brightness-110 disabled:opacity-50"
              :disabled="isDisabled"
              @click="handleSubmit()"
            >
              Send Feedback <span class="i-lucide:mail-check" />
            </button>
          </div>
        </div>
        <div v-else>
          <p class="heading">Thanks for your feedback!</p>
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

.feedback-textarea {
  font-size: 14px;
}

.feedback-textarea::placeholder {
  font-size: 12px;
}

details summary {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  list-style: none;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary .arrow-right {
  display: inline-block;
  flex-shrink: 0;
}

details summary .arrow-down {
  display: none;
  flex-shrink: 0;
}

details[open] summary .arrow-right {
  display: none;
}

details[open] summary .arrow-down {
  display: inline-block;
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