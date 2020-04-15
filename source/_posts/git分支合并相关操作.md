---
title: git分支合并相关操作
date: 2019-12-03 09:50:56
categories: 工具
tags: [command, git]
comments: false
---

分支合并的一些操作我们经常会遇到

<!-- more -->

## 合并（git merge）

当项目中包含多条功能分支时，有时就需要 `git merge` 命令，指定将某个分支的提交合并到当前分支，git 有两个合并策略 fast-forword 和 no-fast-forward

### fast-forward(-ff)

如果当前分支在合并之前，没有做过额外提交，那么合并分支的过程不会产生新的提交记录，而是直接将分支上的提交添加进来，这成为 fast-forword 合并

![ff](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFOtuyKTBrtvK9POh0ZicUNyIXv0ibWLFrc3LicMicWlicFhqlUV5qLcC0t1tw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

现在 dev 分支上的修改已全部合并到主分支 master 上

### no-fast-forward(--no-ff)

上面的场景很少遇到，基本是：在当前分支分离出子分支之后，做了一些修改；而分离出的子分支也做了修改，这个时候再使用 `git merge`, 就会触发 no-fast-forward 策略了
在 no-fast-forward 策略下， git 会在当前分支（active brach）额外创建一个新的合并提交，这条提交记录既指向当前分支，又指向合并分支

![no-ff](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFOovc8FicicdbGMeIPQt2bFCq8xmucibxsQ7zWib2g8NDW5GWRq2arZ6sktA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

合并后，在当前主分支 master 上包含 dev 分支上的所有修改

### 合并冲突

如果两个分支的修改存在冲突：比如说同事修改了某个文件的同一行；或者一个分支删除了文件，而另一个分支修改了文件--对于这种情况，git 是无法决定合并策略的。这个时候，git 就会把合并操作交给我们。

举个例子，两个分支对同一个 README 做了修改，如果此时将 dev 合并到 master，那么就存在合并冲突了，当在主分支上执行 `git merge`后，git 会提示存在合并冲突，并把冲突的地方标记出来，我们手工处理完毕后，保存修改、添加文件、然后提交修改就可以了

![合并冲突](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFOl4iaZmrUk2neawldGKz1LguRiaYtQQTFL4PzTwebj5GRfmW8UmOjL5TQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

### 变基（git rebase）

除了 `git merge`, 还能使用`git rebase` 来合并分支

`git rebase` 指令会复制当前分支的所有最新提交，然后将这些提交添加到指定分支提交记录之上

![rebase](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFOs1pbHgKho3v46GZhMre3BDX1JHVicL4lTlzKOmVfpwiaqRdwVGZ9WsFA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

如图，dev 分支是从主分支上分离出去的（在 i8fe5）处，之后主分支与 dev 分支上都有相应的修改，执行 `git rebase master` 后，dev 分支将自己的最新提交记录复制出来（提交 hash 也发生了改变），拼在了主分支最后一次提交之上，这种合并分支的方式，会令 git 提交历史看起来很清爽

变基在开发功能（feature brach）分支时很有用--在开发功能时，主分支上可能也做了一些更新，我们可以将主分支上的最新更新通过变基合并到功能分支上来，这在未来在主分支上合并功能分支避免了冲突的发生

### 交互式变基

git rebase 时，我们还能对当前分支上的提交记录做修改，采用交互式变基形式（Interactive Rebase）形式
变基时提供了 6 种操作模式：

- reword 提交修改信息
- edit 修改此提交
- squash 将当前提交合并到之前的提交中
- fixup 将当前提交合并到之前的提交中，不保留提交日志消息
- exec 在每一个需要变基的提交上执行一条命令
- drop 删除提交

drop 的例子：
![drop](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFOBnJ7NwOgrzMIhcKXsME3PiaIaoVQyuNpUyduZk1CZ5s6SLfec8zfONA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

squash 的例子：
![squash](https://mmbiz.qpic.cn/mmbiz_gif/meG6Vo0MeviaPS2ZgOV7sV3qpnhsB4LFOfOgVv8QmLumCzyvHzLutYBgWY5u1buC2ibGibfn8b7LLFg7bM92uB97g/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

**注意**

- squash 的时候，首条记录必须是还没有推送到远端的
- 使用 `git rebase -i HEAD~3` 交互式修改最新的三条提交记录，参数在操作的时候会提示
- 使用 `git rebase master` 变基为最新的 master 分支
- 如果交互式变基出现下面错误
  ```sh
    fatal: It seems that there is already a rebase-merge directory, and
    I wonder if you are in the middle of another rebase.  If that is the
      case, please try
        git rebase (--continue | --abort | --skip)
      If that is not the case, please
        rm -fr ".git/rebase-merge"
  ```
- 如果变基出现冲突，执行 `git add .`，不用 `commit`，接着执行 `git rebase --continue` 就可以变基完成
- 还有出现任何错误，都可以执行 `git rebase --abort` 回到变基前的状态

## 分支覆盖

1.  切换分支

        git checkout master

2.  本地覆盖为当前分支

        git reset --hard feature/1.0

3.  强制推送的远端

        git push origin master --force

4.  检查

        git diff master feature/1.0
