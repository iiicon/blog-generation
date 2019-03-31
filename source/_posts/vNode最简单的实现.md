---
title: vNode最简单的实现
date: 2019-03-31 23:38:46
tags: [js, vNode]
categories: js
---

vNode 基本原理

1. 用 json 表示 dom 树
2. 计算数据的差异，生成虚拟 dom
3. 给 dom 打补丁，渲染 dom 树

```
/**
 * @author GerritV
 * @description 虚拟 DOM Demo
 * @todo 暂时不考虑复杂情况
 */

 class VNode {
   constructor(tag, children, text) {
     this.tag = tag
     this.children = children
     this.text = text
   }

   render() {
     if (this.tag === '#text') {
       return document.createTextNode(this.text)
     }
     let el = document.createElement(this.tag)
     this.children.forEach(item => {
       el.appendChild(item.render())
     });
     return el
   }
 }

function v(tag, children, text) {
  if (typeof children === 'string') {
    text = children
    children = []
  }
  return new VNode(tag, children, text)
}

let vNodes = v('div', [
  v('p', [
    v('span', [v('#text', 'baidu.com')])
  ]
  ),
  v('span', [
    v('#text', 'joyowo.com')
  ])
]
)
console.log(vNodes.render())

function patchElement(parent, newNode, oldNode, index=0) {
  if (!oldNode) {
    parent.appendChild(newNode.render())
  } else if (!newNode) {
    parent.removeChild(parent.childNodes[index])
  } else if (newNode.tag !== oldNode.tag || newNode.text !== oldNode.text) {
    parent.replaceChild(newNode.render(), parent.childNodes[index])
  } else {
    for (let i = 0; i < newVNode.children.length || i < oldVNode.children.length; i++) {
      patchElement(parent.childNodes[index], newVNode.children[i], oldVNode.children[i], i)
    }
  }
}

var vNodes1 = v('div',[], 'hello,world')

const root = document.querySelector('#root')
patchElement(root, vNodes1)

```

[git仓库](https://github.com/iiicon/vNode/tree/master)
