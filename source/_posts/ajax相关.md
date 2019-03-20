---
title: ajax相关
date: 2019-03-19 20:20:20
categories: js
tags: [G, js, ajax]
comments: false
---

### AJAX 功能
客户端用来发送请求
1. js 设置请求头
  第一部分: request.open('get', 'xxx')
  第二部分: request.setHeader('Content-Type', 'x-www-form-urlencoded')
  第四部分: request.send('a=1&b=2')
2. js 获取响应头
  第一部分：request.status request.statusText
  第二部分： request.getResponseHeader() 或者 request.getAllResponseHeaders()
  第四部分： request.responseText
**P.S.** 注意第四部分纸盒第二部分的 content-type 有关

### jQuery 也提供了 promise
`$.ajax().then(()=>{}, ()=>{})`
> promise 解决的问题是回调函数名称不一样的问题
好像上面这种说法也有道理，同时又解决了回调地狱

### 代码链接
[自己实现的ajax](https://github.com/iiicon/nodejs-test-cors/commits/master)