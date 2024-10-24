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
        for (let movement of this.movements) {
            movement(delta, this);
        }
    }
}
class Player extends Movable {
}
const gameWidth = 1200;
const gameHeight = 650;
const gravityVel = 200;
const jumpMaxVel = -700;
const jumpDecay = 0.5;
const jumpInterval = 0.25;
const rightVel = 200;
const rightSinAmp = 600;
const rightSinOscSpeed = 10;
const leftInterval = 0.5;
const leftTeleport = new p5.Vector(-200, -50);
const movables = [];
let prevTime = Date.now();
let curTime = 0;
let deltaSec = 0;
let player;
function gravity() {
    return (delta, movable) => {
        let change = new p5.Vector(0, gravityVel * delta);
        movable.translate(change);
    };
}
function jump() {
    const actualJumpVel = jumpMaxVel - gravityVel;
    const jumpDecayRate = (-actualJumpVel) / jumpDecay;
    const velIntegral = (t) => {
        return actualJumpVel * t + (jumpDecayRate / 2) * t * t;
    };
    const culmVelocity = (initTime, endTime) => {
        return velIntegral(endTime) - velIntegral(initTime);
    };
    let timeSinceJump = Infinity;
    return (delta, movable) => {
        if (timeSinceJump > jumpInterval) {
            if (keyIsDown(87)) {
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
function rightwardMovement() {
    let timeTotal = 0;
    return (delta, movable) => {
        if (keyIsDown(68)) {
            movable.translate((new p5.Vector(rightVel, -gravityVel + sin(timeTotal * rightSinOscSpeed) * rightSinAmp)).mult(delta));
            timeTotal += delta;
        }
    };
}
function leftwardMovement() {
    let lastLeft = Infinity;
    return (delta, movable) => {
        if (keyIsDown(65) && lastLeft > leftInterval) {
            movable.translate(leftTeleport.copy());
            lastLeft = 0;
        }
        lastLeft += delta;
    };
}
function generatePlayerMovements() {
    let movements = [];
    movements.push(gravity());
    movements.push(jump());
    movements.push(rightwardMovement());
    movements.push(leftwardMovement());
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