<template>
  <div class="game-container">
    <div class="game-info">
      <span><strong>分数:</strong><span class="value">{{ score }}</span></span>
      <span><strong>最高分:</strong><span class="value">{{ highScore }}</span></span>
      <span><strong>游戏状态:</strong><span class="value">{{ gameStatusText }}</span></span>
      <span v-if="isPaused">已暂停</span>
    </div>
    <canvas 
      ref="gameCanvas" 
      width="400" 
      height="400"
      @keydown.prevent="handleKeyPress"
      tabindex="0"
    ></canvas>
    <div class="control-buttons">
      <button 
        @click="handleContinue" 
        :disabled="!isPaused || isGameOver"
      >继续</button>
      <button 
        @click="handleRestart"
      >重新开始</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Game } from '../../core/Game';

const gameCanvas = ref<HTMLCanvasElement | null>(null);
const game = new Game();
let animationFrameId: number;
let ctx: CanvasRenderingContext2D | null = null;
let lastUpdateTime = 0;

// 添加响应式状态
const score = ref(0);
const highScore = ref(0);
const isPaused = ref(false);
const isGameOver = ref(false);

// 添加游戏状态
const gameStatus = ref('notStarted'); // 'notStarted' | 'playing' | 'ended'

// 计算游戏状态显示文本
const gameStatusText = computed(() => {
  switch (gameStatus.value) {
    case 'notStarted':
      return '未开始';
    case 'playing':
      return '游戏中';
    case 'ended':
      return '游戏结束';
    default:
      return '未开始';
  }
});

// 更新游戏状态的函数
const updateGameState = () => {
  score.value = game.getScore();
  highScore.value = game.getHighScore();
  isPaused.value = game.getIsPaused();
  isGameOver.value = game.getIsGameOver();
  
  // 更新游戏状态
  if (isGameOver.value) {
    gameStatus.value = 'ended';
  }
};

// 修改游戏循环逻辑
const gameLoop = (timestamp: number) => {
  if (!lastUpdateTime) lastUpdateTime = timestamp;
  
  const deltaTime = timestamp - lastUpdateTime;
  
  if (deltaTime >= game.moveInterval) {
    if (gameStatus.value === 'playing') {
      game.update();
      updateGameState();
    }
    lastUpdateTime = timestamp;
  }
  
  render();
  animationFrameId = requestAnimationFrame(gameLoop);
};

// 渲染函数
const render = () => {
  if (!ctx || !gameCanvas.value) return;
  
  // 清空画布
  ctx.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);
  
  // 绘制网格线
  const gridSize = 24;
  const cellSize = gameCanvas.value.width / gridSize;
  
  // 设置网格线样式
  ctx.strokeStyle = '#c0c0c0';
  ctx.lineWidth = 0.5;
  
  // 绘制垂直线
  for (let x = 0; x <= gridSize; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, gameCanvas.value.height);
    ctx.stroke();
  }
  
  // 绘制水平线
  for (let y = 0; y <= gridSize; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(gameCanvas.value.width, y * cellSize);
    ctx.stroke();
  }
  
  // 绘制蛇
  ctx.fillStyle = '#42b883';
  game.getSnake().getBody().forEach(segment => {
    if (ctx) {
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize - 1,
        cellSize - 1
      );
    }
  });
  
  // 绘制食物
  if (ctx) {
    ctx.fillStyle = '#ff6b6b';
    const food = game.getFood().getPosition();
    ctx.fillRect(
      food.x * cellSize,
      food.y * cellSize,
      cellSize - 1,
      cellSize - 1
    );
  }
};

// 修改键盘事件处理
const handleKeyPress = (event: KeyboardEvent) => {
  // 只有在游戏中状态才处理键盘事件
  if (gameStatus.value === 'playing') {
    game.handleKeyPress(event.key);
  }
};

// 修改继续按钮处理函数
const handleContinue = () => {
  if (gameStatus.value === 'playing') {
    game.togglePause();
    gameCanvas.value?.focus(); // 继续后将焦点返回到画布
  }
};

const handleRestart = () => {
  game.restart();
  gameCanvas.value?.focus(); // 重启后将焦点返回到画布
  gameStatus.value = 'playing'; // 设置状态为游戏中
  updateGameState(); // 更新游戏状态显示
};

// 组件挂载时初始化
onMounted(() => {
  if (!gameCanvas.value) return;
  
  ctx = gameCanvas.value.getContext('2d');
  gameCanvas.value.focus();
  
  gameStatus.value = 'notStarted'; // 初始状态设置为未开始
  updateGameState();
  
  // 启动游戏循环
  gameLoop(0);
});

// 组件卸载时清理
onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.game-info {
  font-size: 1.2em;
  text-align: center;
  color:#3aa876
}

.game-info span {
  margin: 0 10px;
}

.game-info .value {
  font-size: 80%; /* 置为父元素字体大小的70% */
  color: #a8a8a8;
}

canvas {
  border: 2px solid #42b883;
  border-radius: 4px;
  outline: none;
  background-color: #ffffff
}

.control-buttons {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.control-buttons button {
  padding: 8px 20px;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  background-color: #42b883;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-buttons button:hover {
  background-color: #3aa876;
}

.control-buttons button:disabled {
  background-color: #a8a8a8;
  cursor: not-allowed;
}
</style> 