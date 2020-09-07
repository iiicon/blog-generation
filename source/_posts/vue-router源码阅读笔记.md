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
接着判断 `install` 方法有没有定义，有则调用，注意第一个参数 `Vue`，最后把 plugin 存储在 `_installPlugins` 中

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

## VueRouter 对象

```js
export default class VueRouter {
  static install: () => void;
  static version: string;

  app: any;
  apps: Array<any>;
  ready: boolean;
  readyCbs: Array<Function>;
  options: RouterOptions;
  mode: string;
  history: HashHistory | HTML5History | AbstractHistory;
  matcher: Matcher;
  fallback: boolean;
  beforeHooks: Array<?NavigationGuard>;
  resolveHooks: Array<?NavigationGuard>;
  afterHooks: Array<?AfterNavigationHook>;

  constructor(options: RouterOptions = {}) {
    this.app = null;
    this.apps = [];
    this.options = options;
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    this.matcher = createMatcher(options.routes || [], this);

    let mode = options.mode || "hash";
    this.fallback =
      mode === "history" && !supportsPushState && options.fallback !== false;
    if (this.fallback) {
      mode = "hash";
    }
    if (!inBrowser) {
      mode = "abstract";
    }
    this.mode = mode;

    switch (mode) {
      case "history":
        this.history = new HTML5History(this, options.base);
        break;
      case "hash":
        this.history = new HashHistory(this, options.base, this.fallback);
        break;
      case "abstract":
        this.history = new AbstractHistory(this, options.base);
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          assert(false, `invalid mode: ${mode}`);
        }
    }
  }

  match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom);
  }

  get currentRoute(): ?Route {
    return this.history && this.history.current;
  }

  init(app: any) {
    process.env.NODE_ENV !== "production" &&
      assert(
        install.installed,
        `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
          `before creating root instance.`
      );

    this.apps.push(app);

    if (this.app) {
      return;
    }

    this.app = app;

    const history = this.history;

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation());
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners();
      };
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      );
    }

    history.listen((route) => {
      this.apps.forEach((app) => {
        app._route = route;
      });
    });
  }

  beforeEach(fn: Function): Function {
    return registerHook(this.beforeHooks, fn);
  }

  beforeResolve(fn: Function): Function {
    return registerHook(this.resolveHooks, fn);
  }

  afterEach(fn: Function): Function {
    return registerHook(this.afterHooks, fn);
  }

  onReady(cb: Function, errorCb?: Function) {
    this.history.onReady(cb, errorCb);
  }

  onError(errorCb: Function) {
    this.history.onError(errorCb);
  }

  push(location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort);
  }

  replace(location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.replace(location, onComplete, onAbort);
  }

  go(n: number) {
    this.history.go(n);
  }

  back() {
    this.go(-1);
  }

  forward() {
    this.go(1);
  }

  getMatchedComponents(to?: RawLocation | Route): Array<any> {
    const route: any = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute;
    if (!route) {
      return [];
    }
    return [].concat.apply(
      [],
      route.matched.map((m) => {
        return Object.keys(m.components).map((key) => {
          return m.components[key];
        });
      })
    );
  }

  resolve(
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    location: Location,
    route: Route,
    href: string,
    normalizedTo: Location,
    resolved: Route,
  } {
    const location = normalizeLocation(
      to,
      current || this.history.current,
      append,
      this
    );
    const route = this.match(location, current);
    const fullPath = route.redirectedFrom || route.fullPath;
    const base = this.history.base;
    const href = createHref(base, fullPath, this.mode);
    return {
      location,
      route,
      href,
      normalizedTo: location,
      resolved: route,
    };
  }

  addRoutes(routes: Array<RouteConfig>) {
    this.matcher.addRoutes(routes);
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  }
}
```

VueRouter 是一个类，先看构造函数做了那些事情，`this.app` 表示根 Vue 实例，`this.apps` 保存持有 `$options.router` 属性的 Vue 实例，`this.options` 保存路由配置，`beforeHooks,resolveHooks,afterHooks` 表示一些钩子，`this.matcher` 表示路由匹配器，`this.fallback`表示浏览器不支持回退到 `hash`模式，`this.mode `表示创建的模式，`this.history` 表示路由历史的具体的实现实例，不同的 `HTML5History,HashHistory,AbstractHistory` 类继承自 `History` 类

我们在实例化 `Vue` 的时候传入 `VueRouter` 的实例 `router`，组件初始化时在混入的 `beforeCreate` 钩子中，如果定义了 `this.$options.router` 就会执行 `this._router.init(this)`

init 方法会把 this（vue 实例）存储在 `this.app` 中，只有根实例会存在 `this.app` 中，并且会拿当前的 `this.history` 执行 `history.transitionTo` 方法来做路由过渡

### Matcher

```js
export type Matcher = {
  match: (
    raw: RawLocation,
    current?: Route,
    redirectedFrom?: Location
  ) => Route,
  addRoutes: (routes: Array<RouteConfig>) => void,
};
```

其中涉及到了两个概念，`Location` 和 `Route`，可以发现 `Location` 基本和 `window.location` 是同样的意思，都是对 url 的结构化描述，`Route` 有了 `fullPath matched redirectedFrom meta` 等特有属性，他是路由中的一条线路

```js
declare type Location = {
  _normalized?: boolean,
  name?: string,
  path?: string,
  hash?: string,
  query?: Dictionary<string>,
  params?: Dictionary<string>,
  append?: boolean,
  replace?: boolean,
};
declare type Route = {
  path: string,
  name: ?string,
  hash: string,
  query: Dictionary<string>,
  params: Dictionary<string>,
  fullPath: string,
  matched: Array<RouteRecord>,
  redirectedFrom?: string,
  meta?: any,
};
```

`this.matcher` 就是在 `VueRouter` 实例化通过 `createMatcher` 创建的, `createMathcer` 接受两个参数，一个是 `routes`，一个是 `router` 实例

createMatcher 首先执行`const { pathList, pathMap, nameMap } = createRouteMap(routes)`创建路由映射表

```js
export function createRouteMap(
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>
): {
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
} {
  // the path list is used to control path matching priority
  const pathList: Array<string> = oldPathList || [];
  // $flow-disable-line
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null);
  // $flow-disable-line
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null);

  routes.forEach((route) => {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === "*") {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList,
    pathMap,
    nameMap,
  };
}
```

`createRouteMap` 把路由映射表分成三部分，`pathList` 存储所有的 `path`，`pathMap` 表示 `path` 到 `routeRecord` 的映射关系，`nameMap` 表示 `name` 到 `routeRecord` 的映射关系


