const gameWidth: number = 1200;
const gameHeight: number = 650;
const gravityVel: number = 100;
const jumpMaxVel: number = -100;
const jumpDecay: number = 0.1; // how long for jump to give way to gravity
const jumpInterval: number = 0.25; // how often player can jump
const rightForce: p5.Vector = new p5.Vector(10, 0);
const rightSinAmp: number = 100;

const movables: Movable[] = [];

let prevTime: number = Date.now();
let curTime: number = 0;
let deltaSec: number = 0;
let player: Player;

function gravity(): Movement {
  return (delta, movable) => {
    let change = new p5.Vector(0, gravityVel * delta);
    movable.translate(change);
  };
}

function generatePlayerMovements(): Movement[] {
  let movements = [];
  // Set gravity
  movements.push(gravity());
  // Jump
  const actualJumpVel = jumpMaxVel;
  const jumpDecayRate = (-actualJumpVel) / jumpDecay;
  const velIntegral = (t: number): number => {
    return actualJumpVel * t + (jumpDecayRate / 2) * t * t;
  };
  const culmVelocity = (initTime: number, endTime: number) => {
    return velIntegral(endTime) - velIntegral(initTime);
  };
  let timeSinceJump: number = Infinity;
  // states:
  // player jumping, cannot jump again
  // player not jumping, cannot jump again
  // player jumping, can jump again (not currently possible)
  // player not jumping, can jump again

  // check
  // 1. If player can jump, sees if player jumps
  // 2. If player is jumping, handle
  // 3. Always update time
  movements.push((delta: number, movable: Movable) => {
    if (timeSinceJump > jumpInterval) {
      if (keyIsDown(87 /*w*/)) {
        timeSinceJump = 0;
      }
    }
    const lastTime = timeSinceJump;
    timeSinceJump += delta;
    if (lastTime < jumpDecay) {
      console.log("here");
      const endTime = max(timeSinceJump, jumpDecay);
      const velocity = culmVelocity(lastTime, endTime);
      movable.translate(new p5.Vector(0, velocity));
    }
  });
  return movements;
}

function createPlayer(): Player {
  let playerWidth = 18;
  let playerHeight = 18;
  let playerImage = createGraphics(playerWidth, playerHeight);
  playerImage.fill(0, 0, 255);
  playerImage.rect(0, 0, playerWidth, playerHeight);
  let player = new Player(0, 0, playerImage);
  generatePlayerMovements().forEach((movement) => {
    player.addMovement(movement);
  });
  return player;
}

function setup() {
  createCanvas(gameWidth, gameHeight);

  player = createPlayer();
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