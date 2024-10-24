class Collidable {
    constructor(x, y, sprite, width, height) {
        this.pos = new p5.Vector(x, y);
        this.widthHeight = new p5.Vector(width, height);
        this.image = sprite;
    }
    collision(other) {
        const verticalCollision = other.pos.y + other.widthHeight.y > this.pos.y &&
            other.pos.y < this.pos.y + this.widthHeight.y;
        const horizontalCollision = other.pos.x < this.pos.x + other.widthHeight.x &&
            other.pos.x + other.widthHeight.x > this.pos.x;
        return verticalCollision && horizontalCollision;
    }
}
class Movable extends Collidable {
    constructor(x, y, sprite, width, height) {
        super(x, y, sprite, width, height);
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
const gameWidth = 1800;
const gameHeight = 900;
const gravityVel = 1000;
const followVel = 500;
const jumpMaxVel = -1200;
const jumpDecay = 0.5;
const jumpInterval = 0.25;
const rightVel = 600;
const rightSinAmp = 600;
const rightSinOscSpeed = 10;
const leftInterval = 0.5;
const leftTeleport = new p5.Vector(-200, -gravityVel * leftInterval);
const spawnChance = 0.03;
const obstacleMinSpeed = 300;
const obstacleMaxSpeed = 900;
const obstacleMinSize = 15;
const obstacleMaxSize = 100;
const movables = [];
const collidables = [];
let prevTime = Date.now();
let curTime = 0;
let deltaSec = 0;
let player;
let game = true;
function findClosestBelowDir(above) {
    let below = null;
    const aboveVec = above.pos.copy();
    let aboveToBelow = null;
    let aboveToBelowDis = Infinity;
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
function gravity() {
    return (delta, movable) => {
        const closest = findClosestBelowDir(movable);
        if (closest !== null && keyIsDown(83)) {
            const norm = closest.normalize();
            norm.mult(-followVel * delta);
            movable.translate(norm);
        }
        else {
            let change = new p5.Vector(0, gravityVel * delta);
            movable.translate(change);
        }
    };
}
function jump() {
    const actualJumpVel = jumpMaxVel - gravityVel;
    const jumpDecayRate = -actualJumpVel / jumpDecay;
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
            movable.translate(new p5.Vector(rightVel, -gravityVel + sin(timeTotal * rightSinOscSpeed) * rightSinAmp).mult(delta));
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
    let player = new Player(gameWidth / 2, 0, playerImage, playerWidth, playerHeight);
    generatePlayerMovements().forEach((movement) => {
        player.addMovement(movement);
    });
    return player;
}
function createObstacle(x, y, width, height, movement) {
    let image = createGraphics(width, height);
    image.fill(255, 140, 0);
    image.rect(0, 0, width, height);
    let obstacle = new Movable(x, y, image, width, height);
    obstacle.addMovement(movement);
    return obstacle;
}
function straightLineMovement(x, y) {
    return (delta, movable) => {
        movable.translate(new p5.Vector(x, y).mult(delta));
    };
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function spawnObstacle() {
    const direction = randomInt(1, 4);
    const width = randomInt(obstacleMinSize, obstacleMaxSize);
    const height = randomInt(obstacleMinSize, obstacleMaxSize);
    const speed = randomInt(obstacleMinSize, obstacleMaxSpeed);
    let spawnPos = new p5.Vector(0, 0);
    let movement = null;
    let x = null;
    let y = null;
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
//# sourceMappingURL=build.js.map