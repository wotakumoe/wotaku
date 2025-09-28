<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import {
  feedbackOptions,
  type FeedbackType,
  getFeedbackOption
} from '../../types/Feedback'
import { useRouter, withBase } from 'vitepress'

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
  'Make it count!',
  'Leave some feedback for us!',
  `We're all ears 🐰`,
  'Tell us what is missing in Wotaku',
  'Your thoughts matter to us 💡',
  'Feedback is a gift 🎁',
  'What do you think?',
  'We appreciate your support 🙏',
  'We need your help 👋',
  'Your feedback is valuable 💯',
  'So... what do you think?',
  "I guess you don't need to say anything 😉",
  'Spill the beans 💣',
  "We're always looking for ways to improve!.",
  'aliens are watching you 👽',
  'tasky was here 👀',
  'The internet is full of crap 😱'
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
  Pick<FeedbackType, "message" | "page"> & Partial<Pick<FeedbackType, "type">>
>({
  page: getURL(props.heading!),
  message: "",
});

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
const helpfulDescription = props.heading
  ? 'Let us know how helpful this section is.'
  : 'Let us know how helpful this page is.'

const prompt = computed(() => getPrompt())
const toggleCard = () => (isCardShown.value = !isCardShown.value)
</script>

<template>
  <template v-if="props.heading">
    <button @click="toggleCard()"
      class="bg-$vp-c-default-soft text-primary border-$vp-c-default-soft hover:border-primary ml-3 inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md border-2 border-solid px-1.5 py-3.5 text-sm font-medium transition-all duration-300 sm:h-6">
      <span :class="isCardShown === false ? `i-lucide:mail` : `i-lucide:mail-x`" />
    </button>
  </template>
  <template v-else>
    <button
      class="bg-$vp-c-default-soft text-primary px2 py1 border-$vp-c-default-soft hover:border-primary mt-2 select-none rounded border-2 border-solid font-bold transition-all duration-300"
      @click="toggleCard()">
      <span :class="isCardShown === false ? `i-lucide:mail mr-2` : `i-lucide:mail-x mr-2`
        " />
      <span>Send Feedback</span>
    </button>
  </template>

  <Transition name="fade" mode="out-in">
    <div v-if="isCardShown"
      class="border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 m-[2rem 0] mt-4 border-2 border-solid p-6">
      <Transition name="fade" mode="out-in">
        <div v-if="!feedback.type">
          <p class="heading">
            {{ helpfulText }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button v-for="item in feedbackOptions" :key="item.value"
              class="bg-bg border-$vp-c-default-soft hover:border-primary mt-2 select-none rounded border-2 border-solid font-bold transition-all duration-250 rounded-lg text-[14px] font-500 leading-normal m-0 px-3 py-1.5 text-center align-middle whitespace-nowrap"
              @click="handleSubmit(item.value)">
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>
        <div v-else-if="feedback.type && !success">
          <div class="mb-2">
            <p class="desc">{{ helpfulDescription }} - {{ prompt }}</p>
            <span>{{ getFeedbackOption(feedback.type)?.label }}</span>
          </div>

          <div v-if="feedback.type === 'suggestion'" class="mb-2 text-sm">
            <details>
              <summary>
                <span class="i-lucide-shield-x bg-cerise-400 mb-1 ml-1" />
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
                  Sites scraping only one or two common sources, such as HiAnime
                  or Animepahe
                </li>
                <li>
                  Sites found in the Unsafe lists of
                  <a href="https://fmhy.net/unsafesites" class="text-primary text-underline font-semibold">
                    FMHY
                  </a>
                  ,
                  <a href="https://megathread.pages.dev/unsafe" class="text-primary text-underline font-semibold">
                    Privateersclub
                  </a>
                  and/or
                  <a href="https://rentry.org/pgames#untrusted-sites" class="text-primary text-underline font-semibold">
                    r/PiratedGames
                  </a>
                  .
                </li>
              </ol>
            </details>
            <details>
              <summary>
                <span class="i-lucide-shield-alert bg-cerise-400 mb-1 ml-1" />
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
          <textarea v-model="feedback.message" autofocus
            class="bg-$vp-c-bg-alt text-$vp-c-text-2 w-full h-[100px] border border-$vp-c-divider rounded px-3 py-1.5 border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 border-2 border-solid"
            placeholder="Tip: Did you know that starring our GitHub repo doubles the chances that your feedback will be read?" />
          <p class="desc mb-2">
            If you want a reply to your feedback, feel free to mention a contact
            in the message or join our
            <a class="text-primary text-underline font-semibold" href="https://discord.gg/wZMuSGpZ8s">
              Discord.
            </a>
          </p>
          <div class="flex flex-row gap-2">
            <button
              class="bg-$vp-c-default-soft text-primary border-$vp-c-default-soft inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md border-2 border-solid px-1.5 py-3.5 text-sm font-medium transition-all duration-300 sm:h-6"
              @click="feedback.type = undefined">
              <span class="i-lucide:panel-left-close">close</span>
            </button>
            <button type="submit"
              class="border border-div rounded-lg transition-colors duration-250 inline-block text-14px font-500 leading-1.5 px-3 py-3 text-center align-middle whitespace-nowrap disabled:opacity-50 text-text-2 bg-swarm-100 dark:bg-swarm-700 border-swarm-800 dark:border-swarm-700 disabled:bg-swarm-100 dark:disabled:bg-swarm-900 hover:border-swarm-900 dark:hover:border-swarm-800 hover:bg-swarm-200 dark:hover:bg-swarm-800"
              :disabled="isDisabled" @click="handleSubmit()">
              Send Feedback 📩
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
  transition:
    border-color 0.25s,
    background-color 0.25s;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
