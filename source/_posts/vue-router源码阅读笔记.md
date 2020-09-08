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

createMatcher 首先执行`const { pathList, pathMap, nameMap } = createRouteMap(routes)` 创建路由映射表

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

```js
declare type RouteRecord = {
  path: string,
  regex: RouteRegExp,
  components: Dictionary<any>,
  instances: Dictionary<any>,
  name: ?string,
  parent: ?RouteRecord,
  redirect: ?RedirectOption,
  matchAs: ?string,
  beforeEnter: ?NavigationGuard,
  meta: any,
  props: boolean | Object | Function | Dictionary<boolean | Object | Function>,
};
```

`routeRecord` 就是 `addRouteRecord` 执行生成的，它遍历 `routes` 为每一个 `route` 执行 `addRouteRecord` 生成一条记录，然后用 `pathList` `pathMap` `nameMap` 管理起来
创建的 routeRecord 如下

```js
const record: RouteRecord = {
  path: normalizedPath,
  regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
  components: route.components || { default: route.component },
  instances: {},
  name,
  parent,
  matchAs,
  redirect: route.redirect,
  beforeEnter: route.beforeEnter,
  meta: route.meta || {},
  props:
    route.props == null
      ? {}
      : route.components
      ? route.props
      : { default: route.props },
};
```

`path` 是规范化后的路径，`regex` 是一个正则的扩展，解析`url`，`components` 对应 `{default: route.component}`，instances 是组件实例，`parent` 是父的 `routeRecord`，因为我们一般也会配置子路由，所以 `RouteRecord` 也是一个树形结构

```js
if (route.children) {
  // ...
  route.children.forEach((child) => {
    const childMatchAs = matchAs
      ? cleanPath(`${matchAs}/${child.path}`)
      : undefined;
    addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
  });
}
```

递归执行 `addRouteRecord` 的时候把当前 `child` 作为 `parent` 参数传入，这样深度遍历，我们就能拿到 `route` 的全部记录

因为 `pathList` `pathMap` `nameMap` 都是引用类型，所以我们会把所有的数据都统计到，经过 `createRouteMap` 的执行，我们会得到 `pathList pathMap nameMap`，有所有的` path`，以及对应的 `routeRecord`

回到 `createMatcher`，创建完路由映射表之后，定义一些方法，最后返回 `{ match, addRoutes }`

```js
function addRoutes(routes) {
  createRouteMap(routes, pathList, pathMap, nameMap);
}
```

`addRoutes` 方法的作用就是动态添加路由，调用 `createRouteMap` 传入新的 `routes`

`match` 函数接受 3 个参数，`raw` 是 `rawLocation` 类型，它可以是一个 `url` 字符串，也可以是一个 `Location` 对象，`currentRoute` 是 `route` 类型，表示当前的路径，`redirectFrom` 和重定向相关，
`match` 方法就是接受一个 `raw` 和当前的 `currentRoute` 计算出一个新的路径并返回

```js
function match(
  raw: RawLocation,
  currentRoute?: Route,
  redirectedFrom?: Location
): Route {
  const location = normalizeLocation(raw, currentRoute, false, router);
  const { name } = location;

  if (name) {
    const record = nameMap[name];
    if (process.env.NODE_ENV !== "production") {
      warn(record, `Route with name '${name}' does not exist`);
    }
    if (!record) return _createRoute(null, location);
    const paramNames = record.regex.keys
      .filter((key) => !key.optional)
      .map((key) => key.name);

    if (typeof location.params !== "object") {
      location.params = {};
    }

    if (currentRoute && typeof currentRoute.params === "object") {
      for (const key in currentRoute.params) {
        if (!(key in location.params) && paramNames.indexOf(key) > -1) {
          location.params[key] = currentRoute.params[key];
        }
      }
    }

    if (record) {
      location.path = fillParams(
        record.path,
        location.params,
        `named route "${name}"`
      );
      return _createRoute(record, location, redirectedFrom);
    }
  } else if (location.path) {
    location.params = {};
    for (let i = 0; i < pathList.length; i++) {
      const path = pathList[i];
      const record = pathMap[path];
      if (matchRoute(record.regex, location.path, location.params)) {
        return _createRoute(record, location, redirectedFrom);
      }
    }
  }

  return _createRoute(null, location);
}
```

首先执行 `normalizeLocation` 方法，根据 `raw` `current` 计算出新的 `location`，他主要处理了两种情况，一种是有 `params` 且没有 `path`，一种是有 `path` 的，对于第一种情况，如果 `current` 有 `name`, 计算出的 `location` 也有 `name`。`normalizeLocation` 返回 `{_normalized: true, path, query, hash}`

计算出 `location` 后，对 `location` 的 `name` 和 `path` 做了处理