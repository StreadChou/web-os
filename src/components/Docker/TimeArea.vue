<script setup lang="ts">

</script>

<template>
  <div class="docker-box container">
    <div class="time no-hand-cursor">10:00:00</div>
    <div class="date no-hand-cursor">2025-10-01</div>
  </div>
</template>

<style scoped>
.container {
  display: flex; /* 使用flex布局 */
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 水平居中对齐子元素 */
  justify-content: center; /* 垂直居中对齐子元素（若需要） */
  padding: 5px 15px;
}

.time, .date {
  width: 100%;
  text-align: center;
  color: #323232;
  font-size: 12px;
}
</style>