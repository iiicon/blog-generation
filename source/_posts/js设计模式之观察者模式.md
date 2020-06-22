---
title: js设计模式之观察者模式
date: 2020-06-22 14:50:26
tags: [code, 设计模式]
categories: js
---

## 观察者模式

一个典型的观察者模式应用场景是用户在一个网站订阅主题

1. 多个用户（观察者 observer）都可以订阅某个主题
2. 当主题内容更新时订阅该主题的用户都能收到通知

以下是代码实现

Subject 是构造函数， new Subject 创建一个主题对象，该对象内部维护订阅当前主题的观察者数组，主题对象上有一些方法，
如添加观察者（addObserver）,删除观察者（removeObserver）,通知观察者更新（notify），当 notify 时实际上调用全部观察者 observer 自身的 update 方法

Observer 上构造函数，new Observer 创建一个观察者对象，该对象有一个 update 方法

```js
class Subject {
  constructor() {
    this.observers = []
  }
  addObserver(observer) {
    this.observers.push(observer)
  }
  addObserver(observer) {
    var index = this.observers.indexOf(observer)
    this.observers.splice(index, 1)
  },
  notify() {
    this.observers.forEach(observer => observer.update())
  }
}

class Observer {
  udpate() {}
}

let subject = new Subject()
let observer1 = new Observer()
observer1.update = function() {
  console.log('observer1 update')
}
subject.addObserver(observer1)

let observer2 = new Observer('valley')
observer2.update = function() {
  console.log('observer2 update')
}
subject.addObserver(observer2)

subject.notify()
```

上面这段代码中，主题被观察者订阅的写法是 subject.addObserver(observer), 不是很直观，给观察者增加订阅方法

```js
class Observer {
  udpate() {}
  subscribeTo(subject) {
    subject.addObserver(this);
  }
}

let subject = new Subject();
let observer = new Observer();
observer.update = function () {
  console.log("observer update");
};
observer.subscribeTo(subject); //观察者订阅主题

subject.notify();
```

## 简化版（发布订阅）

```js
const eventManager = (function () {
  let eventList = {};
  function on(event, handler) {
    if (!eventList[event]) {
      eventList[event] = [handler];
    } else {
      eventList[event].push(handler);
    }
  }
   function off(event, handler) {
    if(eventList[event]) {
      if(!handler) {
        delete eventList[event]
      }else {
        let index = eventList[event].indexOf(handler)
        eventList[event].splice(index, 1)
      }
    }
  }
  function trigger(event, data) {
    if (eventList[event]) {
      eventList.forEach(event => event(data))
    }
  }
  return {
    on,
    off,
    trigger,
  };
})();

eventManager.on('say', function(data) {
  console.log('hello' + data)
})
eventManager.trigger('say', 'world')
```
