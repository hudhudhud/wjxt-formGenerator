import Vue from 'vue'
import App from './App.vue'

import Element from 'element-ui'
import './theme/index.css'
import meta from 'vue-meta'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import router from './router/index'
import api from './api'
import {api_plain} from './api'
import store from './store/index'
import '@/assets/styles/index.scss' // global css
import '@/utils/plugins'
// 全局组件自动注册
import '@/components/autoRegister'
import VueClipboard from 'vue-clipboard2'
Vue.prototype.$api = api
Vue.prototype.$api_plain = api_plain
Vue.prototype.$dayjs = dayjs
Vue.prototype.$store = store
Vue.prototype.$cookies = Cookies
Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: 'success' })
}
Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: 'error' })
}
Vue.prototype.msgWarning = function(msg) {
    this.$message({ showClose: true, message: msg, type: 'warning' })
}
Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg)
}

Vue.use(VueClipboard)
Vue.use(meta)
Vue.use(Element, {size: 'small', zIndex: 3000})

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
