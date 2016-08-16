function sum1() {
  let args = Array.from(arguments);
  let sol = 0;
  args.forEach( (arg) => {
    sol += arg;
  });
  return sol;
}

function sum2(...args) {
  let sol = 0;
  args.forEach( (arg) => {
    sol += arg;
  });
  return sol;
}

Function.prototype.myBind = function(context, ...otherargs) {
  return (...args) => this.apply(context, otherargs.concat(args));
};

Function.prototype.myBind2 = function(context) {
  let args = Array.from(arguments);
  let that = this;
  return function() {
    let args2 = Array.from(arguments);
    that.apply(context, args.slice(1).concat(args2));
  };
};

function curriedSum(count) {
  let numbers = [];
  let sum = 0;
  return function _curriedSum(num) {
    sum += num;
    if (numbers.push(num) === count) {
      return sum;
    } else {
      return _curriedSum;
    }
  };
}

Function.prototype.curry = function(num) {
  let args = [];
  let func = this;

  return function _fun(arg) {
    if (args.push(arg) === num) {
      return func(...args);
    } else {
      return _fun;
    }
  };
};

Function.prototype.curry2 = function(num) {
  let args = [];
  let func = this;

  return function _fun(arg) {
    if (args.push(arg) === num) {
      return func.apply(func, args);
    } else {
      return _fun;
    }
  };
};


function sumThree(num1, num2, num3) {
  return num1 + num2 + num3;
}

console.log(sumThree.curry2(3)(4)(20)(6));
