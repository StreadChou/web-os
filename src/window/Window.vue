<script setup lang="ts">
import {ref, computed, useTemplateRef, onMounted} from 'vue'
import {WindowInstance} from './WindowInstance.ts'
import {useAppManager} from '../store/AppManager.ts'
import interact from 'interactjs'

const AppManager = useAppManager()
const props = defineProps<{
  windowInstance: WindowInstance
  index: number
}>()


// window 的实例
const OsWindow = ref(AppManager.windows[props.windowInstance.id] as WindowInstance)
// window 的 DOM
const WindowRef = useTemplateRef<HTMLDivElement>('WindowRef')

// 计算属性生成 CSS 样式
const windowStyle = computed(() => ({
  top: OsWindow.value.windowStyle.top + 'px',
  left: OsWindow.value.windowStyle.left + 'px',
  width: OsWindow.value.windowStyle.width + 'px',
  height: OsWindow.value.windowStyle.height + 'px',
  zIndex: OsWindow.value.zIndex,
}))


// 初始化
const init = async () => {
  if (!WindowRef.value) return null;
  // 保存dom
  OsWindow.value.windowRef = WindowRef.value as HTMLDivElement


  interact(WindowRef.value as HTMLElement).resizable({
    edges: {left: true, right: true, bottom: true},
    modifiers: [
      interact.modifiers.restrictEdges({outer: AppManager.domRef.windowLayoutRef || 'parent'}),
      interact.modifiers.restrictSize({min: {width: 200, height: 150}})
    ],
    listeners: {
      move(event) {
        OsWindow.value.resize(
            event.rect.width,
            event.rect.height,
            OsWindow.value.windowStyle.top += event.deltaRect.top,
            OsWindow.value.windowStyle.left += event.deltaRect.left,
        );
      }
    }
  })

  // 拖动
  interact(WindowRef.value.querySelector('.window-header') as HTMLElement).draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: AppManager.domRef.windowLayoutRef || 'parent',
        endOnly: true
      })
    ],
    listeners: {
      start(event) {
        if (OsWindow.value.isMaximized) {
          OsWindow.value.toggleMaximize()
          OsWindow.value.windowStyle.top = event.clientY
        }
      },
      move(event) {
        const top = OsWindow.value.windowStyle.top + event.dy
        const left = OsWindow.value.windowStyle.left + event.dx
        OsWindow.value.move(top, left)
      },
    }
  })

  // 双击标题栏最大化
  interact(WindowRef.value.querySelector('.window-header') as HTMLElement).on(
      'doubletap',
      () => OsWindow.value.toggleMaximize()
  )


}


onMounted(() => init())

</script>


<template>
  <div class="window" :style="windowStyle" ref="WindowRef" @click="OsWindow.active">
    <div class="window-header">
      <span class="window-title">标题栏</span>
      <div class="window-controls">
        <button @click.stop="OsWindow.toggleMinimize" class="control-btn minimize-btn">_</button>
        <button @click="OsWindow.toggleMaximize" class="control-btn maximize-btn">
          <span v-if="!OsWindow.isMaximized">&#9723;</span>
          <span v-else>&#8597;</span>
        </button>
        <button @click.stop="OsWindow.close" class="control-btn close-btn">X</button>
      </div>
    </div>
    <div class="window-content">
      <div class="default-window-content">
        <div>这是窗口的内容区域。</div>
        <div>是否最大化: {{ OsWindow.isMaximized }}</div>
        <div>是否活跃: {{ OsWindow.isActive }}</div>
      </div>
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

.window-header {
  height: 30px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 8px;
  user-select: none;
  flex-shrink: 0;
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

.close-btn:hover {
  background-color: #e81123;
  color: white;
}
</style>
