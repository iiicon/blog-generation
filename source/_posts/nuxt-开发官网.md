---
title: nuxt 开发官网
date: 2019-05-23 09:38:48
categories: 总结
tags: [项目总结]
comments: false
---

<!-- 1. 刷文档 -->

### 文件目录

nuxt 不会扩展 components 下面的组件，意味着组件没有 asyncData 的方法特性

layouts 的目录名字不能修改

middleware 中间件允许自定义一个函数运行在一个页面或者一组页面渲染之前

```
export default function (context) {
  context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent
}
```

pages 目录不可更改，nuxt 框架读取该目录下的所有 .vue 文件并自动生成路由配置文件
下面这张图就是 pages 最关键的一些属性 ![1558590067(1).jpg](https://i.loli.net/2019/05/23/5ce6329c82dd231257.jpg)

plugins 目录用于组织那些需要在 根 vue 实例化之前运行的 js 插件(有个疑问就是现在的项目没有使用 es6 编译的插件，这个先 mark 一下)

static 下的文件直接映射到根目录下，不会用 webpack 进行编译

nuxt.config.js 用于覆盖默认的配置文件

```
## babel 配置
默认为 @nuxt/babel-preset-app 在client构建中是ie：'9'，在server构建中是node:'current'。
{
  babelrc: false,
  cacheDirectory: undefined,
  presets: ['@nuxt/babel-preset-app']
}
```

... 配置有点多

### 一些问题
其实项目都是vue，而且静态居多，好像没有什么特别有印象的问题

其实最主要就是 nuxt.config.js, 有很多功能可以直接在这里实现

最后上线的时候遇到了一个问题，有利于搜索引擎抓取的路径地图配置文件

是一个 sitemap 的 xml 文件，以前没接触过，这个文件直接用抓取工具生成就可以

还需要一个 robots.txt 文件制定 sitemap 的路径

这两个文件都需要放到 static 下面，这样最后打包的时候会直接生成文件在项目的根目录下面
