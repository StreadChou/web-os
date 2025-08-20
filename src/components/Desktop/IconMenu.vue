<script setup lang="ts">
import {onMounted, onBeforeUnmount} from "vue";
import type {AppInterfaceInStore} from "../../app/Apps/AppInterface.ts";
import {useAppManager} from "../../store/AppManager.ts";

const props = defineProps<{ app: AppInterfaceInStore; x: number; y: number; }>();
const appManager = useAppManager();
const emit = defineEmits<{ (e: "close"): void; }>();

const handleClickOutside = (e: MouseEvent) => {
  const menu = document.getElementById("context-menu");
  if (menu && !menu.contains(e.target as Node)) {
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const openApp = (force?: boolean) => {
  if (force) {
    appManager.createWindow(props.app)
  } else {
    appManager.showOrCreateWindow(props.app)
  }
  emit("close");
};

</script>

<template>
  <ul id="context-menu" class="menu" :style="{ top: y + 'px', left: x + 'px' }">
    <li @click="openApp(false)">跳转或打开</li>
    <li @click="openApp(true)">强制打开</li>
    <li class="divider"></li>
    <li @click="$emit('close')">关闭菜单</li>
  </ul>
</template>

<style scoped>
.menu {
  position: fixed;
  color: #000;
  border-radius: 8px;
  padding: 4px 0;
  list-style: none;
  z-index: 9999;
  min-width: 160px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  background: rgba(255, 255, 255, 0.63);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.menu li {
  padding: 8px 16px;
  cursor: default;
  white-space: nowrap;
  transition: background 0.2s;
}

.menu li:hover {
  background: rgba(8, 130, 228, 0.63);
}

.menu li.divider {
  height: 1px;
  margin: 4px 0;
  background: #d0d0d0;
  padding: 0;
}
</style>
