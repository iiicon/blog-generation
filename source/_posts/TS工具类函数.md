---
title: TS工具类函数
date: 2019-12-20 11:15:12
tags: [code]
categories: js-code
---

### 是否是对象

    export function isObject(val: any): val is Object {
      return val !== null && typeof val === "object";
    }

### 是否是纯对象

    export function isPlainObject(val: any): val is Object {
      return Object.prototype.toString.call(val) === "[object Object]";
    }

### 是否是日期对象

    export function isDate(val: any): val is Date {
      return Object.prototype.toString.call(val) === "[object Date]";
    }

### 是否是 URLSearchParams 对象

    export function isURLSearchParams(val: any): val is URLSearchParams {
      return typeof val !== "undefined" && val instanceof URLSearchParams;
    }

### 是否是 FormData

    export function isFormData(val: any): val is FormData {
      return typeof val !== "undefined" && val instanceof FormData;
    }

### 是否是绝对地址

    export function isAbsoluteURL(url: string): boolean {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    }

### extend 合并两个对象的属性

    export function extend<T, U>(to: T, from: U): T & U {
      for (const i in from) {
        (to as T & U)[i] = from[i] as any;
      }
      return to as T & U;
    }

### 合并 baseurl 和 url

    export function combineURL(baseURL: string, relativeURL?: string): string {
      return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
    }

### 对象合并（深拷贝）

    export function deepMerge(...objs: any[]): any {
      const result = Object.create(null);

      objs.forEach(obj => {
        if (obj) {
          Object.keys(obj).forEach(key => {
            const val = obj[key];
            if (isPlainObject(val)) {
              if (isPlainObject(result[key])) {
                result[key] = deepMerge(result[key], val);
              } else {
                result[key] = deepMerge(val);
              }
            } else {
              result[key] = val;
            }
          });
        }
      });

      return result;
    }
