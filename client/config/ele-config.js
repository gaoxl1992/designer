// 基础控件配置
export default [{
  title: '控件',
  components: [{
      elName: 'rad-text',
      title: '描述文本',
      hasThreshold: false
    },
    {
      elName: 'rad-input',
      title: '输入框',
      hasThreshold: true,
      isForm: true
    },
    {
      elName: 'rad-radio',
      title: '单选框',
      hasThreshold: true,
      isForm: true
    },
    {
      elName: 'rad-checkbox',
      title: '多选框',
      hasThreshold: true,
      isForm: true
    },
    {
      elName: 'rad-select',
      title: '下拉选择',
      hasThreshold: true,
      isForm: true,
      defaultStyle: {
        textAlign: 'left'
      },
    },
    {
      elName: 'rad-datetime',
      title: '时间选择器',
      hasThreshold: true,
      isForm: true
    },
    {
      elName: 'rad-table',
      isPlaceholder: true,
      title: '表格',
      defaultStyle: {
        height: 200
      },
      hasThreshold: true,
      isForm: true
    },
    {
      elName: 'rad-image',
      title: '图片',
      defaultStyle: {
        height: 200
      },
      hasThreshold: true,
      isForm: true
    },
    {
      elName: 'rad-imagepicker',
      title: '图片选择器',
      defaultStyle: {
        height: 200
      },
      hasThreshold: true,
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
      },
      hasThreshold: true
    },
    {
      elName: 'rad-editor',
      title: '富文本',
      defaultStyle: {
        height: 200
      },
      hasThreshold: true,
      isForm: true
    }
  ]
}]