---
title: ES6之Symbol和迭代器
date: 2019-08-04 16:46:41
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

### 迭代器

> 迭代器是一个对象，它定义一个序列，并在终止时可能返回一个返回值。它知道如何每次访问集合中的一项， 并跟踪该序列中的当前位置。
> 它提供了一个 next() 方法，用来返回序列中的下一项。这个方法返回包含两个属性：done 和 value。迭代器对象一旦被创建，就可以反复调用 next()。

创建一个对象，他有 next 方法，可以一直调用，这就是迭代器

    function fn() {
      let value = 0
      return {
        next: function() {
          value += 1
          if (value > 10) {
            throw new Error('不能大与10')
          }
          if (value === 10) {
            return { value, done: true }
          }
          return {
            value,
            done: false
          }
        }
      }
    }

### 生成器

> 虽然自定义的迭代器是一个有用的工具，但由于需要显式地维护其内部状态，因此需要谨慎地创建。生成器函数提供了一个强大的选择：它允许你定义一个包含自有迭代算法的函数， 同时它可以自动维护自己的状态。

    function* fn() {
      let value = 0
      while(true) {
        value += 1
        yield value
      }
    }

这个函数的功能和上面迭代器的功能是一样的，称为生成器，是迭代器的语法糖

### 可迭代对象

> 若一个对象拥有迭代行为，比如在 for...of 中会循环哪些值，那么那个对象便是一个可迭代对象。一些内置类型，如 Array 或 Map 拥有默认的迭代行为，而其他类型（比如 Object）则没有。
> 为了实现可迭代，一个对象必须实现 @@iterator 方法，这意味着这个对象（或其原型链中的任意一个对象）必须具有一个带 Symbol.iterator 键（key）的属性。

这样我们就可以自定义可迭代对象

    let myIterable = {
      *[Symbol.iterator]() {
        yield 1
        yield 2
        yield 3
      }
    }
    for (const iterator of myIterable) {
      console.log(iterator)
    }

### 内置的可迭代对象

String, Array, TypedArray, Map, Set 他们的原型对象都有一个 Symbol.iterator 函数


### 用于可迭代对象的语法（语法糖）

- for of
我们如果要调用生成器，只要一直 .next 就行，js 提供了一个语法糖，那就是 for of

- 展开语法
    [...'abc'] // ['a', 'b', 'c']