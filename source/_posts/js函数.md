---
title: js函数
date: 2019-03-02 23:18:36
categories: js
tags: [G, js, 函数]
comments: false
---

#### 函数的声明

具名函数 匿名函数 具名函数赋值 Function 箭头函数

### this 和 arguments

this 是 fn.call(this, ...args) 的第一个参数，arguments 是第二个

### 作用域

按照语法树，就近原则
注意 js 是静态作用域
注意变量是事先生命的，但是是可以动态改变的

### 函数调用栈

最多压 9641 超多就会报错

### call apply

参数确定的时候函数用 call 调用，不确定个数的时候用 apply 调用

### bind

用一个新函数来绑定 this，保证 this 是确定的
fn.bind.call(fn, {}, 1,2,3)

### return

每一个函数都有 return，如果没写相当于 return undefined

### 柯里化，偏函数

返回函数的函数, 可以将真实计算拖延到最后再做

```
// 柯里化之前
function sum(x, y) {
  return x + y
}
// 柯里化之后
funciton addy(y) {
  return sum(1, y)
}
// 柯里化之前
function Handlebar(template, data){
    return template.replace('{{name}}', data.name)
}
// 柯里化之后
function HandleBar(template) {
  return function(data) {
    return template.replace('{{name}}', data.name)
  }
}
```

### 高阶函数
满足下列任一情况
1. 接受一个或者多个函数作为输入
    forEach map sort reduce filter
    array.map.call(array, fn)
2. 输出一个函数
    lodash.curry _.debounce
3. 满足两者
    Function.prototype.bind

### 回调函数
作为参数被调用的函数就是回调函数
注意和异步没关系

### 构造函数
返回对象的函数就是构造函数
```
function Ex() {
  this.name = 'ex'
  return this
}
var ex = new Ex()
// 加 return this 就可以写成 Ex.call({}) 
```

