---
title: TS安装与调试
date: 2019-05-19 23:57:53
categories: TS
tags: [TS, G]
---

### 安装

```
npm install typescript -g
npm install ts-node -g
```

### 调试

```
mkdir .vscode
touch .vscode/launch.json

{
  "configurations": [
    {
      "name": "ts-node",
      "type": "node",
      "request": "launch",
      "program": "/Users/shiguangwei/.nvm/versions/node/v11.13.0/bin/ts-node",
      "args": [
        "${relativeFile}"
      ],
      "cwd": "${workspaceRoot}",
      "protocol": "inspector"
    }
  ]
}

```
touch 1.ts, 输入 console.log('hello joyowo') 点击调试即可

### 查看五分钟入门
[五分钟入门](https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html)

### 练习一下

```
enum Gender {
  Man,
  Woman
}
interface person {
  age: number,
  gender: Gender
}
function marry(a: person, b: person): [person, person] {
  if(a.gender!==b.gender) {
    return [a,b]
  } else {
    throw new Error('不能结婚')
  }
}
var c = marry({gender: Gender.Man, age: 28}, {gender: Gender.Woman, age: 18})
console.log(c)

function sorted(a: number[]):number[] {
  return a.sort((a, b) => b - a)
}
console.log(sorted([1,23,2,42,21]))

function add(a: string, b: string): string
function add(a: number, b: number): number
function add(a: any, b: any): any {
  return a + b
}

console.log(add(1, 2))

function min(a: number, b: number): number {
  if (a < b) {
    return ;
  } else {
    return b;
  }
}

var c = min(1, 2);
console.log(c);

```
