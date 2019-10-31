/**
 * 对象和对象的关系（原型链）
 * 对象和函数的关系（this）
 */
var person1 = {
  name: 'frank',
  age: 18,
  isAdult: true,
  say() {
    console.log(`I am ${this.name}`)
  }
}
var person2 = {
  name: 'jack',
  age: 18,
  isAdult: true,
  say() {
    console.log(`I am ${this.name}`)
  }
}
var person3 = {}
var person4 = {}

// 这些对象太类似了，于是我们发明了构造函数（返回对象的函数，一般首字母大写）
function createPerson(name, age) {
  var object = {}
  object.name = name
  object.age = age
  object.isAdult = age >= 18 // 这就是计算属性，因为是计算出来的属性
  object.say = function () {
    console.log(`I am ${this.name}`) // this 可能是 object 也可能不是
  }

  return object
}

// 没有必要给每个 object 创建一个匿名函数（object.say指向的匿名函数），所以我们创建一个对象，包含所有共用属性
var personCommonAttrs = {
  say: function () {
    console.log(`I am ${this.name}`)
  }
}
function createPerson(name, age) {
  var object = {}
  object.name = name
  object.age = age
  object.isAdult = age >= 18
  object.__proto__ = personCommonAttrs // __proto__ 是私有属性，不要在生产环境使用 __proto__, 请使用 Object.create

  return object
}

// 很多人觉得不爽，把 personCommonAttrs 改为 createPerson 的属性
createPerson.personCommonAttrs = {
  say: function () {
    console.log(`I am ${this.name}`)
  }
}
function createPerson(name, age) {
  var object = {}
  object.name = name
  object.age = age
  object.isAdult = age >= 18
  object.__proto__ = personCommonAttrs // __proto__ 是私有属性，不要在生产环境使用 __proto__, 请使用 Object.create

  return object
}

// 接下来我们创建狗
function createDog(name, age) {
  var object = {}
  object.name = name
  object.name = age
  object.isAdult = age >= 2.6
  object.__proto__ = createDog.dogCommonAttr

  return object
}
createDog.dogCommonAttr = {
  say: function () {
    console.log(`狗子汪汪汪`)
  }
}

// 对比人的代码和狗的代码，你会发现 xxxCommonAttrs 这个名字完全就是多此一举，不如叫做 personCommonAttrs 然后一些程序员把 commonAttrs 重命名为 prototype

// 然后上面的代码就变成了
function createDog(name, age) {
  var object = {}
  object.name = name
  object.age = age
  object.isAdult = age >= 2.6
  object.__proto__ = createDog.prototype

  return object
}
createDog.prototype = {
  say: function () {
    console.log(`狗子汪汪汪`)
  }
}

// 接下来我们来玩一下
var ergou = createDog('ergouzi', 30)
var dagou = createDog('dagouzi', 50)
dagou.say()
ergou.say()
console.log(dagou.say === ergou.say)
ergou.gender = '女性'
console.log(ergou)
console.log(dagou.gender)
console.log(ergou.say === dagou.say)
ergou.say = function () {
  console.log('汪汪汪 二狗子')
}
ergou.say()
console.log(dagou.say === ergou.say)

/**
 * 对象和函数的关系
 */

// JS 中对象函数没有关系，JS 之父通过 this 强行使得它们有关系。
// obj.fn.call(obj, 1,2,3) => obj.fn(1,2,3)

/**
 * new 关键字
 */

// 我们假设在兵营中制造士兵，一个士兵在计算机中有一堆属性
// 有兵种 攻击力 生命值 行走 跑 死亡 攻击 防御
// 我们可以这样制造一个士兵
var 士兵 = {
  ID: 1,
  兵种: '步兵',
  攻击力: 5,
  生命值: 100,
  行走: function () { },
  奔跑: function () { },
  死亡: function () { },
  攻击: function () { },
  防御: function () { },
}
兵营.制造(士兵)

// 如果需要 100 个士兵怎么办呢？ 循环 100 次吧
var 士兵们 = []
var 士兵
for (let i = 0; i < 100; i++) {
  士兵 = {
    ID: 1,
    兵种: '步兵',
    攻击力: 5,
    生命值: 100,
    行走: function () { },
    奔跑: function () { },
    死亡: function () { },
    攻击: function () { },
    防御: function () { },
  }
  士兵们.push(士兵)
}
兵营.批量制造(士兵们)

// 上面的代码浪费了很多内存，
// 这些function行为对于每一个士兵都是一样的，引用同一个函数就可以了
// 这些士兵的兵种和攻击力是一样的，没必要创建100次
// 只有 ID 和生命值需要创建100次，因为每个士兵都有自己的 ID 和生命值
var 士兵原型 = {
  兵种: '步兵',
  攻击力: 5,
  行走: function () { },
  奔跑: function () { },
  死亡: function () { },
  攻击: function () { },
  防御: function () { },
}
var 士兵们 = []
var 士兵
for (let i = 0; i < 100; i++) {
  士兵 = {
    ID: i,
    生命值: 100
  }
  士兵.__proto__ = 士兵原型
  士兵们.push(士兵)
}

兵营.批量制造(士兵们)

// 有人指出创建一个士兵的代码分散在两个地方很不优雅，于是我们用一个函数把这两部分联系起来
function 士兵(ID) {
  var o = {}
  o.__proto__ = 士兵.原型
  o.ID = ID
  o.生命值 = 42
  return o
}
士兵.原型 = {
  兵种: '步兵',
  攻击力: 5,
  行走: function () { },
  奔跑: function () { },
  死亡: function () { },
  攻击: function () { },
  防御: function () { },
}
var 士兵们 = []
for (var i = 0; i < 100; i++) {
  士兵们.push(士兵(i))
}
兵营.批量制造(士兵们)

// JS 之父创建了 new，可以让我们少写几行代码
function 士兵(ID) {
  var o = {} // 帮你创建临时对象
  o.__proto__ = 士兵.原型 // 帮你绑定原型
  o.ID = ID
  o.生命值 = 42
  return o // 帮你返回对象
}
士兵.原型 = {} // 统一焦作 prototype

// 只要你在士兵前面使用 new 关键字，那么至少做四件事情
// 1. 不用创建临时对象，因为 new 会帮你做 [使用this就能获取到临时对象，把this指向了临时对象]
// 2. 不用绑定原型，因为 new 会帮你做，new 为了知道原型在哪，所以指定原型的名字为 prototype
// 3. 不用return 对象，因为 new 会帮你做
// 4. 不要给原型想名字了，因为 new 指定名字为 prototype

// 这一次 我们用 new 来写
function 士兵(ID) {
  this.ID = ID
  this.生命值 = 42
}
士兵.原型 = {
  兵种: '步兵',
  攻击力: 5,
  行走: function () { },
  奔跑: function () { },
  死亡: function () { },
  攻击: function () { },
  防御: function () { },
}
var 士兵们 = []
for (var i = 0; i < 100; i++) {
  士兵们.push(new 士兵(i))
}
兵营.批量制造(士兵们)

/**
 * new 的作用就是省那么几行代码，就是所谓的语法糖
 * 功能就是 用构造函数构造出了对象，实现了自身属性和共用属性
 */
// constructor属性
// new 操作为了记录 [零时对象是由哪个函数创建的]，所以预先给 [士兵.prototype] 加了一个 constructor 属性
士兵.prototype = {
  constructor: 士兵
}
// 所以如果你想留着constructor 就别直接覆盖 prototype
// 当然你也可以给自己的constructor重新赋值