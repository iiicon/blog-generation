---
title: JS 数据类型(一)
date: 2018-12-28 00:47:26
categories: js
tags: [G, js, js数据类型]
comments: false
---

### 七种数据结构

	number string boolean symbol undefined null object

#### typeof 运算符

```
typeof 123 // 'number'
typeof '123' // 'string'
typeof false // 'boolean'
typeof function(){} // 'function'
typeof undefined // 'undefined' 利用这一点可以查看变量有没有声明但是不报错
typeof window/[]/{} // 'object'
typeof null // object
```

#### number

- 整数和浮点数
	js 内部数字都是以 64 位浮点数存储，所以 `1.0 === 1`，有些时候运算只有整数才能完成，js 会自动把 64 位浮点数转换成 32 位整数，因为浮点数不是精确的值，所以涉及小数运算的时候要小心  
	
	```
	0.1 + 0.2 === 0.3 // false
	0.3 / 0.1 === 2.9999999999999996 // true
	(0.3 - 0.2) === (0.2 - 0.1) // false
	```

- 浮点数的 64 位
	
		(-1)^符号位 * 1.xx...xx * 2^指数部分
		精度：2e53 = 9007199254740992 （16位的十进制数，所以15位的十进制都可以做精确处理）比如 9007199254740992111 将存为 9007199254740992000
		范围指数部分是 11 位，最大值就是 2e11-1=2017 分一半给负数就是 (2e-1023-52, 2e+2014), 超出部分则无法表示
		Math.pow(2, 1024) // Infinity
		Math.pow(2, -(1023+53) // 0
		
- Number 对象提供 MAX_VALUE 和 MIN_VALUE 返回可以表示的最大值和最小值
- 数值表示法 
    - 可以用多种进制表示
    - 小数点前的数字多于 21 位或者小数点后的零多于 5 个会自动转为科学计数法
- 数值的进制
    - 十进制 11
    - 二进制 0b11
    - 八进制 0o11 或者 011 // es6 已经禁止了后面这种，但是浏览器还留有
    - 十六进制 0x11
- 特殊数值
    - 正零和负零  
      - 因为第一个二进制位是符号位导致的，一般情况下 `+0===-0` 只有在做分母时，会得到 Infinity 和 -Infinity
    - NaN
      - 他是一个值 typeof NaN === 'number'
      - 他不等于自身 NaN === NaN // false
      - Boolean(NaN) // false
    - Infinity
      - 无穷大或者负无穷小 ex: `Math.pow(2, 1024)` `1/0`
      - Infinity 与 NaN 比较，总是返回 false
- parseInt() 
    - 基本用法
      - 用于将字符串转为整数，如果字符串开头有空格则自动去掉，如果不是字符串则先转为字符串再转换，开始转换后一个个转换，不能转换就停止不转换并且返回已经转换好的部分，如果第一个字符不能转换为数字（除了+-）则返回 NaN，所以要不返回十进制要不 NaN
      - 一些例子 `parseInt('0x10') // 16`   `parseInt('011') // 11`   `parseInt(0.0000008) // parseInt('8e-7') // 8`
    - 进制转换 
      ```
      parseInt('1000', 2) // 8
      parseInt('1000', 6) // 216
      parseInt('1000', 8) // 512
      ```
      - 第二个参数的取值范围是 2-36，如果是 0 undefined null 就忽略，其他就返回 NaN
- parseFloat()
    - 用法基本和 parseInt 一样 就放几个例子吧
    
    ```
    parseFloat([]) // NaN
    parseFloat('FF2') // NaN
    parseFloat('') // NaN
    parseFloat(true)  // NaN
    
    Number(true) // 1

    parseFloat(null) // NaN
    Number(null) // 0

    parseFloat('') // NaN
    Number('') // 0

    parseFloat('123.45#') // 123.45
    Number('123.45#') // NaN
    ```

- isNaN()

  isNaN 只对数字有效，如果不是数字，则会先转换为数字
  所以需要注意的是如果返回 true，很有可能不是 NaN， 很有可能是字符串

  ```
  var isNaN = function(value) {
      var n = Number(value);
      return n !== n;
  }
  ```

- isFinite()
  除了 Infinity、-Infinity、NaN 和 undefined 这几个值会返回 false，isFinite 对于其他的数值都会返回 true。




#### string

##### 表示 

  '' "" `` 
注意如果单引号中间要加单间号需要用 \ 转义，为了避免坑人，换行最好用 + 拼接

##### 转义
```
  \0 null
  \b 后退
  \f 换页
  \n 换行
  \r 回车
  \t 制表符
  \v 垂直制表符
  \' \" \\
```
当然反斜杠还有三种特殊用法
  \HHH 八进制
  \xHHH 十六进制
  \uXXXX \u 后面紧跟四个十六进制数，代表一个字符，XXXX 对应该字符的 Unicode 码点
就是字符对应的各种进制表示的Unicode码点

##### unicode 字符集

js 使用 unicode 字符集，所以可以用 \uXXXX 来表示，但是要注意只能编到 U+FFFF es6 解决了这个bug

##### base64 编码

`0-9 a-z A-Z + /`

btoa 任意值转为 Base64 编码
atob Base64 编码转为原来的值
如果是非 ASCII 码转 Base64 则必须加一个转码环节，在使用这个方法

##### toString()

+ '' 和 String() 是一样的，可以把任何东西变成字符串，+ 左右两边如果有非字符串，会变成字符串

> However for 1.toString(), the JS engine cannot determine what does . mean - a dot operator (for object methods), or a float number point?
所以 1..toString() 就是可以的 1.toString是不行的 或者(1).toString()


#### null 和 undefined

null 惯例用来表示空对象， 不知道类型时用 undefined
Number(null) 是 0
Number(undefined) 是 NaN

#### Boolean

下面这些运算符会返回布尔值
前置逻辑运算符！相等运算符 === == !== 比较运算符 ><>=

六个falsy值 转为false 其他都是true `null undefined '' NaN false 0`



