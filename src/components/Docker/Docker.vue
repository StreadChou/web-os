<script setup lang="ts">

import TimeArea from "./TimeArea.vue";
import AppArea from "./AppArea.vue";
</script>

<template>
  <div class="docker-container">
    <AppArea></AppArea>
    <TimeArea></TimeArea>
  </div>
</template>

<style scoped>
.docker-container {
  width: 100%;
  height: var(--docker-height);
  position: fixed;
  left: 0;
  bottom: 10px;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 30;
}
</style>