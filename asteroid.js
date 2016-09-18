const Util = require('./util.js');
const MovingObject = require('./moving_object.js');

function Asteroid (pos, game, vel = Util.randomVec(5)) {
  MovingObject.apply(this, [pos, game, vel, "darkgray", 50]);
}


Util.inherits(Asteroid, MovingObject);

module.exports = Asteroid;
