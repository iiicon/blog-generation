---
title: TS泛型
date: 2019-06-24 00:02:45
categories: TS
tags: [TS, G]
---

### 定义
泛型就是用一个东西表示广泛类型
```
function returnIt<T>(param: T): T {
  return param
}
let s = returnIt<string>('hi')

// 表示对象
interface Human {
  name: string
  age: number
}
let p = returnIt<Human>({ name: 'zhangsan', age: 18 })

// 返回一个 array
function returnArray<T>(arr: Array<T>): Array<T> {
  return arr
}
```

### 泛型函数
```
// 这就是泛型函数
let returnIt: <U>(param: U) => U = <T>(param: T): T => param

{
  interface add {
    (a: number, b: number): number
  }
  interface addAny<T> {
    (a: T, b: T): T
  }

  const add: add = (a, b) => a + b

  const addAny: addAny<string> = (a, b) => a + b
  console.log(addAny('1', '3'))
}
```

### 泛型类
泛型类使用（<>）括起泛型类型，跟在类名后面
```
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型约束
就是给泛型添加一些约束

```
function returnIt<T>(arg: T): T{
  console.log(arg.length) // error, 我们知道不是任何数据类型都有length属性，如果我们不约束有可能报错
  return arg;
}
```
我们使用接口和 extends 关键字实现约束
```
interface HasLength{
  length: number
}

function returnIt<T extends HasLength>(arg: T): T{
  console.log(arg.length) // no error
  return arg;
}
```

### 在泛型中使用类
```
function create<T>(c: {new(): T; }): T {
  return new c();
}
```

### 补充

#### 使用对象字面量来定义泛型函数
```
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```
这其实可以直接变换一下使用泛型接口来实现
```
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```
**总之泛型函数就是要在前面声明泛型变量 T**

当然可以把泛型参数当做整个接口的一个参数，这样：
```
interface GenericIdentityFn<T> {
    (arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn<number> = identity;
```
**所以对于描述那部分属性属于泛型部分，放在函数签名和放在接口上是需要区分的**

#### 对于泛型类
类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

### 实际使用

1. 函数中泛型使用

```
function identity<T>(arg: T): T {
  return arg;
}
let output = identity("myString");
```
注意我们没有必要使用尖括号来明确地传入类型；编译器可以查看参数的值，然后把 T 设置为他的类型，类型推论帮助我们保持代码精简和高可读性


2. 泛型变量的使用

```
function loggingIdentity<T>(arg: T[]): T[]
```
我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性

