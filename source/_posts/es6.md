---
title: es6
date: 2017-10-04 17:45:13
tags: ES6
categories: js
comments: false
---

最近用hexo搭建了一个博客，采用next主题，用来记录自己工作学习生活的点点滴滴
正好想巩固一下es6的基础知识，好了，现在开始

![ES6 Screenshot](http://oxb2vhvil.bkt.clouddn.com/es6-logo.jpg)

## 解构赋值
> 数据解构 对象解构

### 数组解构   

- `[a, b] = [1, 2]` // 1 2

- `[a, b, ...rest] = [1,2,3,4,5,6]` [3, 4, 5, 6]

- `[a, , , b] = [1, 2, 3, 4, 5]` // 1 4

- `默认值 [a, b, c=3] = [1, 2]`   

**使用场景** 1/变量交换

### 对象解构

- `{a, b} = {a: 1, b: 2}` // 1 2

- `{a=2, b} = {a: 1, b: 2}` // 1 2

* **使用场景**    

```
   * let data = {title: 'abc', test: [{title: 'test'}]}
   * let {title: f,test: [{title: s}]}  = data        
```


## 正则扩展
> u y 修饰符

- `reg= new RegExp(/xyz/i)`

- `reg= new RegExp(/xyz/ig,'i')` **后面的修饰符覆盖前面的修饰符**
- `reg.flags` // 'i'

- `/b+/y.exec('bbbbb_bbb')` // 只能匹配一次

- `/b+/g.exec('bbbbb_bbb')` // 可以匹配两次 **reg.sticky可以判断是不是y**

- `/美{2}/u.test('美美')` **如果不能识别多个字符串，要加u**


## 字符串扩展
> unicode表示法  遍历接口  模板字符串 新增的十种方法

### unicode 

- `console.log(`\u0061/`)`

- `console.log(`\u00617`)`

- `console.log(`\u{00617}`)` **大于两个字符的需要用大括号包起来**

-		```
		let str = `\u{20BB7}`

		str.charCodeAt(0) // 55362
		str.charCodeAt(1) // 57271 

		str.codePointAt(0) // 134071
		str.codePointAt(1) // 57571 
		```
**codePointAt比charCode更智能，charCodeAt只能识别两位字节，fromCharCode也一样，fromCodePoint更能灵活识别unicode**

### 遍历接口

- ``\u{20BB7}abc`通过for循环不能正常遍历，通过of可以正确识别`


### api

- `'string'.includes('t')` // true

- `'string'.startsWith('s')` // true

- `'string'.endsWith('ng')` // true

- `'string'.repeat(2)` // stringstring

- `'1'.padStart(2, '0')` // 01

- `'1'.padEnd(2, '0')` // 10

- `String.raw `Hello \n girl`` // 不能换行，raw会在'/'之前再一次转义

### 字符串模板

- `${str}` // 很简单，不做赘述

-		```
		let str = {
			name: 'ez',
			age: 1000
		}
		abc`i am ${usr.name}${usr.age}`
		function abc(s,v1,v2) { console.log(s,v1, v2)
		}
		```
		       
* **应用场景** 1.处理标签，防止xss攻击  2.处理多语言标签渲染


## 数值扩展
> 新增的方法 方法调整

- 二进制都是0b表示 `console.log(0b111)` 不分大小写 // 7

- 八进制都是0o表示 `console.log(0o111)`  // 73

- 判断是不是有尽 `Number.isFinite(19303295)`  // true

- 判断是不是数字 `Number.isNaN(NaN)` // 以上这两使用频率不是很高

- 判断是不是整数 `Number.isInteger(10.1)` // false 	`Number.isInteger(10.0)` // true

- 取整数部分 `Math.trunc(5.2) Math.trunc(5.9)` // 5

- 判断正负  `Math.sign(3)` // 1 -1 0 NaN

- 返回平方和的平方根 `Math.hypot([value1[, value2[, ...]]])` //


## 数组扩展
> 新增的方法 of from keys values entries

### api

- `Array.of(0,2,3)` // [0, 2, 3]

- `Array.from(document.queryAll('p'))` // []
- `Array.from({length: 100000}, (v, i) => i)` // 会先生成 undefined，然后赋值
- `Array.from([1,2,4], (item) => {return item*2})` // [2, 4, 8] 和map	一样

- `[1, 'a', undefined].fill(7)` // [7, 7, 7]

- `[1, 'a', undefined].fill(7, 1, 3)` // [1, 7, 7]

-		```
		let b c
		b = [1, 'a', undefined].keys() 
		// b = [1, 'a', undefined].values()
		// c = [1, 'a', undefined].entries()
		for (let index of b) {console.log(index)}
		//for (let [index, value] of c) {console.log(index, value)}
		```
* *复制数组元素到指定位置(一个比较有意思的api)*
- `[1,2,3,4,5].copyWithin(0, 2, 5)` // [3, 4, 5, 4, 5]

**查找（比较重要）**      

- `[3, 4, 5, 4, 5].findIndex((item) => {return item>4})` // 5

- `[3, 4, 5, 4, 5].find((item) => {return item>4})` // 2

`[1, NaN, 9].includes(NaN)` // true **可以判断NaN这个比较厉害**


## 函数扩展
> 参数默认值 rest参数 扩展运算符 箭头函数 this绑定 尾调用

### 默认值

- 参数默认值要注意必须写在参数最后面

- 函数参数是按值传递的

```
{
	let x='test';
  	function test2(x,y=x){
    	console.log('作用域',x,y);
  	}
  	test2('kill');
} 	 
```

- rest参数可以通过 (...args) 来获取函数的 arguments

- 箭头函数不做赘述

- 尾调用就是把函数作为参数传入，返回另一个函数，类似于函数柯里化这种

```
{
  function tail(x){
    console.log('tail',x);
  }
  function fx(x){
    return tail(x)
  }
  fx(123)
}
```

## 对象扩展
> 对象新增特性： 简洁表示法 属性表达式 扩展预算符 新增api

### 属性和方法的简洁表示

		```
			let o=1;
			let k=2;
			let es5={
				o:o,
				k:k
			};
			let es6={
				o,
				k
			};
			console.log(es5,es6);

			let es5_method={
				hello:function(){
					console.log('hello');
				}
			};
			let es6_method={
				hello(){
					console.log('hello');
				}
			};
			console.log(es5_method.hello(),es6_method.hello());
		```

### 属性表达式（很重要）
		```
			let a='b';
			let es5_obj={
				a:'c',
				b:'c'
			};

			let es6_obj={
				[a]:'c'
			}

			console.log(es5_obj,es6_obj);
		```

### 新增api
> is assign entries

- `console.log('字符串',Object.is('abc','abc'),'abc'==='abc');`  
	`console.log('数组',Object.is([],[]),[]===[]);`

- `console.log('拷贝',Object.assign({a:'a'},{b:'b'}));`

```
	let test={k:123,o:456};
  for(let [key,value] of Object.entries(test)){
    console.log([key,value]);
  }
```

## symbol用法

```
{
  let a1=Symbol.for('abc');
  let obj={
	// 基础用法
    [a1]:'123',
    'abc':345,
    'c':456
  };
  console.log('obj',obj);

// 只能取到普通属性
  for(let [key,value] of Object.entries(obj)){
    console.log('let of',key,value);
  }

// 只能取到symbol声明
  Object.getOwnPropertySymbols(obj).forEach(function(item){
    console.log(obj[item]);
  })

// 可以去到实例的所有属性
  Reflect.ownKeys(obj).forEach(function(item){
    console.log('ownkeys',item,obj[item]);
  })
}
```

## 数据结构
> set weakset map weakmap

### set

#### new Set

```
let list = new Set();
list.add(5);
list.add(7);
```

```
let arr = [1,2,3,4,5];
let list = new Set(arr);
```

`长度 list.size`

#### 去重

```
let arr = [1,2,3,1,'2'];
let list2 = new Set(arr);
list.add(1)
console.log('unique',list2);
```
**可以利用set这个特性去重**

#### set实例的方法
```
let arr=['add','delete','clear','has'];
let list=new Set(arr);

console.log('has',list.has('add'));
console.log('delete',list.delete('add'),list);
list.clear();
console.log('list',list);
```

#### set实例遍历
**可以用对象遍历的所有方法**

```
let arr=['add','delete','clear','has'];
let list=new Set(arr);

for(let key of list.keys()){
	console.log('keys',key);
}
for(let value of list.values()){
	console.log('value',value);
}
for(let [key,value] of list.entries()){
	console.log('entries',key,value);
}

list.forEach(function(item){console.log(item);})
```

### weakSet
> 1 元素必须是对象 
> 2 只是对象的弱引用，不会被垃圾回收机制检测到
> 3 没有clear方法
> 4 不能遍历

### map
> 直接上代码，不好说

```
let map = new Map();
let arr=['123'];

map.set(arr,456);

console.log('map',map,map.get(arr));
```
```
let map = new Map([['a',123],['b',456]]);
console.log('map args',map);
console.log('size',map.size);
console.log('delete',map.delete('a'),map);
console.log('clear',map.clear(),map);
```

### weakmap

```
let weakmap=new WeakMap();

let o={};
weakmap.set(o,123);
console.log(weakmap.get(o));
```


### 有意思的代码

```
1. Distance between two points
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0)
```
