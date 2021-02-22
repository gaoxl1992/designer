// 基础控件配置
let eleConfig = [{
  title: '控件',
  components: [{
      elName: 'rad-text',
      title: '描述文本'
    },
    {
      elName: 'rad-input',
      title: '输入框',
      isForm: true
    },
    {
      elName: 'rad-radio',
      title: '单选框',
      isForm: true
    },
    {
      elName: 'rad-checkbox',
      title: '多选框',
      isForm: true
    },
    {
      elName: 'rad-select',
      title: '下拉选择',
      isForm: true,
      defaultStyle: {
        textAlign: 'left'
      },
    },
    {
      elName: 'rad-datetime',
      title: '时间选择器',
      isForm: true
    },
    {
      elName: 'rad-table',
      isPlaceholder: true,
      title: '表格',
      defaultStyle: {
        height: 200
      },
      isForm: true
    },
    {
      elName: 'rad-image',
      title: '图片',
      defaultStyle: {
        height: 200
      },
      isForm: true
    },
    {
      elName: 'rad-imagepicker',
      title: '图片选择器',
      defaultStyle: {
        height: 200
      },
      isForm: true
    },
    {
      elName: 'rad-button',
      title: '按钮'
    },
    {
      elName: 'rad-line',
      title: '直线',
      defaultStyle: {
        height: 40
      }
    },
    {
      elName: 'rad-drcode',
      title: '条形码/二维码',
      defaultStyle: {
        height: 200
      }
    },
    {
      elName: 'rad-editor',
      title: '富文本',
      defaultStyle: {
        height: 200
      },
      isForm: true
    },
    {
      elName: 'rad-rectangle',
      title: '矩形区域',
      defaultStyle: {
        height: 200
      }
    }
  ]
}]

function list2Map() {
  let eles = {}
  eleConfig.forEach((els) => {
    els.components.forEach((ele) => {
      eles[ele.elName] = ele.title
    })
  })
  return eles
}

let eleMap = list2Map()

export {
  eleConfig,
  eleMap
}