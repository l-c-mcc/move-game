class Collidable {
    constructor(x, y, sprite) {
        this.pos = new p5.Vector(x, y);
        this.image = sprite;
    }
}
class Movable extends Collidable {
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.movements = [];
    }
    translate(vec) {
        this.pos.add(vec);
    }
    addMovement(movement) {
        this.movements.push(movement);
    }
    update(delta) {
        let reuse = [];
        while (this.movements.length > 0) {
            let movement = this.movements.pop();
            if (movement(delta, this)) {
                reuse.push(movement);
            }
        }
        this.movements = reuse;
    }
}
class Player extends Movable {
}
const gameWidth = 1200;
const gameHeight = 650;
const gravityVel = 100;
const jumpVel = new p5.Vector(0, -250);
const jumpInterval = 0.5;
const rightForce = new p5.Vector(10, 0);
const rightSinAmp = 100;
const movables = [];
let prevTime = Date.now();
let curTime = 0;
let deltaSec = 0;
let player;
function gravity() {
    return (delta, movable) => {
        let change = new p5.Vector(0, gravityVel * delta);
        movable.translate(change);
        return true;
    };
}
function generatePlayerMovements() {
    let movements = [];
    movements.push(gravity());
    return movements;
}
function createPlayer() {
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
//# sourceMappingURL=build.js.map