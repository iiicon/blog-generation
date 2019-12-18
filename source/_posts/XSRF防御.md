---
title: XSRF防御
date: 2019-12-18 15:28:45
tags: [HTTP]
categories: web 安全
---

### XSRF 又名 CSRF，它是前端常见的一种攻击方式，

> CSRF 的防御手段有很多，比如验证请求的 referer，但是 referer 也是可以伪造的，所以杜绝此类攻击的一种方式是服务器端要求每次请求都包含一个 token，这个 token 不在前端生成，而是在我们每次访问站点的时候生成，并通过 set-cookie 的方式种到客户端，然后客户端发送请求的时候，从 cookie 中对应的字段读取出 token，然后添加到请求 headers 中。这样服务端就可以从请求 headers 中读取这个 token 并验证，由于这个 token 是很难伪造的，所以就能区分这个请求是否是用户正常发起的。

![xsrf.png](https://i.loli.net/2019/12/18/vnpR7tbIwyJAkS4.png)

### axios 会默认做三件事情

- 首先判断如果是配置 withCredentials 为 true 或者是同域请求，我们才会请求 headers 添加 xsrf 相关的字段。

- 如果判断成功，尝试从 cookie 中读取 xsrf 的 token 值。

- 如果能读到，则把它添加到请求 headers 的 xsrf 相关字段中。
