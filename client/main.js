import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import RadUI from 'radui'
import 'radui/lib/theme-chalk/index.css';
import '@/common/styles/index.scss' // 自定义 css
import VueClipboard from 'vue-clipboard2'
import 'xe-utils'

Vue.use(RadUI);
Vue.use(VueClipboard)

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}

store.register(store, 'editor', { preserveState: false })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')