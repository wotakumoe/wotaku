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
import { ref } from 'vue'

// Set a fixed image size
const imageSize = ref('550px') // Fixed size for the image
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
    <div class="text-center">
      <img
        :style="{ width: imageSize, height: 'auto' }"
        src="/asset/404.gif"
        alt="404 Image"
        class="mx-auto"
      />
      <p class="text-title-lg mt-4 font-bold leading-tight text-white">404</p>
      <p
        class="text-body-lg flex flex-wrap items-center justify-center leading-snug text-gray-400"
      >
        Umm.... you shouldn’t be here
        <span class="icon-container mx-1">
          <img class="icon-img" src="/asset/inahuh.png" alt="Inahuh Icon" />
        </span>
        If you got here from a link, please click
        <span class="icon-container mx-1">
          <svg
            class="w-icon h-icon inline-block align-text-bottom"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </span>
        to report it.
      </p>
    </div>
  </div>
</template>

<style scoped>
.text-title-lg {
  font-size: 1.5rem; /* Font size for titles */
}

.text-body-lg {
  font-size: 1rem; /* Font size for body text */
}

.w-icon {
  width: 1em; /* Make the icon size relative to the text size */
}

.h-icon {
  height: 1.25em; /* Make the icon size relative to the text size */
}

.icon-container {
  display: inline-flex; /* Use inline-flex to control spacing within the container */
  align-items: center; /* Vertically center the icon/image */
  justify-content: center; /* Horizontally center the icon/image */
}

.icon-img {
  width: 1em; /* Make the image size relative to the text size */
  height: auto; /* Maintain aspect ratio */
}

.mx-1 {
  margin-left: 0.25em; /* Adjust this value for precise spacing */
  margin-right: 0.25em; /* Adjust this value for precise spacing */
}

@media (max-width: 640px) {
  .text-title-lg {
    font-size: 1.25rem; /* Adjusted font size for smaller screens */
  }
  .text-body-lg {
    font-size: 0.875rem; /* Adjusted font size for smaller screens */
  }

  .mx-1 {
    margin-left: 0.1em; /* Adjusted margin for smaller screens */
    margin-right: 0.1em; /* Adjusted margin for smaller screens */
  }
}

p {
  overflow-wrap: break-word;
  word-break: break-word;
}

div {
  max-height: 100vh; /* Prevents container from exceeding viewport height */
  overflow-y: hidden; /* Ensures no vertical scrollbar is visible */
}
</style>
