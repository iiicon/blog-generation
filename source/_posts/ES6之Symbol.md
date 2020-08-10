---
title: ES6之Symbol
date: 2020-08-06 11:48:43
categories: js
tags: [es6, G]
comments: false
---

### Symbol

    let race = {
      b: Symbol(),
      y: Symbol(),
      w: Symbol()
    }

#### 特性
1. Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 'symbol'
2. Symbol 函数钱不能使用 new 命令，否则会报错，这是因为生成的 Symbol 是一个原始类型的值，不是对象
3. instanceof 的值为 false
4. Symbol 函数可以接受一个字符串作为参数，表示对 Symbol实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分
5. 如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值
6. Symbol 函数的参数只是表示对当前Symbol 值的描述，相同参数的 Symbol 函数的返回值是不相等的
7. Symbol 值不能与其他类型的值进行运算，会报错
8. Symbol 值可以显示转为字符串
9. Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性
10. Symbol 作为属性名，该属性不会出现在 `for in`  `for of`循环中，也不会被 `Object.keys()` `Object.getOwnPropertyNames()` `JSON.stringify()` 返回。但是，它也不是私有属性，有一个 `Object.getOwnPropertySymbols` 方法，可以获取指定对象的所有 `Symbol` 属性名
11. 如果我们希望使用同一个 Symbol 值，可以用 `Symbol.for`，它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值
12. Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key

? Symbol 是不是一个引用，Symbol.iterator 代表什么，因为能访问， 所以 Symbol 可以理解成是一个引用
