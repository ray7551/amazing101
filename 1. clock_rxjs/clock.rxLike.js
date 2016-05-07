'use strict';
/**
 A clock using rxjs-like observer pattern
 核心思想是数据源决定 UI 更新的时机
 1. Observable 是数据源（provider），Observer 是消费者（consumer）
 2. 数据源决定何时调用provider
 3. provider 内部调用 Observer.onNotify()，并传递数据
 4. Observer.onNotify() 调用 consumer 来把数据更新到 UI
 */


class Observer {
  constructor(consumer) {
    this._consumer = consumer;
  }
  onNotify(data) {
    this._consumer.call(this, data);
  }
};


class Observable {
  constructor(provider) {
    this._provider = provider;
  }
  subscribe(observer) {
    this._provider.call(this, observer);  // consumer 的调用时机由数据源决定
  }
}

let bootStrap = function () {
  let $clock = document.getElementById('clock');
  let $localClock = document.getElementById('localClock');
  let getTime = function (d) {
    return d.toTimeString().slice(0, 8);
  };
  let getLocalTime = function (d) {
    return d.toLocaleTimeString();
  };

  let tickStream = new Observable(function(observer) {
    setInterval(function() {
      observer.onNotify(new Date());
    }, 1000);
  });

  let clockRefresher = new Observer(function(dateTime) {
    $clock.textContent = getTime(dateTime);
  });
  let localClockRefresher = new Observer(function(dateTime) {
    $localClock.textContent = getLocalTime(dateTime);
  });

  tickStream.subscribe(clockRefresher);
  setTimeout(() => {
    tickStream.subscribe(localClockRefresher);
  }, 3000);
}


document.addEventListener('DOMContentLoaded', bootStrap, false);
