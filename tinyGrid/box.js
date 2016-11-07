var $ = function(selector) {
  return document.querySelector(selector);
}
var $all = function(selector) {
  return document.querySelectorAll(selector);
}

window.addEventListener('DOMContentLoaded', function() {
  function makeBox(el, x, y, className) {
    className = className ? className : '';
    var d = document.createElement("div");
    d.className = "frame";
    d.style.left = 50 * x + "%";
    d.style.top = 50 * y + "%";

    var box = document.createElement("div");
    box.classList.add('box');
    if (className) box.classList.add(className);
    box.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);

    d.appendChild(box);
    el.appendChild(d);
  };

  function divide(el, remove) {
    remove = remove === void 0 ? true : !!remove;
    makeBox(el, 0, 0);
    makeBox(el, 1, 0, 'diagonal');
    makeBox(el, 0, 1, 'diagonal');
    makeBox(el, 1, 1);
    if (!remove) {
      return; }
    el.removeChild(el.childNodes[0]);
  };
  var level = 1;
  divide($("#screen"), false, level);
  window.ondragstart = function() {
    return false; }
  document.onclick = function() {
    if (level > 9) {
      $all('.box').forEach(function(box) {
        box.onclick = function() {
          divide(this.parentNode);
        };
      });
      return;
    }
    level++;
    $all('.box.diagonal').forEach(function(box) {
      divide(box.parentNode);
    });
  }

}, false);
