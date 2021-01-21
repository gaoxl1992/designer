import TableDesigner from './TableDesigner.vue'

TableDesigner.install = function (Vue) {
  Vue.component(TableDesigner.name, TableDesigner);
};

export default TableDesigner