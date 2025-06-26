<script setup lang="ts">
import {ref, computed} from 'vue';
import {WindowInstance} from "./WindowInstance.ts";
import {useAppManager} from "../store/AppManager.ts";

const AppManager = useAppManager();
const props = defineProps<{
  windowInstance: WindowInstance
  index: number,
}>();

const MIN_WIDTH = 200; // 窗口最小宽度
const MIN_HEIGHT = 150; // 窗口最小高度

const OsWindow = ref(AppManager.windows[props.windowInstance.id] as WindowInstance);

// 窗口的样式计算属性
const windowStyle = computed(() => ({
  left: typeof OsWindow.value.x == 'string' ? OsWindow.value.x : `${OsWindow.value.x}px`,
  top: typeof OsWindow.value.y == 'string' ? OsWindow.value.y : `${OsWindow.value.y}px`,
  width: typeof OsWindow.value.width == 'string' ? OsWindow.value.width : `${OsWindow.value.width}px`,
  height: typeof OsWindow.value.height == 'string' ? OsWindow.value.height : `${OsWindow.value.height}px`,
  zIndex: props.windowInstance.zIndex,
  display: props.windowInstance.isMinimized ? 'none' : 'block', // 最小化时隐藏
}));

// --- 拖拽功能实现 ---
let isDragging = false;
let startX = 0;
let startY = 0;
let initialX = 0;
let initialY = 0;

const startDrag = (e: MouseEvent) => {
  if (props.windowInstance.isMaximized) return; // 最大化时不允许拖拽

  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  initialX = OsWindow.value.x as number;
  initialY = OsWindow.value.y as number;

  document.addEventListener('mousemove', doDrag);
  document.addEventListener('mouseup', stopDrag);
  AppManager.selectWindows(props.windowInstance.id);
};

