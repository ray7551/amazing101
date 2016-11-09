var $ = function (selector) {
  return document.querySelector(selector);
};
var $all = function (selector) {
  return document.querySelectorAll(selector);
};
var colorScheme = [
  '#6BED08',
  '#A0F261',
  '#86EF35',
  '#60DD00',
  '#4AAA00',
  '#F8FE09',
  '#FBFE66',
  '#F9FE39',
  '#F2F800',
  '#BABF00',
  '#06BEBE',
  '#54D1D1',
  '#2CC5C5',
  '#009595',
  '#007373'
];
getRandomColor = function () {
  return colorScheme[Math.floor(colorScheme.length * Math.random())];
};

window.addEventListener('DOMContentLoaded', function () {
  function makeBox(el, x, y, className) {
    className = className ? className : '';
    var d = document.createElement("div");
    d.className = "frame";
    d.style.left = 50 * x + "%";
    d.style.top = 50 * y + "%";

    var box = document.createElement("div");
    box.classList.add('box');
    if (className) box.classList.add(className);
    box.style.backgroundColor = getRandomColor();

    d.appendChild(box);
    el.appendChild(d);
  }

  function divide(el, remove) {
    remove = remove === void 0 ? true : !!remove;
    makeBox(el, 0, 0);
    makeBox(el, 1, 0, 'diagonal');
    makeBox(el, 0, 1, 'diagonal');
    makeBox(el, 1, 1);
    if (!remove) {
      return;
    }
    el.removeChild(el.childNodes[0]);
  }

  var level = 1;
  divide($("#screen"), false, level);

  document.onclick = function () {
    if (level > 9) {
      $all('.box').forEach(function (box) {
        box.onclick = function () {
          divide(this.parentNode);
        };
      });
      return;
    }
    level++;
    $all('.box.diagonal').forEach(function (box) {
      divide(box.parentNode);
    });
  }

}, false);
