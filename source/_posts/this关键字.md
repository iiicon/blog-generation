---
title: this关键字
date: 2019-02-14 17:28:47
categories: js
tags: [G, js, oop]
comments: false
---

### this关键字
总是返回一个对象，表示当前属性和方法所在的对象

### 使用场景

- 全局使用，this 就是代表顶层对象 window
- 构造函数中使用就代表是实例对象
- 对象的方法就是指这个对象
**如果this所在的方法不在对象的第一层，这时this只是指向当前一层的对象，而不会继承更上面的层。**
```
var a = {
  p: 'Hello',
  b: {
    m: function() {
      console.log(this.p);
    }
  }
};

a.b.m() // undefined
```

### 使用注意点

#### 避免多层 this
解决方法就是保存this对象

#### 避免数组处理方法中的 this
比如 map 和 forEach 方法
解决方法就是 js 提供了第二个参数可以用来绑定 this

#### 避免回调函数中的 this

### 绑定 this 的方法
Function.prototype.call(obj, param)
如果传入的对象是空 null undefined, 则默认传入全局对象

Function.prototype.apply()
几个应用
```
var a = [10, 2, 4, 15, 9];  // 求数组最大值
Math.max.apply(null, a) // 15

Array.apply(null, ['a', ,'b']) // 空位置格式化为 undefined

Array.prototype.slice.apply({0: 1, length: 1}) // 转换类数组对象
```

Function.prototype.bind()
每一次返回一个函数