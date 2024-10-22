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
    function Collidable(x, y) {
        this.pos = new p5.Vector(x, y);
        this.image = null;
    }
    return Collidable;
}());
var Movable = (function (_super) {
    __extends(Movable, _super);
    function Movable(x, y) {
        var _this = _super.call(this, x, y) || this;
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
function setup() {
    var width = 1200;
    var height = 650;
    createCanvas(width, height);
}
function draw() {
    background(0);
    var fb = createGraphics(100, 100);
    fb.fill(0, 0, 255);
    fb.rect(0, 0, 50, 50);
    image(fb, 0, 0);
}
//# sourceMappingURL=build.js.map