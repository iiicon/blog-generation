---
title: TS接口
date: 2019-06-11 23:35:27
categories: TS
tags: [TS, G]
---

### 数据类型

js 七种数据类型 + 枚举 + any + void + never
默认情况下 null 和 undefined 是所有类型的子类型，就是说你可以把 null 赋值给 string 类型的变量

### 写法

```
let a: null = null
let b: undefined = undefined

let c: boolean = true
let d: number = 1.23

let o: object = {}
let s: symbol = Symbol()

let e: number = 1
// e = 'string'
let e1: any = 1
e1 = 'string'

// let gender = 'man'
enum Gender {
  Man = 'm',
  Woman = 'w'
}
let gender: Gender = Gender.Man

function print(x): void {
  console.log(x)
}
```

### 类型断言

```
<string>someValue
someValue as string
```

当你在 TypeScript 里使用 JSX 时，只有 as 语法断言是被允许的

### 类型转化

```
  // 类型转换
  let a: number = 1
  let b: string = a.toString()

  let c: string = '1.2'
  let d: number = parseFloat(c)

  let e: string = 'false'
  let f: boolean = Boolean(e)

  if (e === undefined) {
  }

  let o:object = {name: 'xxx'}
  let s: string = JSON.stringify(o)
```

### 变量声明

用 let 和 const
注意如果 const 声明的是对象，是地址不能变，不是对象不能变

### 接口

接口就是用代码描述一个对象必须有什么属性（包括方法），但是有没有其他属性就不管了

### 声明对象

```
interface Human {
  name: string
  // readonly name: string
  age: number
  shape: Shape
  likeGame?: Array<string>
  say(word: string): void
}
```

- 只读属性 readonly，用作声明属性，const 用作声明变量
- 可选属性 加？
- 属性是函数 say(word: string): void

### 传入了 interface 之外的属性 ？

```
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): void {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

想要传入 Interface 之外的属性，可以：

1. 使用类型断言

```
 let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

2. 使用索引签名

```
 interface SquareConfig {
     color?: string;
     width?: number;
     [propName: string]: any;
 }
```

### interface 对象，这个对象是一个函数

```
interface Add {
  (a: number, b: number): number
}

let add: Add = function(a, b) {
  return a + b
}
```

### 这个函数的属性也是函数

```
第一种
interface Add {
  (a: number, b: number): number
  // minus(c: number, d: number): number
}

let add: Add = ((): Add => {
  let x:any = function(a, b) {
    return a + b
  }
  x.minus = function(c: number, d: number): number {
    return c - d
  }
  return x
})()
```

```
第二种
class Adds {
   minus(c: number, d: number): number
}
interface Add extends Adds {
  (a: number, b: number): number
  
}
```

### interface 的对象是一个数组

```
interface StringArray {
  [index: number]: string;
}
let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

### interface 可以继承

```
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```
