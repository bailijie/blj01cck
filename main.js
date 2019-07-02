import Vue from 'vue'
import App from './App'
import $ajax from './api/api.js'

Vue.config.productionTip = false
const version = 1.0;
Vue.prototype.$version = version;

App.mpType = 'app'
//判断是否登录
Vue.prototype.isLogin = function(){
	let openId = uni.getStorageSync('openId')
	return openId
}
Vue.prototype.$ajax = $ajax;

const app = new Vue({
    ...App
})
app.$mount()
