---
title: relayout和repaint
date: 2020-04-03 17:34:43
categories: css
tags: [css, C]
---

## 浏览器和渲染树

在页面的生命周期中，一些效果的交互都有可能发生重排（Layout）和重绘（Painting），这些都会使我们付出高额的性能代价。 浏览器从下载文件至本地到显示页面是个复杂的过程，这里包含了重绘和重排。通常来说，渲染引擎会解析 HTML 文档来构建 DOM 树，与此同时，渲染引擎也会用 CSS 解析器解析 CSS 文档构建 CSSOM 树。接下来，DOM 树和 CSSOM 树关联起来构成渲染树（RenderTree），这一过程称为 Attachment。然后浏览器按照渲染树进行布局（Layout），最后一步通过绘制显示出整个页面。

![20200403173804.png](https://i.loli.net/2020/04/03/AjnOINYaRJsrzdi.png)

其中重排和重绘是最耗时的部分，一旦触发重排，我们对 DOM 的修改引发了 DOM 几何元素的变化，渲染树需要重新计算， 而重绘只会改变 vidibility、outline、背景色等属性导致样式的变化，使浏览器需要根据新的属性进行绘制。更比而言，重排会产生比重绘更大的开销。所以，我们在实际生产中要严格注意减少重排的触发。

## 触发重排的操作主要是几何因素

1.页面第一次渲染 在页面发生首次渲染的时候，所有组件都要进行首次布局，这是开销最大的一次重排。 2.浏览器窗口尺寸改变 3.元素位置和尺寸发生改变的时候 4.新增和删除可见元素 5.内容发生改变（文字数量或图片大小等等） 6.元素字体大小变化。 7.激活 CSS 伪类（例如：:hover）。 8.设置 style 属性 9.查询某些属性或调用某些方法。比如说：`offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft clientWidth、clientHeight`

除此之外，当我们调用 getComputedStyle 方法，或者 IE 里的 currentStyle 时，也会触发重排，原理是一样的，都为求一个“即时性”和“准确性”。

## 触发重绘的操作主要有

vidibility、outline、背景色等属性的改变
我们应当注意的是：重绘不一定导致重排，但重排一定会导致重绘。

## 那么我们可以采取哪些措施来避免或减少重排带来的巨大开销呢？

### 分离读写操作

    div.style.top = "10px";
    div.style.bottom = "10px";
    div.style.right = "10px";
    div.style.left = "10px";
    console.log(div.offsetWidth);
    console.log(div.offseHeight);
    console.log(div.offsetRight);
    console.log(div.offsetLeft);

### 样式集中改变

通过 cssText 和 class 进行样式的集中改变（现代浏览器会有 flush 队列优化，会好很多）

### 缓存布局信息

    // bad 强制刷新 触发两次重排
    div.style.left = div.offsetLeft + 1 + 'px';
    div.style.top = div.offsetTop + 1 + 'px';

    // good 缓存布局信息 相当于读写分离
    var curLeft = div.offsetLeft;
    var curTop = div.offsetTop;
    div.style.left = curLeft + 1 + 'px';
    div.style.top = curTop + 1 + 'px';

### 将 dom 离线

设置 display:none,元素不会存在于渲染树中，相当于将其从页面拿掉，我们之后的操作将不会触发 repaint 和 relayout

- 通过使用 DocumentFragment 创建一个 dom 碎片,在它上面批量操作 dom，操作完成之后，再添加到文档中，这样只会触发一次重排。

- 复制节点，在副本上工作，然后替换它！

### 将 position 属性设置为 absolute 或 fixed
   
position 属性为 absolute 或 fixed 的元素，重排开销比较小，不用考虑它对其他元素的影响

### 优化动画

- 可以把动画应用到定位的元素上
- 启用 GPU 加速
