import Preview from './Preview.vue'

Preview.install = function (Vue) {
  Vue.component(Preview.name, Preview);
};

export default Preview