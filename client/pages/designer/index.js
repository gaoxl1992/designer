import Designer from './Designer.vue'
import _Vue from 'vue'

/* istanbul ignore next */
Designer.install = function (Vue) {
  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  Vue.component(Designer.name, Designer);
};

export default Designer;