<script setup lang="ts">

import {useAppManager} from "../../store/AppManager.ts";

const appManager = useAppManager();
</script>

<template>
  <div class="Wallpaper">
    <img :src="appManager.options.wallpaper" alt="Wallpaper"/>
  </div>
</template>

<style scoped>
.Wallpaper {
  width: 100vw; /* 使用视口宽度 */
  height: 100vh; /* 使用视口高度 */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex; /* 使用 flexbox 来居中 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  overflow: hidden; /* 防止图片溢出 */
}

.Wallpaper img {
  min-width: 100%; /* 图片至少占满宽度 */
  min-height: 100%; /* 图片至少占满高度 */
  position: relative; /* 相对定位以适应容器 */
  object-fit: cover; /* 保持宽高比，同时裁剪以填满容器 */
}
</style>
