// 编辑器组件
<template>
  <div class="tinymce-box">
    <editor v-model="content"
            :init="init"
            :disabled="disabled">
    </editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/charmap' // 特殊字符插件
import 'tinymce/plugins/code' // 代码插件
import bus from '@/utils/bus'
export default {
  components: {
    Editor
  },
  name: 'Tinymce',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists table charmap code'
    },
    menu: {
      type: Object,
      default: () => {
        return {
          file: { title: '新建', items: 'newtpl' },
          edit: {
            title: '编辑',
            items: 'undo redo | cut copy paste pastetext | selectall'
          },
          view: {
            title: '视图',
            items: 'code'
          },
          insert: {
            title: '插入',
            items: 'charmap | input | select'
          },
          format: {
            title: '格式',
            items:
              'bold italic underline strikethrough superscript subscript | formats | removeformat'
          },
          tools: { title: '工具', items: 'spellchecker code' },
          table: {
            title: '表格',
            items: 'inserttable tableprops deletetable | cell row column'
          }
        }
      }
    }
  },
  data() {
    return {
      init: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: './tinymce/skins/ui/oxide',
        fontsize_formats: '10px 12px 14px 16px 18px 20px 24px 36px',
        font_formats: '宋体=simsun,serif;新宋体=NSimSun;仿宋=FangSong;楷体=KaiTi;黑体=SimHei;微软雅黑="Microsoft YaHei";Times New Roman="Times New Roman";隶书=LiSu;幼圆=YouYuan',
        block_formats: 'Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3',
        height:
          document.body.getBoundingClientRect().bottom -
          document.getElementById('page-header').getBoundingClientRect().bottom,
        plugins: this.plugins,
        toolbar: `undo redo | fontsizeselect | formatselect | bold italic forecolor backcolor fontselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat`,
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        branding: false,
        menubar: true,
        menu: this.menu,
        setup: (editor) => {
          editor.ui.registry.addMenuItem('select', {
            text: '选择器',
            context: 'insert',
            onAction: () => {
              editor.windowManager.open({
                title: '选择器',
                body: {
                  type: 'panel',
                  items: [
                    {
                      type: 'input',
                      name: 'options',
                      label: '选项（英文逗号分割）'
                    }
                  ]
                },
                buttons: [
                  {
                    type: 'cancel',
                    text: 'Close'
                  },
                  {
                    type: 'submit',
                    text: 'Save',
                    primary: true
                  }
                ],
                onSubmit: function (api) {
                  var data = api.getData()
                  if (!data.options.trim()) {
                    api.close()
                    return
                  }

                  let options = data.options.split(',')
                  let innerContent = '<select>'
                  for (let i = 0; i < options.length; i++) {
                    innerContent += `<option value='${options[i]}'>${options[i]}</option>`
                  }
                  innerContent += '</select>'

                  editor.insertContent(innerContent)
                  api.close()
                }
              })
            }
          }),
            editor.ui.registry.addMenuItem('input', {
              text: '输入框',
              context: 'insert',
              onAction: () => {
                editor.insertContent('<input class="table-input"/>')
              }
            }),
            editor.ui.registry.addMenuItem('newtpl', {
              text: '新建模版',
              context: 'file',
              onAction: () => {
                this.content = ''
                bus.$emit('initMce')
              }
            })
        }
      },
      content: this.value
    }
  },
  mounted() {
    tinymce.init({})
    this.$nextTick(() => {
      this.content = this.value
      this.$emit('input', this.value)
    })
  },
  methods: {
    getContent() {
      // 获取内容
      this.$emit('saveContent', this.content)
    }
  },
  watch: {
    value(newValue) {
      this.content = newValue
    }
  }
}
</script>
