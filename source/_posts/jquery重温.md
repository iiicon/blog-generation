---
title: jquery重温
date: 2019-03-09 01:46:38
categories: js
tags: [G, jquery]
---

### 命名空间

命名空间是一种设计模式

```
var dom = {}
dom.getSiblings(node)
dom.addClass(node, {a: true, b: false})
```

### 原型继承

利用原型就可以使得实例化的对象都具有原型的方法
代码就可以写成

```
node.getSiblings()
node.addClass({a: true, b: false})
```

### 无侵入

如果大家都修改原型就会有互相覆盖的风险
可以用无侵入的模式封装一个对象用来操作传入的元素

```
function jquery(node) {
  return {
    element: node,
    getSiblings: function(){
    },
    addClass: function(){
    }
  }
}

let node = document.getElementById('x')
let node2 = jquery(node)
node2.siblings()
node2.addClass()
```
*当然真实的 jquery 不是这样的*

### 测试无侵入
传入一个 dom 或者选择器，应用生成的对象操作对应的 api

```
window.jQuery = function(param) {
  var nodes = {}
  if (typeof param === 'string') {
    nodes = document.querySelectorAll(param)
  } else {
    nodes = {
      0: param,
      length: 1
    }
  }

  nodes.addClass = function(classes) {
    for(var i=0;i<nodes.length;i++) {
      nodes[i].classList.add(classes)
    }
  }

  nodes.setText = function(text) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = text
    }
  }
  
  return nodes
}
window.$ = jQuery
var $div = $('div')
$div.addClass('red') // 可将所有 div 的 class 添加一个 red
$div.setText('hi')
```
