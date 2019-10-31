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
// 兵营.批量制造(士兵们)

function createSoldier(name) {
  this.id = i // ID 不能重复
  this.生命值 = 42
  this.name = name || '无名战士'
}
createSoldier.prototype.兵种 = "美国大兵"
createSoldier.prototype.攻击力 = 5
createSoldier.prototype.行走 = function () { /*走俩步的代码*/ }
createSoldier.prototype.奔跑 = function () { /*狂奔的代码*/ }
createSoldier.prototype.死亡 = function () { /*Go die*/ }
createSoldier.prototype.攻击 = function () { /*糊他熊脸*/ }
createSoldier.prototype.防御 = function () { /*护脸*/ }

var soldiers = []
for (var i = 0; i < 100; i++) {
  soldiers.push(new createSoldier())
}

// 兵营.batchMake(soldiers)

// 习俗
// 1. 构造函数首字母大写
// 2. 构造函数可以省掉 create
// 3. 如果构造函数没有参数，那么可以省略括号

// 下面说继承
function Human(options) {
  this.name = options.name
  this.肤色 = options.肤色
}
Human.prototype.eat = function () { }
Human.prototype.drink = function () { }
Human.prototype.poo = function () { }

function Soldier(options) {
  Human.call(this, options)
  this.id = options.id
  this.生命值 = 100
}
Soldier.prototype = Object.create(Human.prototype)
// 大脑中的
// Soldier.prototype.__proto__ = Human.prototype
Soldier.prototype.兵种 = "美国大兵"
Soldier.prototype.攻击力 = 5
Soldier.prototype.行走 = function () { /*走俩步的代码*/ }
Soldier.prototype.奔跑 = function () { /*狂奔的代码*/ }
Soldier.prototype.死亡 = function () { /*Go die*/ }
Soldier.prototype.攻击 = function () { /*糊他熊脸*/ }
Soldier.prototype.防御 = function () { /*护脸*/ }

var s = new Soldier({ name: 'ergou', 肤色: 'yellow', id: 1 })
console.dir(s)

// 改成 class 的写法
class Human {
  constructor(options) {
    this.name = options.name
    this.肤色 = options.肤色
  }
  eat() { }
  drink() { }
  poo() { }
}

class Soldier extends Human {
  constructor(options) {
    super(options)
    this.id = options.id
    this.生命值 = 100
    this.兵种 = "美国大兵"
    this.攻击力 = 5
  }
  行走() { /*走俩步的代码*/ }
  奔跑() { /*狂奔的代码*/ }
  死亡() { /*Go die*/ }
  攻击() { /*糊他熊脸*/ }
  防御() { /*护脸*/ }
}