import TableDesigner from './table-designer/index.js'
import Designer from './designer/index.js'
import Editor from './editor/index.js'
import Preview from './preview/index.js'
// import store from '../store'

export default {
  install(Vue) {
    Vue.use(TableDesigner)
    Vue.use(Designer)
    Vue.use(Editor)
    Vue.use(Preview)
  }
}