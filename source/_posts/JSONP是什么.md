---
title: JSONP是什么
date: 2019-03-16 12:36:53
categories: js
tags: [G, js, jsonp]
comments: false
---

### jsonp
jsonp 就是 JSON + Padding
服务端用 SRJ(Server Render Javascript) 技术把数据塞到前端请求的回调函数里

### jsonp 由来
最初的需求其实就是局部刷新

#### form action 
form 可以 post 提交数据，但是页面会跳转，所以需要一个空 iframe 用来指向，这样也能得到数据，可以做局部刷新

#### img src 
img 的 src 可以调用其他服务器的资源，不受限制，而且 onload 可以监测成功，onerror 可以监测失败
但是只能 get，而且服务端返回的数据只能是图片

#### script
script 的 src也不受同源策略的限制，也同样有 onload 和 onerror
这样就可以的客户端封装函数，然后把函数名字发送给后端，后端用 SRG 把数据塞到函数里返回，然后在前端执行

#### jquery jsonp
jquery 把这一系列操作都放到了 ajax 上，你只需指定 dataType 为 jsonp
jquery 返回 jQuery33105114825241317853_1552671331082.call(null, 48) 类似这样的字符串

默认约定回调函数名字就是 callback 加一串随机数组成

[自己实现的jsonp](https://github.com/iiicon/node-server-demo2/commits/master)
[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
[html跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors)