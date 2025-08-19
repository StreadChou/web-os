<script setup lang="ts">
import {useAppManager} from "../../store/AppManager.ts";
import AppIcon from "./AppIcon.vue";

const AppManager = useAppManager();
</script>

<template>
  <div class="docker-box container" ref="AppArea">
    <template v-for="(item) in AppManager.runningApps" :key="item.pid">
      <AppIcon :pid="item.pid"/>
    </template>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 10px; /* 使用gap调整间隔 */
  padding: 5px 15px 5px;
}

</style>
