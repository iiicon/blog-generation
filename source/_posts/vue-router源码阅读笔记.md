---
title: vue-route 源码阅读笔记
date: 2020-09-02 17:22:46
tags: [vue, 笔记, vue-router]
categories: vue
---

# Vue Router

使用 `Vue.js + Vue Router` 创建单页只需要将组件 `components` 映射到路由 `routes`，然后告诉 `Vue Router` 在哪里渲染它们

<!-- more -->

## 路由注册

Vue 主要是解决视图渲染的问题，其他的能力是通过插件的方式解决

### `Vue.use`

Vue 提供了 use 的全局 API 来注册这些插件，定义在 `vue/src/core/global-api/use.js` 中：

```js
export function initUse(Vue: GlobalAPI) {
  Vue.use = function(plugin: Function | Object) {
    const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

`Vue.use` 接受一个 `plugin` 参数，并且维护了一个 `_installPlugins` 数组，并存储所有注册过的 `plugins`,
接着判断 `install` 方法有没有定义，有则调用，注意第一个参数 `Vue`，最后把 plugin 存储在 `_installPlugins` 中

### 路由安装

Vue-Router 的入口文件是 `src/index.js`，其中定义了 `VueRouter` 类，挂载了 `install` 方法 `VueRouter.install = install`

当我们执行 `Vue.use(VueRouter)` 的时候，就是执行了 `install` 方法，其中最重要的就是 通过 `Vue.mixin` 方法把 `beforeCreate` 和 `destroyed` 钩子注入到每一个组件中

```js
export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function(mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

它其实就是把定义的对象混入了 `Vue.options` 中，因为我们在组件创建阶段会执行 `extend` 把 `Vue.options` merge 到自身的 `options` 中，所以相当于每个组件都混入了这两个钩子

我们再看 `install` 方法

```js
export function install(Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef((i = i.data)) && isDef((i = i.registerRouteInstance))) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed() {
      registerInstance(this)
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router
    }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route
    }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
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
  static install: () => void
  static version: string

  app: any
  apps: Array<any>
  ready: boolean
  readyCbs: Array<Function>
  options: RouterOptions
  mode: string
  history: HashHistory | HTML5History | AbstractHistory
  matcher: Matcher
  fallback: boolean
  beforeHooks: Array<?NavigationGuard>
  resolveHooks: Array<?NavigationGuard>
  afterHooks: Array<?AfterNavigationHook>

  constructor(options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }

  get currentRoute(): ?Route {
    return this.history && this.history.current
  }

  init(app: any) {
    process.env.NODE_ENV !== 'production' && assert(install.installed, `not installed. Make sure to call \`Vue.use(VueRouter)\` ` + `before creating root instance.`)

    this.apps.push(app)

    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(history.getCurrentLocation(), setupHashListener, setupHashListener)
    }

    history.listen(route => {
      this.apps.forEach(app => {
        app._route = route
      })
    })
  }

  beforeEach(fn: Function): Function {
    return registerHook(this.beforeHooks, fn)
  }

  beforeResolve(fn: Function): Function {
    return registerHook(this.resolveHooks, fn)
  }

  afterEach(fn: Function): Function {
    return registerHook(this.afterHooks, fn)
  }

  onReady(cb: Function, errorCb?: Function) {
    this.history.onReady(cb, errorCb)
  }

  onError(errorCb: Function) {
    this.history.onError(errorCb)
  }

  push(location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }

  replace(location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.replace(location, onComplete, onAbort)
  }

  go(n: number) {
    this.history.go(n)
  }

  back() {
    this.go(-1)
  }

  forward() {
    this.go(1)
  }

  getMatchedComponents(to?: RawLocation | Route): Array<any> {
    const route: any = to ? (to.matched ? to : this.resolve(to).route) : this.currentRoute
    if (!route) {
      return []
    }
    return [].concat.apply(
      [],
      route.matched.map(m => {
        return Object.keys(m.components).map(key => {
          return m.components[key]
        })
      })
    )
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
    resolved: Route
  } {
    const location = normalizeLocation(to, current || this.history.current, append, this)
    const route = this.match(location, current)
    const fullPath = route.redirectedFrom || route.fullPath
    const base = this.history.base
    const href = createHref(base, fullPath, this.mode)
    return {
      location,
      route,
      href,
      normalizedTo: location,
      resolved: route
    }
  }

  addRoutes(routes: Array<RouteConfig>) {
    this.matcher.addRoutes(routes)
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }
}
```

VueRouter 是一个类，先看构造函数做了那些事情，`this.app` 表示根 Vue 实例，`this.apps` 保存持有 `$options.router` 属性的 Vue 实例，`this.options` 保存路由配置，`beforeHooks,resolveHooks,afterHooks` 表示一些钩子，`this.matcher` 表示路由匹配器，`this.fallback`表示浏览器不支持回退到 `hash`模式，`this.mode`表示创建的模式，`this.history` 表示路由历史的具体的实现实例，不同的 `HTML5History,HashHistory,AbstractHistory` 类继承自 `History` 类

我们在实例化 `Vue` 的时候传入 `VueRouter` 的实例 `router`，组件初始化时在混入的 `beforeCreate` 钩子中，如果定义了 `this.$options.router` 就会执行 `this._router.init(this)`

init 方法会把 this（vue 实例）存储在 `this.app` 中，只有根实例会存在 `this.app` 中，并且会拿当前的 `this.history` 执行 `history.transitionTo` 方法来做路由过渡

## Matcher

```js
export type Matcher = {
  match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route,
  addRoutes: (routes: Array<RouteConfig>) => void
}
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
  replace?: boolean
}
declare type Route = {
  path: string,
  name: ?string,
  hash: string,
  query: Dictionary<string>,
  params: Dictionary<string>,
  fullPath: string,
  matched: Array<RouteRecord>,
  redirectedFrom?: string,
  meta?: any
}
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
  nameMap: Dictionary<RouteRecord>
} {
  // the path list is used to control path matching priority
  const pathList: Array<string> = oldPathList || []
  // $flow-disable-line
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // $flow-disable-line
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  // ensure wildcard routes are always at the end
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
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
  props: boolean | Object | Function | Dictionary<boolean | Object | Function>
}
```

`routeRecord` 就是 `addRouteRecord` 执行生成的，它遍历 `routes` 为每一个 `route` 执行 `addRouteRecord` 生成一条记录，然后用 `pathList` `pathMap` `nameMap` 管理起来
创建的 routeRecord 如下

```js
const record: RouteRecord = {
  path: normalizedPath, // cleanPath(`${parent.path}/${path}`)
  regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
  components: route.components || { default: route.component },
  instances: {},
  name,
  parent,
  matchAs,
  redirect: route.redirect,
  beforeEnter: route.beforeEnter,
  meta: route.meta || {},
  props: route.props == null ? {} : route.components ? route.props : { default: route.props }
}
```

`path` 是规范化后的路径，`regex` 是一个正则的扩展 解析`url`，`components` 对应 `{default: route.component}`，instances 是组件实例，`parent` 是父的 `routeRecord`，因为我们一般也会配置子路由，所以 `RouteRecord` 也是一个树形结构

```js
if (route.children) {
  // ...
  route.children.forEach(child => {
    const childMatchAs = matchAs ? cleanPath(`${matchAs}/${child.path}`) : undefined
    addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
  })
}
```

递归执行 `addRouteRecord` 的时候把当前 `child` 作为 `parent` 参数传入，这样深度遍历，我们就能拿到 `route` 的全部记录

因为 `pathList` `pathMap` `nameMap` 都是引用类型，所以我们会把所有的数据都统计到，经过 `createRouteMap` 的执行，我们会得到 `pathList pathMap nameMap`，有所有的`path`，以及对应的 `routeRecord`

回到 `createMatcher`，创建完路由映射表之后，定义一些方法，最后返回 `{ match, addRoutes }`

```js
function addRoutes(routes) {
  createRouteMap(routes, pathList, pathMap, nameMap)
}
```

`addRoutes` 方法的作用就是动态添加路由，调用 `createRouteMap` 传入新的 `routes`

`match` 函数接受 3 个参数，`raw` 是 `rawLocation` 类型，它可以是一个 `url` 字符串，也可以是一个 `Location` 对象，`currentRoute` 是 `route` 类型，表示当前的路径，`redirectFrom` 和重定向相关，
`match` 方法就是接受一个 `raw` 和当前的 `currentRoute` 计算出一个新的路径并返回

```js
function match(raw: RawLocation, currentRoute?: Route, redirectedFrom?: Location): Route {
  const location = normalizeLocation(raw, currentRoute, false, router)
  const { name } = location

  if (name) {
    const record = nameMap[name]
    if (process.env.NODE_ENV !== 'production') {
      warn(record, `Route with name '${name}' does not exist`)
    }
    if (!record) return _createRoute(null, location)
    const paramNames = record.regex.keys.filter(key => !key.optional).map(key => key.name)

    if (typeof location.params !== 'object') {
      location.params = {}
    }

    if (currentRoute && typeof currentRoute.params === 'object') {
      for (const key in currentRoute.params) {
        if (!(key in location.params) && paramNames.indexOf(key) > -1) {
          location.params[key] = currentRoute.params[key]
        }
      }
    }

    if (record) {
      location.path = fillParams(record.path, location.params, `named route "${name}"`)
      return _createRoute(record, location, redirectedFrom)
    }
  } else if (location.path) {
    location.params = {}
    for (let i = 0; i < pathList.length; i++) {
      const path = pathList[i]
      const record = pathMap[path]
      if (matchRoute(record.regex, location.path, location.params)) {
        return _createRoute(record, location, redirectedFrom)
      }
    }
  }

  return _createRoute(null, location)
}
```

首先执行 `normalizeLocation` 方法，根据 `raw` `current` 计算出新的 `location`，他主要处理了两种情况，一种是有 `params` 且没有 `path`，一种是有 `path` 的，对于第一种情况，如果 `current` 有 `name`, 计算出的 `location` 也有 `name`。`normalizeLocation` 返回 `{_normalized: true, path, query, hash}`

计算出 `location` 后，对 `location` 的 `name` 和 `path` 的两种情况做了处理
有 `name` 情况根据 `nameMap` 匹配到 `record`，它是一个 `RouteRecord` 对象，如果 `record` 不存在，则匹配失败，返回一个空路径。然后拿到 `record` 对应的 `paramNames`，再对比 `currentRoute` 中的 `params`，把交集部分添加到 `location` 中，然后再通过 `fillParams` 方法根据 `record.path` 计算出 `location.path`，最后调用 `_createRoute(record, location, redirectedFrom)` 去生成一条新路径

通过 `name` 我们可以很快找到 `record`，但是通过 `path` 并不能，因为我们计算后的 `location.path` 是一个真实路径，而 `record` 中的 `path` 可能会有 `param`，因此需要对所有的 `pathList` 做顺序遍历，然后通过 `matchRoute` 方法根据 `record.regex location.path location.params` 匹配，如果匹配到就通过 `_createRoute(record, location, redirectedFrom)` 去生成一条新路径。

```js
function _createRoute(record: ?RouteRecord, location: Location, redirectedFrom?: Location): Route {
  if (record && record.redirect) {
    return redirect(record, redirectedFrom || location)
  }
  if (record && record.matchAs) {
    return alias(record, location, record.matchAs)
  }
  return createRoute(record, location, redirectedFrom, router)
}
```

`createRoute` 可以根据 `record` 和 `location` 创建出一条 `route` 路径，`vue-router` 中所有的路径都是通过 `createRoute` 函数创建，并且是 `freeze` 不可被外部修改的，`Route` 最终都会有一个特别重要的属性 `matched`，它通过 `formatMatch` 计算而来

```js
function formatMatch(record: ?RouteRecord): Array<RouteRecord> {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}
```

可以看它通过 `record` 循环向上找 `parent`，直到找到最外层，并把所有的 `record` 都 `push` 到一个数组中，最终返回的就是 `record` 数组，它记录了一条线路上的所有 `record`，`matched` 属性非常有用，它为之后渲染组件提供了依据

## 路径切换

history.transitionTo 是 Vue-Router 中非常重要的方法，当我们切换路由线路的时候，就会执行该方法

```js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const route = this.router.match(location, this.current)

  this.confirmTransition(route, () => {
    this.updateRoute(route)
    onComplete && onComplete(route)
    this.ensureURL()

    if (!this.ready) {
      this.ready = true
      this.readyCbs.forEach(cb => { cb(route) })
    }
  }, err => {
    if (onAbort) {
      onAbort(err)
    }
    if (err && !this.ready) {
      this.ready = true
      this.readyErrorCbs.forEach(cb => { cb(err) })
    }
  })
}
```

transitionTo 首先根据目标 location 和当前路径 this.current 执行 this.router.match 方法去匹配到目标的路径，然后执行 confirmTransition 做真正的切换，
这个过程可能有一些异步的操作（异步操作），所以整个 cinfirmTransition API 设计成带有成功回调函数和失败回调函数

```js
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    const current = this.current
    const abort = err => {
      // changed after adding errors with
      // https://github.com/vuejs/vue-router/pull/3047 before that change,
      // redirect and aborted navigation would produce an err == null
      if (!isNavigationFailure(err) && isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach(cb => {
            cb(err)
          })
        } else {
          warn(false, 'uncaught error during route navigation:')
          console.error(err)
        }
      }
      onAbort && onAbort(err)
    }
    const lastRouteIndex = route.matched.length - 1
    const lastCurrentIndex = current.matched.length - 1
    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      lastRouteIndex === lastCurrentIndex &&
      route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
    ) {
      this.ensureURL()
      return abort(createNavigationDuplicatedError(current, route))
    }

    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )

    const queue: Array<?NavigationGuard> = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated)
    )

    this.pending = route
    const iterator = (hook: NavigationGuard, next) => {
      if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        hook(route, current, (to: any) => {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true)
            abort(createNavigationAbortedError(current, route))
          } else if (isError(to)) {
            this.ensureURL(true)
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route))
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }

    runQueue(queue, iterator, () => {
      const postEnterCbs = []
      const isValid = () => this.current === route
      // wait until async components are resolved before
      // extracting in-component enter guards
      const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
      const queue = enterGuards.concat(this.router.resolveHooks)
      runQueue(queue, iterator, () => {
        if (this.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        this.pending = null
        onComplete(route)
        if (this.router.app) {
          this.router.app.$nextTick(() => {
            postEnterCbs.forEach(cb => {
              cb()
            })
          })
        }
      })
    })
  }
