---
title: js标准库RegExp
date: 2019-07-16 17:04:24
categories: js
tags: [js, 标准库]
comments: false
---

### 实例属性（没什么用）
```
RegExp.prototype.ignoreCase
RegExp.prototype.global
RegExp.prototype.multiline
RegExp.prototype.lastIndex
RegExp.prototype.source
```

### 实例方法
- RegExp.prototype.test()
  如果带g， 每次都从 lastIndex 开始
- RegExp.prototype.exec()
  参数很多，第一项是匹配的，第二项是捕获的

### 字符串实例方法
- String.prototype.match()
  返回一个数组，如果没有g，其结果基本和 exec 是一致的，还有就是对 lastIndex 无效
  如果有 g， 则返回所有的匹配项
- String.prototype.search()
  找到就返回位置，找不到就返回 -1
- String.prototype.replace() 
  接受两个参数，第一个是正则表达式，第二个是替换的内容，也可以是一个函数
  最主要的应用就是修饰符 g 如果有则全部替换
- String.prototype.split()
```
// 非正则分隔
'a,  b,c, d'.split(',')
// [ 'a', '  b', 'c', ' d' ]

// 正则分隔，去除多余的空格
'a,  b,c, d'.split(/, */)
// [ 'a', 'b', 'c', 'd' ]

// 指定返回数组的最大成员
'a,  b,c, d'.split(/, */, 2)
[ 'a', 'b' ]
```