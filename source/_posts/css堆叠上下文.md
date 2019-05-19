---
title: css堆叠上下文
date: 2019-05-09 08:22:01
categories: css
tags: [css, G]
---

### 堆叠顺序
0. z-index = -1
1. background
2. border
3. div 块级元素
4. 浮动元素
5. 文字 内联元素
6. position z-index=0
7. position z-index>0

PS. 如果兄弟元素重叠，后面的盖在前面的身上

### 堆叠上下文
**我们知道一些属性能触发堆叠上下文，但是我们不知道堆叠上下文是什么**
1. 根元素 HTML
2. z-index 不为 auto 的 relative absolute 定位
3. opacity 小于 1 的元素
4. transform 不为 none 的元素
5. position: fixed 的元素
6. -webkit-overflow-scrolling: touch 的元素
7. isolation: isolute 的元素
...

触发堆叠上下文后，会解决 z-index 的问题，上面 0 就会在 2 和 3 之间