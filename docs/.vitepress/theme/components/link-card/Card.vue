<script setup lang="ts">
const props = defineProps<{
  href: string
  title: string
  download?: boolean
}>()
</script>

<template>
  <a
    role="article"
    :href="props.href"
    :download="props.download ? '' : undefined"
    class="hover:scale-[1.03] focus:scale-[1.03] active:scale-[0.98] transition-all! flex flex-col gap-1 text-neutral-600! text-sm px-4 py-3 rounded-2xl border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-300! interact:shadow-xl shadow-neutral-700/5 duration-300 font-normal! no-underline!"
  >
    <h3 class="text-black! dark:text-white! no-underline! font-medium! text-lg my-0!">
      {{ props.title }}
    </h3>
    <p class="m-0! leading-normal!">
      <slot />
    </p>
  </a>
</template>
