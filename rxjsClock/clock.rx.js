'use strict';
/**
 * clock using rxjs
 */

let bootStrap = function () {
  let $clock = document.getElementById('clock');
  let $localClock = document.getElementById('localClock');
  let getTime = function (d) {
    return d.toTimeString().slice(0, 8);
  };
  let getLocalTime = function (d) {
    return d.toLocaleTimeString();
  };

  let tickStream = Rx.Observable.create(function(observer) {
    setInterval(function() {
      observer.onNext(new Date());
    }, 1000);
  });

  let clockRefresher = Rx.Observer.create(function(dateTime) {
    $clock.textContent = getTime(dateTime);
  });
  let localClockRefresher = Rx.Observer.create(function(dateTime) {
    $localClock.textContent = getLocalTime(dateTime);
  });

  tickStream.subscribe(clockRefresher);
  setTimeout(() => {
    tickStream.subscribe(localClockRefresher);
  }, 3000);
}


document.addEventListener('DOMContentLoaded', bootStrap, false);
