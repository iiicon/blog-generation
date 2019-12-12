---
title: 从「从输入URL到页面加载」谈及Web性能优化
date: 2019-12-12 15:40:59
tags: [性能优化]
categories: web 性能
commets: false
---

### 如何理解 web 性能优化

一个网站的性能，可以分为两个方面，一个叫做 Loading Performance（加载性能），一个叫做 Rendering Performce（渲染性能），说白了就是用户觉得页面加载很快

![浏览器原理](https://user-images.githubusercontent.com/25027560/46640041-5703be80-cb9c-11e8-8974-5cd0d71ead5f.png)

### 从输入 URL 到页面加载发生了什么

从各个阶段寻求优化

#### 缓存

![浏览器缓存](https://user-gold-cdn.xitu.io/2018/5/28/163a4d01fdd197b6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

输入地址后又缓存直接读缓存，没有就直接请求

#### DNS 查询

DNS 查询就像电话簿，你再浏览器地址输入地址，通过 DNS 查询得到域名的真实 IP
DNS 查询完成之前，浏览器无法从服务器下载任何资源

优化：就需要减少 DNS 查询

- DNS 缓存
- 减少域名

#### TCP 连接

![20191212171414.png](https://i.loli.net/2019/12/12/W2kKG78ybpLvcPu.png)

优化：

- http 请求头 `Connection:keep-alive`
- http2.0 多路复用

#### http 请求

##### 不要滥用 cookie

- 去除不必要的 cookie
- 尽量压缩 cookie
- 注意 设置 cookie 的 domain 级别，不要影响 sub-domain
- 设置合适的过期时间
- 静态资源使用无 cookie 的域名

##### 添加 Expires 或 Cache-Control 响应头

- 静态内容：将 Expires 响应头设置为将来很远的时间，实现「永不过期」策略
- 动态内容：设置合适的 Cache-Control 响应头，让浏览器有条件地发起请求。

##### 设置 Etag

通过如 MD5 等加密算法，设置缓存体的 Etag 配合 3.3 的缓存时间使用，这样 Cache-Control 就可以设置较长时间（max-age 设置个十年半载 ），只要浏览器缓存中资源与源服务器中的资源 Etag 不一致，说明内容更新了，此时再下载新资源；Etag 匹配成功则直接响应 304，不用重复下载了用户自然感觉很快。

##### 使用 Gzip

使用 Gzip 就是将 HTML CSS JS XML JSON 等资源进行 Gzip 高效压缩，减少资源体积那么下载就会更快，Gzip 压缩通常可以达到 70%，对某些文件可以达到 90%，比 Deflate 更高效。主流服务器都有相应的模块，绝大多数浏览器支持 Gzip 解码，从 http1.1 开始客户端就有了支持压缩的 `Accept-Encoding:gzip,deflate` 请求头

服务器看到这个请求头，它就会用客户端列出的一种方式来压缩响应。web 服务器通过 Content-Encoding 响应头来通知客户端。`Content-Encoding: gzip`

**注意**已经压缩过的内容如图片和 pdf 不要使用 Gzip，另外还有文件内容本身就很小，这些资源再使用 Gzip 反而会增加资源下载时间，浪费 cpu 资源，可能还会增加文件体积

##### 请求数量

http 请求的另一个优化方案是增加同时请求的数量，浏览器会同时发送多个请求（cdn），但是同一个域名最多发动 4-8 个，那么当资源过多时，就可以通过增加域名的方法增加并发下载，当然这和上面的 DNS 查询相悖，真实的线上要做权衡

##### 延迟加载

因为一次发送的请求有限，所以重要的资源要优先加载，动态的要异步加载

<!-- TODO: script module -->

##### 预加载

预先加载利用浏览器空闲时间请求将来要使用的资源，以便用户访问下一页面时更快地响应。

<!-- TODO: script module -->

#### 接受相应

同样是压缩 Gzip 和利用缓存 Etag 等，响应完成就代表浏览器下载完资源了

#### 接受完成，解析 HTML
（Gzip 压缩）
接受完成后开始逐行解析 html 文件

##### DOCTYPE
一定要写对 DOCTYPE
这个声明的目的是防止浏览器在渲染文档时，切换到我们称为“怪异模式(兼容模式)”的渲染模式。“<!DOCTYPE html>" 确保浏览器按照最佳的相关规范进行渲染，而不是使用一个不符合规范的渲染模式。

##### css
合并css 减少请求数
浏览器会并行下载css，然后逐个解析
把样式表放在 head 中可以让页面渐进渲染，尽早呈现视觉反馈，给用户加载速度很快的感觉，有些浏览器会在 css 加载完成之后才会渲染页面 
我们知道不管是 css 还是 js 都会阻塞页面的渲染（比如chrome中css就会）
而且 GUI 线程和 js引擎是互斥的，只有一方能工作，所以一般 css 写上面， js写下面，这样更加符合浏览器的工作原理

##### js
合并js，减少请求数
浏览器会并行下载 js，然后逐个解析
而且 <script> 一定阻塞页面 // 待确认
放在body最后，可以尽早显示页面，还可以获取节点