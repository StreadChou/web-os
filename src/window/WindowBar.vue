<script setup lang="ts">
import {RunningAppManager} from "../app/RunningApp/RunningAppManager.ts";

const props = defineProps<{ pid: number; }>()
const AppInstance = RunningAppManager.Instance.getAppInstance(props.pid);
const AppStyle = AppInstance.getStore();

</script>

<template>
  <div class="window-header" wo-draggable wo-double-tap>
    <span class="window-title">{{ AppStyle.title }}</span>
    <div class="window-controls">
      <button @click.stop="AppInstance.toggleMinimize();" class="control-btn minimize-btn">_</button>
      <button @click.stop="AppInstance.toggleMaximize();" class="control-btn maximize-btn">
        <span v-if="!AppInstance.isMaximized">&#9723;</span> <!-- 方框图标 -->
        <span v-else>&#8597;</span> <!-- 恢复图标 -->
      </button>
      <button @click.stop="AppInstance.close()" class="control-btn close-btn">X</button>
    </div>
  </div>
</template>

<style scoped>


/* 标题栏 */
.window-header {
  height: 30px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: grab;
  user-select: none; /* 防止拖拽时选中文字 */
  flex-shrink: 0; /* 防止标题栏被内容挤压 */
}

.window-header:active {
  cursor: grabbing;
}

.window-title {
  flex-grow: 1;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.window-controls {
  display: flex;
  gap: 4px;
}

.control-btn {
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: #e0e0e0;
}

.minimize-btn:hover {
  background-color: #e0e0e0;
}

.maximize-btn:hover {
  background-color: #e0e0e0;
}

.close-btn:hover {
  background-color: #e81123;
  color: white;
}

</style>