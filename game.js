const Util = require('./util.js');
const Asteroid = require('./asteroid.js');
const MovingObject = require('./moving_object.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');


function Game(xDim, yDim, numAst) {
  this.xDim = xDim;
  this.yDim = yDim;
  this.asteroids = [];
  this.bullets = [];
  this.ship = new Ship(this.randomPos(), this);

  for(let i = 0; i < numAst; i++) {
    this.addAsteroids();
  }
}

Game.prototype.addAsteroids = function() {
  let rPos = this.randomPos();
  let ast = new Asteroid(rPos, this);
  this.asteroids.push(ast);
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.xDim, this.yDim);
  this.allObjects().forEach( (obj) => {
    obj.draw(ctx);
  });
};

Game.prototype.moveObjects = function(ctx) {
  this.allObjects().forEach( (obj) => {
    obj.move();
  });
};

Game.prototype.wrap = function(pos) {
  if (pos[0] < 0 || pos[0] > this.xDim) {
    return [this.xDim - pos[0], pos[1]];
  } else if(pos[1] < 0 || pos[1] > this.yDim) {
    return [pos[0], this.yDim - pos[1]];
  } else {
    return pos;
  }
};

Game.prototype.remove = function(obj) {
  if (obj instanceof Asteroid) {
    let i = this.asteroids.indexOf(obj);
    this.asteroids.splice(i, 1);
  } else if (obj instanceof Bullet) {
    let i = this.bullets.indexOf(obj);
    this.bullets.splice(i, 1);
  } else {
    this.ship = new Ship(this.randomPos(), this);
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.draw(ctx);
  this.checkCollisions();
};

Game.prototype.checkCollisions = function() {
  let collisions = [];
  this.allObjects().forEach( (obj, idx) => {
    this.allObjects().forEach((otherObj, i) => {
      if (i !== idx) {
        if (obj.isCollidedWith(otherObj)) {
          if (obj instanceof Ship && otherObj instanceof Asteroid) {
            collisions.push(obj);
          } else if (obj instanceof Asteroid && otherObj instanceof Bullet) {
            collisions.push(obj);
            collisions.push(otherObj);
          }
        }
      }
    });
  });
  collisions.forEach( (obj) =>{
    this.remove(obj);
  });
};

Game.prototype.randomPos = function() {
  let x = Math.random() * this.xDim;
  let y = Math.random() * this.yDim;
  return [x,y];
};

Game.prototype.allObjects = function() {
  return this.asteroids.concat(this.bullets).concat([this.ship]);
};

module.exports = Game;