const doDrag = (e: MouseEvent) => {
  if (!isDragging) return;
  const item = AppManager.windows[props.windowInstance.id]
  if (!item) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let newX = initialX + dx;
  let newY = initialY + dy;

  OsWindow.value.x = newX;
  OsWindow.value.y = newY;
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener('mousemove', doDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// --- 调整大小功能实现 ---
let isResizing = false;
let resizeDirection = '';
let initialWidth = 0;
let initialHeight = 0;
let initialMouseX = 0;
let initialMouseY = 0;
let initialWindowX = 0;
let initialWindowY = 0;

const startResize = (e: MouseEvent, direction: string) => {
  if (props.windowInstance.isMaximized) return; // 最大化时不允许调整大小

  isResizing = true;
  resizeDirection = direction;
  initialWidth = OsWindow.value.width as number;
  initialHeight = OsWindow.value.height as number;
  initialMouseX = e.clientX;
  initialMouseY = e.clientY;
  initialWindowX = OsWindow.value.x as number;
  initialWindowY = OsWindow.value.y as number;

  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);

  AppManager.selectWindows(props.windowInstance.id); // 调整大小时置顶
  e.stopPropagation(); // 阻止事件冒泡到父元素的拖拽事件
};

const doResize = (e: MouseEvent) => {
  if (!isResizing) return;

  const dx = e.clientX - initialMouseX;
  const dy = e.clientY - initialMouseY;

  let newX = OsWindow.value.x;
  let newY = OsWindow.value.y;
  let newWidth = OsWindow.value.width;
  let newHeight = OsWindow.value.height;

  switch (resizeDirection) {
    case 'n': // top
      newHeight = Math.max(MIN_HEIGHT, initialHeight - dy);
      newY = initialWindowY + (initialHeight - newHeight);
      break;
    case 'ne': // top-right
      newHeight = Math.max(MIN_HEIGHT, initialHeight - dy);
      newY = initialWindowY + (initialHeight - newHeight);
      newWidth = Math.max(MIN_WIDTH, initialWidth + dx);
      break;
    case 'e': // right
      newWidth = Math.max(MIN_WIDTH, initialWidth + dx);
      break;
    case 'se': // bottom-right
      newWidth = Math.max(MIN_WIDTH, initialWidth + dx);
      newHeight = Math.max(MIN_HEIGHT, initialHeight + dy);
      break;
    case 's': // bottom
      newHeight = Math.max(MIN_HEIGHT, initialHeight + dy);
      break;
    case 'sw': // bottom-left
      newWidth = Math.max(MIN_WIDTH, initialWidth - dx);
      newX = initialWindowX + (initialWidth - newWidth);
      newHeight = Math.max(MIN_HEIGHT, initialHeight + dy);
      break;
    case 'w': // left
      newWidth = Math.max(MIN_WIDTH, initialWidth - dx);
      newX = initialWindowX + (initialWidth - newWidth);
      break;
    case 'nw': // top-left
      newWidth = Math.max(MIN_WIDTH, initialWidth - dx);
      newX = initialWindowX + (initialWidth - newWidth);
      newHeight = Math.max(MIN_HEIGHT, initialHeight - dy);
      newY = initialWindowY + (initialHeight - newHeight);
      break;
  }

  OsWindow.value.x = newX;
  OsWindow.value.y = newY;
  OsWindow.value.width = newWidth;
  OsWindow.value.height = newHeight;
};

const stopResize = () => {
  isResizing = false;
  resizeDirection = '';
  document.removeEventListener('mousemove', doResize);
  document.removeEventListener('mouseup', stopResize);
};


</script>

<template>
  <div
      class="window"
      :style="windowStyle"
      @mousedown="AppManager.selectWindows(OsWindow.id)"
      :class="{ 'is-maximized': windowInstance.isMaximized, 'is-minimized': windowInstance.isMinimized }"
  >
    <!-- 标题栏 -->
    <template v-if="'header' in OsWindow.app">
      <template v-if="OsWindow.app.header">
        <component :is="windowInstance.app.header"
                   v-bind="{
                      osWindow: OsWindow,
                      startDrag
                  }"
        ></component>
      </template>
    </template>
    <template v-else>
      <div class="window-header" @mousedown="startDrag">
        <span class="window-title">{{ OsWindow.app.name }}</span>
        <div class="window-controls">
          <button @click.stop="AppManager.toggleMinimize(OsWindow.id);" class="control-btn minimize-btn">_</button>
          <button @click.stop="AppManager.toggleMaximize(OsWindow.id);" class="control-btn maximize-btn">
            <span v-if="!windowInstance.isMaximized">&#9723;</span> <!-- 方框图标 -->
            <span v-else>&#8597;</span> <!-- 恢复图标 -->
          </button>
          <button @click.stop="OsWindow.close()" class="control-btn close-btn">X</button>
        </div>
      </div>
    </template>


    <!-- 窗口内容区域 -->
    <div class="window-content">
      <template v-if="windowInstance.app.view">
        <component :is="windowInstance.app.view"
                   v-bind="{
                      osWindow: OsWindow,
                      startDrag
                  }"
        ></component>
      </template>
      <template v-else>
        <!-- 这里可以放置任何窗口内容，例如iframe, 图片, 文本等 -->
        <p>这是窗口 {{ windowInstance.id }} 的内容区域。</p>
        <template v-for="(item, key) in windowStyle">
          <div>{{ key }}: {{ item }}</div>
        </template>
      </template>
    </div>

    <!-- 拖拽手柄 -->
    <div v-if="!windowInstance.isMaximized" class="resize-handle n" @mousedown="startResize($event, 'n')"></div>
    <div v-if="!windowInstance.isMaximized" class="resize-handle ne" @mousedown="startResize($event, 'ne')"></div>
    <div v-if="!windowInstance.isMaximized" class="resize-handle e" @mousedown="startResize($event, 'e')"></div>
    <div v-if="!windowInstance.isMaximized" class="resize-handle se" @mousedown="startResize($event, 'se')"></div>
    <div v-if="!windowInstance.isMaximized" class="resize-handle s" @mousedown="startResize($event, 's')"></div>
    <div v-if="!windowInstance.isMaximized" class="resize-handle sw" @mousedown="startResize($event, 'sw')"></div>
    <div v-if="!windowInstance.isMaximized" class="resize-handle w" @mousedown="startResize($event, 'w')"></div>
    <div v-if="!windowInstance.isMaximized" class="resize-handle nw" @mousedown="startResize($event, 'nw')"></div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 确保内容不会超出窗口 */
  min-width: 200px; /* 最小宽度 */
  min-height: 150px; /* 最小高度 */
  box-sizing: border-box; /* 边框包含在尺寸内 */
  pointer-events: auto; /* 允许窗口接收鼠标事件 */
}

/* 最大化时的样式 */
.window.is-maximized {
  border-radius: 0;
  border: none;
  box-shadow: none;
}

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

/* 窗口内容 */
.window-content {
  flex-grow: 1; /* 占据剩余空间 */
  min-height: 100px;
  overflow: auto; /* 内容超出时滚动 */
  font-size: 14px;
  color: #333;
}

/* 拖拽手柄 */
.resize-handle {
  position: absolute;
  /* 背景透明，只改变鼠标样式 */
  background: transparent;
  /* 确保手柄在窗口内容之上，但低于标题栏和控制按钮 */
  z-index: 1;
}

/* 四个角 */
.resize-handle.nw, .resize-handle.ne, .resize-handle.sw, .resize-handle.se {
  width: 10px;
  height: 10px;
}

.resize-handle.nw {
  top: 0;
  left: 0;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: 0;
  right: 0;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: 0;
  left: 0;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}

/* 四条边 */
.resize-handle.n, .resize-handle.s {
  left: 10px; /* 避免覆盖角上的手柄 */
  right: 10px;
  height: 5px; /* 细条 */
}

.resize-handle.e, .resize-handle.w {
  top: 10px; /* 避免覆盖角上的手柄 */
  bottom: 10px;
  width: 5px; /* 细条 */
}

.resize-handle.n {
  top: 0;
  cursor: n-resize;
}

.resize-handle.s {
  bottom: 0;
  cursor: s-resize;
}

.resize-handle.e {
  right: 0;
  cursor: e-resize;
}

.resize-handle.w {
  left: 0;
  cursor: w-resize;
}
</style>