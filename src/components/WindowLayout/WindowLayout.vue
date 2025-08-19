<script setup lang="ts">
import {useAppManager} from "../../store/AppManager.ts";
import Window from "../../window/Window.vue";
import {onMounted, useTemplateRef} from "vue";
import {DomRef} from "../../app/DomRef/DomRef.ts";

const AppManager = useAppManager();
const WindowLayoutRef = useTemplateRef<HTMLElement>('WindowLayoutRef')

onMounted(() => {
  if (!WindowLayoutRef.value) return null;
  DomRef.windowLayoutRef = WindowLayoutRef.value as HTMLElement;
})
</script>

<template>
  <div class="container" ref="WindowLayoutRef">
    <template v-for="(item) in AppManager.runningApps" :key="item.pid">
      <Window :pid="item.pid"/>
    </template>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: calc(100% - var(--docker-height) - 10px);
  position: absolute;
  z-index: 20;
  pointer-events: none;
}
</style>