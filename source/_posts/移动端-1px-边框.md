---
title: 移动端 1px 边框
date: 2019-04-23 15:31:21
tags: [h5, css]
categories: css
---

今天再一次遇到了 1px 的问题，突然有点想不起来，从网上查了一下总结一下常用的方法

### 0.5px 边框
`border-width: 0.5px;` 直接写，但是兼容性差，安卓不行

### border-image
也可以用，但是太麻烦了，而且圆角还会模糊

### background-image 
基本和上面一样，替换图片太麻烦了，累

### background 设置渐变
其实本质和 background-image 是一样的，但是这个可以用一下，原理就是一半有颜色，一半透明

### box-shadow
`box-shadow: inset 0px -1px 1px -1px #c8c7cc;` 效果也不错，这样的话不能设置背景，而且放大之后会有毛边，即使在移动端不会放大

### viewport + rem 
这种方式就比较无脑了，除了用rem 没什么缺点

### 伪类加 transform 实现

这个还是我最喜欢的方式 也是兼容性最好的方式
**利用 `-webkit-device-pixel-ratio` 或者 `min-resolution`** scale 以达到目的
下面截图来自 MDN   
![20190423160334.jpg](https://i.loli.net/2019/04/23/5cbec6fa33545.jpg)
```
.border-top-1px, .border-right-1px, .border-bottom-1px, .border-left-1px
  position: relative
  &::before, &::after
    content: ""
    display: block
    position: absolute
    transform-origin: 0 0

.border-top-1px
  &::before
    border-top: 1PX solid $color-row-line
    left: 0
    top: 0
    width: 100%
    transform-origin: 0 top

.border-right-1px
  &::after
    border-right: 1PX solid $color-col-line
    top: 0
    right: 0
    height: 100%
    transform-origin: right 0

.border-bottom-1px
  &::after
    border-bottom: 1PX solid $color-row-line
    left: 0
    bottom: 0
    width: 100%
    transform-origin: 0 bottom

.border-left-1px
  &::before
    border-left: 1PX solid $color-col-line
    top: 0
    left: 0
    height: 100%
    transform-origin: left 0

@media (min-resolution: 2dppx)
  .border-top-1px
    &::before
      width: 200%
      transform: scale(.5)
  .border-right-1px
    &::after
      height: 200%
      transform: scale(.5)
  .border-bottom-1px
    &::after
      width: 200%
      transform: scale(.5)
  .border-left-1px
    &::before
      height: 200%
      transform: scale(.5)****

@media (min-resolution: 3dppx)
  .border-top-1px
    &::before
      width: 300%
      transform: scale(.333)
  .border-right-1px
    &::after
      height: 300%
      transform: scale(.333)
  .border-bottom-1px
    &::after
      width: 300%
      transform: scale(.333)
  .border-left-1px
    &::before
      height: 300%
      transform: scale(.333)
```
