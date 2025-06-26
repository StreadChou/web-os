<script setup lang="ts">

import {useAppManager} from "../../store/AppManager.ts";
import Window from "../../window/Window.vue";

const AppManager = useAppManager();
</script>

<template>
  <div class="container">
    <template v-for="(item, index) of AppManager.windows" :key="index">
      <Window :window-instance="item" :index="index"/>
    </template>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 20;
  overflow: hidden;
  pointer-events: none; /* 允许鼠标事件穿透 */
}
</style>