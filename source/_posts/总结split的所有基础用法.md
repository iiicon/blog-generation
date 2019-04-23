---
title: 总结split的所有基础用法
date: 2019-04-14 12:14:49
tags: [js, code]
categories: js
---

> split() 方法使用指定的分隔符字符串将一个String对象分割成字符串数组，以将字符串分隔为子字符串，以确定每个拆分的位置。 

### 语法
```
/**
 * @param {string} separator 指定根据什么分割
 * @param {number} limit 指定分割出来的是几个，（前几个）
 */
str.split([separator[, limit]])
```

### 例子
```
'name age job.jobname'.split()
// (3) ["name age job.jobname"]

'name age job.jobname'.split('')
//(20) ["n", "a", "m", "e", " ", "a", "g", "e", " ", "j", "o", "b", ".", "j", "o", "b", "n", "a", "m", "e"]

'name age job.jobname'.split(' ')
// (3) ["name", "age", "job.jobname"]

'job.jobname'.split('.')
(2) ["job", "jobname"]

'name'.split('.')
["name"]

'name age job.jobname'.split('', 5)
(5) ["n", "a", "m", "e", " "]
```

以上应该覆盖了常用的情况，希望以后加深记忆
