---
title: git分支覆盖
date: 2019-12-03 09:50:56
categories: 工具
tags: [command]
comments: false
---

1. 切换分支

        git checkout master

2. 本地覆盖为当前分支

        git reset --hard feature/1.0

3. 强制推送的远端

        git push origin master --force

4. 检查
   
        git diff master feature/1.0