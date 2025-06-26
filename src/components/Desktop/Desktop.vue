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
    AppManager.createWindow(app)
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
  width: 100vw;
  height: calc(100vh - 65px); /* 设定容器高度，以便内部的 flex 布局可以计算列的换行 */
  position: absolute;
  z-index: 10;
  /* 容器内的 flex 属性可以根据需要保留或调整，这里主要为了让 app-grid 居中或靠左上 */
  display: flex;
  align-items: flex-start; /* 垂直方向从顶部开始 */
  justify-content: flex-start; /* 水平方向从左侧开始 */
  padding: 10px; /* 容器内边距 */
  box-sizing: border-box; /* 包含内边距在总宽高内 */
}

.app-grid {
  display: flex;
  flex-direction: column; /* 弹性项从上到下排列 */
  flex-wrap: wrap; /* 当列满时，换到下一列（从左到右） */
  height: 100%; /* 关键：让这个容器占据父容器的所有可用高度，这样 flex-wrap 才能知道何时换列 */
  align-content: flex-start; /* 当有多列时，将列从左侧对齐 */
  gap: 15px 0;
}

.app-item {
  display: flex;
  flex-direction: column; /* 图标和文本垂直排列 */
  align-items: center; /* 图标和文本水平居中 */
  text-align: center; /* 文本自身居中 */
  width: 70px; /* 每个图标项的固定宽度，给文字留一些空间 */
  flex-shrink: 0; /* 防止项目在空间不足时缩小 */
  cursor: pointer;
  padding: 5px; /* 确保与选中状态的 padding 保持一致 */
  border: 1px solid transparent; /* 默认透明边框 */
}

.app-item.is-selected {
  border: 1px solid rgba(0, 120, 215, 0.8); /* Windows 风格的蓝色边框 */
  background-color: rgba(0, 120, 215, 0.2); /* 浅蓝色背景 */
  padding: 4px; /* 增加内边距，让边框和内容之间有空间 */
  border-radius: 4px; /* 轻微圆角，与Windows风格接近 */
  box-sizing: border-box; /* 确保 padding 包含在 width 和 height 内 */
}

.app-item img {
  width: 40px; /* 图标宽度 */
  height: 40px; /* 图标高度 */
  object-fit: contain; /* 确保图片内容在指定尺寸内完整显示 */
}

.app-item span {
  margin-top: 2px; /* 图标和文本之间的间隔 */
  color: white; /* 文本颜色 */
  font-size: 12px; /* 文本字体大小 */

  white-space: nowrap; /* 禁止文本换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 溢出部分显示省略号 */
  max-width: 100%; /* 限制最大宽度为父元素的100% */

}
</style>