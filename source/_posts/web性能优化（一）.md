---
title: web性能优化（一）
date: 2019-04-23 22:03:32
tags: [G, 性能优化]
categories: web 性能
---

### css
chrome 会等 css 全部下载完毕才会渲染，所以 css 有可能阻塞页面，尽量写到前面
chrome 可以并行下载 8 个 css，解析只能挨个解析

### DNS 查询
减少 DNS 查询，比如所有资源放到同一个域名下

### TCP 连接
TCP 连接复用，`connection: keep-alive`
HTTP 2.0 开启多路复用

### HTTP 请求
减少 cookie （大小）
增加 cache-control （去掉请求）
增加域名 （同时发送多个请求，比如把静态资源放到 CDN）

### 接受响应
ETag 304 （Etag是file的md5值，if-none-match能匹配就传输的内容很少，很快）
Gzip `Content-Encoding` （开启压缩）

### 接受完成
DOCTYPE 指定
HTML 压缩，尽量减少标签
js css iamge 压缩合并
js 放到 body 最后
