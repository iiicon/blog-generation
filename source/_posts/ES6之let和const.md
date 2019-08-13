---
title: ES6之let和const
date: 2019-07-30 23:11:13
categories: js
tags: [ES6, G]
comments: false
---

### 相关概念

- let 作用域在{}之间
- 在 let a 之前使用，报错
- 重复 let 报错
- const 只有一次赋值机会，而且必须立马赋值

### var 变量提升

    function fn() {
      if (true) {
        console.log(a)
      } else {
        var a = 1
      }
    }

相当于这样

    function fn() {
      var a
      if (true) {
        console.log(a)
      } else {
        a = 1
      }
    }
    console.log(a)

### 想办法不暴露全局变量

可以用立即执行函数

    (function(){
      var a = 1
      window.xxx = function() { console.log(a) }
    }())

或者 let

    {
      let a = 1
      window.xxx = function() { console.log(a) }
    }

### let 临时死区（temp dead zone）

    {
      let a = 1
      {
        console.log(a) // 如果一个块中有变量声明，必须先声明再使用
        let a = 2
      }
    }

### 一些题

#### 修改全局变量

    {
      var value = 1

      function foo() {
        console.log(value)
      }

      function bar() {
        value = 2

        foo()
      }
      bar()
    }

注意和词法作用域做区分

    {
    var value = 1

    function foo() {
      console.log(value)
    }

    function bar() {
    var value = 2
        foo()
    }
    bar()
    }

### for 循环中的全局变量

    {
      for (var index = 0; index < 6; index++) {
      }
      console.log(index)  // 输出 6
    }

另一种情况

    {
      for (var index = 0; index < 6; index++) {
        function fn() {
          console.log(index)
        }
        button.onclick = fn // 输出 6
      }
    }

这种情况换一种写法

    {
      for (var index = 0; index < 6; index++) {
        button[index].onclick = function() {
          console.log(index) // 输出 6
        }
      }
    }

我们用一个变量把 index 保存下来

    {
      for (var index = 0; index < 6; index++) {
        j = index
        button[j].onclick = function() {
          console.log(j)  // 这个时候输出 5，一共维护两个变量，index 和 j，index会++
        }
      }
    }

使用 let 作为局部变量

    {
      for (var index = 0; index < 6; index++) {
        let j = index // 这就很关键了，维护 6 个 j
        button[j].onclick = function() {
          console.log(j)  // 0 1 2 3 4 5
        }
      }
    }

也可以使用函数来使用局部变量

    {
      for (var index = 0; index < 6; index++) {
        (function(){
          var j = arguments[0] // 这样在函数中维护 6 个 j
          button[j].onclick = function() {
            console.log(j)  // 0 1 2 3 4 5
          }
        })(index)
      }
    }
    {
      for (var index = 0; index < 6; index++) {
        (function(j){
          button[j].onclick = function() {
            console.log(j)  // 0 1 2 3 4 5
          }
        })(index)
      }
    }

### for 循环魔法

我们知道其实最简单的写法是这样

    {
      for (let index = 0; index < 6; index++) {
        button[index].onclick = function() {
          console.log(index)  // 0 1 2 3 4 5
        }
      }
    }

但其实 js 帮我们创建了一个额外的变量 \_index, 因为 index 并不在块里
for 循环在执行的时候把 \_index 赋给 index，最后执行完后再把 index 赋给 \_index

    {
      for (let _index = 0; _index < 6; _index++) {
        let index = _index
        button[index].onclick = function() {
          console.log(index)  // 0 1 2 3 4 5
        }
      }
    }

这样其实在内部共维护了 7 个变量
