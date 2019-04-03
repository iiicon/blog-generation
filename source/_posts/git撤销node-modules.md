---
title: git撤销node_modules
date: 2019-03-24 22:09:00
categories: 工具
tags: [command, G]
comments: false
---

```
touch .gitignore
echo /node_modules/ >> .gitignore
git rm -r --cached node_modules
git add . -A
git commit -m "remove node_modules"
git push
npm install 或者 yarn install
```
