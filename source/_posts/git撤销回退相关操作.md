---
title: git撤销回退相关操作
date: 2020-04-15 17:15:06
categories: 工具
tags: [command, git]
comments: false
---

分支回退的一些操作我们经常会遇到

<!-- more -->

## 重置（git reset）

如果因为某些原因（比如新提交导致了 BUG，或只是一个 WIP 提交），需要撤回提交，那么可以使用 git reset 指令。
git reset 可以控制当前分支回撤到某次提交时的状态。

### 软重置

使用软重置，我们可以撤销提交记录，但是保留新建的文件。（就是我们可以重新提交）
![soft-reset](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFO8dmv56PCuicTzZTVL6lVp541picccqwMAU36EhACmJCMttPvBJl8tXjQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

### 硬重置

硬重置会把当前工作目录中的文件，以暂存的文件全部移除, `git reset --hard HEAD~2` 直接回退到两次提交之前的版本，
git 也会直接删除记录
![hard-reest](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFOsiboiaLTHUnlyorlyicvxZtRT9tQD4fcX2VponJIcFUpZHbKKdP5p31vQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

## 还原（git revert）

还有一种撤销更改的方式，是使用 `git revert` 命令，用于还原某次提交的修改，会创建一个包含已还原更改的新提交记录（也就是在不修改分支历史的前提下，还原某次提交引入的更改）
![revert](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFO9KAj8ZGBkjDallvJibGfibgWnfa5ECCY2pOpf6tZwwicv6RGViazjibRiaAg/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

## 检出提交（git cherry-pick） 
*gitLab翻译为优选* 把其他分支的提交检出到当前分支，检出之后已经执行了commit

