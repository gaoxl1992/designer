import Vue from 'vue'
import Vuex from 'vuex'
import {
  register,
  unregister
} from './modules/editor'

Vue.use(Vuex);
const store = new Vuex.Store({});
store.register = register;
store.unregister = unregister;

export default store