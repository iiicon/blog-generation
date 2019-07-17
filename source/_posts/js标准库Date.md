---
title: js标准库Date
date: 2019-07-16 17:02:24
categories: js
tags: [js, 标准库]
comments: false
---

### 普通函数的用法
Date(2000, 1, 1) 或者 Date() 返回当前时间的字符串

### 构造函数的用法
New Date() 返回 Date 对象的实例
可以接受诸如 毫秒数 日期字符串 以及年月日这种多个整数的 等参数

### 日期的运算
+ 就返回字符串相连（转为string）
- 就返回毫秒数 （转为number）
  
### 静态方法
Date.parse 
Date.now

### 实例方法
大概有 to get set 三类
