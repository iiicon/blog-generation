---
title: js错误处理机制
date: 2019-01-10 11:35:36
categories: js
tags: [G, js, Error对象]
comments: false
---

### Error
    var error = new Error('error')
    error 有三个属性 error.name error.message error.stack
    参数 error 就是 message 属性

抛出 Error 之后，整个程序就中断在发生错误的地方，不再往下执行

### 六个派生对象
这六个对象是在 Error 对象的基础上生成的，这个六个对象同时也是函数 他们的 prototype 指向 Error 对象
    
    var err = new Error('xx')
    SyntaxError.prototype == Error {} // js这个命名有时候真是不懂
    Error.prototype == 错误 {}
    err.__proto__ == 错误 {}
    错误.__proto__ == Object.prototype


#### SyntaxError
    var 1a

#### ReferenceError
    unknownVariable

#### RangeError
    new Array(-1)

#### TypeError
    new 123

#### URIError
    decodeURI('%2')

#### EvalError

#### 当然你可以自定义错误

    function UserError(message) {
      this.message = message || '默认信息';
      this.name = 'UserError';
    }

    UserError.prototype = new Error();
    UserError.prototype.constructor = UserError;

### 相关语法

#### throw 语句
throw 抛出一个错误，中断程序的执行，可以抛出任何的值
    throw 123

#### try-catch 结构
因为发生错误会中断程序的执行，js 提供 try-catch 用来捕获错误，选择是否往下执行

#### finally 代码块
不论发生错误与否，都会执行
如果 catch 中有 return 或者 throw 就会先执行 finally 中的代码，而且 return 不会阻止 finally 代码的执行
如果没有 catch 报错就会中断程序，但这之前会执行 finally 中的代码