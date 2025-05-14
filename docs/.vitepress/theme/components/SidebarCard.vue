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
import Field from './CardField.vue'
</script>

<template>
  <div
    class="bg-$vp-c-bg hover:bg-$vp-c-bg/40 border-$vp-c-default-soft hover:border-primary transition-border relative z-0 rounded-lg border-2 border-solid p-5 duration-500 mt-2"
  >
    <div class="align-center mb-4 flex justify-between">
      <div class="text-$vp-c-text-1 lh-relaxed text-sm font-bold">Legend</div>
    </div>
    <Field icon="i-twemoji-glowing-star">Favorite</Field>
    <Field icon="i-material-symbols-lock-outline">Closed Source</Field>
    <Field icon="i-ic-round-attach-money">Paid</Field>
    <Field icon="i-ic-round-currency-exchange">Subscription</Field>
    <Field icon="i-akar-icons-coin">Coin / Point</Field>
    <Field icon="i-ic-round-add-shopping-cart">Freemium</Field>
    <Field icon="i-material-symbols-cloud-download-outline-rounded">Online / DDL</Field>
    <Field icon="i-lucide-magnet">Torrent / p2p</Field>
    <Field icon="i-iconoir-floppy-disk">Local</Field>
    <Field icon="i-material-symbols-science">Nightly build</Field>
    <Field icon="i-lucide-mail">Feedback</Field>
    <Field icon="i-material-symbols-directions-alt">Proxies</Field>
    <Field icon="i-material-symbols-help">Help / Docs</Field>
    <Field icon="i-material-symbols-person-add">Needs account</Field>
    <Field icon="i-material-symbols-info-outline-rounded">More Info</Field>
    <Field icon="i-mdi-arrow-right-bold">Related</Field>
  </div>
</template>
