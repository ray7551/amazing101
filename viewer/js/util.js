let clog = function () {
  /* eslint-disable no-console */
  console.log.call(this, ...arguments);
};
clog.info = function () {
  Array.prototype.slice.call(arguments).forEach(function (text) {
    clog('%c' + text, 'color: blue');
  });
};
clog.warn = function () {
  Array.prototype.slice.call(arguments).forEach(function (text) {
    clog('%c' + text, 'color: yellowgreen');
  });
};
clog.err = function () {
  Array.prototype.slice.call(arguments).forEach(function (text) {
    clog('%c' + text, 'color: red');
  });
};

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * `delay` milliseconds. If `atBegin` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * */
let debounce = function (fn, delay, atBegin) {
  let timeout;
  return function () {
    let args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!atBegin) fn.apply(this, args);
    }, delay);
    if (atBegin && !timeout) {
      fn.apply(this, args);
    }
  };
};

/**
 * deep assign
 * var p = {a: 1, b:{c: 3}};
 * var c = deepAssign({}, p, {a: 2, b:{d: 4}});
 * c should be {a: 2, b:{c: 3, d: 4}};
 */
let deepAssign = function (target /*[, ...sources]*/) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  let output = Object(target);
  for (let index = 1; index < arguments.length; index++) {
    let source = arguments[index];
    if (source !== undefined && source !== null) {
      for (let nextKey in source) {
        if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
          if (Object.prototype.toString.apply(source[nextKey]) === '[object Object]') {
            output[nextKey] = output[nextKey] ? output[nextKey] : {};
            output[nextKey] = deepAssign({}, output[nextKey], source[nextKey]);
          } else {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }
  }
  return output;
};

let util = {
  clog: clog,
  debounce: debounce,
  deepAssign: deepAssign
};

export default util;
export {clog, debounce, deepAssign};
