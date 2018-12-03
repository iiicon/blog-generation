---
title: node.js server
date: 2018-11-30 00:10:29
categories: js
tags: [HTTP, G, node]
comments: false
---

### TCP 传输控制协议（Transmission Control Protocal）

1 TCP 和 UDP 的区别是什么？
TCP 可靠、面向连接，相对 UDP 较慢，对应的协议有 HTTP FTP 等
UDP 不可靠、不面向连接，相对 TCP 较快，对应的协议有 DNS

2 TCP 三次握手
TCP 采用 flag 确认收到信息，发送端首先发送一个带有 SYN（synchronize）标志的包给对方，服务端确认收到之后回传一个带有（SYN/ACK）标志的数据包以示传达确认信息，最后发送端再回传一个带有 ACK 的数据包代表握手结束。

### IP 网络协议（Internet Protocol）

IP 协议位于网络层，基本分为内网 IP 和 外网 IP，需要通过路由器连接

### 端口 PORT

访问一个设备需要制定 IP 和端口
一般一个端口对应一个服务
比如 http -> 80 https ->443 ftp -> 21
每个机器有 65535（2^16-1） 个端口，0-1023（2^10-1） 需要管理员权限才能使用

### Node.js 启动一个服务器

[node.js 简易 server](https://github.com/iiicon/node-server-demo/blob/master/server.js)

```
var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号？\nnode server.js 端口号')
  process.exit(1)
}

var server = http.createServer(function(request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  console.log('含查询字符串的路径\n' + pathWithQuery)

  if (path === '/') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(
      '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><link rel="stylesheet" href="./style"></head><body><script src="./main.js"></script></body></html>'
    )
    response.end()
  } else if (path === '/style') {
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write('* {color: #a37654;}')
    response.end()
  } else if (path === '/main.js') {
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write('alert("test")')
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('Not Found')
    response.end()
  }
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n http://localhost:' + port)
```
