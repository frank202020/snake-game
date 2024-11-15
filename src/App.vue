<script setup lang="ts">
import GameCanvas from './components/GameCanvas.vue'
</script>

<template>
  <div class="app">
    <h1>贪吃蛇-by红哥Frank</h1>
    <GameCanvas />
    <div class="instructions">
      <h3>操作说明：</h3>
      <p>方向键 或 WASD：控制蛇的移动</p>
      <p>空格键：暂停/继续</p>
      <p>R 键：重新开始</p>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;

}

h1 {
  color: #42b883;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.instructions {
  width: 380px;
  margin: 20px auto;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  font-size: 0.9em;
}

.instructions h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.1em;
}

.instructions p {
  margin: 5px 0;
  color: #666;
}
</style>
