class Collidable {
    constructor(x, y, sprite) {
        this.pos = new p5.Vector(x, y);
        this.image = sprite;
    }
}
class Movable extends Collidable {
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.velocity = new p5.Vector(0, 0);
        this.forces = [];
    }
    add_force(force) {
        this.forces.push(force);
    }
    add_velocity(velocity) {
        this.velocity = velocity;
    }
    update(delta) {
        for (let force of this.forces) {
            this.velocity.add(force(delta));
        }
        let translation = this.velocity.copy().mult(delta);
        this.pos.add(translation);
    }
}
class Player extends Movable {
}
const gameWidth = 1200;
const gameHeight = 650;
const gravityForce = 350;
const jumpVel = new p5.Vector(0, -250);
const jumpInterval = 0.5;
const movables = [];
const playerActions = new Map();
let prevTime = Date.now();
let curTime = 0;
let deltaSec = 0;
let player;
function gravity(acceleration) {
    if (acceleration == null) {
        return (delta) => {
            return new p5.Vector(0, gravityForce * delta);
        };
    }
    else {
        return (delta) => {
            return new p5.Vector(acceleration.x * delta, acceleration.y * delta);
        };
    }
}
function initPlayerActions() {
    let lastJump = 0;
    playerActions.set("w", () => {
        if (((curTime - lastJump) / 1000) > jumpInterval) {
            lastJump = curTime;
            player.add_velocity(jumpVel.copy());
        }
    });
}
function createPlayer() {
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
//# sourceMappingURL=build.js.map