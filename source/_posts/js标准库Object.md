---
title: js标准库Object
date: 2019-02-15 13:13:27
categories: js
tags: [G, js, 标准库]
comments: false
---

### Object

#### Object() 

本身是一个方法，用来将任意值转换为对象

#### new Object()

根据传入的参数，生成一个新对象，和 Object 用法相似，都是对象就本身，原始类型就生成包装对象
但是语义是不同的，Object(value) 是把 value 转成一个对象，new Object(value) 生成一个对象，它的值是 value

#### Object 静态方法

```
Object.keys() 
Object.getOwnPropertyNames() 可返回不可枚举的属性
Object.getOwnPropertyDescriptor() 获取某个属性的描述对象
Object.defineProperty()
Object.defineProperties()
Object.getPrototypeOf()
Object.create()
```

#### Object 实例方法

```
Object.prototype.valueOf()
Object.prototype.toString()  // 返回类型字符串
Object.prototype.toLocaleString()
Object.prototype.hasOwnProperty()
Object.prototype.isPrototypeOf()
Object.prototype.propertyIsEnnumerable() // 属性是否可枚举
```