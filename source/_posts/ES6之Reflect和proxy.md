---
title: ES6之Reflect和proxy
date: 2019-08-16 15:32:54
categories: js
tags: [ES6, G]
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

Proxy 可以理解成，在目标对象之间架设一层拦截，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写，可以译为代理器



