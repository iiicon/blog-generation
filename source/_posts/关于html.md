---
title: 关于 HTML
date: 2018-12-02 20:06:17
categories: html
tags: [HTML, G]
comments: false
---

### 现状
 
1. 现在大部分都是 HTML5
2. 规范文档（specifications）由 w3c（consortium） 编写
3. 必须指定 DOCTYPE 
4. 最简单的 html 应该由 DOCTYPE + title + 内容 组成
5. 工作中常用的标签
```
 inline > a span img input label button em strong b i big small 
        iframe ...
 block > div article h1~h6 p ul ol section nav header 
        footer ...
```

### 比较重要的一些标签

#### head
[head标签内的标签](https://gethead.info/)

    <base> 元素 指定用于一个文档中包含的所有相对URL的基本URL。一份中只能有一个<base>元素

#### 空元素
> 不存在子节点的 element

    <area>
    <img>
    <br>
    <col>
    <command>
    <hr>
    <input>
    <link>
    <meta>
    <param>

#### 可替换元素
> 元素是一类外观渲染独立于 css 的外部对象，不是由 css 控制

    img
    video
    textarea
    input
    audio
    canvas

#### iframe
主要用来嵌套页面

    frameborder 默认 1
    name 可以用作 a 标签 和 form 标签的 target 值

#### a 
跳转页面（HTTP GET 请求）

    target  四个值 _blank _self _parent _top, 后两个在 iframe 中才有作用
    href  'http' 或者 '//' 或者 './' 或者 '?name=xx' 或者 '#1' 或者 'mailto:xx@xx.com'
    download  下载指定的地址 (如果是下载地址需要指定 Content-type 为 application/octet-stream)

#### form 
跳转页面（HTTP POST 请求）post 提交 Content-Type 为 application/x-www-form-urlencoded

    action  请求地址
    enctype  提交 form 给服务器的 MIME 类型
    method  post 或者 get
    name 
    target  _blank _self _parent _top

#### input button
主要区别就是 input 是空标签，button 不是空标签

#### table 

    - 子元素
    <caption>
    <colgroup> > <col bgcolor=red> -> 指定对应列的颜色
    <thead>
    <tbody>
    <tfoot>
    <tr>

