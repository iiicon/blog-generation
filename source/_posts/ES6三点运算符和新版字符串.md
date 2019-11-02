---
title: ES6 三点运算符和新版字符串
date: 2019-08-04 16:06:54
categories: js
tags: [es6, G]
comments: false
---

## 三点运算符

### 函数的默认参数

    function(x = 10)

### 剩余参数

    Array.prototype.slice.call(arguments, 2)
    Array.from(arguments).slice(2)
    function fn(a, b, ...c)

### 展开操作符

    [...iteralableObject] = [1,2,3]
    [0, ...iteralableObject, 1, 2]

### 解构赋值

    [a, b] = [b, a]
    [a, b, ...rest] = [1, 2, 3]
    let {name, age} = person
    [a = 5, b = 7] = [1]
    [a, b] = f()
    [a, ,b] = f()
    {p: foo, q: bar} = o
    let {a = 10, b = 5} = {a: 4}
    let {a:aa = 10, b:bb = 5} = {a: 3};
    对象的浅拷贝（JSON， ...，Object.assign）
    对象合并

### 对象属性增强

    let obj = { x, y }
    obj = {['baz'+qux()]: 33}
    函数属性可以缩写

## 新版字符串

### 多行字符串，插值

    let a = `a${name}
             b
            `
### 函数接字符串

    fn`${name} 是一个 ${person}`

[style.component](https://github.com/styled-components/styled-components)就是这个用法

    const Title = styled.h1`
      font-size: 1.5em;
      text-align: center;
      color: palevioletred;
    `;
