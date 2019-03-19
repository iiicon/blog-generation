---
title: jsDOM
date: 2019-03-03 22:42:15
categories: js
tags: [G, js, DOM]
comments: false
---

### DOM

数据结构就是树
在 DOM 树中，树上有节点（Node）
Node 主要有 Document Element text 等
DOM 树抽象为对象主要有三个构造函数 Document Element Text，他们都继承自 Node.prototype
![1551626734126.jpg](https://i.loli.net/2019/03/03/5c7bf21547e43.jpg)

上图就是 DOM 的大致原型链的关系
与此同时 Node 提供了一系列 API 用来操作 DOM

### Node 接口

```
属性：
childNodes // 返回 NodeList 继承自 Object
children // 返回 HTMLCollection 继承自 Object
firstChild
innerText
lastChild
nextSibiling
nodeName
nodeType
nodeValue
outerText
ownerDocument
parentElement
parentNode
previousSibiling
textContent
```

```
方法
appendChild()
cloneNode() // 参数为 true 就是深拷贝，否则为浅拷贝
contains()
hasChildNodes()
insertBefore()
insertAfter()
isEqualNode() // dom 一致
isSameNode() // 同一个 dom
removeChild()
replaceChild()
normalize() // 合并文本节点
```

### Document 接口

```
属性
body
characterSet
childElementCount
children
doctype
domain
fullscreen
head
images
links
location
referrer
scripts
scrollingElement
title
documentElement
```

```
方法
createDocumentFragment()
createElement()
createTextNode()
execCommand()
exitFullscreen()
getElementById()
getElementsByClassName()
getElementsByName()
getElementsByTagName()
getSelection()
hasFocus()
open()
close()
querySelector()
querySelectorAll()
registerElement()
write()
writeln()
```

### Element 接口

```
offsetWidth
offsetHeight
clientLeft
clientTop
scrollHeight
scrollTop
getBoundingClientRect().left
```

### NodeList 和 HTMLCollection

- 上述的 api 有的返回是 NodeList 实例，有的返回 collection 实例，这两者是有区别的

HTMLCollection 实例对象的成员只能是 Element 节点，NodeList 实例对象的成员可以包含其他节点。
HTMLCollection 实例对象可以用 id 属性或 name 属性引用节点元素，NodeList 只能使用数字索引引用。
HTMLCollection 实例对象是静态的 NodeList 是动态的。(x) 两者都是动态的 -_-
