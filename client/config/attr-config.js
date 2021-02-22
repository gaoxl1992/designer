// 属性配置
const alignTypeList = [{
  title: '左对齐',
  icon: 'iconfont iconalign_l',
  type: 'l'
}, {
  title: '上对齐',
  icon: 'iconfont iconalign_t',
  type: 't'
}, {
  title: '右对齐',
  icon: 'iconfont iconalign_r',
  type: 'r'
}, {
  title: '下对齐',
  icon: 'iconfont iconalign_b',
  type: 'b'
}, {
  title: '垂直居中对齐',
  icon: 'iconfont iconalign_hcenter',
  type: 'tb'
}, {
  title: '水平居中对齐',
  icon: 'iconfont iconalign_vcenter',
  type: 'lr'
}]

// border配置
const borderStyleList = [{
  label: '实线',
  value: 'solid'
}, {
  label: '虚线',
  value: 'dashed'
}, {
  label: '点状',
  value: 'dotted'
}, {
  label: '双线',
  value: 'double'
}]

// 字体库
const fontFamilyList = [{
  label: '宋体',
  value: 'SimSun'
}, {
  label: '黑体',
  value: 'SimHei'
}, {
  label: '微软雅黑',
  value: 'Microsoft YaHei'
}, {
  label: '微软正黑体',
  value: 'Microsoft JhengHei'
}, {
  label: '新宋体',
  value: 'NSimSun'
}, {
  label: '新细明体',
  value: 'PMingLiU'
}, {
  label: '细明体',
  value: 'MingLiU'
}, {
  label: '标楷体',
  value: 'DFKai-SB'
}, {
  label: '仿宋',
  value: 'FangSong'
}, {
  label: '楷体',
  value: 'KaiTi'
}]

// 组件库
const compsLibs = [{
    label: '描述文本',
    value: 'rad-text'
  },
  {
    label: '输入框',
    value: 'rad-input'
  },
  {
    label: '单选框',
    value: 'rad-radio'
  },
  {
    label: '多选框',
    value: 'rad-checkbox'
  },
  {
    label: '下拉选择',
    value: 'rad-select'
  },
  {
    label: '时间选择器',
    value: 'rad-datetime'
  },
  {
    label: '表格',
    value: 'rad-table'
  },
  {
    label: '图片',
    value: 'rad-image'
  },
  {
    label: '图片选择器',
    value: 'rad-imagepicker'
  },
  {
    label: '按钮',
    value: 'rad-button'
  },
  {
    label: '直线',
    value: 'rad-line'
  },
  {
    label: '条形码/二维码',
    value: 'rad-drcode'
  },
  {
    label: '富文本',
    value: 'rad-editor'
  }
]

// 快捷操作
const menuOptions = [{
    title: '复制',
    icon: 'iconfont iconcopy',
    value: 'copy',
  },
  {
    title: '删除',
    icon: 'iconfont icondelete-border',
    value: 'delete',
  },
  {
    title: '字体放大',
    icon: 'iconfont iconA',
    value: 'fontA+',
  },
  {
    title: '字体缩小',
    icon: 'iconfont iconA-',
    value: 'fontA-',
  },
  {
    title: '字体加粗',
    icon: 'iconfont iconbold',
    value: 'fontB',
  },
  {
    title: '图层上移',
    icon: 'iconfont iconup_one',
    value: 'layerUp',
  },
  {
    title: '图层下移',
    icon: 'iconfont icondown_one',
    value: 'layerDown',
  },
  {
    title: '图层置顶',
    icon: 'iconfont iconup_top',
    value: 'layerTop',
  },
  {
    title: '图层置底',
    icon: 'iconfont icondown_btm',
    value: 'layerBottom',
  },
]

// 表格模版关联关系表
const tableRelations = {
  'equal': '等于',
  'not_equal': '不等于',
  'min': '大于',
  'min_equal': '大于等于',
  'max': '小于',
  'max_equal': '小于等于',
  'include': '包含',
  'not_include': '不包含',
  'start_with': '开始以',
  'not_start_with': '不开始以',
  'null': '是null',
  'not_null': '不是null',
  'nothing': '是空的',
  'not_nothing': '不是空的',
  'between': '介于',
  'not_between': '不介于',
  'inlist': '在列表',
  'not_inlist': '不在列表'
}

let scriptStr = `/** 可做条件判断参数
  * _business 业务信息，可根据具体业务由业务层挂载
  * _business.studyData.key值 - 检查信息中的值 - str
  * _report 报告信息，当前报告的主体结构
  * _report.currentComp.key值 - 当前编辑脚本组件
  * _report.pageData - 控制报告内任何内容逻辑变化
  * _report.elements - 最终已绑定阈值的控件
    {
      // 页面初始化
      "initPage": "if(_business.studyData.crisisFlag===0){console.log('----')}",
      // 点击组件
      "onclick": "if(_business.studyData.crisisFlag===0){console.log('----')}",
      // 值变化
      "onchange": "if(_business.studyData.crisisFlag===0){console.log('----')}"
    }
 */
`


export {
  alignTypeList,
  borderStyleList,
  fontFamilyList,
  compsLibs,
  menuOptions,
  tableRelations,
  scriptStr
}