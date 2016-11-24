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

Graphics.fillText = function (context, text, width, height) {
  context.save();
  context.font = height + "px arial";
  context.fillText(text, 0, height);
  context.restore();
};

Graphics.getImageDataBuffer32 = function (context) {
  console.log('getting imgDataBuffer32');
  var imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

  console.log('imgData:', imgData);
  return {
    buffer32: new Uint32Array(imgData.data.buffer),
    width: context.canvas.width,
    height: context.canvas.height
  };
};