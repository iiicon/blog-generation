---
title: js对象相关
date: 2019-01-10 00:18:38
categories: js
tags: [G, js, js数据类型]
comments: false
---

### 四种对象

1. 数字
var n =1 和new Object() 的区别
 1 内存
 2 有一些内置的方法  
当然字面量在使用的一些方法的时候会生成一个零时对象，这个对象有全部的内置方法，使用之后这个对象就会从内存中消失

2. 字符串
var s = new String() 之后也会得到一个 hash 
s[0] 就能获取到 hash 的第零项
s.charAt(0) 和 s[0] 等价
'a'.charCodeAt(0) 得到对应位置unicode编码  'a'.charCodeAt(0).toString(16) 利用 toSting(16) 就可以转换成16进制
's  '.trim() 去掉空格

3. 布尔
字面量和new Boolean()的区别最主要是 new 生成一个对象，这个对象原始值是false，但这个对象可以转化为true

4. object

上面这四种对象各有自己的一些属性，但是前三种有object的所有属性，
通过构造函数生成的对象又有各自对象的所有属性，

### 原型
他们是通过原型链继承的

    var n = new Number(1)
    n.__proto__ == Number.prototype
    n.__proto__.__proto__== Object.prototype
    Number.__proto__==Function.prototype

    var obj = new Object()
    obj.__proto__ == Object.prototype
    Object.__proto__ == Function.prototype

    var fn = new Function()
    fn.__proto__==Function.prototype
    Function.__proto__==Function.prototype // Function 就是 Function 的构造函数

重要的就是

    对象.__proto__ === 构造函数.prototype 
    生成的对象之所以能够有 __proto__ 这个共有属性的引用就是因为 js 把原型（共有属性）的引用保存在了构造函数的 prototype 上