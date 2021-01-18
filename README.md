# 编辑器
## 使用
- 直接使用
```
git clone http://svn.radonline.cn:3888/PACS/web-RSTEditor.git
```

安装依赖
```
npm install
```

启动
```
npm run dev
```

- 依赖使用
```
npm i web-reseditor
```

## 表格设计器
```js
import { TableDesigner } from 'web-reseditor/index.js'
```

```html
<TableDesigner ref="tableDesigner"
  :tableTplList="tpls" 
  @saveContent="saveTable"
  @saveEdit="saveEditTable"
  @deleteTableTpl="deleteTableTpl"></TableDesigner>
```

- tableTplList 历史表格模版 Array []
```js
{
  id - 模版id
  name - 模版名称
  rels - 关联属性 Object
  tpl - 表格模版字符串
}
```
- tableDesigner 触发模版内保存模版事件 通过refs触发
```js
this.$refs.tableDesigner.getContent()
```

- saveContent 事件 新建表格模版保存数据 Object {}
```
{
  id - 模版id
  name - 模版名称
  rels - 关联属性 Object
  tpl - 表格模版字符串
  index - 坐标
}
```

- deleteTableTpl 事件 删除表格模版 Number 坐标

- saveEdit 事件 编辑表格模版保存数据 Object {}
```
{
  id - 模版id
  name - 模版名称
  rels - 关联属性 Object
  tpl - 表格模版字符串
}
```

## 报告设计器
```js
import { Designer } from 'web-reseditor/index.js'
```

```html
<Designer ref="designer"
  @saveDesignerData="fetchDesignerData"
  :customComps="customComp"></Designer>
```

- customComp 客户自定义组件 Array
```js
{
  title - 标题
  elName - 对应组件的elname
  type - 分类
  threshold - 阈值
}
```

- saveDesignerData 事件 保存设计器整体obj
- this.$refs.designer.saveDesignerData() 触发设计器保存动作
- this.$refs.designer.resetPage(pageData) 设计器导入模版 pageData是原设计器导出的结构，不对非规范obj兼容

## 编辑器
```js
import { Editor } from 'web-reseditor/index.js'
```

```html
<Editor ref="editor"
  @updateSpChars="updateSpChars"
  :tpls="tpls"
  @saveEditor="saveEditedPage"></Editor>
```
- this.$refs.editor.resetPage(this.pageHistory, chars) 编辑器导入模版 pageData是原设计器导出的结构，不对非规范obj兼容
- tpls 表格模版列表，需要符合表格模版设计器保存的规则
- updateSpChars 编辑器更新特殊字符，外部调用接口修改数据库
- saveEditor 保存编辑数据
- this.$refs.editor.save() 触发编辑器保存

## 预览
```js
import { Preview } from 'web-reseditor/index.js'
```

```html
<Preview :tplStr="pageTpl"
  ref="preview"></Preview>
```

- pageTpl编辑器导出的模版字符串