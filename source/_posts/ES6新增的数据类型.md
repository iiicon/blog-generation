---
title: ES6新增的数据类型
date: 2019-08-11 23:14:39
categories: js
tags: [es6, G]
comments: false
---

### Symbol

**symbol 是一种基本数据类型**

> Symbol()函数会返回 symbol 类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的 symbol 注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法："new Symbol()"。
> 每个从 Symbol()返回的 symbol 值都是唯一的。一个 symbol 值能作为对象属性的标识符；这是该数据类型仅有的目的。

    Symbol() === Symbol() // false

#### 在对象中查找 symbol 属性

    Object.getOwnPropertySymbols()

#### 应用于私有属性

    {
      let a = Symbol()
      let obj = {
        [a]: 1
      }
      window.obj = obj
    }
    obj // {Symbol(): 1}
    obj[a] // undefined

### Set

Set 函数可以接受一个数组，(或者具有 iterable 接口的其他数据结构)，作为参数用来初始化

操作方法有 `add delete has(value) clear` 方法

遍历可以用 `keys values entires forEach`

属性 size 返回实例成员的总数

> Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。
> Set 对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set 中的元素只会出现一次，即 Set 中的元素是唯一的。

**WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。**

#### 属性

    size

有一个比较重要的是 set 没有键名，所以 key 和 value 是一样的

#### 实例方法

    var a = new Set()
    a.add(1) // Set(1) {1}
    a.has(1) // true
    a.delete(1) // true
    a.entries()
    a.keys()
    a.values() // SetIterator {1 => 1, {…} => {…}}

#### 实例默认可迭代

    // 默认生成器函数就是 values 方法
    Set.prototype[Symbol.iterator] === Set.prototype.values
    Set.prototype[Symbol.iterator] === Set.prototype.keys

上面三个 api 都返回迭代器对象，意味着我们可以用 for of 迭代拿到这些值
同时也提供了 forEach 方法，和数组的用法一致

#### 典型例子

    // 数组去重
    [...new Set(arr)]

### WeakSet

> WeakSet 对象允许你将弱保持对象存储在一个集合中。
> 也就是这个对象中的成员有可能被 GC

#### 实例方法

    var b = new WeakSet() // WeakSet {}
    var o = {}
    b.add(o)
    o = null
    b.has(o) // false

可以看出已经没有这个成员了，这就是 weakSet 的作用

它只有四个 api

    WeakSet.prototype.add(value)
    WeakSet.prototype.clear()
    WeakSet.prototype.delete(value)
    WeakSet.prototype.has(value)

### Map

> Map 对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。
> 就是说对象的 key 值可以是一个对象，以前会直接转换为字符串

    let o = {}
    let a = {}
    a[o] = 1 // { [object Object]: 1 }

作为构造函数，Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组

    var m = new Map([
        ['name', 'xxx'],
        ['age', 18]
    ])

    // 实际上是下面这个操作
    const map = new Map();

    items.forEach(
    ([key, value]) => map.set(key, value)
    );

Map 的方法基本和 Set 一样

    // 默认的迭代器函数是 entries
    Map.prototype[Symbol.iterator] === Map.prototype.entries

[Objects 和 Maps 的比较](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map#Objects_%E5%92%8C_maps_%E7%9A%84%E6%AF%94%E8%BE%83)

### WeakMap

> WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
> 原生的 WeakMap 持有的是每个键或值对象的“弱引用”，这意味着在没有其他引用存在时垃圾回收能正确进行。原生 WeakMap 的结构是特殊且有效的，其用于映射的 key 只有在其没有被回收时才是有效的。

### 用法

```js
const wm = new WeakMap();
let key = new Array(5 * 1024 * 1024);
wm.set(key, 1);
key = null;
```

当我们设置 `wm.set(key, 1)` 时，其实建立了 `wm` 对 `key` 所引用的对象的弱引用，但因为 `let key = new Array(5 * 1024 * 1024)` 建立了 `key` 对所引用对象的强引用，被引用的对象并不会被回收，但是当我们设置 `key = null` 的时候，就只有 `wm` 对所引用对象的弱引用，下次垃圾回收机制执行的时候，该引用对象就会被回收掉。

**WeakMap 可以帮你省掉手动删除对象关联数据的步骤，所以当你不能或者不想控制关联数据的生命周期时就可以考虑使用 WeakMap。**

WeakMap 只接受对象作为键名

同样它也是不可枚举的，有四个 api

#### WeakMap api

    WeakMap.prototype.delete(key)
    WeakMap.prototype.get(key)
    WeakMap.prototype.has(key)
    WeakMap.prototype.set(key, value)

### key 弱引用，value 不是

    const wm = new WeakMap();
    let key = {};
    let obj = {foo: 1};

    wm.set(key, obj);
    obj = null;
    wm.get(key)
    // Object {foo: 1}

### 关于 Map 的应用

1. 在 DOM 对象上保存相关数据
   传统使用 jQuery 的时候，我们会通过 $.data() 方法在 DOM 对象上储存相关信息(就比如在删除按钮元素上储存帖子的 ID 信息)，jQuery 内部会使用一个对象管理 DOM 和对应的数据，当你将 DOM 元素删除，DOM 对象置为空的时候，相关联的数据并不会被删除，你必须手动执行 $.removeData() 方法才能删除掉相关联的数据，WeakMap 就可以简化这一操作：

```js
let wm = new WeakMap(),
  element = document.querySelector(".element");
wm.set(element, "data");

let value = wm.get(elemet);
console.log(value); // data

element.parentNode.removeChild(element);
element = null;
```

2. 数据缓存
   从上一个例子，我们也可以看出，当我们需要关联对象和数据，比如在不修改原有对象的情况下储存某些属性或者根据对象储存一些计算的值等，而又不想管理这些数据的死活时非常适合考虑使用 WeakMap。数据缓存就是一个非常好的例子：

```js
const cache = new WeakMap();
function countOwnKeys(obj) {
  if (cache.has(obj)) {
    console.log("Cached");
    return cache.get(obj);
  } else {
    console.log("Computed");
    const count = Object.keys(obj).length;
    cache.set(obj, count);
    return count;
  }
}
```

3. 私有属性
   WeakMap 也可以被用于实现私有变量，不过在 ES6 中实现私有变量的方式有很多种，这只是其中一种：

```js
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    privateData.set(this, { name: name, age: age });
  }

  getName() {
    return privateData.get(this).name;
  }

  getAge() {
    return privateData.get(this).age;
  }
}

export default Person;
```

4. 更多
   [http://www.ruanyifeng.com/blog/2017/04/memory-leak.html](http://www.ruanyifeng.com/blog/2017/04/memory-leak.html)
