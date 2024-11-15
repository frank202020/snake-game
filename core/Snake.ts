interface Position {
  x: number;
  y: number;
}

export class Snake {
  private body: Position[];
  private direction: string;

  constructor() {
    this.direction = 'right';
    this.body = [
      { x: 12, y: 12 },
      { x: 11, y: 12 },
      { x: 10, y: 12 },
      { x: 9, y: 12 }
    ];
  }

  move(): void {
    const head = { ...this.body[0] };
    
    switch (this.direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }

    this.body.unshift(head);
    this.body.pop();
  }

  grow(): void {
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
  }

  setDirection(newDirection: string): void {
    const opposites: Record<string, string> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };

    if (opposites[newDirection as keyof typeof opposites] !== this.direction) {
      this.direction = newDirection;
    }
  }

  getBody(): Position[] {
    return this.body;
  }

  getHead(): Position {
    return this.body[0];
  }

  checkCollision(): boolean {
    const head = this.getHead();
    
    if (head.x < 0 || head.x >= 24 || head.y < 0 || head.y >= 24) {
      return true;
    }

    return this.body.slice(1).some(segment => 
      segment.x === head.x && segment.y === head.y
    );
  }
}
