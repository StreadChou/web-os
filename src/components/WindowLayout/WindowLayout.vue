<script setup lang="ts">
import {useAppManager} from "../../store/AppManager.ts";
import Window from "../../window/Window.vue";
import {onMounted, useTemplateRef} from "vue";

const AppManager = useAppManager();
const WindowLayoutRef = useTemplateRef<HTMLDivElement>('WindowLayoutRef')

onMounted(() => {
  if (!WindowLayoutRef.value) return null;
  AppManager.domRef.windowLayoutRef = WindowLayoutRef.value as HTMLDivElement;
})
</script>

<template>
  <div class="container" ref="WindowLayoutRef">
    <template v-for="(item) of AppManager.windows" :key="item.id">
      <Window :window-instance="item" :index="item.id"/>
    </template>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: calc(100% - 65px);
  position: absolute;
  z-index: 20;
  overflow: hidden;
  pointer-events: none;
}
</style>