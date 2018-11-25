---
title: js数组求和.md
date: 2018-11-09 17:38:15
tags: [code]
categories: js-code
---

### js 五种数组求和

```
function sum1(arr) {
  // 递归
  if (arr.length == 0) {
    return 0
  }
  if (arr.length == 1) {
    return arr[0]
  }
  if (arr.length > 1) {
    return arr[0] + sum1(arr.slice(1))
  }
}

function sum2(arr) {
  // for
  var sum = 0
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i]
  }
  return sum
}

function sum3(arr) {
  // forEach
  var sum = 0
  arr.forEach(item => {
    sum += item
  })
  return sum
}

function sum4(arr) {
  // reduce
  return arr.reduce(function(pre, next, index, arr) {
    return pre + next
  })
}

function sum5(arr) {
  // eval
  return eval(arr.join('+'))
}
```
