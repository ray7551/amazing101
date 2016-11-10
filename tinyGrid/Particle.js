function Particle(x, y, option) {
  this.radius = option.radius;
  this.duration = option.duration;
  this.speed = option.speed;
  this.type = option.type;
  this.futurRadius = util.randomInt(option.radius, option.radius + 3);

  this.x = x;
  this.y = y;
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

  // @TODO: particle or the container should be rendered instead of have a render function
  render: function (context) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.radius < this.futurRadius && this.dying === false) {
      this.radius += this.duration;
    } else {
      this.dying = true;
    }
    if (this.dying === true) {
      this.radius -= this.duration;
    }

    switch (this.type) {
      case 'circle':
        Graphics.drawCircle(context, this.x, this.y, this.color, this.radius);
        break;
      case 'rect':
        Graphics.drawRect(context, this.x, this.y, this.color, this.futurRadius);
        break;
    }

    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.y = this.base[1];
      this.dying = false;
      this.radius = 1.1;
      this.setSpeed(this.speed);
      this.futurRadius = util.randomInt(this.radius, this.radius + 3);
      this.setHeading(util.randomInt(0, 2 * Math.PI));
    }
  }
};

// @TODO: make Graphics a class
var Graphics = function() {};
Graphics.drawCircle = function (context, x, y, color, radius) {
  context.save();
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, Math.PI * 2, 0);
  context.closePath();
  context.fill();
  context.restore();
};

Graphics.drawRect = function (context, x, y, color, width, height) {
  height = height===void 0 ? width : height;
  context.save();
  context.fillStyle = color;
  context.beginPath();
  context.fillRect(x, y, width, height);
  context.closePath();
  context.fill();
  context.restore();
};