---
title: React-ContextApi
date: 2019-07-24 00:12:20
categories: React
tags: [React, G]
---

### 用 context api 传值
**ContextApi就是给组件共享一个全局的局部变量**

首先需要 createContext

    const nContext = React.createContext(0)

其次需要在要传递值的组件上用 nContext.Provider 包起来，把要传递的值放到 value 上

    <nContext.Provider value={this.state.x}>
      <F1 />
    </nContext.Provider>

然后在你需要获取值的时候用 nContext.Consumer 包裹，传递一个函数，这个函数会作为 consumer 的回调执行

    <nContext.Consumer>{x => <F4 n4={x.n} setN={x.setN} />}</nContext.Consumer>

这样我们就能在 F4 组件上获得相应的属性

### Consumer 语法的含义
如下所示，我们可以通过 props.children 获取组件的子元素，如果是函数我们就可以执行，并且可以传递参数

    <Consumer>
      {p => <div>{p}</div>}
    </Consumer>

    // 标签里面传递函数
    function Consumer(props) {
      // console.log(props.children)
      const child = props.children(9202)
      return (
        <h2>{child}</h2>
      )
    }

在 React 内部，上面这段代码会变成这样

    React.createElement(Consumer, null, function (p) {
      return React.createElement("div", null, p);
    }); 

    // 标签里面传递函数
    function Consumer(props) {
      // console.log(props.children)
      var child = props.children(9202);
      return React.createElement("h2", null, child);
    }

### 代码仓库
[Context Api](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA7/index.jsx)