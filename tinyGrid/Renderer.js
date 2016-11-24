;(function (window) {

// A canvas renderer
function Renderer(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.resize(document.body.clientWidth, document.body.clientHeight);
}

Renderer.prototype = {
  render: function (container) {
    if(!container.needRender){
      return;
    }
    switch (container.type) {
      case 'circle':
        Graphics.drawCircle(this.ctx, container.x, container.y, container.color, container.radius);
        break;
      case 'rect':
        Graphics.drawRect(this.ctx, container.x, container.y, container.color, container.width, container.height);
        break;
      default:
        break;
    }
    
    container.children.forEach(function (child) {
      this.render(child);
    }.bind(this));
    
    container.needRender = false;
  },
  resize: function (width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    // @TODO resize container
  }
};

window.Renderer = Renderer;
})(window);