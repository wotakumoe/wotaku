<!--
  <fb /> — inline feedback button for use beside h1 headings.
  Renders identically to the auto-inserted h2 button in Feedback.vue
  by reusing Feedback with the page title as the heading prop.
-->
<script setup lang="ts">
import { useData } from 'vitepress'
import Feedback from './Feedback.vue'

const { page } = useData()
</script>

<template>
  <Feedback :heading="page.title" />
</template>