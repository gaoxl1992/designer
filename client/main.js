import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'radui/lib/theme-chalk/index.css';
import '@/common/styles/index.scss' // 自定义 css
import VueClipboard from 'vue-clipboard2'
import 'xe-utils'

Vue.use(ElementUI);
Vue.use(VueClipboard)

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')