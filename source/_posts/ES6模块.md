---
title: ES6模块
date: 2019-08-05 23:47:35
categories: js
tags: [ES6, G]
comments: false
---

### export

> 在创建 JavaScript 模块时，export 语句用于从模块中导出函数、对象或原始值，以便其他程序可以通过 import 语句使用它们。
> 无论您是否声明，导出的模块都处于严格模式。 export 语句不能用在嵌入式脚本中。

    export let name1, name2
    export function FunctionName(){...}
    export class ClassName {...}
    export { name1, name2, …, nameN };
    export { variable1 as name1, variable2 as name2, …, nameN };
    export default expression;
    export default function (…) { … }
    export * from …;

### import

> 静态的 import 语句用于导入由另一个模块导出的绑定。无论是否声明了 strict mode ，导入的模块都运行在严格模式下。在浏览器中，import 语句只能在声明了 type="module" 的 script 的标签中使用。

> 此外，还有一个类似函数的动态 import()，它不需要依赖 type="module" 的 script 标签。在您希望按照一定的条件或者按需加载模块的时候，动态 import() 是非常有用的。

    在您希望按照一定的条件或者按需加载模块的时候，动态import() 是非常有用的。
    import * as name from "module-name";
    import { export } from "module-name";
    import { export as alias } from "module-name";
    import { export1 , export2 } from "module-name";
    import { export1 , export2 as alias2 , [...] } from "module-name";
    import defaultExport, { export [ , [...] ] } from "module-name";
    import defaultExport, * as name from "module-name";
    import "module-name";

### 使用注意

- 一个 js 文件可以有多个 export
- 在浏览器中使用要加 type='module'
- 在不支持的浏览器中要用 babel webpack 或者 parcel 编译之后运行
