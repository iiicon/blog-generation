---
title: vue3 源码阅读笔记
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

```js
app.mount = (containerOrSelector) => {
  // 标准化容器
  const container = normalizeContainer(containerOrSelector);
  if (!container) return;
  const component = app._component;
  // 如组件对象没有定义 render 函数和 template 模板，则取容器的 innerHTML 作为组件模板内容
  if (!isFunction(component) && !component.render && !component.template) {
    component.template = container.innerHTML;
  }
  // 挂载前清空容器内容
  container.innerHTML = "";
  // 真正的挂载
  return mount(container);
};
```

app.mount 就是 重写的 mount 方法，传入 container 参数，先标准化容器，然后取出 rootComponent，
如组件对象没有定义 render 函数和 template 模板，则取容器的 innerHTML 作为组件模板内容，
在挂载前清空容器内容，然后执行通用的 mount 方法

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
function createVNode(type, props = null, children = null) {
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
    : 0;
  const vnode = {
    type,
    props,
    shapeFlag,
    // 一些其他属性
  };
  // 标准化子节点，把不同数据类型的 children 转成数组或者文本类型
  normalizeChildren(vnode, children);
  return vnode;
}
```

可以看出 createVnode 就是对 props 做标准化处理、对 vnode 的类型信息编码、创建 vnode 对象，标准化子节点 children，返回 vnode

#### 渲染 vnode

在 app.mount 内部通过 render(vnode, rootContainer) 去渲染组件

```js
render(vnode, rootContainer);
const render = (vnode, container) => {
  if (vnode == null) {
    // 销毁组件
    if (container._vnode) {
      unmount(container._vnode, null, null, true);
    }
  } else {
    // 创建或者更新组件
    patch(container._vnode || null, vnode, container);
  }
  // 缓存 vnode 节点，表示已经渲染
  container._vnode = vnode;
};
```

通过 vnode 判断去执行卸载还是创建或更新，接下来看 patch

```js
const patch = (
  n1,
  n2,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  optimized = false
) => {
  // 如果存在新旧节点, 且新旧节点类型不同，则销毁旧节点
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1);
    unmount(n1, parentComponent, parentSuspense, true);
    n1 = null;
  }
  const { type, shapeFlag } = n2;
  switch (type) {
    case Text:
      // 处理文本节点
      break;
    case Comment:
      // 处理注释节点
      break;
    case Static:
      // 处理静态节点
      break;
    case Fragment:
      // 处理 Fragment 元素
      break;
    default:
      if (shapeFlag & 1 /* ELEMENT */) {
        // 处理普通 DOM 元素
        processElement(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      } else if (shapeFlag & 6 /* COMPONENT */) {
        // 处理组件
        processComponent(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      } else if (shapeFlag & 64 /* TELEPORT */) {
        // 处理 TELEPORT
      } else if (shapeFlag & 128 /* SUSPENSE */) {
        // 处理 SUSPENSE
      }
  }
};
```

我们重点关注对组件的处理和对普通 dom 元素的处理
先看对组件的处理

```js
const processComponent = (
  n1,
  n2,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  if (n1 == null) {
    // 挂载组件
    mountComponent(
      n2,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      isSVG,
      optimized
    );
  } else {
    // 更新组件
    updateComponent(n1, n2, parentComponent, optimized);
  }
};
```

mountComponent 就做三件事情

```js
const mountComponent = (
  initialVNode,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  // 创建组件实例
  const instance = (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent,
    parentSuspense
  ));
  // 设置组件实例
  setupComponent(instance);
  // 设置并运行带副作用的渲染函数
  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  );
};
```

组件的创建不像 2.0 去实例化组件，内部通过返回对象创建，接着是设置组件实例，保留了很多组件相关的数据，维护了组件的上下文，包括对 props，插槽，以及其他实例的属性的初始化处理，最后是运行带副作用的渲染函数 `setupRenderEffect`

```js
const setupRenderEffect = (
  instance,
  initialVNode,
  container,
  anchor,
  parentSuspense,
  isSVG,
  optimized
) => {
  // 创建响应式的副作用渲染函数
  instance.update = effect(function componentEffect() {
    if (!instance.isMounted) {
      // 渲染组件生成子树 vnode
      const subTree = (instance.subTree = renderComponentRoot(instance));
      // 把子树 vnode 挂载到 container 中
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
      // 保留渲染生成的子树根 DOM 节点
      initialVNode.el = subTree.el;
      instance.isMounted = true;
    } else {
      // 更新组件
    }
  }, prodEffectOptions);
};
```

该函数利用响应式库的 effect 函数创建了一个副作用渲染函数 componentEffect ,当组件的数据发生变化时，effect 函数包裹的内部渲染函数 componentEffect 会重新执行一遍，从而达到重新渲染组件的目的。

先分析初始渲染

**初始渲染主要做两件事情：渲染组件生成 subTree、把 subTree 挂载到 container 中**

`initialVnode` 就是 `组件 vnode`，`subTree` 就是 `子树 vnode` 执行 `renderComponentRoot` 生成

我们知道每个组件都会有对应的 `render` 函数，即使你写 `template`，也会编译成 `render` 函数，而 `renderComponentRoot` 函数就是去执行 `render` 函数创建整个组件树内部的 `vnode`，把这个 `vnode` 再经过内部一层标准化，就得到了该函数的返回结果：子树 vnode。

渲染成子树 `vnode` 后，接下来就是继续调用 `patch` 函数把子树 `vnode` 挂载到 `container` 中

又回到 `patch` 函数，会继续对这个子树的 `vnode` 类型进行判断，如果是 `div` 就对应的是 `普通元素 vnode`，
就会处理普通 dom 执行 `processElement` 函数

```js
const processElement = (
  n1,
  n2,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  isSVG = isSVG || n2.type === "svg";
  if (n1 == null) {
    //挂载元素节点
    mountElement(
      n2,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      isSVG,
      optimized
    );
  } else {
    //更新元素节点
    patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized);
  }
};
```

接下来看 mountComponent 的逻辑

```js
const mountElement = (
  vnode,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  let el;
  const { type, props, shapeFlag } = vnode;
  // 创建 DOM 元素节点
  el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is);
  if (props) {
    // 处理 props，比如 class、style、event 等属性
    for (const key in props) {
      if (!isReservedProp(key)) {
        hostPatchProp(el, key, null, props[key], isSVG);
      }
    }
  }
  if (shapeFlag & 8 /* TEXT_CHILDREN */) {
    // 处理子节点是纯文本的情况
    hostSetElementText(el, vnode.children);
  } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
    // 处理子节点是数组的情况
    mountChildren(
      vnode.children,
      el,
      null,
      parentComponent,
      parentSuspense,
      isSVG && type !== "foreignObject",
      optimized || !!vnode.dynamicChildren
    );
  }
  // 把创建的 DOM 元素节点挂载到 container 上
  hostInsert(el, container, anchor);
};
```

可以看到，挂载元素函数主要做四件事情，创建 `DOM` 元素节点，处理 `props`，处理 `children`，挂载 `DOM` 到 container 上

渲染完 `subTree` 之后，就会执行 `componentEffect` 函数中的剩余逻辑

```js
initialVNode.el = subTree.el;
instance.isMounted = true;
```