```

首先定义了 `abort` 函数，然后判断如果满足计算后的 `route` 和 `current` 是相同路径的话，则直接调用 `this.ensureUrl` 和 `abort`

接着根据 `current.matched` 和 `route.matched` 执行 `resolveQueue` 方法解析出 3 个队列，因为 `matched` 是一个 `routeRecord` 数组，所以遍历长度长的找到两个 `route` 不一样的位置，拿到 `updated` `activeted` `deactiveted` 三个 `RouteRecord` 数组，接下来要执行一系列的钩子

### 导航守卫

守卫就是一系列钩子
接下里的逻辑就是首先构造一个队列 `queue`，然后再定义一个 iterator，最后执行 `runQueue` 执行这个队列

```js
export function runQueue(queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```

这是一个非常经典的异步函数队列化执行的模式，queue 是一个 `NavigationGuard` 类型的数组，我们定义了 `step` 函数，每次根据 `index` 从 `queue` 中取出一个 `guard`，然后执行 `fn` 函数，
并且吧 `guard` 作为参数传入，第二个参数是一个函数，当这个函数执行的时候再递归执行 `step` 函数，前进到下一个，这里的 `fn` 就是 `iterator` 函数

```js
const iterator = (hook: NavigationGuard, next) => {
  if (this.pending !== route) {
    return abort()
  }
  try {
    hook(route, current, (to: any) => {
      if (to === false || isError(to)) {
        this.ensureURL(true)
        abort(to)
      } else if (typeof to === 'string' || (typeof to === 'object' && (typeof to.path === 'string' || typeof to.name === 'string'))) {
        abort()
        if (typeof to === 'object' && to.replace) {
          this.replace(to)
        } else {
          this.push(to)
        }
      } else {
        next(to)
      }
    })
  } catch (e) {
    abort(e)
  }
}
```

`iterator` 函数就是去执行 每一个导航守卫 `hook`，并传入 `route` `current` 和匿名函数，这些参数对应文档中的 `to` `from` `next`, 如果执行了匿名函数，会根据一些条件执行 `abort` 和 `next`, 只有执行 `next` 才会进入下一个钩子。(这里的 `next` 就会调用 `runQueue` 中 `fn` 的回调)

最后看一下 这个 `queue`

```js
const queue: Array<?NavigationGuard> = [].concat(
  extractLeaveGuards(deactivated),
  this.router.beforeHooks,
  extractUpdateHooks(updated),
  activated.map(m => m.beforeEnter),
  resolveAsyncComponents(activated)
)
```

其中钩子的顺序如下：

1. 在失活的组件里调用离开守卫
2. 调用全局的 `beforeEach` 守卫
3. 在重用的组件里调用 `beforeRouteUpdate` 守卫
4. 在激活的路由配置里调用 `beforeEnter`
5. 解析异步路由
6. 在被激活的组件里调用 `beforeRouteEnter`
7. 调用全局的 `beforeResolve` 钩子

```js
const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
const queue = enterGuards.concat(this.router.resolveHooks)
```

8. 调用全局的 `afterEach` 钩子
9. 触发 `DOM` 更新
10. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入

```js
if (this.router.app) {
  this.router.app.$nextTick(() => {
    postEnterCbs.forEach(cb => {
      cb()
    })
  })
}
```

### url

当我们点击 `router-link` 的时候，实际上最终会执行 `router.push`

```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // $flow-disable-line
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      this.history.push(location, resolve, reject)
    })
  } else {
    this.history.push(location, onComplete, onAbort)
  }
}
```

**`hash` 模式下的 `history.push`**

```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(
    location,
    route => {
      pushHash(route.fullPath)
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    },
    onAbort
  )
}
```

在 transitionTo 成功的回调中，会调用 pushHash 方法

```js
function pushHash(path) {
  if (supportsPushState) {
    pushState(getUrl(path))
  } else {
    window.location.hash = path
  }
}
```

如果 `supportPushState` 为 `true`，就执行 `pushState(getUrl(path))`，否则直接替换 `window.location.hash`

```js
export function pushState(url?: string, replace?: boolean) {
  saveScrollPosition()
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}
```

`pushState` 会调用浏览器原生的 `history` 的 `pushState` 接口或者 `replaceState` 接口，更新浏览器的 `url` 地址，并把当前 `url` 压入历史栈中

然后在 h`istory 的初始化中，会设置一个监听器，监听历史栈的变化

