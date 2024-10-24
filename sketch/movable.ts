type Movement = (delta: number, movable: Movable) => void;

class Collision {
  public vertical: boolean;
  public horizontal: boolean;

  constructor(vertical: boolean, horizontal: boolean) {
    this.vertical = vertical;
    this.horizontal = horizontal;
  }

  public isCollided(): boolean {
    return this.vertical || this.horizontal;
  }
}

class Collidable {
  public pos: p5.Vector;
  public widthHeight: p5.Vector;
  public image: p5.Graphics;

  constructor(
    x: number,
    y: number,
    sprite: p5.Graphics,
    width: number,
    height: number,
  ) {
    this.pos = new p5.Vector(x, y);
    this.widthHeight = new p5.Vector(width, height);
    this.image = sprite;
  }

  public collision(other: Collidable): Collision {
    const verticalCollision =
      other.pos.y + other.widthHeight.y > this.pos.y &&
      other.pos.y < this.pos.y + this.widthHeight.y;
    const horizontalCollision =
      other.pos.x < this.pos.x + other.widthHeight.x &&
      other.pos.x + other.widthHeight.x > this.pos.x;
    return new Collision(verticalCollision, horizontalCollision);
  }
}

class Movable extends Collidable {
  protected movements: Movement[];

  constructor(
    x: number,
    y: number,
    sprite: p5.Graphics,
    width: number,
    height: number,
  ) {
    super(x, y, sprite, width, height);
    this.movements = [];
  }

  public translate(vec: p5.Vector) {
    this.pos.add(vec);
  }

  public addMovement(movement: Movement) {
    this.movements.push(movement);
  }

  public update(delta: number) {
    for (let movement of this.movements) {
      movement(delta, this);
    }
  }
}

class Player extends Movable {}
