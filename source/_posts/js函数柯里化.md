---
title: js函数curry
date: 2019-03-03 15:22:16
tags: [G, code]
categories: js-code
---

```
function curry(func, fixedParams) {
  if (!Array.isArray(fixedParams)) {
    fixedParams = []
  }
  return function() {
    var newParams = Array.prototype.slice.call(arguments)
    if (newParams.length  + fixedParams.length >= func.length) {
      return func.apply(null, fixedParams.cancat(newParams))
    } else {
      return curry(func, fixedParams.cancat(newParams))
    }
  }
}
```
