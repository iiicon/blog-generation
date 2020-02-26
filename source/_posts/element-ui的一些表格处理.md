---
title: element-ui的一些表格处理
date: 2020-02-26 16:57:38
tags: [vue, element-ui]
categories: vue
---

_2020 疫情到来，转眼就休息了两个月，是时候开始新的征程了，加油 XD_

### 应用一（表格合并）

总体思路就是把需要合并索引放到一个二维数组里，这个二维数组代表每一列，每一列里不是 0 的就是合并的行数，
具体做法就是用类似于计数排序的思路（对应hash的每一个值去计数），如果下一行的某个属性和上一行的某个属性相同，我们就要索引值加 1，数组里也要相应的补 0，
如果不相同，就补 1，并定位到当前位置，这样我们就能得到我们的一个二维数组，再通过 objectSpanMethod 取到对应的值去合并表格

```
{
  data() {
    return {
      position: 0,
      spanArr: [] // 二维数组
    }
  },
  methods: {
    rowspan(idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr[idx].push(1);
          this.position = 0;
        } else {
          if (this.tableData[index][prop] === this.tableData[index - 1][prop]) {
            this.spanArr[idx][this.position] += 1; // 有相同项
            this.spanArr[idx].push(0); // 名称相同后往数组里面加一项0
          } else {
            this.spanArr[idx].push(1); //同列的前后两行单元格不相同
            this.position = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const row = this.spanArr[0][rowIndex];
        const col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col
        };
      }

      if (this.paramsType === 1) {
        if (columnIndex === 1) {
          if (this.spanArr[1]) {
            const row = this.spanArr[1][rowIndex];
            const col = row > 0 ? 1 : 0;
            return {
              rowspan: row,
              colspan: col
            };
          }
        }
      }
    }
  }
}

```
