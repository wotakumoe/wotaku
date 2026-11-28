<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import Feedback from './Feedback.vue'

defineProps<{ h: string }>()
</script>

<template>
  <Feedback :heading="h" />
</template>
