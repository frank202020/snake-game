import { Snake } from './Snake';
import { Food } from './Food';

export class Game {
  private snake: Snake;
  private food: Food;
  private score: number;
  private highScore: number;
  private isGameOver: boolean;
  private isPaused: boolean;
  public readonly moveInterval: number = 200;

  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    this.isGameOver = false;
    this.isPaused = false;
  }

  update(): void {
    if (this.isGameOver || this.isPaused) return;

    this.snake.move();

    if (this.snake.checkCollision()) {
      this.gameOver();
      return;
    }

    // 检查是否吃到食物
    const head = this.snake.getHead();
    const food = this.food.getPosition();

    // 修改这里的判断逻辑，确保正确检测碰撞
    if (head.x === food.x && head.y === food.y) {
      // 蛇增长
      this.snake.grow();
      // 更新分数
      this.updateScore();
      // 重新放置食物
      this.food.relocate(this.snake.getBody());
      
      // 可以在控制台输出来调试
      console.log('Score:', this.score);
    }
  }

  private updateScore(): void {
    this.score += 1;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
  }

  private gameOver(): void {
    this.isGameOver = true;
  }

  // Getters
  getSnake(): Snake {
    return this.snake;
  }

  getFood(): Food {
    return this.food;
  }

  getScore(): number {
    return this.score;
  }

  getHighScore(): number {
    return this.highScore;
  }

  getIsGameOver(): boolean {
    return this.isGameOver;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  // Game controls
  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  restart(): void {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.isGameOver = false;
    this.isPaused = false;
  }

  handleKeyPress(key: string): void {
    switch (key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        this.snake.setDirection('up');
        break;
      case 'arrowdown':
      case 's':
        this.snake.setDirection('down');
        break;
      case 'arrowleft':
      case 'a':
        this.snake.setDirection('left');
        break;
      case 'arrowright':
      case 'd':
        this.snake.setDirection('right');
        break;
      case ' ':
        this.togglePause();
        break;
      case 'r':
        this.restart();
        break;
    }
  }
}
