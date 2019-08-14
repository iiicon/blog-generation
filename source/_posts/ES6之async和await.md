---
title: ES6之async和await
date: 2019-08-12 23:28:36
categories: js
tags: [ES6, G]
comments: false
---

### async

> async function 用来定义一个返回 AsyncFunction 对象的异步函数。异步函数是指通过事件循环异步执行的函数，它会通过一个隐式的 Promise 返回其结果。如果你在代码中使用了异步函数，就会发现它的语法和结构会更像是标准的同步函数。

### 基本用法

    function fn() {
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          let n = Math.floor(Math.random()*6+1)
          if (n>3) {
            resolve(n)
          } else {
            reject(n)
          }
        },100)
      })
    }

    async function test() {
      try {
        let n = await fn()
        console.log('success', n)
      } catch (e) {
        console.log('error', e)
      }
    }

    test()

### 串形异步请求

    function fn() {
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          let n = Math.floor(Math.random()*6+1)
          if (n>3) {
            resolve(n)
          } else {
            reject(n)
          }
        },100)
      })
    }

    async function test() {
      try {
        let n = await fn()
        console.log('success', n)
        if (n) {
          test2()
        }
      } catch (e) {
        console.log('error', e)
      }
    }

    async function test2() {
      try {
        let n = await fn()
        console.log('success', n)
      } catch (e) {
        console.log('error', e)
      }
    }

    test()

### 同时处理多个请求

    function fn() {
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          let n = Math.floor(Math.random()*6+1)
          if (n>3) {
            resolve(n)
          } else {
            reject(n)
          }
        },100)
      })
    }

    async function test() {
      try {
        let n = await Promise.all([fn(), fn()])
        console.log('success', n) // [4, 6]
      } catch (e) {
        console.log('error', e)
      }
    }

    test()

### Promise.all 和 Promise.race 的区别

先说 all

    function fn() {
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          let n = Math.floor(Math.random()*6+1)
          if (n>3) {
            resolve(n)
            console.log(n,'---')
          } else {
            console.log(n,'+++')
            reject(n)
          }
        },100)
      })
    }

    function test() {
      Promise.all([fn(), fn()]).then(res=>{
        console.log('all success', res)
      }, e=>{
        console.log('has error', e)
      })
    }
    test()

成功时这样返回

    // 4
    // "---"
    // 6
    // "---"
    // "all success"
    // [4, 6]

失败时这样返回

    // 1
    // "+++"
    // "has error"
    // 1
    // 1
    // "+++"

再说 race

成功时

    // 5
    // "---"
    // "all success"
    // 5
    // 2
    // "+++"

失败时

    // 1
    // "+++"
    // "has error"
    // 1
    // 6
    // "---"

从返回值我们可以看出

- all 返回的是一个数组，
- race 返回一个值
- all 在两个都执行成功之后会执行 .then
- race 在任意一个执行成功之后会执行 .then
- all 和 race 都会在任意一个发生错误时执行 catch，并且另外的 promise 依然会执行
