---
title: vue3源码阅读笔记
date: 2020-08-20 10:03:35
tags: [vue, 笔记]
categories: vue
---

# Vue.js 的优化

## 源码优化

- 更好的代码管理方式：monorepo
- 有类型的 JavaScript：TypeScript

## 性能优化

- 源码体积优化

  - 首先，移除一些冷门的 feature（比如 filter、inline-template 等）
  - 其次，引入 tree-shaking 的技术，减少打包体积

- 数据劫持优化
- 编译优化，借助 Block tree，Vue.js 将 vnode 更新性能由与模版整体大小相关提升为与动态内容的数量相关，这是一个非常大的性能突破

## 语法 API 优化：Composition API

1. 优化逻辑组织
2. 优化逻辑复用

## 引入 RFC：使每个版本改动可控

[Vue.js-RFC](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3A3.x)

# 组件的实现：Vue 核心的实现

> 模板 + 对象描述 + 数据 = 组件

## 1. vnode 到真实 DOM 是如何转变的？

> 创建 vnode + 渲染 vnode + 生成 DOM

### vue 初始化

```js
// 在 Vue.js 3.0 中，初始化一个应用的方式如下
import { createApp } from "vue";
import App from "./app";
const app = createApp(App);
app.mount("#app"); // 把 App 组件挂载到 id 为 app 的 DOM 节点上
```

这其中导入了一个 createApp 入口函数，他是 Vue.js 对外暴露的一个函数

```js
const createApp = (...args) => {
  // 创建 app 对象
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  // 重写 mount 方法
  app.mount = (containerOrSelector) => {
    // ...
  };
  return app;
};
```

从代码中可以看出 createApp 主要做了两件事情，创建 app 对象和重写 app.mount 方法

#### 1. 创建 app 对象

```js
const app = ensureRenderer().createApp(...args);
```

其中 ensureRenderer() 用来创建一个渲染器对象，它的内部实现如下

```js
// 渲染相关的一些配置，比如更新属性的方法，操作 DOM 的方法
const rendererOptions = {
  patchProp,
  ...nodeOps,
};
let renderer;
// 延时创建渲染器，当用户只依赖响应式包的时候，可以通过 tree-shaking 移除核心渲染逻辑相关的代码
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options) {
  function render(vnode, container) {
    // 组件渲染的核心逻辑
  }

  return {
    render,
    createApp: createAppAPI(render),
  };
}
function createAppAPI(render) {
  // createApp createApp 方法接受的两个参数：根组件的对象和 prop
  return function createApp(rootComponent, rootProps = null) {
    const app = {
      _component: rootComponent,
      _props: rootProps,
      mount(rootContainer) {
        // 创建根组件的 vnode
        const vnode = createVNode(rootComponent, rootProps);
        // 利用渲染器渲染 vnode
        render(vnode, rootContainer);
        app._container = rootContainer;
        return vnode.component.proxy;
      },
    };
    return app;
  };
}
```

#### 2. 重写 app.mount 方法

Vue.js 不仅仅是为 Web 平台服务，它的目标是支持跨平台渲染，而 createApp 函数内部的 app.mount 方法是一个标准的可跨平台的组件渲染流程，

```js
mount(rootContainer) {
 // 创建根组件的 vnode
 const vnode = createVNode(rootComponent, rootProps)
 // 利用渲染器渲染 vnode
 render(vnode, rootContainer)
 app._container = rootContainer
 return vnode.component.proxy
}
```

标准的跨平台渲染流程是先创建 vnode，再渲染 vnode。此外参数 rootContainer 也可以是不同类型的值，也就是这里是通用的渲染逻辑，
来完善 Web 平台下的渲染逻辑

```
app.mount = (containerOrSelector) => {
  // 标准化容器
  const container = normalizeContainer(containerOrSelector)
  if (!container)
    return
  const component = app._component
   // 如组件对象没有定义 render 函数和 template 模板，则取容器的 innerHTML 作为组件模板内容
  if (!isFunction(component) && !component.render && !component.template) {
    component.template = container.innerHTML
  }
  // 挂载前清空容器内容
  container.innerHTML = ''
  // 真正的挂载
  return mount(container)
}

```

app.mount 就是 重写的 mount 方法，传入 container 参数，先标准化容器，然后取出 rootComponent，
如组件对象没有定义 render 函数和 template 模板，则取容器的 innerHTML 作为组件模板内容，
在挂载钱清空容器内容，然后执行通用的 mount 方法

### 核心渲染流程：创建 vnode 和渲染 vnode

#### 创建 vnode

组件 vnode 其实是对抽象事物的描述，这是因为我们并不会在页面上真正渲染一个 `<custom-component>` 标签，而是渲染组件内部定义的 HTML 标签。
vnode 有组件 vnode，普通元素 vnode，注释 vnode，文本 vnode

**为什么要设计 vnode？**

- 抽象
- 跨平台都可以用

回顾 app.mount 内部实现，用 createVnode 创建了根组件的 vnode

```js
const vnode = createVNode(rootComponent, rootProps);
```
```js
function createVNode(type, props = null
,children = null) {
  if (props) {
    // 处理 props 相关逻辑，标准化 class 和 style
  }
  // 对 vnode 类型信息编码
  const shapeFlag = isString(type)
    ? 1 /* ELEMENT */
    : isSuspense(type)
      ? 128 /* SUSPENSE */
      : isTeleport(type)
        ? 64 /* TELEPORT */
        : isObject(type)
          ? 4 /* STATEFUL_COMPONENT */
          : isFunction(type)
            ? 2 /* FUNCTIONAL_COMPONENT */
            : 0
  const vnode = {
    type,
    props,
    shapeFlag,
    // 一些其他属性
  }
  // 标准化子节点，把不同数据类型的 children 转成数组或者文本类型
  normalizeChildren(vnode, children)
  return vnode
}

```
可以看出 createVnode 就是对 props 做标准化处理、对 vnode 的类型信息编码、创建 vnode 对象，标准化子节点 children，返回 vnode