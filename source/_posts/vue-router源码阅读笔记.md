---
title: vue-route 源码阅读笔记
date: 2020-09-02 17:22:46
tags: [vue, 笔记]
categories: vue
---

# Vue Router

使用 `Vue.js + Vue Router` 创建单页只需要将组件 `components` 映射到路由 `routes`，然后告诉 `Vue Router` 在哪里渲染它们

## 路由注册

Vue 主要是解决视图渲染的问题，其他的能力是通过插件的方式解决

### `Vue.use`

Vue 提供了 use 的全局 API 来注册这些插件，定义在 `vue/src/core/global-api/use.js` 中：

```js
export function initUse(Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    const args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}
```

`Vue.use` 接受一个 `plugin` 参数，并且维护了一个 `_installPlugins` 数组，并存储所有注册过的 `plugins`,
接着判断 `install` 方法有没有定义，有则调用，注意一个参数 `Vue`，最后把 plugin 存储在 `_installPlugins` 中

### 路由安装

Vue-Router 的入口文件是 `src/index.js`，其中定义了 `VueRouter` 类，挂载了 `install` 方法 `VueRouter.install = install`

当我们执行 `Vue.use(VueRouter)` 的时候，就是执行了 `install` 方法，其中最重要的就是 通过 `Vue.mixin` 方法把 `beforeCreate` 和 `destroyed` 钩子注入到每一个组件中

```js
export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
```

它其实就是把定义的对象混入了 `Vue.options` 中，因为我们在组件创建阶段会执行 `extend` 把 `Vue.options` merge 到自身的 `options` 中，所以相当于每个组件都混入了这两个钩子

我们再看 `install` 方法

```js
export function install(Vue) {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;

  _Vue = Vue;

  const isDef = (v) => v !== undefined;

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode;
    if (
      isDef(i) &&
      isDef((i = i.data)) &&
      isDef((i = i.registerRouteInstance))
    ) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed() {
      registerInstance(this);
    },
  });

  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    },
  });

  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route;
    },
  });

  Vue.component("RouterView", View);
  Vue.component("RouterLink", Link);

  const strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate =
    strats.created;
}
```

混入的 `beforeCreate` 钩子，对于根 Vue 实例而言，执行该钩子 `this._routerRoot` 就是自身，`this._router` 表示 `router` 实例，然后执行 `this._router.init()` 初始化 `router`,
接着用 `defineReactive` 把 `this._router` 变成响应式对象
对于子组件的 `_routerRoot` 始终指向的离它最近的传入了 `router` 对象作为配置而实例化的父实例。

`beforeCreate` 和 `destroyed` 钩子都会执行 vnode 定义的 `registerInstance`

接着在实例原型上定义了 `$router` 和 `$route` 2 个属性的 get 方法，我们可以 `this.$router` 以及 `this.$route` 去访问 router

接着通过 `Vue.component` 方法定义了全局的 `router-view` 和 `router-link` 组件

最后定义了 `Vue Router` 钩子函数用 Vue 的 `created` 的钩子合并策略
