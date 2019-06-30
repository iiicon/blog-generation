---
title: TS高级类型（一）
date: 2019-06-30 19:10:49
categories: TS
tags: [TS, G]
---

### 交叉类型（Intersection Types）

```
// T 和 U 的并集
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}
```

### 联合类型（Union Types）

```
// 或运算
function padLeft(value: string, padding: string | number) {
    // ...
}
```

### 类型保护与区分类型（Type Guards and differentiating Types）

```
let pet = getSmallPet();

// 每一个成员访问都会报错
if (pet.swim) {
    pet.swim();
}

// 为了使这段代码工作，需要使用类型断言
if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}

// 为了不每次都写类型断言，我们可以利用 ts 的类型保护机制
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
if (isFish(pet)) {
    pet.swim();
}

// 对于 js 那六大类型，依然可以使用 typeof
typeof x === "number"

// instance of 也可以识别（右边要求是一个构造函数）
padder instanceof StringPadder
```

### 可以为 null 的类型

**如果编译器不能够去除 null 或 undefined，你可以使用类型断言手动去除。 语法是添加 !**

```
let s = "foo";
s = null; // 错误, 'null'不能赋值给'string'
let sn: string | null = "bar";
sn = null; // 可以

sn = undefined; // error, 'undefined'不能赋值给'string | null'
```

### 类型别名

就是一个引用

与交叉类型一起使用，可以创建出稀奇古怪的类型

```
type LinkedList<T> = T & { next: LinkedList<T> };
```

#### 接口 vs 类型别名

1. 接口创建了一个新的名字，可以在任何地方使用，类型别名并不创建新名字，比如发生错误的时候不显示别名
2. 类型别名不能 extends 和
3. 通常使用接口，接口搞不定的时候再使用类型别名

### 字符串字面量类型

```
type Easing = "ease-in" | "ease-out" | "ease-in-out";
```

### 数字字面量类型

```
function rollDie(): 1 | 2 | 3 | 4 | 5 | 6 {
    // ...
}
```

### 可辨识联合（Disminated Union）

```
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

// 让各个接口建立联系
type Shape = Square | Rectangle | Circle;

// 使用
function area(s: Shape) {
  switch (s.kind) {
    case "square": return s.size * s.size;
    case "rectangle": return s.height * s.width;
    case "circle": return Math.PI * s.radius ** 2;
  }
}
```

#### 完整性检查

万一有一个 case 不存在，发生错误怎么办
第一种就是 `| undefined`
第二种就是 返回一个 never

```
default: return assertNever(s);
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
```

#### 那么 never 是什么呢

```
let x: never
console.log(x === undefined) // true
```
