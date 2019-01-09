---
title: js数据类型转换
date: 2019-01-09 00:39:09
categories: js
tags: [G, js, js数据类型]
comments: false
---

## 概述
JavaScript 是一种动态类型语言, 变量没有类型限制，虽然类型不确定，但是各种运算符对数据类型是有要求的。如果运算符发现运算子的类型与预期不符，就会自动转换类型。
先说总结的，再说一些啰嗦的

## 总结的常用的
任意类型转字符串 `String(x) x.toString x+''`
  注意有个特例就是 `{}+''` 返回 0
任意类型转换为数字 `Number(x) parseInt(x, 10) parseFloat(x) x-0 +x`
任意类型转换为布尔 `Boolean(x) !!x`

## 强制转换

### number
1. 原始类型值的转换规则就是 parseInt 和 Number 的规则
2. Number 方法的参数是对象时返回 NaN, 除非参数是包含单个值的数组
> 这里就有Number()一个简单的规则了，首先调用valueof()，如果返回原始类型，就用Number，否则就调用toString(), 如果返回原始类型，就用Number，如果返回的是对象，就直接报错
![Number.jpg](https://i.loli.net/2019/01/08/5c34b1d82a534.jpg)

### toString 方法
`[object Object]` 或者 `1,2,3` 或者 `function(){}`

### string
1. 原始类型转换
数值就转换相应的字符串
字符串转为原来的值
布尔值 `true` 转为 `'true'`, `false` 转为 `'false'`
`undefined` 转为 `'undefined'`
`null` 转为 `'null'`
2. 对象
方法的参数如果是对象，返回一个类型字符串；如果是数组，返回该数组的字符串形式,函数返回函数的字符串形式
> String 的规则就正好和 Number 相反，首先调用 toString 如果返回原始类型就用 String，如果返回的是对象，就调用 valueOf，返回的是原始类型的值就调用 String 若返回的是对象就抛出错误
![String.jpg](https://i.loli.net/2019/01/08/5c34bc66642f4.jpg)

### valueOf 方法
返回数据本身的值，null 和 undefined 会报错

### boolean
五个falsy值 `0 '' null undefined NaN` 会转化为 false
其余都是 true
![Boolean.jpg](https://i.loli.net/2019/01/08/5c34bedc75d01.jpg)


## 自动转换
> 自动转换的规则是这样的：预期什么类型的值，就调用该类型的转换函数。比如，某个位置预期为字符串，就调用String函数进行转换。如果该位置即可以是字符串，也可能是数值，那么默认转为数值。

### 自动转换为布尔值
`if()`
`&&`
`!`
`expression ? true : false` 
`!!expression`

### 自动转换为字符串
字符串的自动转换主要发生在字符串的加法运算时。当一个值为字符串，另一个值为非字符串，则后者转为字符串。
![Auto-string.jpg](https://i.loli.net/2019/01/08/5c34c3fb87011.jpg)

### 自动转换为数值
除了加法运算符（+）有可能把运算子转为字符串，其他运算符都会把运算子自动转成数值
![Auto-number.jpg](https://i.loli.net/2019/01/09/5c34c9c6e5b85.jpg)
一元运算符也会把运算子转换为数值
![Auto-number2.jpg](https://i.loli.net/2019/01/09/5c34cd0f98921.jpg)