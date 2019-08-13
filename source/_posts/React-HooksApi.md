---
title: React-HooksApi
date: 2019-07-24 08:07:40
categories: React
tags: [React, G]
---

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

### 代码仓库
[React-HooksApi](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA8/index.jsx)