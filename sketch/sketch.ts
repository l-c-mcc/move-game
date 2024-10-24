const gameWidth: number = 1800;
const gameHeight: number = 900;
const gravityVel: number = 1000;
const jumpMaxVel: number = -1200;
const jumpDecay: number = 0.5; // how long for jump to give way to gravity
const jumpInterval: number = 0.25; // how often player can jump
const rightVel: number = 200;
const rightSinAmp: number = 600;
const rightSinOscSpeed: number = 10;
const leftInterval: number = 0.5;
const leftTeleport: p5.Vector = new p5.Vector(-200, -gravityVel * leftInterval);

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

function jump(): Movement {
  const actualJumpVel = jumpMaxVel - gravityVel;
  const jumpDecayRate = -actualJumpVel / jumpDecay;
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
  return (delta: number, movable: Movable) => {
    if (timeSinceJump > jumpInterval) {
      if (keyIsDown(87 /*w*/)) {
        timeSinceJump = 0;
      }
    }
    const lastTime = timeSinceJump;
    timeSinceJump += delta;
    if (lastTime < jumpDecay) {
      const endTime = min(timeSinceJump, jumpDecay);
      const velocity = culmVelocity(lastTime, endTime);
      movable.translate(new p5.Vector(0, velocity));
    }
  };
}

function rightwardMovement(): Movement {
  let timeTotal = 0;
  return (delta: number, movable: Movable) => {
    if (keyIsDown(68 /*d*/)) {
      movable.translate(
        new p5.Vector(
          rightVel,
          -gravityVel + sin(timeTotal * rightSinOscSpeed) * rightSinAmp,
        ).mult(delta),
      );
      timeTotal += delta;
    }
  };
}

function leftwardMovement(): Movement {
  let lastLeft: number = Infinity;
  return (delta: number, movable: Movable) => {
    if (keyIsDown(65) /*a*/ && lastLeft > leftInterval) {
      movable.translate(leftTeleport.copy());
      lastLeft = 0;
    }
    lastLeft += delta;
  };
}

function generatePlayerMovements(): Movement[] {
  let movements = [];
  movements.push(gravity());
  movements.push(jump());
  movements.push(rightwardMovement());
  movements.push(leftwardMovement());
  return movements;
}

function createPlayer(): Player {
  let playerWidth = 18;
  let playerHeight = 18;
  let playerImage = createGraphics(playerWidth, playerHeight);
  playerImage.fill(0, 0, 255);
  playerImage.rect(0, 0, playerWidth, playerHeight);
  let player = new Player(0, 0, playerImage, playerWidth, playerHeight);
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
