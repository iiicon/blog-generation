---
title: h5项目总结（xl2）
date: 2019-12-06 10:01:55
categories: 总结
tags: [项目总结]
comments: false
---

## 在 xl 基础上做如下优化

### 命名

文件用 kebab case
变量 camel case
组件用 kebab case （个人偏好， 尤小右推荐用 Pascal case）

html 部分
属性尽量用 kebab case
id 用 camel case
类名用 kebab case

### 关于 toast

在 vue.prototype 上注册一个全局的 Toast，方便在组件中和 js 文件的任何地方调用
主要是得益于 cube-ui 的 createAPI

### 关于 Loading

也是利用 createAPI 的全局注册一个组件，可以用 api 调用组件

### 全局注入文件，以便每个文件使用

完成公共样式的抽离

```
css: {
  loaderOptions: {
    sass: {
      data: `
        @import "@/assets/css/variable.scss";
        @import "@/assets/css/cover-cube.scss";
        @import "@/assets/css/public.scss";
      `
    }
  }
}
```

### 退出多层路由


### input click

点击事件需要加 native

### 在 vuex 层做数据持久化

默认方式采用 sessionstorage 存储
需要挑出使用 localstorage 存储的属性和 不需要存储的属性

下面贴出 vuex 配置

```
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import createPersistedstate from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// 完全不需要存储的属性放在这里，默认的是要存储 sessionstorage
const pathWithoutLSAndSS = []

// 需要 localstorage 不能存 sessionstorage 的放在这里
const pathWithoutSS = ['authToken']

const vuexWithSS = createPersistedstate({
  key: 'SS',
  storage: window.sessionStorage,
  reducer: (vuexState) => {
    let sessionState = Object.assign({}, vuexState)
    let path = [...pathWithoutSS, ...pathWithoutLSAndSS]

    path.forEach(item => {
      if (sessionState.hasOwnProperty(item)) {
        delete sessionState[item]
      }
    })
    return vuexState
  }
})

const vuexWithLS = createPersistedstate({
  key: 'LS',
  storage: window.localStorage,
  reducer: (vuexState) => {
    let storage = {}

    pathWithoutSS.forEach(item => {
      if (vuexState.hasOwnProperty(item)) {
        storage[item] = vuexState[item]
      }
    })

    return storage
  }
})

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,

  // 在开发环境打开严格模式，虽然还是可以被修改，但是会在控制台报错
  strict: debug,

  // 使用插件存储 vuex 数据到 storage, 同时要在开发环境打开 logger
  plugins: debug ? [createLogger(), vuexWithSS, vuexWithLS] : [vuexWithSS, vuexWithLS]
})

export default store

```
vuex persist API 文档

![1562649994(1).jpg](https://i.loli.net/2019/07/09/5d2425ba6317133933.jpg)

### 利用 promise 解析 res.data

优化前

```
post(url, data, options = {}) {
  const instance = axios.create(this.getFixedConfig())
  this.interceptors(instance)
  return instance.post(url, data, options)
}
```

优化后

```
post(url, data, options = {}) {
  const instance = axios.create(this.getFixedConfig())
  this.interceptors(instance)
  return new Promise((resolve, reject) => {
    instance.post(url, data, options).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}
```

### 获取 accessToken 优化

- 优化前
在 mian.js 中调用获取 accessToken 的接口

- 优化后
写一个 getToken 的 js 文件，在 login register getpass 三个页面调用，统一存储到 vuex

- 优化空间
再存储一个过期时间，没有过期就不再继续请求，直接读取 vuex 中的值


### xl 需要的改动
- 意见反馈增加参数
- 退出登录加类型

### ljl 需要优化点

- 时间选择初始化
- 数据可能获取比较慢，在表单数据获取之后 refresh scroll
