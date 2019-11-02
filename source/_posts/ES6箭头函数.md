---
title: ES6箭头函数
date: 2019-07-31 23:27:32
categories: js
tags: [es6, G]
comments: false
---

### 箭头函数的写法

好像抄袭自 coffeescript, 叫做 `fat Function`

    () => {}

coffeescript 还有一个 `empty Function`

    () -> {} 会被解析成 function() {}

### 箭头函数的优点

1. 简洁，箭头函数表达式对非方法函数是最合适的
2. 没有 this，也就是父级作用域的 this
3. 箭头函数不绑定 Arguments 对象，使用剩余参数是相较使用 arguments 对象的更好选择。
4. 由于 箭头函数没有自己的 this 指针，通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定 this---译者注），他们的第一个参数会被忽略。
