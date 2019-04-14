---
title: 一道有趣的 js 面试题
date: 2019-04-14 11:52:55
tags: [js, code, 面试题]
categories: js
---

周末早上起来想起官网的架构，于是打开知乎寻找大神的方案，看到了一个大神的博客点进来了，被大神的博客吸引遂开始刷了起来，感慨于人和人差距的巨大
看到一道题的各种解法实在是经典，所以做一个记录

### 问题
解析字符串模板
```
var greeting = 'My name is ${name}, age ${age}, I am a ${job.jobName}';
var employee = {
    name: 'XiaoMing',
    age: 11,
    job: {
        jobName: 'designer',
        jobLevel: 'senior'
    } 
};
var result = greeting.render(employee);
console.log(result);
```

### 解法一（正则）
```
String.prototype.render = function(obj) {
  return this.replace(/\$\{(\w+|\w+\.\w+)\}/g, match => {
    var keys = match.replace('${', '').replace('}', '').split('.')
    return keys.reduce((acc, cv) => acc[cv], obj)
  })
}
```

### 解法二（es6字符串模板，解构）
```
String.prototype.render = function(obj) {
    // 利用了ES6的解构、对象keys新方法，在函数内部解构并自动展开变量
    eval(`var {${Object.keys(obj).join(',')}} = obj`)
    // 利用eval使字符串直接作为ES6解析
    return eval('`' + this + '`')
}
```

### 解法三 （with）
```
String.prototype.render = function (obj) {
    with(obj) {
        return eval('`' + this + '`')
    }
}
```