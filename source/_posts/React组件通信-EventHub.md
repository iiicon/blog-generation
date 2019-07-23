---
title: React组件通信-EventHub
date: 2019-07-17 19:56:12
categories: React
tags: [React, G]
---
### 代码仓库
[eventHub](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA2_1/index.jsx)   
[redux](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA2_2/index.jsx)

### 任意两个组件如何通信&&发布订阅模式

一个组件发布一个事件，另一个组件订阅这个事件，订阅事件的时候就是把触发的函数 push 到队列里，发布就是挨个执行这些函数，并把 payload 作为函数的参数执行

```
let fnObject = {}
let eventHub = {
  // 发布
  trigger(eventName, data) {
    let fnList = fnObject[eventName]
    if (!fnList) {
      return
    }
    for (let i = 0; i < fnList.length; i++) {
      fnList[i](data)
    }
  },
  // 订阅
  on(eventName, fn) {
    if (!fnObject[eventName]) {
      fnObject[eventName] = []
    }
    fnObject[eventName].push(fn)
  }
}

// eventHub 的 subscribe
let x = {
  init() {
    eventHub.on('xxx', function(data)=>{ // subscribe
      store.money -= data // reducer
      render()
    })
  }
}
x.init()
```

需要像上面这样的一个事件中心，管理发布和订阅，就是 trigger 和 on 两个函数

你在需要这个事件的地方去订阅，把需要执行的函数放在里 eventHub.on(eventName, fn)

```
eventHub.on('cost', data => {
  this.setState({
    money: this.state.money - data
  })
})
```

在执行组件行为的时候，你就可以发布一个事件（其实就是执行刚才那个函数）

```
eventHub.trigger('cost', 100)
```

这就是发布订阅模式。

### 利用 redux 进行组件通信

当然我们很多时候数据都是自上而下的单向数据流，这样的情况我们只需要在顶层组件去订阅事件，然后在需要的时候去发布事件就行了，这样所有组件都能共享数据了

`redux` 就是专门做这个的工具，需要用 `store` 对象来管理所有数据，下面是 `redux` 的主要步骤:

1. 第一步引入 `createStore` 函数 **createStore**

```
import { createStore } from 'redux'
```

2. 这个函数接受一个 `reducer` 的数据操作函数 **reducer**

```
let reducers = (state, action) => { // reducer
  state = state || { money: 10000 }
  switch (action.type) {
    case 'cost':
      return {
        money: state.money - action.payload
      }
    default:
      return state
  }
}
```

3. 创建 `store` 对象, 参数是 `reducer` 函数 **store**

```
let store = createStore(reducer) 
```

4. 你好像必须在顶层组件 `store.getState()` 获取数据

```
<App money={store.getState().money} />
```

5. 如果你要发布一个事件，用来和别的组件通信，你需要： **dispatch action**

```
store.dispatch({ type: 'cost', payload: 100 })
这个就对应上面发布 eventHub.trigger('cost', 100) 
```

**type 就是 action-type**
**payload 就是 action-payload**

6. 当然必须要订阅才能监听到发布的事件 **subscribe**

```
const render = () =>
  ReactDOM.render(
    <RA22 />,
    document.getElementById('root2')
  )
render()
store.subscribe(render) // 只要 store 一变化，subscribe 里面的函数就会执行，这个函数就是上面的 `x.init()`
```
