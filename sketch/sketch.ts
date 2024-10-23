const gameWidth: number = 1200;
const gameHeight: number = 650;
const gravityForce: number = 350;
const jumpVel: p5.Vector = new p5.Vector(0, -250);
const jumpInterval: number = 0.5; // how often player can jump

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
  // Set jump
  let lastJump = 0;
  playerActions.set("w", () => {
    if ((curTime - lastJump) / 1000 > jumpInterval) {
      lastJump = curTime;
      player.add_velocity(jumpVel.copy());
    }
  });
}

function createPlayer(): Player {
  let playerWidth = 25;
  let playerHeight = 25;
  let playerImage = createGraphics(playerWidth, playerHeight);
  playerImage.fill(0, 0, 255);
  playerImage.rect(0, 0, playerWidth, playerHeight);
  player = new Player(0, 0, playerImage);
  player.add_force(gravity());
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
