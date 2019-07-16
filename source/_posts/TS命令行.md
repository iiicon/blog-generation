---
title: TS命令行
date: 2019-05-23 01:25:08
categories: TS
tags: [TS, G]
---

### 最简单的命令行程序

```
## shebang
#!/usr/bin/env ts-node
console.log('hello')

## 接着给文件添加可执行权限
chmod +x ./1.ts

## 执行 ./1.ts
就能看到 hello
```

### 接受命令行参数

```
#!/usr/bin/env ts-node
console.log(process.argv)
```

执行会报错，2.ts(2,13): error TS2304: Cannot find name 'process'. 找不到 process
实际上我们在项目中经常用 process.NODE.env 这种获取环境变量，process 就是 Node.js 的全局变量，不可能找不到

这就是 TS 的厉害之处：如果你不告诉我 process 是什么，我就不允许你用 process

```
npm install @types/node
```

执行之后再次打开可以看到参数了

### 加法的例子

```
#!/usr/bin/env ts-node
console.log('hello world')
const a = parseInt(process.argv[2])
const b = parseInt(process.argv[3])

if (Number.isNaN(a) || Number.isNaN(b)) {
  console.log('参数必须是数字')
  process.exit(1)
}
console.log(a + b)
process.exit(0)
```

### 族谱的例子

```
#!/usr/bin/env ts-node
{
  class Person {
    public children: Person[] = []
    constructor(public name: string) {}
    addPerson(child: Person): void {
      this.children.push(child)
    }
    introduce(n?: number): void {
      n = n || 1
      const prefix = '--'.repeat(n - 1)
      console.log(`${prefix}${this.name}`)
      this.children.forEach((child: Person) => {
        child.introduce(n + 1)
      })
    }
  }

  const grandPa = new Person('爷爷')
  const child1 = new Person('大伯')
  const child2 = new Person('二伯')
  const child11 = new Person('大哥')
  const child12 = new Person('大姐')
  const child21 = new Person('二哥')
  const child22 = new Person('二姐')

  grandPa.addPerson(child1)
  child1.addPerson(child11)
  child1.addPerson(child12)
  grandPa.addPerson(child2)
  child2.addPerson(child21)
  child2.addPerson(child22)

  grandPa.introduce()
}
```
