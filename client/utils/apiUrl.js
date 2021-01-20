/* 使用示例
  // post请求
  const res = await this.$http.setPageConfig({
    prefix: 'baidu', //匹配url前缀
    ifHandleError: true, //不对该接口进行全局错误提示。
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    data: {
      userId: this.idCard,
      userName: this.realName,
      color: 'red',
    }
  })

  // get请求
  this.$http.qryPageConfig({
    method: 'get', //默认
    params: {
      page: 'login'
    },
  }).then((res) => {
    this.pageConfig = res.data;
  }).finally(() => {
    ...
    this.close();
  });
 */
import Vue from 'vue';
import request from './request';

let services = {};

const reportModule = '/report/template'
// 接口url统一维护
const apiUrl = {
  saveDesignerData: '/output/save', // 设计器保存
  fetchDesignerData: '/output/detail', // 设计器打开重新编辑
  saveSymbolword: '/symbolword/set', //设置特殊词汇
  fetchSymbolword: '/symbolword/get', // 查询特殊词汇
}

Object.entries(apiUrl).forEach((item) => {
  services[item[0]] = function (options = {}) {
    return request(Object.assign({
      url: reportModule + item[1]
    }, options))
  }
})

// 将services挂载到vue的原型上
// 业务中引用的方法：this.$http.接口名
Object.defineProperty(Vue.prototype, '$http', {
  value: services
});

export default services;