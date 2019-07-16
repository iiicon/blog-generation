---
title: js标准库String
date: 2019-07-16 15:16:41
categories: js
tags: [G, js, 标准库]
comments: false
---

### 静态方法

#### fromCharCode

如果参数为空，就返回'',否则就返回 Unicode 对应的字符串

### 实例方法

#### charAt

返回指定位置的字符，大于长度或者负数都返回空字符串

#### charCodeAt

返回指定位置的 unicode，大于或者负数都返回 NaN

#### concat

返回一个新字符串，不改变原字符串, 都是字符串连接不是的话要改成字符串

#### slice

返回一个字字符串，不改变原字符串，没有的话也是返回''

#### substring

substring(9, -3) 会把-3 变成 0，然后变成(0, 9)，违反直觉，所以不建议使用，依然返回新字符串，不改变原字符串

#### substr

和 slice 的区别是第二个参数是要截取的长度，返回一个新的字符串，且不会改动原字符串。

#### indexOf lastIndexOf

indexOf('o', 6) 6 是开始的位置, 返回一个字符串在另一个字符串中出现的位置

#### trim

去除两端的 \s \t \v \n \r，返回新字符串，不改变原字符串

#### toLowerCase toUpperCase

改变大小写，不改变原来字符串的大小

#### match

找到了返回数组，找不到返回 null

```
'cat, bat, sat, fat'.match('at') // ["at"]
'cat, bat, sat, fat'.match('xt') // null
```

#### search

和 match 基本一致，不同得是返回开始的位置

#### replace

基本是替换第一个，除非是正则表达式加上了 g

#### split

返回一个按照指定分隔符分成的数组

```
'a|b|c'.split('|') // ['a', 'b', 'c']
'a|b|c'.split('') // ['a', '|', 'b', '|', 'c']
'a|b|c'.split() // ['a|b|c']
'|b|c'.split('|') // ['', 'b', 'c']
'a|b|c'.split('|', 2) // ['a', 'b']
'a|b|c'.split('|', 4) // ['a', 'b', 'c']
```

#### localeCompare

比较两个字符的长度，转成 unicode 判断
