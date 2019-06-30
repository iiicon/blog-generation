---
title: TS函数
date: 2019-06-24 00:02:32
categories: TS
tags: [TS, G]
---

### 声明
```
function add(a:number, b:number = 1): number|string {
  'use strict'
  console.log(this)
  // console.log(arguments)
  return a + b
}
```

### 函数重载
```
function add(n1: number, n2: number);
function add(n1: string, n2: string);
function add(n1, n2) {
  return n1 + n2;
}

function add2<T>(n1: T, n2: T): T {
  return n1
}

add(1, 2); // 3
add('frank', 'jack'); // 'frankjack'

add2(new Date(), new Date())
```

### 类型推论
```
let myAdd: (baseValue: number, increment: number) => number = function(x, y) { return x + y; };
// 所以 TS 通过类型推论是可以知道 x y 的类型的，所以写类型和不写类型的这个粒度是怎么样的呢？需要思考和实践
```

### 类型兼容

```
interface Named {
  name: string;
}

let x: Named;
let y = { name: 'Alice', location: 'Seattle' };
x = y;
// 直接赋值是报错的，但是这样就可以了
```

规定返回值如果是源函数的返回值的子类型，那么 TS 就认为这是对的
```
{
  let x = () => ({ name: 'Alice' });
  let y = () => ({ name: 'Alice', location: 'Seattle' });

  x = y; // OK
  y = x; // 反过来肯定不行
}
```
