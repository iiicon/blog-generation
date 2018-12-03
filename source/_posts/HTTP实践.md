---
title: HTTP实践
date: 2018-11-27 23:42:31
categories: 网络
tags: [HTTP, G]
comments: false
---

### 历史
> world wide web、Uniform Resource Indetifer、HyperText Transfer Protocol、HyperText Markup Language

上个世纪 90 年代 Tim Berners Lee 发明了第一个浏览器，网页，服务器，以及 www 
www 主要包含 URI HTTP HTML

### URI

uri > url + urn  
  urn  ISBN:148395792378952
  url  google.com

### DNS 
> Domain Name System

用到的命令
  nslookup ping   
本地的文件在 `/etc/hosts`

### curl (transfer a url)

```
curl -X POST -s -v -H "token: xxx" -- "https://www.baidu.com"
  -X --request (method)
  -s --slient (Don't show progress meter or error messages)
  -v --verbose (Mostly useful for debugging)
  -H --header (Extra header to use when getting a web page)
  -d --data (Sends the specified data)
```

### HTTP 请求包括哪些部分

  请求行，首部字段，空行，请求参数 四部分

  1 动词 路径 协议/版本
  2 Key1: value1
  2 Key2: value2
  2 Key3: value3
  2 Content-Type: application/x-www-form-urlencoded
  2 Host: www.baidu.com
  2 User-Agent: curl/7.54.0
  3 
  4 params

  具体参数查看 Chrome network 的 request headers, chrome 好像把请求参数单独分出为 query string paramters

### HTTP 响应包括哪些部分

  状态行，首部字段，空行，报文主体 四部分

  1 协议/版本号 状态码 状态解释
  2 Key1: value1
  2 Key2: value2
  2 Content-Length: 17931
  2 Content-Type: text/html
  3
  4 要下载的内容

  具体参数查看 Chrome network 的 response headers, 还有 Content-Type 和 Content-Length 是如此重要