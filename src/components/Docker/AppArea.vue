<script setup lang="ts">
import {useAppManager} from "../../store/AppManager.ts";

const AppManager = useAppManager();

// 方法来切换应用状态（示例）
const toggleAppState = (id: number) => {
  const item = AppManager.windows[id];
  if (!item) return null;
  // 最小化的应用直接打开
  if (item.isMinimized) return AppManager.toggleMinimize(id);
  // 活跃的应用最小化
  if (item.isActive) return AppManager.toggleMinimize(id);
  // 普通引用让其活跃
  AppManager.selectWindows(id);
};
</script>

<template>
  <div class="docker-box container">
    <div
        v-for="(window, index) of AppManager.windows"
        :key="index"
        class="app"
        @click="toggleAppState(window.id)"
    >
      <div class="icon">
        <img :src="window.app.icon" :alt="window.title"/>
      </div>
      <div
          class="point"
          :class="{ 'active': window.zIndex == 101, }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 10px; /* 使用gap调整间隔 */
  padding: 5px 15px 5px;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 5px;
}

.icon img {
  height: 30px;
  width: 30px;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

.point {
  width: 30%;
  height: 2px; /* 设置横条的高度 */
  background-color: transparent;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.point.active {
  background-color: #4caf50 !important; /* 彩色状态 */
}

.app:hover .point {
  width: 60%;
  background-color: black;
}
</style>
