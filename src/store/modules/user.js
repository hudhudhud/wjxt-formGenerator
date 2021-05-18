// import api from '@/api'
const tokenKey = 'eos-tduck-token'
const userInfoKey = 'eos-tduck-userInfo'
const namespaceKey = 'eos-tduck-namespace'
const namespaceIdKey = 'eos-tduck-namespaceId'
const state = {
    token: localStorage[tokenKey],
    userInfo: localStorage[userInfoKey],
    namespace:localStorage[namespaceKey],
    namespaceId:localStorage[namespaceIdKey],
}

const getters = {
    isLogin: state => {
        return state.token
    },
    userInfo: state => {
        return state.userInfo?JSON.parse(state.userInfo):''
    },
    namespace:state=>{
        return state.namespace?JSON.parse(state.namespace):[]
    },
    namespaceId:state=>{
        return state.namespaceId?state.namespaceId-'':''
    },
    hasPermi: (state) => (code) => {
        let userInfo = state.userInfo?JSON.parse(state.userInfo):''
        let res = userInfo?(userInfo.isAdmin || userInfo.roles[code]):false
        return res
    }
}

const actions = {
    login(context, payload) {
        return new Promise(resolve => {
            // 模拟登录成功，写入 token 信息
            context.commit('setData', payload)
            resolve()
        })
    },
    update(context, payload) {
        return new Promise(resolve => {
            // 模拟登录成功，写入 token 信息
            context.commit('setData', payload)
            resolve()
        })
    },
    logout(context) {
        context.commit('delData')
    }
}

const mutations = {
    setData(state, data) {
        if('token' in data){
            localStorage.setItem(tokenKey, data.token)
            state.token = data.token
        }
        if('userInfo' in data){
            //追加权限数据
            if(Array.isArray(data.userInfo.userResourceNsDto.resourceList)){
                data.userInfo.roles={}
                data.userInfo.userResourceNsDto.resourceList.forEach(it=>{
                    data.userInfo.roles[it]=true
                })
            }
            localStorage.setItem(userInfoKey, JSON.stringify(data.userInfo))
            state.userInfo = JSON.stringify(data.userInfo)
        }
        if('namespace' in data){
            localStorage.setItem(namespaceKey, JSON.stringify(data.namespace))
            state.namespace = JSON.stringify(data.namespace)
        }
        if('namespaceId' in data){
            localStorage.setItem(namespaceIdKey, data.namespaceId)
            state.namespaceId = data.namespaceId
        }
    },
    delData() {
        state.token = null
        state.userInfo = null
        state.namespace = null
        state.namespaceId = null
        localStorage.removeItem(tokenKey)
        localStorage.removeItem(userInfoKey)
        localStorage.removeItem(namespaceKey)
        localStorage.removeItem(namespaceIdKey)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
