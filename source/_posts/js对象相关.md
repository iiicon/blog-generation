---
title: js对象相关
date: 2019-01-10 00:18:38
categories: js
tags: [G, js, js数据类型]
comments: false
---

## 概述

#### key
对象就是一组键值对的集合，是一种无序的复合数据集合
对象obj的所有键名虽然看上去像数值，实际上都被自动转成了字符串，如果键名不符合标识名的条件，且也不是数字，则必须加上引号，否则就会报错

#### 表达式还是语句
{ console.log(123) }是一个代码块，要解释为对象，最好在大括号前加上圆括号，因为圆括号里面只能是表达式，所以确保大括号只能解释为对象
这种差异在eval中显示的最为明显

    eval('{foo:1}')
    eval('({foo:1})')

### 属性的操作

#### 读取
有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。
obj.o obj['o'] 使用点 o 就是字符串，使用方括号 o 就是变量
如果key是数字，则只能使用方括号，点会报错，方括号里的数字会自动转换为字符串

#### 赋值
允许'后绑定'

#### 查看
查看一个对象本身的所有属性，可以用 Object.keys 方法

#### 删除
删除对象本身的属性用 delete, delete obj.o 成功后返回 true
只有一种情况 delete 返回 false 那就是该属性存在且不得删除
var obj = Object.defineProperty({}, 'p', {value: 1, configurable: false})  delete obj.p
delete 返回 true 之后并不能说明已经删除，比如继承的属性

#### in 运算符判断属性是否存在
in 和 hasOwnProperty() 可以查找自身的属性

#### for in 属性遍历
- 它遍历的是所有 enumerable 的属性，会跳过不可遍历的属性
- 它不仅遍历对象自身的属性，还遍历继承的属性


## 四种对象

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