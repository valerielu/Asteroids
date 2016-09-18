/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(1);
	const Asteroid = __webpack_require__(2);
	const MovingObject = __webpack_require__(3);
	const Game = __webpack_require__(4);
	const Ship = __webpack_require__(5);
	const Bullet = __webpack_require__(6);
	// const KeyMaster = require('./keymaster.js');

	function GameView(ctx) {
	  this.ctx = ctx;
	  this.game = {};
	}

	GameView.prototype.start = function(xDim, yDim, numAst) {
	  this.game  = new Game(xDim, yDim, numAst);
	  this.bindKeyHandlers();
	  setInterval(() => {this.game.step();}, 20);
	};

	GameView.prototype.bindKeyHandlers = function() {
	  key('w', () => {this.game.ship.power([0,-1])});
	  key('s', () => {this.game.ship.power([0,1])});
	  key('a', () => {this.game.ship.power([-1,0])});
	  key('d', () => {this.game.ship.power([1,0])});
	  key('t', () => {this.game.ship.fireBullet()});
	};

	let gameview = new GameView(ctx);

	gameview.start(1500, 1500, 20);


/***/ },
/* 1 */
/***/ function(module, exports) {

	const Util = {
	  inherits (childClass, parentClass) {
	    function Surrogate() {}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate;
	    childClass.prototype.constructor = childClass;
	  },


	  distance (v1,v2) {
	    return Math.pow((Math.pow((v1[0] - v2[0]), 2)
	     + Math.pow((v1[1] - v2[1]), 2)), .5);
	  },

	  norm (x) {
	    return Util.distance([0,0],x);
	  },

	  randomVec (length) {
	    let x = Math.random()*length;
	    let y = Math.pow(Math.pow(length, 2) - Math.pow(x, 2) , .5);
	    let t = Math.round(Math.random());
	    let w = Math.round(Math.random());
	    let m = Math.pow(-1,t);
	    let n = Math.pow(-1,w);
	    return [m * x,n * y];
	  }

	};

	module.exports = Util;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(1);
	const MovingObject = __webpack_require__(3);

	function Asteroid (pos, game, vel = Util.randomVec(5)) {
	  MovingObject.apply(this, [pos, game, vel, "darkgray", 50]);
	}


	Util.inherits(Asteroid, MovingObject);

	module.exports = Asteroid;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(1);
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(1);
	const Asteroid = __webpack_require__(2);
	const MovingObject = __webpack_require__(3);
	const Ship = __webpack_require__(5);
	const Bullet = __webpack_require__(6);


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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(1);
	const MovingObject = __webpack_require__(3);
	const Bullet = __webpack_require__(6);

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util  = __webpack_require__(1);
	const MovingObject = __webpack_require__(3);

	function Bullet(pos, game, vel) {
	  MovingObject.call(this, pos, game, vel, "darkgreen", 5);
	}
	Util.inherits(Bullet, MovingObject);

	Bullet.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	};


	module.exports = Bullet;


/***/ }
/******/ ]);