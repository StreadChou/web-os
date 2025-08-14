<script setup lang="ts">

import {useAppManager} from "../../store/AppManager.ts";

const appManager = useAppManager();
</script>

<template>
  <div class="Wallpaper">
    <template v-if="appManager.options.wallpaper">
      <img :src="appManager.options.wallpaper" alt="Wallpaper"/>
    </template>
    <template v-else>
      <div class="defaultWallpaper"></div>
    </template>
  </div>
</template>

<style scoped>
.Wallpaper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex; /* 使用 flexbox 来居中 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  overflow: hidden; /* 防止图片溢出 */
}

.Wallpaper img, .Wallpaper .defaultWallpaper {
  min-width: 100%; /* 图片至少占满宽度 */
  min-height: 100%; /* 图片至少占满高度 */
  background: rebeccapurple;
}
</style>
