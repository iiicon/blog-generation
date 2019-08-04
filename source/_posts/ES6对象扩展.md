---
title: ES6对象扩展
date: 2019-08-05 00:11:22
categories: js
tags: [ES6, G]
comments: false
---

### 动态属性名

    var o = {[name]: 1}

### 属性可以是一个函数、getter、setter 方法

    var o = {_age: 18, get age() {return _age}, set age(a){return a}}

### 一道题

    let i = 0
    Object.defineProperty(window, a, {get() { i +=1; return i}})
    a == 1 && a==2 && a == 3 //true

### 浅复制

    Object.assign 会触发 setter
    ... 不会

### 在旧的对象上添加 set get

    Object.defineProperty(window, a, {
      get() {},
      set() {},
      configurable: true,
      enumerable: true,
      value: '',
      writable: false
    })

获取这些属性可以用 `Object.getOwnPropertyDescriptor(window, a)`

如果对象的属性是 symbol 可以用 `Object.getOwnPropertySymbols(window)`

### 关于原型

- 获取
`Object.getPrototypeOf()`

- 设置
`Object.create()`