import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'
// 引入字体文件
import './assets/fonts/iconfont.css'
// 引入 axios
import Axios from 'axios'
// 配置 axios根路径
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.axios = Axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
