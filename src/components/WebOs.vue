<script setup lang="ts">
import Docker from "./Docker/Docker.vue";
import WindowLayout from "./WindowLayout/WindowLayout.vue";
import Wallpaper from "./Wallpaper/Wallpaper.vue";
import Desktop from "./Desktop/Desktop.vue";

const disableRightClick = (event: MouseEvent) => {
  event.preventDefault();
}

</script>

<template>
  <div class="wo_screen" @contextmenu="disableRightClick">
    <Desktop></Desktop>
    <Wallpaper></Wallpaper>
    <WindowLayout></WindowLayout>
    <Docker></Docker>
  </div>
</template>

<style scoped>

</style>
