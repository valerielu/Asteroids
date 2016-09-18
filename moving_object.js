const Util = require('./util.js');
// const Bullet = require('./bullet.js');

function MovingObject(pos, game, vel, color, rad) {
  this.pos = pos;
  this.vel = vel;
  this.color = color;
  this.rad = rad;
  this.game = game;
}

MovingObject.prototype.move = function() {
  let x = this.pos[0] + this.vel[0];
  let y = this.pos[1] + this.vel[1];

  this.pos = this.game.wrap([x,y]);
};

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.rad,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  return Util.distance(this.pos, otherObject.pos) < this.rad + otherObject.rad;
};


MovingObject.prototype.collideWith = function(otherObject) {
  this.game.remove(this);
  this.game.remove(otherObject);
};


module.exports = MovingObject;
