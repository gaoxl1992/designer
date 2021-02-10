# 编辑器
## 使用
- 独立部署直接使用
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
1.0版本稳定版本推荐 1.1.0版本

## 表格设计器
```js
import { TableDesigner } from 'web-reseditor/index.js'
```

```html
<TableDesigner ref="tableDesigner"
  :tableTplList="tpls" 
  :extent="extent"
  @saveContent="saveTable"
  @saveEdit="saveEditTable"
  @deleteTableTpl="deleteTableTpl"></TableDesigner>
```

- extent 保存模版的扩展字段
```
[
  key: {
    name: ''// label
    options: [] // length>0时呈现为下拉框，否则呈现为输入框
    option: '' // 绑定值
  }
]
```
- tableTplList 历史表格模版 Array []
```js
{
  id - 模版id
  name - 模版名称
  // rels - 关联属性 Object
  tpl - 表格模版字符串
  extend - 业务扩展字段 []
}
```
- tableDesigner 触发模版内保存模版事件 通过refs触发 配合saveContent
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

- deleteTableTpl 事件 删除表格模版 Number 返回坐标

- saveEdit 事件 编辑表格模版保存数据 Object {}
```
{
  id - 模版id
  name - 模版名称
  <!-- rels - 关联属性 Object -->
  tpl - 表格模版字符串,
  extent - 扩展字段
}
```

## 报告设计器
```js
import { Designer } from 'web-reseditor/index.js'
```

```js
<Designer ref="designer"
  @saveDesignerData="saveDesignerData"
  :customCompEditable="false"
  :customComps="customComp"></Designer>

function saveDesignerData(e) {
  // e
  /**
    elements: [],
    fixedHeader: {
      openFixed: false,
      height: 50,
      pageNum: false,
      page: '1'
    },
    fixedFooter: {
      openFixed: false,
      height: 50,
      pageNum: false,
      page: '1'
    },
    name: '',
    pageType: 'a4',
    spCharacters: [],
    script: '',
    customHeight: 297,
    customWidth: 210,
    totalPages: 1,
    backgroundSize: 20,
    width: $config.canvasH5Width > 700 ? $config.canvasH5Width : 700,
    height: $config.canvasH5Height,
    backgroundImage:
  */
}
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
- this.$refs.designer.saveDesignerData() 触发设计器保存动作，触发后配合saveDesignerData获取模版内容
- this.$refs.designer.resetPage(pageData) 设计器导入模版 pageData是原设计器导出的结构，不对非规范obj兼容,无参数时为新建模版，按标准化配置基础参数

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
- this.$refs.editor.resetPage(pageData = {}, chars = []) 编辑器导入模版 pageData是原设计器导出的结构，不对非规范obj兼容,chars为特殊字符集[]
- tpls 表格模版列表，需要符合表格模版设计器保存的规则
- updateSpChars 编辑器更新特殊字符，返回字符集list
- saveEditor 保存编辑数据
- this.$refs.editor.save() 触发编辑器保存，配合saveEditor，saveEditor返回值同设计器的保存方法

### 和富文本交互
```js
// 追加内容
window.reditor['阈值'].edit.appendHtml(str)
// 追加到光标
window.reditor['阈值'].edit.insertHtml(str);
// 替换全部内容 可以是字符串或序列化的dom节点
window.reditor['阈值'].edit.html(str) 
// 获取内容
window.reditor['阈值'].edit.html()
```

## 预览
```js
import { Preview } from 'web-reseditor/index.js'
```

```html
<Preview :tplStr="pageTpl"
  ref="preview"></Preview>
```

- pageTpl编辑器导出的模版字符串