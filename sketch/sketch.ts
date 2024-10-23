const gameWidth: number = 1200;
const gameHeight: number = 650;
const gravityForce: number = 100;
const jumpVel: p5.Vector = new p5.Vector(0, -250);
const jumpInterval: number = 0.5; // how often player can jump
const rightForce: p5.Vector = new p5.Vector(10, 0);
const rightSinAmp: number = 100;

const movables: Movable[] = [];
const playerActions: Map<string, () => void> = new Map();

let prevTime: number = Date.now();
let curTime: number = 0;
let deltaSec: number = 0;
let player: Player;

function gravity(acceleration?: p5.Vector): Force {
  if (acceleration == null) {
    return (delta: number) => {
      return new p5.Vector(0, gravityForce * delta);
    };
  } else {
    return (delta: number) => {
      return new p5.Vector(acceleration.x * delta, acceleration.y * delta);
    };
  }
}

function initPlayerActions() {
  player.add_force(gravity());
  // Set jump
  let lastJump = 0;
  playerActions.set("w", () => {
    if ((curTime - lastJump) / 1000 > jumpInterval) {
      lastJump = curTime;
      let jump = jumpVel.copy();
      let curVel = player.get_velocity();
      player.set_velocity(new p5.Vector(curVel.x, jump.y));
    }
  });
  // Set right
  let prevRightMovTime: number = 0;
  player.add_force((delta: number) => {
    if (keyIsPressed === true && key == "d") {
      let curRightMovTime: number = prevRightMovTime + delta;
      let time_scale = 24;
      let verticalForce =
        (-cos(curRightMovTime * time_scale) + cos(prevRightMovTime * time_scale)) * rightSinAmp;
      let velocity = rightForce.copy();
      velocity.y = -gravityForce * delta;
      player.pos.y += verticalForce;
      prevRightMovTime = curRightMovTime;
      return velocity;
    }
  });
}

function createPlayer(): Player {
  let playerWidth = 18;
  let playerHeight = 18;
  let playerImage = createGraphics(playerWidth, playerHeight);
  playerImage.fill(0, 0, 255);
  playerImage.rect(0, 0, playerWidth, playerHeight);
  player = new Player(0, height / 2, playerImage);
  return player;
}

function setup() {
  createCanvas(gameWidth, gameHeight);

  let player = createPlayer();
  initPlayerActions();
  movables.push(player);
}

function draw() {
  background(0);
  if (keyIsPressed) {
    if (key === "d") {
    }
  }
  curTime = Date.now();
  deltaSec = (curTime - prevTime) / 1000;
  player.update(deltaSec);
  image(player.image, player.pos.x, player.pos.y);
  prevTime = curTime;
}

function keyPressed() {
  let action = playerActions.get(key);
  if (action != undefined) {
    action();
  }
}