```js
setupListeners () {
  const router = this.router
  const expectScroll = router.options.scrollBehavior
  const supportsScroll = supportsPushState && expectScroll

  if (supportsScroll) {
    setupScroll()
  }

  window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', () => {
    const current = this.current
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), route => {
      if (supportsScroll) {
        handleScroll(this.router, route, current, true)
      }
      if (!supportsPushState) {
        replaceHash(route.fullPath)
      }
    })
  })
}
```

在 `router.init` 的时候，首次执行 `transitionTo` 时成功或失败的回调都会设置为 `setupListeners`, 这个函数添加 `popstate` 或者 `hashchange` 事件，
事件的回调会执行 `transitionTo` 并把 `getHash()` 的结果作为第一个参数. 当点击浏览器返回按钮的时候，如果已经有 `url` 被压入历史栈，则会触发 `popstate` 事件

### 组件

路由最终的渲染离不开组件，`Vue-Router` 内置了 `<router-view>` 组件

```js
export default {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render(_, { props, children, parent, data }) {
    data.routerView = true

    const h = parent.$createElement
    const name = props.name
    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})

    let depth = 0
    let inactive = false
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      if (parent._inactive) {
        inactive = true
      }
      parent = parent.$parent
    }
    data.routerViewDepth = depth

    if (inactive) {
      return h(cache[name], data, children)
    }

    const matched = route.matched[depth]
    if (!matched) {
      cache[name] = null
      return h()
    }

    const component = (cache[name] = matched.components[name])

    data.registerRouteInstance = (vm, val) => {
      const current = matched.instances[name]
      if ((val && current !== vm) || (!val && current === vm)) {
        matched.instances[name] = val
      }
    }
    ;(data.hook || (data.hook = {})).prepatch = (_, vnode) => {
      matched.instances[name] = vnode.componentInstance
    }

    let propsToPass = (data.props = resolveProps(route, matched.props && matched.props[name]))
    if (propsToPass) {
      propsToPass = data.props = extend({}, propsToPass)
      const attrs = (data.attrs = data.attrs || {})
      for (const key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key]
          delete propsToPass[key]
        }
      }
    }

    return h(component, data, children)
  }
}
```

