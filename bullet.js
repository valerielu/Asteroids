const Util  = require('./util.js');
const MovingObject = require('./moving_object.js');

function Bullet(pos, game, vel) {
  MovingObject.call(this, pos, game, vel, "darkgreen", 5);
}
Util.inherits(Bullet, MovingObject);

Bullet.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};


module.exports = Bullet;
