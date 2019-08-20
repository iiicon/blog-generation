---
title: ES6自己实现简易promise
date: 2019-08-19 11:12:16
categories: js
tags: [ES6, G]
comments: false
---

### ES5 实现

```
  // function Promise(???){
  //   ???
  //   return ???
  // }

  var __PENDING = 'pending'
  var __RESOLVED = 'resolved'
  var __REJECTED = 'rejected'

  function Promise(fn) {
    var status = __PENDING
    var resolvedArr = []
    var rejectedArr = []

    function resolveFn() {
      status = __RESOLVED
      todoThen.apply(undefined, arguments)
    }

    function rejectFn() {
      status = __REJECTED
      todoThen.apply(undefined,arguments)
    }

    fn.call(undefined, resolveFn, rejectFn)

    function todoThen() {
      setTimeout(() => {
        if (status === __RESOLVED) {
          for (let i = 0; i < resolvedArr.length; i++) {
            resolvedArr[i].apply(undefined, arguments)
			console.log(arguments[0])
          }
        }
        if (status === __REJECTED) {
          for (let i = 0; i < rejectedArr.length; i++) {
            rejectedArr[i].apply(undefined, arguments)
          }
        }
      })
    }
    
    return {
      then: function(successfn, errfn) {
        resolvedArr.push(successfn)
        rejectedArr.push(errfn)
        return undefined
      }
    }
  }

  var promise = new Promise(function(x,y){
    setTimeout(()=>{
        x(101)
    }, 1000)
  })
  promise.then((z)=>{
    console.log(z)  // 101
  })
```

### ES6 实现（未完待续）

```
const statusProvider = (promise, status) => data => {
  if (promise.status !== 'pending') {
    return false
  }
  switch (status) {
    case FULFILLED: return Promise.successListener.forEach(fn => fn(data))
    case REJECTED: return Promise.failListener.forEach(fn => fn(data))
  }
  promise.status = status
  promise.result = data
}

class Promise {
  constructor(executor) {
    this.status = 'pending'
    this.result = undefined
    this.successListener = []
    this.failListener = []
    executor(data => statusProvider(this, 'resolved'), err => statusProvider(this, 'reject'))
  }
  then(...args) {
    switch (this.status) {
      case 'pending': {
        this.successListener.push(args[0])
        this.failListener.push(args[1])
        break
      }
      case 'resolved': {
        args[0](this.result) // 是要处理这种情况，但是不应该在这里调用
        break
      }
      case 'reject': {
        args[1](this.result)
      }
    }
  }
  catch(arg) {
    return this.then(undefined, arg)
  }
}

```