我们可以看到 `<router-view></router-view>` 是一个函数组件，它的渲染也是依赖 render 函数，我们分析一下他的渲染

首先获取 createElement name route cache 等变量

然后在 `router.init` 的时候，会执行 history.listen()

```js
history.listen(route => {
  this.apps.forEach((app) => {
    app._route = route
  })
})

listen (cb: Function) {
  this.cb = cb
}
```

我们在 `transitionTo` 成功的回调中 `afterEach` 之前会执行 `updateRoute`

```js
updateRoute (route: Route) {
  this.current = route
  this.cb && this.cb(route)
}
```

`$route` 是定义在 `Vue.prototype` 上。每个组件实例访问 `$route` 属性，就是访问根实例的 `_route`，也就是当前的路由线路。

`<router-view>` 是支持嵌套的，回到 `render` 函数，其中定义了 `depth` 的概念，他表示 `router-view` 嵌套的深度，每个 `router-view` 在渲染的时候都会执行如下逻辑：

```js
data.routerView = true
// ...
while (parent && parent._routerRoot !== parent) {
  if (parent.$vnode && parent.$vnode.data.routerView) {
    depth++
  }
  if (parent._inactive) {
    inactive = true
  }
  parent = parent.$parent
}

const matched = route.matched[depth]
// ...
const component = (cache[name] = matched.components[name])
```

