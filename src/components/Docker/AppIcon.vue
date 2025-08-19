<script setup lang="ts">
import type {RunningAppInStore} from "../../app/RunningApp/RunningApp.ts";
import {RunningAppManager} from "../../app/RunningApp/RunningAppManager.ts";
import {onMounted, useTemplateRef} from "vue";

const props = defineProps<{ pid: number, }>()
const AppIconInDocker = useTemplateRef<HTMLElement>("AppIconInDocker");

const AppInstance = RunningAppManager.Instance.getAppInstance(props.pid);
const AppStyle: RunningAppInStore = AppInstance.getStore();

onMounted(() => {
  if (!AppIconInDocker) return null;
  AppInstance.dockerIconDom = AppIconInDocker.value as HTMLElement;
})

</script>

<template>
  <div class="app" ref="AppIconInDocker" @click="AppInstance.clickDockerIcon()">
    <div class="icon">
      <img :src="AppStyle.icon" :alt="AppStyle.title"/>
    </div>
    <div class="point" :class="{ 'active': AppInstance.isActive, }"
    ></div>
  </div>


</template>

<style scoped>

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