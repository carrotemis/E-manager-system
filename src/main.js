// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../src/assets/css/global.css'
// import momont from 'momont'
Vue.config.productionTip = false
Vue.filter('filterTime', function (time, seprator) {
  time = new Date(time)  //看情况加
  //3.写处理逻辑
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  // 4 这个处理函数比如return 一个数据
  return y + seprator + m + seprator + d
})
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
