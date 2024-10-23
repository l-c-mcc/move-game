const gameWidth = 1200;
const gameHeight = 650;
const gravityAccel = 50;

const movables: Movable[] = [];

let prev_time = Date.now();
let cur_time = 0;
let player: Player;

function gravity(acceleration?: p5.Vector): Force {
    if (acceleration == null) {
        return (delta: number) => {
            return new p5.Vector(0, gravityAccel * delta);
        };
    } else {
        return (delta: number) => {
            return new p5.Vector(acceleration.x * delta, acceleration.y * delta);
        };
    }
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
  movables.push(player);
}

function draw() {
  background(0);
  cur_time = Date.now();
  let deltaSec = (cur_time - prev_time) / 1000;
  player.update(deltaSec);
  image(player.image, player.pos.x, player.pos.y);
  prev_time = cur_time;
}
