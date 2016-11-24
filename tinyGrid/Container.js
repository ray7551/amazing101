var Container = (function () {
  "use strict";
  function Container(option) {
    option = util.deepAssign({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      x: 0,
      y: 0
    }, option);
    this.width = option.width;
    this.height = option.height;
    this.x = option.x;
    this.y = option.y;
    this.needRender = true;
    this.autoResize = false;
    this.children = [];
  }
  Container.prototype.resize = function (width, height) {
    var originWidth = this.width;
    var originHeight = this.height;
    this.width = width || this.width;
    this.height = height || this.height;
    // @TODO resize all children
    this.children.forEach(function(container){
      if(!container.autoResize) {
        container.resize();
        return;
      }
      container.resize(
        container.width * this.width / originWidth,
        container.height * this.height / originHeight);
    }.bind(this));
  };
  Container.prototype.clearChildren = function () {
    this.children = [];
  };
  Container.prototype.addChild = function (child) {
    this.children.push(child);
  };
  Container.prototype.update = function () {
    this.children.forEach(function (particle) {
      particle.update(renderer.ctx);
    });
    this.needRender = true;
  };
  return Container;
})();