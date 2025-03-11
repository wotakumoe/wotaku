<!--
  Copyright (c) 2024 taskylizard

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const needRefresh = ref(false)

let updateServiceWorker: (() => Promise<void>) | undefined

function onNeedRefresh() {
  needRefresh.value = true
}
async function close() {
  needRefresh.value = false
}

onBeforeMount(async () => {
  const { registerSW } = await import('virtual:pwa-register')
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh
  })
})
</script>

<template>
  <template v-if="needRefresh">
    <div
      class="pwa-toast z-100 bg-$vp-c-bg b b-solid b-1px b-color-$pwa-border rounded-2 fixed bottom-0 right-0 m-6 px-6 py-4 shadow-xl"
      role="alertdialog"
      aria-labelledby="pwa-message"
    >
      <div id="pwa-message" class="mb-3">
        New content available, click the reload button to update.
      </div>
      <button
        type="button"
        class="pwa-refresh mr-2 rounded px-3 py-1"
        @click="updateServiceWorker?.()"
      >
        Reload
      </button>
      <button
        type="button"
        class="pwa-cancel b b-solid b-1px !b-color-$pwa-border mr-2 rounded px-3 py-1"
        @click="close"
      >
        Close
      </button>
    </div>
  </template>
</template>

<style scoped>
/* PWA: Prompt for Update */
.pwa-toast .pwa-refresh {
  border-color: var(--vp-button-brand-border);
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
}

.pwa-toast .pwa-refresh:hover {
  border-color: var(--vp-button-brand-hover-border);
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
}

.pwa-toast .pwa-refresh:active {
  border-color: var(--vp-button-brand-active-border);
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
}

.pwa-toast .pwa-cancel {
  border-color: var(--vp-button-alt-border);
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
}

.pwa-toast .pwa-cancel:hover {
  border-color: var(--vp-button-alt-hover-border);
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
}

.pwa-toast .pwa-cancel:active {
  border-color: var(--vp-button-alt-active-border);
  color: var(--vp-button-alt-active-text);
  background-color: var(--vp-button-alt-active-bg);
}
</style>
