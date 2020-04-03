---
title: relayout和repaint
date: 2020-04-03 17:34:43
categories: css
tags: [css, C]
---
## 浏览器和渲染树

在页面的生命周期中，一些效果的交互都有可能发生重排（Layout）和重绘（Painting），这些都会使我们付出高额的性能代价。 浏览器从下载文件至本地到显示页面是个复杂的过程，这里包含了重绘和重排。通常来说，渲染引擎会解析HTML文档来构建DOM树，与此同时，渲染引擎也会用CSS解析器解析CSS文档构建CSSOM树。接下来，DOM树和CSSOM树关联起来构成渲染树（RenderTree），这一过程称为Attachment。然后浏览器按照渲染树进行布局（Layout），最后一步通过绘制显示出整个页面。

![20200403173804.png](https://i.loli.net/2020/04/03/AjnOINYaRJsrzdi.png)

其中重排和重绘是最耗时的部分，一旦触发重排，我们对DOM的修改引发了DOM几何元素的变化，渲染树需要重新计算， 而重绘只会改变vidibility、outline、背景色等属性导致样式的变化，使浏览器需要根据新的属性进行绘制。更比而言，重排会产生比重绘更大的开销。所以，我们在实际生产中要严格注意减少重排的触发。

## 触发重排的操作主要是几何因素

1.页面第一次渲染 在页面发生首次渲染的时候，所有组件都要进行首次布局，这是开销最大的一次重排。
2.浏览器窗口尺寸改变 
3.元素位置和尺寸发生改变的时候 
4.新增和删除可见元素 
5.内容发生改变（文字数量或图片大小等等） 
6.元素字体大小变化。 
7.激活CSS伪类（例如：:hover）。 
8.设置style属性 
9.查询某些属性或调用某些方法。比如说：`offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft clientWidth、clientHeight`

除此之外，当我们调用getComputedStyle方法，或者IE里的currentStyle时，也会触发重排，原理是一样的，都为求一个“即时性”和“准确性”。

## 触发重绘的操作主要有

vidibility、outline、背景色等属性的改变
我们应当注意的是：重绘不一定导致重排，但重排一定会导致重绘。

## 那么我们可以采取哪些措施来避免或减少重排带来的巨大开销呢？