---
title: js事件循环
date: 2020-06-16 16:25:50
categories: js
tags: [js]
comments: false
---

## JS运行机制
JS 执行是单线程的，它是基于事件循环的，事件循环大致分为以下几个步骤
1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）
2. 主线程之外，还有一个任务队列（task quene），只要异步任务有了运行结果，就在任务队列中放置一个事件
3. 一旦执行栈中所有的同步任务执行完毕，系统就会读取任务队列，看看里面有哪些事件。哪些对应的异步任务，于是结束等待状态，进入执行栈，开始执行
4. 主线程不断重复上面三步

![event-loop.png](https://i.loli.net/2020/06/16/jB4M83ywUmRrtVK.jpg)

### 常见的 macro-task
setTimeout MessageChannel postMessage setImmediate

### 常见的 micro-task
MutationObsever Promise.then

基本的顺序就是
```js
for (macroTask of macroTaskQueue) {
    // 1. Handle current MACRO-TASK
    handleMacroTask();
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask);
    }
}
```