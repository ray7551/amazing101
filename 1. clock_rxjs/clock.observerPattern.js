'use strict';
/**
 A clock using classical observer pattern
 核心思想是数据源决定 UI 更新的时机
 1. Observable 是数据源（provider），Observer 是消费者（consumer）
 2. 数据源决定何时用 notify 方法传递数据给每个 Observer 的 update 方法
 3. Observer 的 update 方法把数据加工并更新到 UI
 */

class Observer {
  constructor(Observable) {
    this.observable = Observable;
  }
  update(changedData) {
    // consumer 的调用时机由数据源决定
  }
};

class Observable {
  constructor() {
    this._observerList = [];
  }
  // Add observer
  attach(observer) {
    if (this._observerList.indexOf(observer) === -1) {
      this._observerList.push(observer);
    }
  }
  // remove observer
  detach(observer) {
    let index = this._observerList.indexOf(observer);
    if (index !== -1) {
      this._observerList.splice(index, 1);
    }
  }
  notify(data) {
    for (let observer of this._observerList) {
      observer.update(data);
    }
  }
}

let bootStrap = () => {
  let $clock = document.getElementById('clock');
  let $localClock = document.getElementById('localClock');

  let getTime = (d) => {
    return d.toTimeString().slice(0, 8);
  };
  let getLocalTime = (d) => {
    return d.toLocaleTimeString();
  };

  let tickStream = new Observable();
  tickStream.tick = () => {
    setInterval(() => {
      tickStream.notify(new Date());
    }, 1000);
  };

  let clockRefresher = new Observer(tickStream);
  clockRefresher.update = (changedDate)=> {
    $clock.textContent = getTime(changedDate);
  };
  let localClockRefresher = new Observer(tickStream);
  localClockRefresher.update = (changedDate)=> {
    $localClock.textContent = getLocalTime(changedDate);
  };

  tickStream.attach(clockRefresher);
  tickStream.tick();
  setTimeout(() => {
    tickStream.attach(localClockRefresher);
  }, 3000);
}


document.addEventListener('DOMContentLoaded', bootStrap, false);
