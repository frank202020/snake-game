interface Position {
  x: number;
  y: number;
}

export class Food {
  private position: Position;

  constructor() {
    this.position = this.generatePosition();
  }

  generatePosition(): Position {
    return {
      x: Math.floor(Math.random() * 24),
      y: Math.floor(Math.random() * 24)
    };
  }

  getPosition(): Position {
    return this.position;
  }

  relocate(snakeBody: Position[]): void {
    let newPosition;
    do {
      newPosition = this.generatePosition();
    } while (this.isOnSnake(newPosition, snakeBody));
    
    this.position = newPosition;
  }

  private isOnSnake(pos: Position, snakeBody: Position[]): boolean {
    return snakeBody.some(segment => 
      segment.x === pos.x && segment.y === pos.y
    );
  }
}
