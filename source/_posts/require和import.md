---
title: require和import
date: 2020-04-06 10:44:42
categories: js
tags: [js, js模块化]
comments: false
---

## require

特点：

- 运行时加载
- 拷贝到本页面
- 全部引入

### CommonJS

Node.js 就是 CommonJS 思想，在 CommonJS 中有一个全局性方法 require() 用于加载模块

```javascript
var math = require('math')
math.add(2, 3)
```

模块写法

````js
模块写法分exports和module.exports。

exports.add = (x,y) => x+y;
module.exports = class math {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  add() {
    return  x+y;
  }
};```

### AMD

require.js cujo.js 就是 AMD 思想

```javascript
require(['math'], function(math) {
  math.add(2, 3)
})
````

模块写法

```javascript
define(id?, dependencies?, factory)

define(function() {
  const add = function(x,y) { return x + y }
  return { add }
})
```

### CMD

sea.js 就是 CMD 思想，类似于 require.js 但 seajs 是依赖就近，延迟执行，requirejs 是依赖前置，提前执行

```javascript
seajs.config({
  alias: {
    jquery: 'http://modules.seajs.org/jquery/3/jquery.js'
  }
})

seajs.use(['./hello', 'jquery'], function(hello, $) {
  $('#beautiful-sea').click(hello.sayHello)
})
```

模块写法

```js
define(function(require, exports, module) {
  var $ = require('jquery')

  exports.sayHello = function() {
    $('#hello').toggle('slow')
  }
  var b = require('b')
  b.doSomething() // 依赖就近，延迟执行
})
```

## import

特点：

- 编译时加载
- 只引用定义
- 按需加载

**对比发现 import 完胜 require，推荐用 import 取代 require**

有两种用法 import 某块 和 import()

import() 返回一个 promise 对象

```js
// 报错
if (x === 2) {
  import MyModual from './myModual'
}
所以引入了动态import
if (x === 2) {
  import('myModual').then(MyModual => {
    new MyModual()
  })
}
```
