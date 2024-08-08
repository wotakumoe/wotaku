<script setup>
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
  <div v-if="isBannerVisible" class="bg-blue-500 text-white p-4">
    <div class="flex justify-between items-center">
      <span>
        wotaku.<bold class="font-bold">moe</bold> is now
        <a class="underline" href="https://wotaku.wiki">wotaku.wiki</a>. Bookmark and share!
      </span>
      <button @click="closeBanner" class="text-white font-bold">✕</button>
    </div>
  </div>
</template>
