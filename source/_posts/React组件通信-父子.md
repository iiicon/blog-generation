---
title: React组件通信-父子
date: 2019-07-14 12:08:12
categories: React
tags: [React, G]
---

### 代码仓库
[龟兔赛跑](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA1/index.jsx)

### 组件 JSX

我们已经知道组件可以是函数，也可以用 class 表示
下面列出一些要点

- 组件名必须大写开头 Pascal
- construnctor 函数必须调用 super
- style 可以直接绑定一个对象，用来表示样式
- 函数组件做不到根据数据改变重新渲染，所以多状态这种组件要用 class，简单的可以直接写函数表示

### 父子组件通信
- 内部组件可以直接用 this.props 获取外部组件的属性，同样函数组件也提供 props 参数
- 如果组件依赖数据变化，必须在 state 上改变数据
- 父组件给子组件传递一个函数，子组件在合适的时候调用这个函数（回调）

父：

```
<Track success={this.onSuccess.bind(this)}>
```
**标签上调用`this.onSuccess`的时候，React会强制把回调的this指向undefined，所以需要自己bind，或者用=>函数**
子：

```
this.props.success()
```
**不要写空格**