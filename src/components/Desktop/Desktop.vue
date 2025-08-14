<script setup lang="ts">
import {ref} from "vue";
import {useAppManager} from "../../store/AppManager.ts";
import type {AppConfigInterface} from "../../app/AppInterface.ts";


const AppManager = useAppManager();

// 添加一个响应式变量来存储当前选中 app 的名称或索引
const selectAppIndex = ref<number | null>(null);

// 处理 app 点击事件
const clickApp = (app: AppConfigInterface, index: number) => {
  // 如果再次点击 app 则走打开逻辑
  if (selectAppIndex.value == index) {
    AppManager.showOrCreateWindow(app)
    selectAppIndex.value = null;
    return null;
  }
  selectAppIndex.value = index;
};

</script>

<template>
  <div class="container">
    <div class="app-grid">
      <div v-for="(app, index) in AppManager.apps" :key="index"
           :class="{ 'app-item': true,'is-selected': index === selectAppIndex }"
           @click="clickApp(app, index)">
        <template v-if="app.hidden && app.hidden()">

        </template>
        <template v-else>
          <img :src="app.icon" :alt="app.name"/>
          <span>{{ app.name }}</span>
        </template>
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
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>