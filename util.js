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
