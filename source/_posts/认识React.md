---
title: 认识React
date: 2019-07-09 23:42:21
categories: React
tags: [React, G]
---

### 认识 React

先做一个小小的 dom 展示

```
import React from 'react';
import ReactDOM from 'react-dom';

class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 1
    }
  }
  add() {
    this.setState({
      number: this.state.number + 1
    })
  }
  render() {
    return (
      <div className="red">
        <span>{this.state.number}</span>
        <button onClick={this.add.bind(this)}>+</button>
        <strong>{this.props.name}</strong>
      </div>
    )
  }
}

function App(props) {
  return (
    <div className="App">
      name is {props.name}
      <Box name="box is god"/>
    </div>
  )
}

ReactDOM.render(<App name="app"/>, document.getElementById('root'));
```

1. 可以用标签的写法来写 dom，都对应虚拟 dom，js 的语法要在 {} 中表示
2. 组件可以用函数实现，函数就是组件，组件对应的属性会被抽象为一个对象，作为函数的参数传递
3. 组件可以用 class 实现，且必须继承自 React.Component
4. 一般外面的属性用 props 表示，内部的属性用 state 表示
5. 组件的属性要写在 constructor 构造函数里，作为实例的属性
6. 必须要有一个 render 函数，用来书写 dom 结构
7. 默认在组件中使用事件书写回调时会把 this 指为 undefined，this.add.call(undefined, 1), 所以要写箭头函数，或者手动 bind this
8. 修改数据要用 setState, 默认只能写一次，书写多次要给 setState 传一个参数，用来接收和返回 state

今天暂时就这样...

[demo 仓库](https://github.com/iiicon/react-demo-2)
