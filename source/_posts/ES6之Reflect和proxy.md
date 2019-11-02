---
title: ES6之Reflect和proxy
date: 2019-08-16 15:32:54
categories: js
tags: [es6, G]
comments: false
---

## Reflect

### Reflect.get(target, name, receiver)

    var myObject = {
      foo: 1,
      bar: 2,
      get baz() {
        return this.foo + this.bar;
      },
    };

    var myReceiverObject = {
      foo: 4,
      bar: 4,
    };

    Reflect.get(myObject, 'baz', myReceiverObject) // 8

### Reflect.set(target, name, value, receiver)

    var myObject = {
      foo: 1,
      set bar(val) {
      return this.foo = val	
      }
    }
    var o = { foo: 2, bar: 3}
    Reflect.set(myObject,  'baz', 127987978978979797, o)


### 其他的静态方法

    Reflect.has(target, name)
    === name in target

    Reflect.deleteProperty(target, name)
    === delete target[name]

    Reflect.construct(target, args)
    === new target(...args)

    Reflect.getPrototypeOf(obj)
    === Object.getPrototypeOf(obj)

    Reflect.setPrototypeOf(obj, newProto)
    === Object.setPrototypeOf(obj, newProto)

    Reflect.apply(func, thisArg, args) 
    === Function.prototype.apply.call(func, thiArg, args)

    Reflect.defineProperty(target, propertyKey, attributes)
    === Object.defineProperty(taget, propertyKey, attributes)

    Reflect.getOwnPropertyDescriptor(target, propertyKey)
    === Object.getOwnPropertyDescriptor(target, propertyKey)

    Reflect.isExtensible(target)
    === Object.isExtensible(target)

    Reflect.preventExtensions(target)
    === Object.preventExtensions(target)

    Reflect.ownKeys(target)
    === Objecct.getOwnPropertyNames(或者 Object.keys()) + Object.getOwnPropertySymbols() 

### 使用 proxy 实现观察者模式
观察者模式是指函数自动观察数据对象，一旦对象有变化，函数就会自动执行

我们需要两个函数，observable 和 observe，observable 返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数

    const queue = new Set()
    const observe = fn => queue.add(fn)
    const observable = obj => new Proxy(obj, {set})

    function set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      queue.forEach(observer => observer())
    }

    const person = observable({
      name； 'GerritV',
      age； 18
    })

    function print() {
      console.log(`${person.name}, ${person.age}`)
    }

    observe(print)

    person.name='frank'

## Proxy

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种元编程，即对编程语言进行编程

Proxy 可以理解成，在目标对象之间架设一层拦截，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写，可以译为代理

### get()

```
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, property) {
    if (property in target) {
      return target[property];
    } else {
      throw new ReferenceError("Property \"" + property + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误
```

### set()

```
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

### apply()

```
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```

### 实现 web 服务的客户端

Proxy 对象可以拦截目标对象的任意属性，这使得它很适合来写 web 服务的客户端

```
const service = createWebService('http://example.com/data')

service.employees().then(json => {
  const emplyees = JSON.parse(json)
  ...
})
```

上面的代码新建了一个 web 服务的端口，这个接口返回各种数据。Proxy 可以拦截这个对象的任意属性，所以不用为每一种数据写一个适配方法，只要写一个 proxy 拦截就好了

```
function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return () => httpGet(baseUrl+'/'+propKey)
    }
  })
}
```
**这个例子也演示了get返回函数的操作**
