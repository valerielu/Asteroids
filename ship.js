const Util = require('./util.js');
const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');

function Ship(pos, game) {
  MovingObject.apply(this, [pos, game, [0,0], "pink", 30]);
}
Util.inherits(Ship, MovingObject);

Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};
Ship.prototype.bulletVel = function() {
  let dirVec = [];
  if (Util.norm(this.vel) < .0001) {
    dirVec = [0, -1];
  } else {
    dirVec = [this.vel[0]/(Util.norm(this.vel) + .000000000001),
    this.vel[1]/(Util.norm(this.vel) + .00000000000001)];
  }
  return [this.vel[0] + 10 * dirVec[0], this.vel[1] + 10 * dirVec[1]];
};

Ship.prototype.fireBullet = function() {
  this.game.bullets.push(new Bullet(Array.from(this.pos), this.game, this.bulletVel()));
};




module.exports = Ship;
