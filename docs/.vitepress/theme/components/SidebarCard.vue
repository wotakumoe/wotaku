<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup>
import { useRouter } from 'vitepress'

const router = useRouter()

async function goRandom() {
  const res = await fetch('/headings.json')
  const headings = await res.json()
  const pick = headings[Math.floor(Math.random() * headings.length)]
  router.go(pick.path + pick.anchor)
}
</script>

<template>
  <div
    class="mt-2 overflow-hidden rounded-lg border-2 border-solid border-$vp-c-default-soft relative z-0 max-md:border max-md:border-neutral-200 max-md:dark:border-neutral-700"
    @click="goRandom"
    title="I'm feeling lucky"
  >
    <img
      src="/soemy.webp"
      alt=""
      class="w-full h-full object-cover block"
      no-zoomable
    />
  </div>
</template>

<style scoped>
div {
  cursor: pointer;
}

div:hover img {
  opacity: 0.85;
  transition: opacity 0.2s;
}

img {
  pointer-events: none;
  transition: opacity 0.2s;
}
</style>