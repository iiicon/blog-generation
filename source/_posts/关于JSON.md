---
title: 关于JSON
date: 2019-03-20 21:37:37
categories: js
tags: [G, json]
comments: false
---

### JSON

JSON 是一种结构化语言，抄自 JavaScript，用来做数据交换
可以由解释引擎直接处理

### 规则

[JSON](http://json.org/)
每个 JSON 对象就是一个值，可能是一个数组或对象，也可能是一个原始类型的值。总之，只能是一个值，不能是两个或更多的值。

- 复合类型的值只能是数组或对象，不能是函数，正则表达式，日期表达式
- 原始类型的值只有四种 字符串 十进制数字 布尔值 null，不能是 undefined NaN 等
- 字符串必须用双引号表示，不能用单引号
- 最后一项不能加逗号

### JSON 对象

JSON 也是 JavaScript 对象，有两个静态方法 JSON.stringify JSON.parse

#### JSON.stringify

- 把符合 JSON 格式的值转为 JSON 字符串
不符合的会转为 '' 或者 null
- 它有第二个参数，用来指定转换后的包含的属性，也就是把指定的属性转换，接受一个数组

```
var obj = {
  'prop1': 'value1',
  'prop2': 'value2',
  'prop3': 'value3'
};

var selectedProperties = ['prop1', 'prop2'];

JSON.stringify(obj, selectedProperties)
// "{"prop1":"value1","prop2":"value2"}"
```

- 第三个参数用来格式化字符串

```
JSON.stringify({ p1:1, p2:2 }, null, '|-');
/*
"{
|-"p1": 1,
|-"p2": 2
}"
*/
```

#### JSON.parse
解析 JSON 字符串
第二个参数是一个函数，用来处理解析的对象