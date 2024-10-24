type Movement = (delta: number, movable: Movable) => void;

class Collidable {
  public pos: p5.Vector;
  public image: p5.Graphics;

  constructor(x: number, y: number, sprite: p5.Graphics) {
    this.pos = new p5.Vector(x, y);
    this.image = sprite;
  }
}

class Movable extends Collidable {
  protected movements: Movement[];

  constructor(x: number, y: number, sprite: p5.Graphics) {
    super(x, y, sprite);
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
