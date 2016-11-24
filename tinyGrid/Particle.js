util.extend(Particle, Container);
function Particle(x, y, option) {
  this.duration = option.duration;
  this.speed = option.speed;
  this.radius = option.radius;
  this.width = this.height = util.randomInt(option.radius, option.radius + 3);
  Container.call(this, {
    width: this.width,
    height: this.height,
    x: x,
    y: y
  });
  this.type = option.type;

  this.vx = 0;
  this.vy = 0;

  this.dying = false;
  this.base = [x, y];

  this.friction = .99;
  this.gravity = option.gravity;
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.setSpeed(util.randomInt(.1, .5));
  this.setHeading(util.randomInt(util.degreesToRads(0), util.degreesToRads(360)));
}

Particle.prototype = {
  getSpeed: function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  },

  setSpeed: function (speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },

  getHeading: function () {
    return Math.atan2(this.vy, this.vx);
  },

  setHeading: function (heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },
  
  resize: function(width, height){
    Container.prototype.resize.call(this);
    // @TODO adjust x, y
  },

  // @TODO: particle or the container should be rendered instead of have a render function
  update: function (context) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.radius < this.width && this.dying === false) {
      this.radius += this.duration;
    } else {
      this.dying = true;
    }
    if (this.dying === true) {
      this.radius -= this.duration;
    }

    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.y = this.base[1];
      this.dying = false;
      this.radius = 1.1;
      this.setSpeed(this.speed);
      this.width = util.randomInt(this.radius, this.radius + 3);
      this.setHeading(util.randomInt(0, 2 * Math.PI));
    }
    
    Container.prototype.update.call(this);
  }
};