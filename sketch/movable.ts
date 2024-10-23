type Movement = (delta: number, movable: Movable) => boolean;

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
    let reuse: Movement[] = [];
    while (this.movements.length > 0) {
      let movement = this.movements.pop();
      if (movement(delta, this)) {
        reuse.push(movement);
      }
    }
    this.movements = reuse;
  }

}

class Player extends Movable {}
