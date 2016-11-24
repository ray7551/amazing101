var util = {
  degreesToRads: function (degrees) {
    return degrees / 180 * Math.PI;
  },
  randomInt: function (min, max) {
    return min + Math.random() * (max - min + 1);
  },
  $: function (selector) {
    return document.querySelector(selector);
  },
  
  // extend prototype
  extend: function (child, parent) {
//     for (var p in parent) if (parent.hasOwnProperty(p)) child[p] = parent[p];
      function __() { this.constructor = child; }
      child.prototype = parent === null 
        ? Object.create(parent)
        : (__.prototype = parent.prototype, new __());
  },
  /**
   * deep assign
   * var p = {a: 1, b:{c: 3}};
   * var c = deepAssign({}, p, {a: 2, b:{d: 4}});
   * c should be {a: 2, b:{c: 3, d: 4}};
   */
  deepAssign: function (target /*[, ...sources]*/) {
    'use strict';
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source !== undefined && source !== null) {
        for (var nextKey in source) {
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
  }
}
;