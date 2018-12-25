---
title: gif 压缩工具 gifsicle
date: 2018-12-15 16:17:38
categories: 工具
tags: [command]
comments: false
---

### gifsicle

gifsicle 是一个 gif 的压缩工具，可以使用 brew 安装

    brew install gifsicle

使用下面命令可压缩 gif, optimize就是要压缩的百分比

    gifsicle --batch --optimize=3 quicksort.gif -o newfile.gif

当然第一次用免不了不会用，这个时候可以安装 tldr，看这个简单的应用应该就可以满足了

[![1544863126044.jpg](https://i.loli.net/2018/12/15/5c14bdac195d5.jpg)](https://i.loli.net/2018/12/15/5c14bdac195d5.jpg)

最后感觉 gifsicle 这算什么单词，记不住，在 zshrc 中写一个 alias

    alias gif3='gifsicle --batch --optimize=3'

以后就可以这样用了

    gif3 1.gif -o 2.gif

一般情况下呢都是写文档要用，直接压缩原图就可以了

    gif3 x.gif