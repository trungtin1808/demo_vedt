var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = 800;
var height = 600;

var bgRgba = [240, 240, 200, 255];
var pointRgba = [0, 0, 255, 255];
var lineRgba = [0, 0, 0, 255];
var vlineRgba = [255, 0, 0, 255];

canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

function Painter(context, width, height) {
  this.context = context;
  this.imageData = context.createImageData(width, height);
  this.points = [];
  this.now = [-1, -1];
  this.width = width;
  this.height = height;
  this.getPixelIndex = function (x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return -1;
    return (x + y * width) << 2;
  };
  this.setPixel = function (x, y, rgba) {
    pixelIndex = this.getPixelIndex(x, y);
    if (pixelIndex == -1) return;
    for (var i = 0; i < 4; i++) {
      this.imageData.data[pixelIndex + i] = rgba[i];
    }
  };
  this.drawPoint = function (p, rgba) {
    var x = p[0];
    var y = p[1];
    for (var i = -1; i <= 1; i++)
      for (var j = -1; j <= 1; j++) this.setPixel(x + i, y + j, rgba);
  };
  this.drawLine = function (p0, p1, rgba) {
    var x0 = p0[0],
      y0 = p0[1];
    var x1 = p1[0],
      y1 = p1[1];
    var dx = x1 - x0,
      dy = y1 - y0;
    if (dx == 0 && dy == 0) return;
    if (Math.abs(dy) <= Math.abs(dx)) {
      if (x1 < x0) {
        var tx = x0;
        x0 = x1;
        x1 = tx;
        var ty = y0;
        y0 = y1;
        y1 = ty;
      }
      var k = dy / dx;
      var y = y0;
      for (var x = x0; x <= x1; x++) {
        this.setPixel(x, Math.floor(y + 0.5), rgba);
        y = y + k;
      }
    } else {
      if (y1 < y0) {
        var tx = x0;
        x0 = x1;
        x1 = tx;
        var ty = y0;
        y0 = y1;
        y1 = ty;
      }
      var k = dx / dy;
      var x = x0;
      for (var y = y0; y <= y1; y++) {
        this.setPixel(Math.floor(x + 0.5), y, rgba);
        x = x + k;
      }
    }
  };
}

getPosOnCanvas = function (x, y) {
  var bbox = canvas.getBoundingClientRect();
  return [
    Math.floor(x - bbox.left * (canvas.width / bbox.width) + 0.5),
    Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5),
  ];
};

doMouseMove = function (e) {
  if (state == 0 || state == 2) {
    return;
  }
  var p = getPosOnCanvas(e.clientX, e.clientY);
  Painter.draw(p);
};

doMouseDown = function (e) {
  if (state == 2 || e.button != 0) {
    return;
  }
  var p = getPosOnCanvas(e.clientX, e.clientY);
  painter.addPoint(p);
  painter.draw(p);
  if (state == 0) {
    state = 1;
  }
};
doKeyDown = function (e) {
  if (state == 2) {
    return;
  }
  var keyID = e.keyCode ? e.keyCode : e.which;
  if (keyId == 27 && state == 1) {
    state = 2;
    painter.draw(painter.points[painter.points.length - 1]);
  }
};
