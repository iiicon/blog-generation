---
title: React-Router
date: 2019-07-28 14:47:05
categories: React
tags: [React, G]
---

### 用 hash 做 router

    window.location.hash = 'signin'

### 用 pushState 做 router

_假设为顶级路由_

    const [ui, setUi] = useState(window.location.pathname === 'signin' ? 0 : 1)
    window.history.pushState(null, '', 'signin')

### 用 React-Router 做路由

安装 react-router-dom `"react-router": "^5.0.1" "react-router-dom": "^5.0.1",`

    yarn add react-router-dom

引入 Router Route Link

    import { BrowserRouter as Router, Route, Link } from "react-router-dom";

使用 Router 组件

    function RA9() {
      return (
        <div>
          <Rotuer>
            <Link to="/signin">
              <button>登录</button>
            </Link>
            <Link to="/signup">
              <button>注册</button>
            </Link>
            <Route path="/" exact component={RA9} />
            <Route path="/signin/" component={SignIn} />
            <Route path="/signup/" component={SignUp} />
          </Rotuer>
        </div>
      )
    }

在 react 内部会变成下面这样

    function RA9() {

      return React.createElement(
        'div',
        null,
        React.createElement(
          Rotuer,
          null,
          React.createElement(
            Link,
            {
              to: '/signin'
            },
            React.createElement('button', null, '\u767B\u5F55')
          ),
          React.createElement(
            Link,
            {
              to: '/signup'
            },
            React.createElement('button', null, '\u6CE8\u518C')
          ),
          React.createElement(Route, {
            path: '/',
            exact: true,
            component: RA9
          }),
          React.createElement(Route, {
            path: '/signin/',
            component: SignIn
          }),
          React.createElement(Route, {
            path: '/signup/',
            component: SignUp
          })
        )
      )
    }

### 代码仓库

[react-router](https://github.com/iiicon/react-demo-advance/blob/master/src/pages/RA9/index.jsx)
