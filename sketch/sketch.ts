const gameWidth: number = 1200;
const gameHeight: number = 650;
const gravityVel: number = 100;
const jumpVel: p5.Vector = new p5.Vector(0, -250);
const jumpInterval: number = 0.5; // how often player can jump
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
    return true;
  };
}

function generatePlayerMovements(): Movement[] {
  let movements = [];
  movements.push(gravity());
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