`parent._routerRoot` 表示的是根 `Vue` 实例，在这个过程，如果碰到了父节点也是 `<router-view>` 的时候，说明有嵌套的情况，`depth++`, 遍历完成后，根据当前线路匹配的路径和 `depth`
找到对应的 `RouteRecord`，进而找到该渲染的组件。

除了找到了应该渲染的组件，还定义了一个注册路由实例的方法

```js
data.registerRouteInstance = (vm, val) => {
  const current = matched.instances[name]
  if ((val && current !== vm) || (!val && current === vm)) {
    matched.instances[name] = val
  }
}
```

给 `vnode` 的 `data` 定义了 `registerRouteInstance` 方法，调用该方法去注册路由的实例
在混入的 `beforeCreate` 钩子函数中，会执行 `registerInstance` 方法，进而执行 `render` 函数中定义的 `registerRouteInstance`，从而给 `matched.instances[name]` 赋值当前组件的 `vm` 实例

render 函数最后根据 component 渲染出对应的组件 vnode

## 问题

1. 路由钩子为什么要 bind
2. this.current 什么时候赋值

`transitionTo` 成功回调执行 `updateRoute`

```js
updateRoute (route: Route) {
  //. ..
  this.current = route
  this.cb && this.cb(route)
  // ...
}
```

3. a 标签执行 router.push
4. routerRecord.instance 什么时候赋值

`beforeCreate` 混入了 `registerInstance(this, this)`, 这个函数会执行 `registerRouteInstance`

```js
data.registerRouteInstance = (vm, val) => {
  // val could be undefined for unregistration
  const current = matched.instances[name]
  if ((val && current !== vm) || (!val && current === vm)) {
    matched.instances[name] = val
  }
}
```
