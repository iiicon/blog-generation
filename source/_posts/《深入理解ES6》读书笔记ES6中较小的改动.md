---
title: 《深入理解ES6》读书笔记ES6中较小的改动
date: 2019-12-12 23:43:55
tags: [js，es6]
categories: 读书笔记
---

### 使用整数

#### 判断整数 Number.isInteger

如果有些数字看起来像浮点数，却存储为整数，这会让 Number.isInteger 方法判断失效而返回 true
在 javascript 中，只给数字添加小数点不会让整数变为浮点数，此处的 25.0 确实是 25，所以会按照整数的形式存储

#### 安全整数 Number.isSafeInteger

Number.isSafeInteger 方法来识别语言可以准确得表示的整数，添加了 Number.MAX_SAFE_INTEGER 和 Number.MIN_SAFE_INTEGER 分别表示整数范围的上限和下限。Number.isSafeInteger 方法用来确保一个值是整数，并且落在整数值的安全范围内

### 新的 Math 方法

ES6 引入定型数组来增强游戏和图形体验，这可以让 js 引擎做更有效的数字计算

```
Math.hypot 求平方和根
Math.sign 返回 1 -1 0
...
```

### 正式化 **proto** 属性

不是所有的 js 引擎 都实现了 **proto**, 所以 ES6 正式添加了这个特性，但有一段警告

> 这些特性本属于 es 核心语言的一部分，在编写新的 es 代码时，程序员不应该使用这些特性和功能，也不应假定它们是存在的。除非在 web 浏览器中或者需要像 web 浏览器一样执行遗留的 es 代码，否则不鼓励

所以更应该用 `Object.getPrototype()` 和 `Object.setPrototype()`

在 es6 引擎中 `Object.prototype.__proto__` 被定义为一个访问器属性，其 get 方法会调用 `Object.getPrototype`，set 方法会调用 `Object.setPrototype`, 因此和使用 __proto__ 的区别就是可以直接设置对象字面量的原型。

