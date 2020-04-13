---
title: React-HooksApi
date: 2019-07-24 08:07:40
categories: React
tags: [React, G]
---

### 类组件的不足

1. 难以复用的状态逻辑 缺少复用机制 渲染属性和高阶组件导致层级冗余
2. 趋向复杂难以维护 生命周期混杂不相干的逻辑 相干的逻辑分散在不同的生命周期
3. this 指向困扰 内联函数过渡创建新句柄 类成员函数不能保证 this

### Hooks Api

就是让函数组件能有状态，以前的无状态组件变成了现在的函数组件

### useState

使用

    import { useState } from 'react'

在函数组件声明 state 属性 count 和 setCount 方法，0 是初始值

    const [count, setCount] = useState(0)

在组件中渲染

    <button onClick={() => setCount(count + 1)}>+1</button>

当然初始值也可设为对象

    const [user, setUser] = useState({name: 'fuck',age: 100})

这样修改

    setUser({
      ...user,
      age: user.age + 1
    })

### useEffect

使用

    import { useEffect } from 'react'

在函数组件中，如果依赖外部世界的逻辑，直接写到 useEffect 的回调中执行

    useEffect(() => {
      document.title = 'useEffect --- React Hooks'
    })

### useContext

```js
useContext(contextObj); // 获取 Provider 传递的值
```

### useMemo

```js
useMemo(()=>{reutrn fn},[]:deep)  // 有返回值的时候使用
setValue在useMemo中可以不写依赖，直接用参数setValue(value=>value+1)
```

### useCallback

```js
useCallback(fn, ([]: deep)); // 没有返回值的时候使用
```

### useRef

- 获取子组件或者 dom 节点的句柄
- 渲染周期之间共享数据的存储

### 自定义 hooks

- use 开头的函数
- 可以逻辑复用，也可以返回 jsx
- 函数可以用 usecallback 优化


### 代码仓库

[React-HooksApi](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA8/index.jsx)
