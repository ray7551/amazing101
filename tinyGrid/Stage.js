var Stage = (function(_super){
  util.extend(Stage, _super);
  function Stage(option) {
    _super.call(this);
    // @TODO the font-family should be set in the option
    this.option = util.deepAssign({
      sampleRate: .25, // 0 ~ 1
      particle: {
        type: 'circle',
        radius: 1,
        gravity: 0,
        duration: .4,
        speed: .1
      }
    }, option);
    this.children = [];
    this.resize(this.width, this.height);
    this.buffer32Cache = null;
  }
  Stage.prototype.resize = function (width, height) {
    _super.prototype.resize.call(this, width, height);
    this.clearChildren(); // @TODO is it necessary here?
    if (this.buffer32Cache){
      this.generate();
    }
  };
  
  Stage.prototype.generate = function (buffer32) {
    var gridW = parseFloat(1 / this.option.sampleRate);
    if(buffer32) this.buffer32Cache = buffer32;
    console.log('generate ', this.width, this.height);
    console.log('generate ', this.buffer32Cache.width, this.buffer32Cache.height);
    console.log('l', this.buffer32Cache.buffer32.length);
    
    var width = this.buffer32Cache.width;
    var height = this.buffer32Cache.height;
    var buffer = this.buffer32Cache.buffer32;
    var enlargeRate = this.height / height;
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += gridW) {
        if (buffer[y * width + x]) {
          var particle = new Particle(x * enlargeRate, y * enlargeRate, this.option.particle);
          console.log('add', x, y);
          this.addChild(particle);
        }
      }
    }
  };
  
  return Stage;
})(Container);