<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const sections = [
  {
    title: 'Frequent',
    items: [
      { icon: 'i-twemoji-glowing-star', label: 'Favorite' },
      { icon: 'i-mdi-package-variant', label: 'Source Code' },
      { icon: 'i-mdi-package-variant-closed-remove', label: 'Closed Source' },
      { icon: 'i-mdi-puzzle', label: 'Extension / Plugin' },
      { icon: 'i-material-symbols-directions-alt', label: 'Proxies' },
      { icon: 'i-twemoji-no-one-under-eighteen', label: 'R18' },
      { icon: 'i-material-symbols-person-add', label: 'Needs account' },
      { icon: 'i-material-symbols-help', label: 'Help / Docs' },
      { icon: 'i-mdi-arrow-right-bold', label: 'Related' }
    ]
  },
  {
    title: 'System',
    items: [
      { icon: 'i-simple-icons-windows', label: 'Windows' },
      { icon: 'i-simple-icons-android', label: 'Android' },
      { icon: 'i-simple-icons-apple', label: 'Apple' },
      { icon: 'i-simple-icons-linux', label: 'Linux' },
      { icon: 'i-simple-icons-freebsd', label: 'BSD' },
      { icon: 'i-material-symbols-terminal-rounded', label: 'CLI / TUI' },
      { icon: 'i-simple-icons-firefoxbrowser', label: 'Firefox' },
      { icon: 'i-simple-icons-googlechrome', label: 'Chromium' },
      { icon: 'i-mdi-web', label: 'Web' }
    ]
  },
  {
    title: 'Type',
    items: [
      { icon: 'i-material-symbols-play-circle-outline', label: 'Stream' },
      {
        icon: 'i-material-symbols-cloud-download-outline-rounded',
        label: 'Online / DDL'
      },
      { icon: 'i-lucide-magnet', label: 'Torrent / p2p' },
      { icon: 'i-iconoir-floppy-disk', label: 'Local file' },
      { icon: 'i-material-symbols-package-2-outline', label: 'Batch Download' },
      { icon: 'i-lucide-file', label: 'Single Page Mode' },
      { icon: 'i-lucide-book-open', label: 'Double Page Mode' },
      { icon: 'i-lucide-scroll', label: 'Long-Strip Mode' }
    ]
  },
  {
    title: 'Price',
    items: [
      { icon: 'i-ic-round-attach-money', label: 'Paid' },
      { icon: 'i-ic-round-currency-exchange', label: 'Subscription' },
      { icon: 'i-ic-round-money-off-csred', label: 'Has free content' },
      { icon: 'i-akar-icons-coin', label: 'Coin / Point' },
      { icon: 'i-ic-round-add-shopping-cart', label: 'Freemium' }
    ]
  },
  {
    title: 'Platform',
    items: [
      { icon: 'i-simple-icons-discord', label: 'Discord' },
      { icon: 'i-simple-icons-4chan', label: '4chan' },
      { icon: 'i-simple-icons-twitter', label: 'Twitter' },
      { icon: 'i-simple-icons-telegram', label: 'Telegram' },
      { icon: 'i-simple-icons-myanimelist', label: 'MyAnimeList' },
      { icon: 'i-simple-icons-anilist', label: 'AniList' },
      { icon: 'i-simple-icons-kitsu', label: 'Kitsu' },
      { icon: 'i-simple-icons-simkl', label: 'Simkl' }
    ]
  },
  {
    title: 'Storage',
    items: [
      { icon: 'i-simple-icons-googledrive', label: 'Google Drive' },
      { icon: 'i-simple-icons-mega', label: 'MEGA' },
      { icon: 'i-simple-icons-mediafire', label: 'MediaFire' },
      { icon: 'i-mdi-snail', label: 'Other Host' }
    ]
  },
  {
    title: 'Region',
    items: [
      { icon: 'i-twemoji-flag-japan', label: 'Japan' },
      { icon: 'i-twemoji-flag-south-korea', label: 'Korea' },
      { icon: 'i-twemoji-flag-china', label: 'China' }
    ]
  },
  {
    title: 'Code',
    items: [
      { icon: 'i-simple-icons-javascript', label: 'JavaScript' },
      { icon: 'i-mdi-language-css3', label: 'CSS' },
      { icon: 'i-simple-icons-python', label: 'Python' },
      { icon: 'i-simple-icons-docker', label: 'Docker' }
    ]
  },
  {
    title: 'Others',
    items: [
      { icon: 'i-material-symbols-science', label: 'Nightly build' },
      { icon: 'i-lucide-mail', label: 'Feedback' },
      { icon: 'i-material-symbols-info-outline-rounded', label: 'More Info' },
      { icon: 'i-ic-round-looks-two', label: 'Alternative' },
      { icon: 'i-simple-icons-rss', label: 'RSS Feed' },
      { icon: 'i-mdi-airplane', label: 'Testflight' },
      { icon: 'i-twemoji-check-mark-button', label: 'Yes / Available' },
      { icon: 'i-twemoji-cross-mark', label: 'No / Unavailable' },
      { icon: 'i-twemoji-globe-showing-asia-australia', label: 'Global' },
      { icon: 'i-mdi-closed-caption', label: 'Subtitles / CC' },
      { icon: 'i-mdi-hulu', label: 'Hardsubs' }
    ]
  }
]
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-9999 p-4 sm:p-6 overflow-y-auto"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        />

        <!-- Modal -->
        <div class="relative mx-auto bg-$vp-c-bg rounded-lg border-2 border-$vp-c-default-soft p-4 sm:p-6 shadow-xl w-full max-w-4xl mt-16 mb-8">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h2 class="text-$vp-c-text-1 text-lg sm:text-xl font-bold align-center vl-middle flex items-center">
              <div class="i-lucide-badge-info text-$vp-c-text-1 mr-2" />
              Icon key
            </h2>
            <button
              class="text-$vp-c-text-2 hover:text-$vp-c-text-1 transition-colors p-1"
              @click="$emit('close')"
            >
              <div class="i-material-symbols-close text-lg" />
            </button>
          </div>

          <div class="space-y-8">
            <div v-for="section in sections" :key="section.title">
              <h3 class="text-$vp-c-text-1 font-bold mb-3">
                {{ section.title }}
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <div
                  v-for="item in section.items"
                  :key="item.label"
                  class="flex flex-col items-center justify-center p-3 rounded-lg bg-$vp-c-bg-alt hover:bg-$vp-c-bg-elv transition-colors"
                >
                  <div
                    :class="[
                      item.icon,
                      'text-2xl mb-1 text-$vp-c-text-1'
                    ]"
                  />
                  <div class="text-$vp-c-text-2 text-xs text-center">
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
