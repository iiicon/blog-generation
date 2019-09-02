---
title: js数组部分api源码实现
date: 2019-09-02 14:23:12
tags: [code]
categories: js-code
---

### join

    Array.prototype.join = function (char) {
      let result = this[0] || ''
      let length = this.length
      for (let i = 1; i < length; i++) {
        result += char + this[i]
      }
      return result
    }

### slice

    Array.prototype.slice = function (begin, end) {
      let result = []
      begin = begin || 0
      end = end || this.length
      for (let i = begin; i < end; i++) {
        result.push(this[i])
      }
    }

### sort

    Array.prototype.sort = function (fn) {
      let x = (a, b) => a - b
      fn = fn || x
      for (let i = 0; i < this.length - 1; i++) {
        for (let j = i + 1; j < this.length; j++) {
          if (fn.call(null, this[j], this[i]) < 0) {
            [this[i], this[j]] = [this[j], this[i]]
          }
        }
      }
      return this
    }

### forEach

    Array.prototype.forEach = function (fn) {
      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          fn.call(undefined, this[i], i, this)
        }
      }
    }

### map

    Array.prototype.map = function (fn) {
      let result = []
      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          result[i] = (fn.call(undefined, this[i], i, this))
        }
      }
      return result
    }

### filter

    Array.prototype.filter = function (fn) {
      let result = [], temp
      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          if (temp = fn.call(undefined, this[i], i, this)) {
            result.push(temp)
          }
        }
      }
    }

### reduce

    Array.prototype.reduce = function (fn, init) {
      let result = init
      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          result = fn.call(undefined, result, this[i], i, this)
        }
      }
      return result
    }