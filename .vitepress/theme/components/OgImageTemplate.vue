<script setup lang="ts">
defineProps<{ title: string; description?: string; dir?: string }>();
</script>

<template>
  <div
    tw="w-full h-full bg-black flex flex-col"
    style="background-image: url(https://files.catbox.moe/tj0pzx.png)">
    <div tw="p-10 w-full min-h-0 grow flex flex-col items-center justify-between">
      <div tw="w-full flex justify-between items-center text-4xl font-medium">
        <div tw="flex items-center">
          <div tw="text-zinc-100 ml-2 mt-1 font-semibold">Wotaku</div>
        </div>
        <div v-if="dir" tw="flex items-center text-zinc-300">
          <div v-if="dir" tw="text-4xl font-semibold mr-2" v-html="dir" />
          <svg
            v-if="dir === 'Glossary'"
            width="48"
            height="48"
            viewBox="0 -960 960 960"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M120-55.5q-15.5 0-26.5-11T82.5-93q0-15.5 11-26.5t26.5-11h720q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11H120ZM207-170q-15.5 0-26.5-11t-11-26.5v-193q-32.5-54-50.75-114.25T100.5-639.5q0-59 15.25-117.5t36.75-116q7.5-20 24.5-32.25t38-12.25q26.5 0 44.75 18.5T276-854.5l-5.5 92q-3 48.5 11 93t41.75 78Q351-558 391-537.75t89 20.25q59.5 0 116.5 11.5T697-471.5q43.5 23 68.25 58.5T790-326v118.5q0 15.5-11 26.5t-26.5 11h-355v-32q0-35 24-60.25T480-287.5h120q15.5 0 26.5-11t11-26.5q0-15.5-11-26.5t-26.5-11H480q-66 0-111.75 47T322.5-202v32H207Zm273-392.5q-65.5 0-111.5-46t-46-111.5q0-65.5 46-111.5t111.5-46q65.5 0 111.5 46t46 111.5q0 65.5-46 111.5t-111.5 46Z" />
          </svg>
          <svg
            v-else-if="dir === 'Guide'"
            height="48"
            width="48"
            viewBox="0 -960 960 960"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M831-327.5V-558L516-386.5q-17 9-36 9t-36-9l-329.5-180q-10-5.5-14.5-14.25t-4.5-18.75q0-10 4.5-18.75t14.5-14.25l330-179.5q8.5-5 17.25-7t18.25-2q9.5 0 18.25 2t17.25 7l371 202q9 5 14.25 13.75T906-577v249.5q0 15.5-11 26.5t-26.5 11q-15.5 0-26.5-11t-11-26.5Zm-387 173-197-107q-18.5-10-28.75-27.75T208-328v-149.5L444-349q17 9 36 9t36-9l236-128.5V-328q0 21-10.25 38.75T713-261.5l-197 107q-8.5 5-17.5 7t-18.5 2q-9.5 0-18.5-2t-17.5-7Z" />
          </svg>
        </div>
      </div>
      <div tw="w-full pr-56 flex flex-col items-start justify-end">
        <div tw="text-6xl font-bold text-stone-200" v-html="title" />
        <div v-if="description" tw="mt-2 text-4xl text-stone-400" v-html="description" />
      </div>
    </div>
    <div tw="shrink-0 h-2 w-full flex" style="background-color: #198cc6" />
  </div>
</template>
