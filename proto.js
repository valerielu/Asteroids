Function.prototype.inherits = function(parent) {
  function Surrogate() {}
  Surrogate.prototype = parent.prototype;
  this.prototype = new Surrogate;
  this.prototype.constructor = this;
};


function MovingObject(name) {
  this.name = name;
}

MovingObject.prototype.move = function(pos) {
  console.log(`move to ${pos}`);
};

function Ship (captain, name) {
  this.captain = captain;
  MovingObject.call(this, name);
}
Ship.inherits(MovingObject);

function Asteroid (size) {
  this.size = size;
}
Asteroid.inherits(MovingObject);

Asteroid.prototype.split = function() {
  console.log('nothing');
};

let falcon = new Ship("Han Solo");

let phobos = new Asteroid(293847234);

let corgus = new MovingObject("Corgus the Magnificient");

// console.log(falcon.split());
console.log(phobos.__proto__);
