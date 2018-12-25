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

[![bubblesort.gif](https://i.loli.net/2018/12/15/5c14b7b81b61f.gif)](https://i.loli.net/2018/12/15/5c14b7b81b61f.gif)

### random-quickSort

```
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  var pivotIndex = Math.floor(arr.length / 2)
  var pivot = arr.splice(pivotIndex, 1)[0]
  var left = []
  var right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot, quickSort(right)])
}
```

[![quicksort.gif](https://i.loli.net/2018/12/15/5c14b72e4f8f2.gif)](https://i.loli.net/2018/12/15/5c14b72e4f8f2.gif)