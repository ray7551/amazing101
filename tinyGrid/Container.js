function Container(text, option) {
  // @TODO the font-family should be set in the option
  this.option = option || {
      text: 'HeiHeiHei',
      type: 'circle',
      resolution: 10,
      radius: 1,
      gravity: 0,
      duration: .4,
      speed: .1
    };
  this.text = text;
  this.children = [];
}
Container.prototype.setText = function (text) {
  this.text = text;
};
Container.prototype.clearChildren = function () {
  this.children = [];
};
Container.prototype.addChild = function (child) {
  this.children.push(child);
};
Container.prototype.render = function (context) {
  var width = context.canvas.width;
  var height = context.canvas.height;

  context.font = height*.4 + "px arial";
  context.fillText(this.text, width*.1, height*.6);
  var imgData = context.getImageData(0, 0, width, height);
  var buffer32 = new Uint32Array(imgData.data.buffer); // translate 8bit unsigned int into 32bit

  var gridH, gridW;
  gridH = gridW = parseFloat(this.option.resolution);
  for (var j = 0; j < height; j += gridH) {
    for (var i = 0; i < width; i += gridW) {
      if (buffer32[j * width + i]) {
        var particle = new Particle(i, j, this.option);
        this.addChild(particle);
      }
    }
  }
};