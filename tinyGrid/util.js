var util = {
  degreesToRads: function(degrees) {
    return degrees / 180 * Math.PI;
  },
  randomInt: function(min, max) {
    return min + Math.random() * (max - min + 1);
  }
};