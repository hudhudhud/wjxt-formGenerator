import axios from 'axios'
// import qs from 'qs'
import {MessageBox, Message} from 'element-ui'
import router from '@/router/index'
import store from '@/store/index'
import signMd5Utils from '@/utils/sign'

const toLogin = () => {
    router.push({
        path: '/loginOut',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

//简易axios
export const api_plain = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000,
    responseType: 'json',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
})
api_plain.interceptors.request.use(
    request => {
        if (store.getters['user/isLogin']) {
            request.headers.Authorization = 'Bearer '+store.state.user.token
        }
        //追加当前租户id
        if (store.getters['user/namespaceId']) {
            request.headers.namespaceId = store.state.user.namespaceId
        }
        return request
    }
)
api_plain.interceptors.response.use(
    response => {
        const res = response.data
        return Promise.resolve(res)
    },
    error => {
        return Promise.reject(error)
    }
)

//业务axios
const api = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000,
    responseType: 'json',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    request => {
        /**
         * 全局拦截请求发送前提交的参数
         * 以下代码为示例，在登录状态下，分别对 post 和 get 请求加上 token 参数
         */
        if (store.getters['user/isLogin']) {
            request.headers.Authorization = 'Bearer '+store.state.user.token
        }
        //追加当前租户id
        if (store.getters['user/namespaceId']) {
            request.headers.namespaceId = store.state.user.namespaceId
        }
        // 签名验证
        if (request.params == undefined) {
            request.params = {}
        }
        // let timestamp = new Date().getTime()
        // request.params.timestamp = '' + timestamp
        // let sign = signMd5Utils.getSign(request.url, request, timestamp)
        // request.params.sign = sign
        return request
    }
)

api.interceptors.response.use(
    response => {
        const res = response.data
        if(res.code==20206 && typeof res.data == "string" && res.data.indexOf('token失效')>-1){
            // 有一个接口进入该方法 其他接口则不在进入
            let reLogin = store.getters['global/isReLogin']
            if (!reLogin) {
                store.dispatch('global/loginExpired', true).then(() => {
                    // to re-login
                    // MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                    //     confirmButtonText: '重新登录',
                    //     cancelButtonText: '取消',
                    //     type: 'warning'
                    // }).then(() => {
                        toLogin()
                        // 重置状态
                        this.$store.dispatch('global/loginExpired', false).then(() => {})
                    // }).catch(() => {

                    // })
                })
            }
            return Promise.reject(res)
        }
        else if (res.flag) {
            return Promise.resolve(res)
        }
        else{
            // 这里做错误提示，如果使用了 element ui 则可以使用 Message 进行提示
            Message({
                message: res.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(res)
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default api
