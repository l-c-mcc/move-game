type Force = (delta: number) => p5.Vector;

class Collidable {
  public pos: p5.Vector;
  public image: p5.Graphics;

  constructor(x: number, y: number, sprite: p5.Graphics) {
    this.pos = new p5.Vector(x, y);
    this.image = sprite;
  }
}

class Movable extends Collidable {
  protected velocity: p5.Vector;
  protected forces: Force[];

  constructor(x: number, y: number, sprite: p5.Graphics) {
    super(x, y, sprite);
    this.velocity = new p5.Vector(0, 0);
    this.forces = [];
  }

  add_force(force: Force) {
    this.forces.push(force);
  }

  get_velocity(): p5.Vector {
    return this.velocity.copy();
  }

  set_velocity(velocity: p5.Vector) {
    this.velocity = velocity;
  }

  update(delta: number) {
    for (let force of this.forces) {
      this.velocity.add(force(delta));
    }
    console.log(this.velocity);
    let translation = this.velocity.copy().mult(delta);
    this.pos.add(translation);
  }
}

class Player extends Movable {}
