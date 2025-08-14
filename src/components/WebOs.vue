<script setup lang="ts">
import Docker from "./Docker/Docker.vue";
import WindowLayout from "./WindowLayout/WindowLayout.vue";
import Wallpaper from "./Wallpaper/Wallpaper.vue";
import Desktop from "./Desktop/Desktop.vue";
import {useAppManager} from "../store/AppManager.ts";

const appManager = useAppManager();

const disableRightClick = (event: MouseEvent) => {
  event.preventDefault();
}

</script>

<template>
  <div class="wo_screen wo_screen-flex" @contextmenu="disableRightClick">
    <template v-if="appManager.options?.leftPanel">
      <component :is="appManager.options.leftPanel"></component>
    </template>
    <div class="MainContainer">
      <Desktop></Desktop>
      <Wallpaper></Wallpaper>
      <WindowLayout></WindowLayout>
      <Docker></Docker>
    </div>
  </div>
</template>

<style scoped>
.wo_screen-flex {
  display: flex;
}

.LeftPanel {
  width: 200px;
}

.MainContainer {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
