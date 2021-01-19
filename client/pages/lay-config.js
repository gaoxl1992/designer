const tabs = {
  tableDesigner: '表格设计器',
  designer: '报告设计器',
  editor: '报告编辑器',
  preview: '报告阅读器'
}

const ops = (_this) => {
  return {
    tableDesigner: [{
      label: '保存',
      clickFn: _this.saveTableTpl
    }],
    editor: [{
      label: '导入模板打开编辑器',
      clickFn: _this.importEditorTpl
    }, {
      label: '继续编辑',
      clickFn: _this.reeditTpl
    }, {
      label: '保存',
      clickFn: _this.saveEditor
    }],
    designer: [{
      label: '保存',
      clickFn: _this.saveDesigner
    }, {
      label: '导入上一次编辑',
      clickFn: _this.importDesigner
    }]
  }
}

export {
  tabs,
  ops
}