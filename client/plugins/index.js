/**
 * 组件库入口
 **/
import Text from './text.vue'
import Button from './button.vue'
import Input from './input.vue'
import Table from './table.vue'
import Radio from './radio.vue'
import Checkbox from './checkbox.vue'
import Select from './select.vue'
import Datetime from './datetime.vue'
import Image from './image.vue'
import Imagepicker from './imagepicker.vue'
import Drcode from './drcode.vue'
import Line from './line.vue'
import Editor from './editor.vue'

// 所有组件列表
const components = [
  Text, Input, Button, Table, Radio, Checkbox, Select, Datetime, Image, Imagepicker, Drcode, Line, Editor
]

// 定义 install 方法，接收 Vue 作为参数
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

let _register_components_object = {};
components.forEach(item => {
  _register_components_object[item.name] = item
})


export {
  Text,
  Input,
  Button,
  Table,
  Radio,
  Checkbox,
  Select,
  Datetime,
  Image,
  Imagepicker,
  Drcode,
  Line,
  Editor,
  _register_components_object
}

export default {
  install
}