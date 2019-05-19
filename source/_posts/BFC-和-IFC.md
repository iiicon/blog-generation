---
title: BFC 和 IFC
date: 2019-05-18 16:29:35
categories: css
tags: [css, G]
---

### BFC
> 一个bfc包含内部所有元素的内容，除了后代也是bfc的元素

#### 功能
1. 如果它是 BFC，就会父元素把子元素包起来
*这不是清除浮动，这是bfc*
2. 兄弟元素就会划清界限，不会重叠
*float + div 做自适应布局，第一个元素float，第二个bfc，就会两个分开*

### 下面这些会触发 BFC
1. 根元素
2. 浮动元素
3. 定位为 absolute 或者 fixed
4. display: inline-block
5. display: table-cell
6. overflow 不是 visible 的元素
7. display: flow-root （css专门用来bfc的）


### IFC
主要有三个点

1. font-size
一个字体会定义一个 em-squre, 他是用来盛放字体的容器，一般是宽高为 100 的相对单位

2. line-height
一个内联元素真实字占的高度，字体在其中自己居中就行了

3. vertical-align
top middle bottom text-top text-bottom 不同字体是无法对齐的