import Preview from './Preview.vue';
import _Vue from 'vue'

/* istanbul ignore next */
Preview.install = function (Vue) {
  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  Vue.component(Preview.name, Preview);
};

export default Preview;