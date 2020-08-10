---
title: ES6之迭代器
date: 2019-08-04 16:46:41
categories: js
tags: [es6, G]
comments: false
---

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