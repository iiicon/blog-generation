---
title: ES6新增api
date: 2019-08-13 22:51:08
categories: js
tags: [Array, es6, G]
comments: false
---

### Array.from

生成一个数组

```
var s = new Set(['foo', window]);
Array.from(s);
// ["foo", Window]

Array.from([1,2,3],x=>x+x)
// [2, 4, 6]

Array.from('123')
// ["1", "2", "3"]

let m = new Map([[1, 2], [2, 4], [4, 8]]);
Array.from(m);
// [Array(2), Array(2), Array(2)] -- [1, 2]1: (2) [2, 4]2: (2) [4, 8]

Array.from({length: 5}, (v, i) => i);
// [0, 1, 2, 3, 4]
这个可以和 new Array() 做对比，new Array 生成的数组没有下标

Array.from({length: 5}).fill(5);
// [5, 5, 5, 5, 5]

<!-- 要求写一个生成n个n的数组的函数 -->
// Es6
function g(n) {
	return Array.from({length: n}).fill(n)
}

// Es5
function g(n) {
	return Array.apply(null, {length:n+1}).join(n).split('')
}
function g(n) {
	return new Array(n+1).join(n).split('')
}
```

### Array.of

生成一个数组

    Array.of(5) // [5]
    Array.of(1,{}) // [1, {}]

### Array.prototype.fill(n, start, end)

填充

    var a = [1, 2, 3]
    a.fill(0) // [0, 0, 0]
    a.fill(5,1) //  [0, 5, 5]

### Array.prototype.find(()=>{})

```
var o = [{name:'xx', age:18}, {name:'yy', age:18}, {name:'zz', age:80}]
o.find((item) => item.name==='xx')
// {name: "xx", age: 18}

x.name = 'xx1'
// o -> // [{name: "xx1", age: 18}1: {name: "yy", age: 18}2: {name: "zz", age: 80}]

// 和 filter 做对比，filter 可以返回多项
o.filter(item=>item.age===18)
(2) [{…}, {…}]

o.find(item=>item.age===18)
{name: "xx1", age: 18}
```

### Array.prototype.copyWithin(i, starti, endi)

    var a = [1, 2, 3]
    a.copyWithin(0, 2, 3)
    // [3, 2, 3]

### Array.prototype.entries()

返回一个可迭代对象（iterator）
这样我们就可以用 `for of` 或者 `next` 去取值

### Array.prototype.keys()

返回一个可迭代对象（iterator）

### Array.prototype.values()

返回一个可迭代对象（iterator）

### String.prototype.includes()

### String.prototype.repeat()

    '12'.repeat(2) // '1212'

### String.prototype.startWith()

### String.prototype.endWith()

    s.lastIndexOf(12) === s.length-2

### Number.EPSILON

### Number.isInteger

### Number.isFinite

### Number.isNaN

    Number.isNaN('NaN') // false

### Math.hypot

    Math.hypot(3, 4) // 5

### Math.sign

返回 0 -0 1 -1 NaN

### Math.trunc

    Math.trunc(3.4801748017401373e+25)
    parseInt(3.4801748017401373e+25) // 3
