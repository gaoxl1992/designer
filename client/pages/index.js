import TableDesigner from './table-designer/Index.vue'
import Designer from './designer/Index.vue'
import Editor from './editor/Index.vue'
import Preview from './preview/Index.vue'

const components = [
  TableDesigner, Designer, Editor, Preview
]

const install = function (Vue) {
  // 判断是否安装，安装过就不继续往下执行
  if (install.installed) return
  install.installed = true
  // 遍历注册所有组件
  components.map(component => Vue.component(component.name, component))
}

// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  TableDesigner,
  Designer,
  Editor,
  Preview
}

export default {
  install
}