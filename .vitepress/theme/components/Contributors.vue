<script setup lang="ts">
import { computed } from "vue";

interface ContributorInfo {
  name: string;
  avatar: string;
  // Optional.
  site?: string;
}

const contribs = [
  {
    name: "taskylizard",
    avatar: "https://github.com/taskylizard.png",
    site: "https://github.com/taskylizard",
  },
  {
    name: "TubaApollo",
    avatar: "https://github.com/TubaApollo.png",
    site: "https://github.com/TubaApollo",
  },
  {
    avatar: "https://yt3.googleusercontent.com/ZDmI8iWPd7kE0fHNRuH5DiNNY5tzyRKSVhW-X5YardXoS_vJ9CdqpfsWZwFbJ7tRMJKhdzeoew",
    name: "Memenami",
  },
  {
    name: "Static",
    avatar: "https://github.com/whitenoisy.png",
    site: "https://github.com/whitenoisy",
  },
  {
    name: "Venlicht",
    avatar: "https://github.com/RenaraScope.png",
    site: "https://github.com/RenaraScope",
  },
  {
    name: "Zinklog",
    avatar: "https://github.com/zinklog2.png",
    site: "https://github.com/zinklog2",
  },
  {
    avatar: "https://github.com/knightmob.png",
    name: "Abyss",
    site: "https://github.com/knightmob",
  },
  {
    avatar: "https://github.com/farahnur42.png",
    name: "Fahim",
    site: "https://github.com/farahnur42",
  },
  {
    avatar: "https://github.com/Helmasko.png",
    name: "Helmasko",
    site: "https://github.com/Helmasko",
  },
  {
    name: "Ishtar",
    avatar: "/pfp/ishtar.png",
  },
  {
    name: "Kai",
    avatar: "https://github.com/Kai-FMHY.png",
    site: "https://github.com/Kai-FMHY",
  },
  {
    name: "Kobayashi",
    avatar: "https://github.com/kobayashi90.png",
    site: "https://www.ryuko.space/",
  },
  {
    name: "loocool",
    avatar: "https://github.com/loocool2.png",
    site: "https://github.com/loocool2",
  },
  {
    name: "nuff",
    avatar: "https://github.com/gengotech.png",
    site: "https://github.com/gengotech",
  },
] satisfies ContributorInfo[];

const contributors = computed(() => contribs || ([] as ContributorInfo[]));
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <div v-for="(c, index) of contributors" class="flex gap-2 items-center">
      <img :src="c.avatar" class="w-8 h-8 rounded-full" />
      <a v-if="c.site" :href="c.site">{{ c.name }}</a>
      <span v-else>{{ c.name }}</span>
      <span v-if="index < contributors.length - 1"> • </span>
    </div>
  </div>
</template>
