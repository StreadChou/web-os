<script setup lang="ts">
import {useAppManager} from "../../store/AppManager.ts";
import {WindowInstance} from "../../window/WindowInstance.ts";
import {onMounted, useTemplateRef} from "vue";

const AppManager = useAppManager();

// 方法来切换应用状态（示例）
const toggleAppState = (OsWindow: WindowInstance) => {
  // 最小化的应用直接打开
  if (OsWindow.isMinimized) return OsWindow.toggleMinimize();
  // 普通应用让其活跃
  OsWindow.active()
};

const AppArea = useTemplateRef<HTMLDivElement>('AppArea')
onMounted(() => {
  if (!AppArea.value) return null;
  AppManager.domRef.appArea = AppArea.value as HTMLDivElement;
})
</script>

<template>
  <div class="docker-box container" ref="AppArea">
    <div
        class="app"
        v-for="(item) of AppManager.windows" :key="item.id"
        :data-id="item.id"
        @click="toggleAppState(item)"
    >
      <div class="icon">
        <img :src="item.app.icon" :alt="item.title"/>
      </div>
      <div
          class="point"
          :class="{ 'active': item.isActive, }"
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
