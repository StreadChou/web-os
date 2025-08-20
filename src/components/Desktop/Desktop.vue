<script setup lang="ts">
import { ref, createVNode, render } from "vue";
import { useAppManager } from "../../store/AppManager.ts";
import type { AppInterfaceInStore } from "../../app/Apps/AppInterface.ts";
import IconMenu from "./IconMenu.vue";

const AppManager = useAppManager();
const selectApp = ref<string | null>(null);

// 当前右键菜单容器
let currentMenuContainer: HTMLDivElement | null = null;

const clickApp = (app: AppInterfaceInStore) => {
  if (selectApp.value !== app.packageId) {
    selectApp.value = app.packageId;
    return;
  }
  AppManager.showOrCreateWindow(app);
  selectApp.value = null;
  closeMenu();
};

// 关闭当前菜单
const closeMenu = () => {
  if (currentMenuContainer) {
    render(null, currentMenuContainer);
    document.body.removeChild(currentMenuContainer);
    currentMenuContainer = null;
  }
};

// 右键点击应用
const onRightClick = (event: MouseEvent, app: AppInterfaceInStore) => {
  event.preventDefault();
  selectApp.value = app.packageId;

  // 先关闭已有菜单
  closeMenu();

  // 创建菜单容器
  const container = document.createElement("div");
  document.body.appendChild(container);
  currentMenuContainer = container;

  const vnode = createVNode(IconMenu, {
    app,
    x: event.clientX,
    y: event.clientY,
    onClose: () => {
      closeMenu();
      selectApp.value = null;
    },
  });

  render(vnode, container);
};

// 点击页面其他地方关闭菜单
const handleGlobalClick = (event: MouseEvent) => {
  const menu = currentMenuContainer;
  if (!menu) return;

  if (!menu.contains(event.target as Node)) {
    closeMenu();
    selectApp.value = null;
  }
};

document.addEventListener("click", handleGlobalClick);
</script>

<template>
  <div class="container">
    <div class="app-grid">
      <div
          v-for="(app, index) in AppManager.apps"
          :key="index"
          :class="{ 'app-item': true,'is-selected': app.packageId === selectApp }"
          @click="clickApp(app)"
          @contextmenu.prevent="onRightClick($event, app)"
      >
        <img :src="app.icon" :alt="app.name" />
        <span>{{ app.name }}</span>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  width: 100%;
  height: calc(100% - 65px);
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
  box-sizing: border-box;
}
.app-grid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  align-content: flex-start;
  gap: 15px 0;
}
.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 70px;
  flex-shrink: 0;
  cursor: pointer;
  padding: 4px;
  border: 1px solid transparent;
}
.app-item.is-selected {
  border: 1px solid rgba(0, 120, 215, 0.8);
  background-color: rgba(0, 120, 215, 0.2);
  padding: 4px;
  border-radius: 4px;
  box-sizing: border-box;
}
.app-item img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
.app-item span {
  margin-top: 2px;
  color: white;
  font-size: 12px;
  max-width: 100%;
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
</style>
