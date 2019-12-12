---
title: 《深入理解ES6》读书笔记了解ES7
date: 2019-12-12 23:23:12
tags: [js，es6]
categories: 读书笔记
---

## 指数运算符

    let result = 5 ** 2
    consol.log(result === Math.pow(5,2))

### 运算顺序

    let result = 2 * 5 ** 2 // 50

### 运算限制

取幂运算符的左侧的一元表达式只能使用 ++ 或者 --

    let result = -5 ** 2 // error
    let result = -(5**2)

## Array.prototype.includes() 方法

第一个参数是要搜索的值，第二个参数是开始搜索的位置，返回 true 或者 false

### 值的比较

    let values = [1, NaN, 2]
    console.log(values.indexOf(NaN)) // -1
    console.log(values.includes(NaN)) // true

如果你只想检查数组中是否存在某个不知道索引的值，由于给 includes() 方法和 indexOf() 方法传入 NaN 的差异，这里建议使用 includes() 方法，如果你想知道某个值在数组的哪个位置，则必须使用 indexOf() 方法
