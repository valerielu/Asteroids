const Util = require('./util.js');
const Asteroid = require('./asteroid.js');
const MovingObject = require('./moving_object.js');
const Game = require('./game.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');
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

gameview.start(1500, 1500, 5);
