var $ = function(selector){
  return document.querySelector(selector);
}
var $all = function(selector){
  return document.querySelectorAll(selector);
}
window.addEventListener('load', function () {
  var random = $("#images").querySelectorAll("img");
  function makeImg (el,x,y,className) {
    var d = document.createElement("div");
    d.className     = "frame";
    d.style.left    = 50 * x + "%";
    d.style.top     = 50 * y + "%";
    var img         = document.createElement("img");
    img.className   = className ? "img "+className : "img";
    img.src         = random[Math.floor(Math.random()*4)].src;
    d.appendChild(img);
    el.appendChild(d);
  };
  function divide (el, remove) {
    remove = remove===void 0 ? true : !!remove;
    makeImg(el,0,0);
    makeImg(el,1,0, 'diagonal');
    makeImg(el,0,1, 'diagonal');
    makeImg(el,1,1);
    if(!remove){return;}
    el.removeChild(el.childNodes[0]);
  };
  var level = 1;
  divide($("#screen"), false, level);
  window.ondragstart = function() { return false; }
  document.onclick = function () {
    if(level > 11){return}
    level++;
    $all('.img.diagonal').forEach(function(img){
      divide(img.parentNode);
    });
  }
}, false);