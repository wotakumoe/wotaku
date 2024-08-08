<script setup lang="ts">
import { ref, onMounted } from "vue";

const isBannerVisible = ref(true);

const closeBanner = () => {
  isBannerVisible.value = false;
  localStorage.setItem("ackDomainChange", "true");
};

onMounted(() => {
  const bannerClosed = localStorage.getItem("ackDomainChange");
  if (bannerClosed === "true") {
    isBannerVisible.value = false;
  }
});
</script>

<template>
  <div v-if="isBannerVisible" class="bg-blue-500 text-white p-4 mb-5">
    <div class="flex justify-between items-center">
      <span>
        wotaku.<bold class="font-bold">moe</bold> is now
        <a class="underline" href="https://wotaku.wiki">wotaku.wiki</a>.
      </span>
      <br />
      <button @click="closeBanner" class="text-white font-bold">✕</button>
    </div>
    <img src="/newdomainbanner.png" alt="wotaku.wiki banner" class="mt-2 w-full h-auto" />
  </div>
</template>
