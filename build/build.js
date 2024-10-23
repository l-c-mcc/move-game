var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Collidable = (function () {
    function Collidable(x, y, sprite) {
        this.pos = new p5.Vector(x, y);
        this.image = sprite;
    }
    return Collidable;
}());
var Movable = (function (_super) {
    __extends(Movable, _super);
    function Movable(x, y, sprite) {
        var _this = _super.call(this, x, y, sprite) || this;
        _this.velocity = new p5.Vector(0, 0);
        _this.forces = [];
        return _this;
    }
    Movable.prototype.add_force = function (force) {
        this.forces.push(force);
    };
    Movable.prototype.update = function (delta) {
        for (var _i = 0, _a = this.forces; _i < _a.length; _i++) {
            var force = _a[_i];
            this.velocity.add(force(delta));
        }
        var translation = this.velocity.copy().mult(delta);
        this.pos.add(translation);
    };
    return Movable;
}(Collidable));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Player;
}(Movable));
var player;
var gameWidth = 1200;
var gameHeight = 650;
var movables = [];
var prev_time = Date.now();
var cur_time = 0;
function gravity(delta) {
    var scale = 100;
    return new p5.Vector(0, delta * scale);
}
function createPlayer() {
    var playerWidth = 25;
    var playerHeight = 25;
    var playerImage = createGraphics(playerWidth, playerHeight);
    playerImage.fill(0, 0, 255);
    playerImage.rect(0, 0, playerWidth, playerHeight);
    player = new Player(0, 0, playerImage);
    player.add_force(gravity);
    return player;
}
function setup() {
    createCanvas(gameWidth, gameHeight);
    var player = createPlayer();
    movables.push(player);
}
function draw() {
    background(0);
    cur_time = Date.now();
    var deltaSec = (cur_time - prev_time) / 1000;
    player.update(deltaSec);
    image(player.image, player.pos.x, player.pos.y);
    prev_time = cur_time;
}
//# sourceMappingURL=build.js.map