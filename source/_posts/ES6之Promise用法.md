---
title: ES6之Promise用法
date: 2019-08-11 13:58:55
categories: js
tags: [es6, G]
comments: false
---

### 常规用法

    function getInfo(name) {
      return new Promise((resolve, reject) => {
        if (name==='Gerritv') {
          resolve('Gerritv')
        } else {
          reject()
        }
      })
    }

    function print(data) {
      return new Promise((resolve, reject) => {
        console.log(data)
        resolve(data)
      })
    }

    function getFriendInfo() {
      return new Promise((resolve, reject) => {
        console.log('第二次获取用户信息')
        resolve('Macel')
      })
    }

    getInfo('Gerritv')
      .then(print)
      .then(getFriendInfo)
      .then(print)

### then 的两个参数

    function getInfo(name) {
      return new Promise((resolve, reject) => {
        if (name === 'Gerritv') {
          resolve('Gerritv')
        } else {
          reject()
        }
      })
    }

    getInfo('macel').then((d) => { console.log(d) }, () => { console.log('不认识') })

### 处理 .then 正确和错误的回调

    function getInfo(name) {
      return new Promise((resolve, reject) => {
        if (name === 'Gerritv') {
          resolve(['Gerritv', 18])
        } else {
          reject(name)
        }
      })
    }

    function getFriendInfo(name) {
      return new Promise((resolve, reject) => {
        if (name === 'Gerritv') {
          resolve('Macel, Bik, lyu')
        } else {
          reject()
        }
      })
    }

    function printInfo(data) {
      console.log(data)
      return Promise.resolve(data[0])
    }

    getInfo('macel')
      .then(printInfo, e => {
        console.log('不认识' + e)
        // 如果后面的不想执行，需要
        return Promise.reject('第一次出错了')
      })
      .then(getFriendInfo, e => {
        console.log(e)
        // 这里可以解决第一次的出错
        return Promise.resolve('Gerritv') // 重新正确了
      })
      .then(printInfo, () => {
        console.log('不认识2')
      })

### 把 promise 返回结果用 await 接受

    let x = await getInfo('Gerritv')
    console.log(x)
    // 如果出错
    try {
      let x = await getInfo('macle')
      console.log(x)
    } catch (error) {
      console.log('出错了'+error)
    }