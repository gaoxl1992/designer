import TableDesigner from './TableDesigner.vue';
import _Vue from 'vue'

/* istanbul ignore next */
TableDesigner.install = function (Vue) {
  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  Vue.component(TableDesigner.name, TableDesigner);
};

export default TableDesigner;