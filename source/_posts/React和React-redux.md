---
title: React和React-redux
date: 2019-07-21 17:46:16
categories: React
tags: [React, G]
---

### 使用 redux

在顶层组件初始化 store

- 我们通过 createStore(reducer) 创建 store
- 我们通过 store.subscribe(render) 订阅事件
- 我们通过 store.dispatch({type, payload}) 发布事件

```
const reducer = (state, action) => {
  if (!state) {
    return { n: 0 }
  } else {
    if (action.type === 'add') {
      return { n: state.n + action.payload }
    } else {
      return state
    }
  }
}
const store = createStore(reducer)

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
```

我们在顶层组件初始化 store，在需要的时候发布事件，但是我们遇到了一个问题，
就是如果我们需要在子组件触发的话，就需要把事件一级级的传递下去，通过 props 上的事件去调用

这样有点累

当然我们也可以把 store 对象作为属性传递下去

```
store={store}
```

这样取值

```
this.props.store.getState().n
```

这样是确实不用一级级传递事件了，但是我们却需要一级级传递 store，其实没有改变什么
这个时候我们就需要一个东西来管理 store 对象的各个属性和状态

### 使用 react-redux

```
- connect()
- Provider
- connectAdvanced()
- batch()
```

我们主要用 Provider 组件和 connect 函数

第一步，给 Provider 一个 store

```
<Provider store={store}>
```

第二步，用 connect 函数返回新的组件

```
export default connect(mapStateToProps, mapDispatchToProps)(App)
```

第一个参数是用来初始化 state 的，接受一个 state，返回新的 state

```
const mapStateToProps = state => {
  return { n: state.n }
}
```

第二个参数可以写作函数也可以写成对象

```
const mapDispatchToProps = dispatch => {
  return {
    add: () => {
      dispatch({ type: 'add', payload: 1 })
    },
    onAdd2: () => {
      dispatch({ type: 'add', payload: 2 })
    }
  }
}
<!-- 或者 -->
const mapDispatchToProps = {
  add: () => {
    return { type: 'add', payload: 1 }
  },
  onAdd2: () => {
    return { type: 'add', payload: 2 }
  }
}

```

我们在调用的时候就可以直接 `this.props.add` 来触发事件了

这就是 react-redux 的使用，感叹 vuex 帮我们做了太多东西，有点香 XD


```js
contextType // 一个 context 的时候可以使用

static contextType = ssContext
const xx = this.context
这样可以不用 consumer 解析
```

### 代码仓库

[react-redux](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA6/index.jsx)