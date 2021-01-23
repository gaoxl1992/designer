import Editor from './Editor.vue';
import _Vue from 'vue'

/* istanbul ignore next */
Editor.install = function (Vue) {
  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  Vue.component(Editor.name, Editor);
};

export default Editor;