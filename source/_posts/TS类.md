---
title: TS类
date: 2019-06-23 23:14:57
categories: TS
tags: [TS, G]
---

### 类

类就是创造对象的东西（描述对象有哪些属性）
对于 TS 来说，类可以让你的程序变得更加可预测（这个对象不会出现一些我不知道的属性，一切尽在我的掌握）

### 语法

```
class Human extends Animal {
  // 声明类的属性
  static color = 'red'  

  // 公有属性，默认就是 public，可以写可以不写
  public name: string

  // 访问器，自定义属性
  _age: number
  get age() {
    return this._age
  }
  set age(val: number) {
    if (val > 28) {
      this._age = 18
    } else {
      this._age = val
    }
  }
  
  // 私有属性，只有这个类可以访问
  private secret: number = 100

  // 使用 constructor
  constructor(name: string, kind: string, age = 18) {
    super(kind)  // 继承类
    this.name = name
    this.age = age
  }

  // 声明对象的函数属性
  say(): string {
    this.move()
    console.log(this.kind)
    return 'i can move'
  }
  public smile() {
    console.log('smile')
  }
}

// 抽象类 也就是爸爸类（只描述有什么方法，并没有实现这些方法）
// 也就是说，只要 class 里面的方法就必须实现，如果不实现，就需要加 abstract
abstract class Animal { // 这里必须写 abstract
  abstract smile(): void // 这里也是

  // 保护属性，可以在类和子类中使用
  protected kind: string  
  constructor(kind: string) {
    this.kind = kind
  }
  move(): void {
    console.log('move')
  }
}
```

### 一些技巧

- TS 的类其实就是一个函数，一个构造函数

```
class Greeter {
  static standardGreeting = "Hello, there";
  greeting: string;
  greet() {
    if (this.greeting) {
        return "Hello, " + this.greeting;
    }
    else {
        return Greeter.standardGreeting;
    }
  }
}

let greeter1: Greeter; // 可能还是感觉这里很多于
greeter1 = new Greeter();
console.log(greeter1.greet());

let greeterMaker: typeof Greeter = Greeter;  // 注意这句话
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
```

- 接口是低配版的类，类是高配版的接口。

```
{
  class Point {
    x: number
    y: number
  }

  interface Point3d extends Point {
    z: number
  }

  let point3d: Point3d = { x: 1, y: 2, z: 3 }
}
```

