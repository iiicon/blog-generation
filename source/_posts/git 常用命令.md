---
title: git 常用命令
date: 2018-11-25 18:47:11
categories: 工具
tags: [command, G, git]
comments: false
---

`git clone git@github.com:xxxx` 下载仓库

`git init，初始化本地仓库` .git

`git status -sb` 显示当前所有文件的状态

`git add 文件路径` 用来将变动加到暂存区

`git commit -m "信息"` 用来正式提交变动，提交至 .git 仓库

`git log` 查看变更历史

`git pull` 

`git push`

`git remote add origin git@github.com:xxxxxxx.git` 将本地仓库与远程仓库关联

`git remote set-url origin git@github.com:xxxxx.git` 上一步手抖了，可以用这个命令来挽回

`git branch` 新建分支

`git merge` 合并分支

`git diff` 查看详细变化

`git rev-parse HEAD` 查看当前的 commit 记录

`git reset --hard xxxx` 回滚

`git push -f origin develop`  git 强制提交

`git push -u orgin dev` git 设置上游 --set-upstream

`git config core.ignorecase false` windows 设置大小写敏感