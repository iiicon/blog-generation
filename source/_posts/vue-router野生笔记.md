---
title: vue-router野生笔记
date: 2019-03-31 21:32:46
tags: [vue, vue-router]
categories: vue
---

```
/**
 * 1. 导航被触发
 * 2. 在失活的组件（即将离开的页面组件）里调用离开守卫 beforeRouteLeave
 * 3. 调用全局的前置守卫 beforeEach
 * 4. 在重用的组件里调用 beforeRouteUpdate
 * 5. 调用路由独享的守卫 beforeEnter
 * 6. 解析异步路由组件
 * 7. 在被激活的组件（即将进入的页面组件）里调用 beforeRouteEnter
 * 8. 调用全局的解析守卫 beforeResolve
 * 9. 导航被确认
 * 10. 调用全局的后置守卫 afterEach
 * 11. 触发DOM更新
 * 12. 用创建好的实例调用beforeRouterEnter守卫里传给next的回调函数
 */
```

![vue-router2.jpeg](https://i.loli.net/2019/03/31/5ca0c3b0c9e8c.jpeg)
![vue-router3.jpeg](https://i.loli.net/2019/03/31/5ca0c3b0c7b92.jpeg)
