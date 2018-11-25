---
title: js排序（更新中）
date: 2018-11-09 18:10:52
tags: [code]
categories: js-code
---

### sort api

```
function sort1(arr) {
    // sort api
    return arr.sort((a, b) => {
      return a - b
    })
  }
```

### bubble

```
function sort2(arr) {
  // bubble
  for (var i = 0; i < arr.length-1; i++) {
    for (var j = 0; j < arr.length-i-1; j++) {
      var temp = ''
      if (arr[j+1] < arr[j]) {
        temp = arr[j+1]
        arr[j+1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}
```

![bubble](http://p1ix9dj97.bkt.clouddn.com/QQ20181109.gif)