<script setup lang="ts">
import {computed, useTemplateRef, onMounted} from 'vue'
import {useAppManager} from '../store/AppManager.ts'
import interact from 'interactjs'
import WindowBar from "./WindowBar.vue";
import {RunningAppManager} from "../app/RunningApp/RunningAppManager.ts";
import type {RunningAppInStore} from "../app/RunningApp/RunningApp.ts";
import {DomRef} from "../app/DomRef/DomRef.ts";
import {AppHelper} from "../app/Apps/AppHelper.ts";

const AppManager = useAppManager()
const props = defineProps<{ pid: number }>()

const AppInstance = RunningAppManager.Instance.getAppInstance(props.pid);
const AppStyle: RunningAppInStore = AppManager.runningApps[props.pid];
const AppConfig = AppHelper.getAppConfig(AppStyle.packageId);

// window 的 DOM
const WindowRef = useTemplateRef<HTMLDivElement>('WindowRef')

// 计算属性生成 CSS 样式
const windowStyle = computed(() => ({
  top: AppStyle.windowStyle.top + 'px',
  left: AppStyle.windowStyle.left + 'px',
  width: AppStyle.windowStyle.width + 'px',
  height: AppStyle.windowStyle.height + 'px',
  zIndex: AppStyle.zIndex,
}))


// 初始化
const init = async () => {
  if (!WindowRef.value) return null;
  // 保存dom
  AppInstance.mainWindowDom = WindowRef.value as HTMLDivElement

  // 输入可缩放
  interact(WindowRef.value as HTMLElement).resizable({
    edges: {left: true, right: true, bottom: true},
    modifiers: [
      interact.modifiers.restrictEdges({outer: DomRef.windowLayoutRef || 'parent'}),
      interact.modifiers.restrictSize({min: {width: 200, height: 150}})
    ],
    listeners: {
      move(event) {
        AppInstance.resize(
            event.rect.width,
            event.rect.height,
            AppStyle.windowStyle.top += event.deltaRect.top,
            AppStyle.windowStyle.left += event.deltaRect.left,
        );
      }
    }
  })

  // 注入拖动
  interact(`#app-${props.pid} [wo-draggable]`).draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: DomRef.windowLayoutRef || 'parent',
        endOnly: true
      })
    ],
    listeners: {
      start(event) {
        if (AppInstance.isMaximized) {
          AppInstance.toggleMaximize()
          AppStyle.windowStyle.top = event.clientY
        }
      },
      move(event) {
        const top = AppStyle.windowStyle.top + event.dy
        const left = AppStyle.windowStyle.left + event.dx
        AppInstance.move(top, left)
      },
    }
  })


  // 注入双击最大化
  interact(`#app-${props.pid} [wo-double-tap]`).on('doubletap', () => {
    console.log(AppInstance);
    AppInstance.toggleMaximize()
  })
}


onMounted(() => init())

</script>


<template>
  <div class="window" :id="`app-${pid}`" :style="windowStyle" ref="WindowRef" @click="AppInstance.active">
    <!-- 标题栏: 先使用APP自己设置的 -->
    <template v-if="'header' in AppConfig">
      <template v-if="AppConfig.header">
        <component :is="AppConfig.header" v-bind="{pid}"></component>
      </template>
    </template>
    <!-- 标题栏: 否则读全局的 -->
    <template v-else-if="'windowBar' in AppManager.options">
      <template v-if="AppManager.options.windowBar">
        <component :is="AppManager.options.windowBar" v-bind="{pid}"></component>
      </template>
    </template>
    <!-- 标题栏: 最后才走默认的 -->
    <template v-else>
      <WindowBar v-bind="{pid}"/>
    </template>


    <div class="window-content">
      <template v-if="AppConfig.view">
        <component :is="AppConfig.view" v-bind="{pid}"></component>
      </template>
      <template v-else>
        <div class="default-window-content">
          <div>这是窗口 {{ AppInstance.pid }} 的内容区域。</div>
          <div>是否最大化: {{ AppInstance.isMaximized }}</div>
          <div>是否活跃: {{ AppInstance.isActive }}</div>
          <template v-for="(item, key) in windowStyle">
            <div>{{ key }}: {{ item }}</div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 200px;
  min-height: 150px;
  box-sizing: border-box;
  pointer-events: auto;
  transition: none; /* 默认禁用动画，交互时开启 */
}


.window-content {
  flex-grow: 1;
  min-height: 100px;
  overflow: auto;
  font-size: 14px;
  color: #333;
  user-select: text; /* 标准写法 */
  -webkit-user-select: text; /* Chrome / Safari */
  -moz-user-select: text; /* Firefox */
  -ms-user-select: text; /* IE / 旧版 Edge */
}

.default-window-content {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.63);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}
</style>
