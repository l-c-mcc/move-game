const gameWidth: number = 1800;
const gameHeight: number = 900;
const gravityVel: number = 700;
const followVel: number = 500;
const jumpMaxVel: number = -1200;
const jumpDecay: number = 0.5; // how long for jump to give way to gravity
const jumpInterval: number = 0.25; // how often player can jump
const rightVel: number = 600;
const rightSinAmp: number = 600;
const rightSinOscSpeed: number = 10;
const leftInterval: number = 0.5;
const leftTeleport: p5.Vector = new p5.Vector(-200, -gravityVel * leftInterval);
const spawnChance: number = 0.03;
const obstacleMinSpeed: number = 300;
const obstacleMaxSpeed: number = 900;
const obstacleMinSize: number = 15;
const obstacleMaxSize: number = 100;

const movables: Movable[] = [];
const collidables: Collidable[] = [];

let prevTime: number = Date.now();
let curTime: number = 0;
let deltaSec: number = 0;
let player: Player;
let game: boolean = true;

function findClosestBelowDir(above: Movable): Maybe<p5.Vector> {
  let below: Maybe<Movable> = null;
  const aboveVec = above.pos.copy();
  let aboveToBelow: Maybe<p5.Vector> = null;
  let aboveToBelowDis: number = Infinity;
  for (let movable of movables) {
    if (movable !== above && aboveVec.y < movable.pos.y) {
      const curVec = aboveVec.copy().sub(movable.pos);
      const curDis = curVec.mag();
      if (curDis < aboveToBelowDis) {
        aboveToBelow = curVec;
        aboveToBelowDis = curDis;
      }
    }
  }
  return aboveToBelow;
}


// to-do: detach from player logic
function gravity(): Movement {
  return (delta, movable) => {
    const closest = findClosestBelowDir(movable);
    if (closest !== null && keyIsDown(83 /*s*/)) {
      const norm = closest.normalize();
      norm.mult(-followVel * delta);
      movable.translate(norm);
    } else {
      let change = new p5.Vector(0, gravityVel * delta);
      movable.translate(change);
    }
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
  let player = new Player(
    gameWidth / 2,
    0,
    playerImage,
    playerWidth,
    playerHeight,
  );
  generatePlayerMovements().forEach((movement) => {
    player.addMovement(movement);
  });
  return player;
}

function createObstacle(
  x: number,
  y: number,
  width: number,
  height: number,
  movement: Movement,
): Movable {
  let image = createGraphics(width, height);
  image.fill(255, 140, 0);
  image.rect(0, 0, width, height);
  let obstacle = new Movable(x, y, image, width, height);
  obstacle.addMovement(movement);
  return obstacle;
}

function straightLineMovement(x: number, y: number): Movement {
  return (delta, movable) => {
    movable.translate(new p5.Vector(x, y).mult(delta));
  };
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnObstacle() {
  /** 1 = Start Up, 2 = Left, 3 = Down, 4 = Right */
  const direction = randomInt(1, 4);
  const width = randomInt(obstacleMinSize, obstacleMaxSize);
  const height = randomInt(obstacleMinSize, obstacleMaxSize);
  const speed = randomInt(obstacleMinSize, obstacleMaxSpeed);
  let movement: Maybe<Movement> = null;
  let x: Maybe<number> = null;
  let y: Maybe<number> = null;
  switch (direction) {
    case 1:
      movement = straightLineMovement(0, speed);
      x = randomInt(0, gameWidth - 1 - width);
      y = -height;
      break;
    case 2:
      movement = straightLineMovement(speed, 0);
      x = -width;
      y = randomInt(0, gameHeight - 1 - height);
      break;
    case 3:
      movement = straightLineMovement(0, -speed);
      x = randomInt(0, gameWidth - 1 - width);
      y = gameHeight;
      break;
    case 4:
      movement = straightLineMovement(-speed, 0);
      x = gameWidth;
      y = randomInt(0, gameHeight - 1 - height);
      break;
  }
  if (movement && x && y) {
    const obstacle = createObstacle(x, y, width, height, movement);
    collidables.push(obstacle);
    movables.push(obstacle);
  }
}

function setup() {
  createCanvas(gameWidth, gameHeight);

  player = createPlayer();
  collidables.push(player);
  movables.push(player);
}

function draw() {
  background(0);
  if (game) {
    if (Math.random() < spawnChance) {
      spawnObstacle();
    }
    curTime = Date.now();
    deltaSec = (curTime - prevTime) / 1000;
    for (let movable of movables) {
      movable.update(deltaSec);
      image(movable.image, movable.pos.x, movable.pos.y);
    }
    for (let collidable of collidables) {
      if (collidable !== player) {
        if (player.collision(collidable)) {
          game = false;
        }
      }
    }
  }
  prevTime = curTime;
}
