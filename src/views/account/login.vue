<template>
    <div class="login-container" >
    </div>
</template>
<script>
import { Message} from 'element-ui'
export default {
    name: 'Login',
    data() {
        return {
          
        }
    },
    created() {
        if(this.$route.name=='afterLogin'){
            this.goAfterLogin()
        }
        //token过期需要先eos登出
        else if(this.$route.name=='loginOut'){
            this.goLoginOut()
        }
        else{
            this.goLogin()
        }
    },
    methods: {
        async goLogin(){
            let RequestUrl = location.origin + '/afterLogin'
            if(this.$route.query.redirect){
                RequestUrl+='?redirect='+encodeURIComponent(this.$route.query.redirect)
            }
            let res = await this.$api_plain.get('/eos_common/ssoLoginUrl',{params:{
                RequestUrl
            }})
            if(res.code==20000){
                location.replace(res.ssoLoginUrl)
            }
            else{
                this.msgError(res.message)
            }
        },
        async goAfterLogin(){
            if(!this.$route.query.ResponseTicket){
                this.$msgWarning('缺少ResponseTicket！')
                return
            }
            let res = await this.$api_plain.get('/eos_common/tokenViaSso',{params:{
                ssoRespTicket:this.$route.query.ResponseTicket
            }})
            if(res.code==20000){
                this.$store.dispatch('user/login', {token:res.token}).then(async () => {
                    // 重置状态
                    this.$store.dispatch('global/loginExpired', false)

                    //获取当前用户拥有的租户列表
                    let result = await this.$api.get('/namespace/list')
                    this.$store.dispatch('user/login', {namespace:result.data})
                    if(Array.isArray(result.data)&&result.data.length){
                        //从其他项目跳转过来，带租户code,直接切换到该code的租户下
                        if(this.$route.query.redirect&&this.$route.query.redirect.indexOf('namespaceCode')>-1){
                            let query = decodeURIComponent(this.$route.query.redirect)
                            let namespaceCode = query.split('?')[1].split('&').find(it=>it.indexOf('namespaceCode')>-1).split('=')[1]
                            let findItem = result.data.find(it=>it.code==namespaceCode)
                            if(findItem){
                                this.$store.dispatch('user/login', {namespaceId: findItem.id})
                            }
                        }
                        else{
                            //当前没有租户，默认第一项
                            this.$store.dispatch('user/login', {namespaceId:result.data[0].id})
                        }
                    }

                    //根据当前租户信息，获取当前用户、权限信息
                    this.$api.get('/userInfo/currentUser').then(res=>{
                        this.$store.dispatch('user/login', {userInfo:res.data})
                    })     
                    
                    //登录成功后路由跳回
                    if (this.$route.query.redirect) {
                        this.$router.replace({
                            path: decodeURIComponent(this.$route.query.redirect)
                        })
                    }
                    else{
                        this.$router.replace({path: '/home'})
                    }
                })
            }  
            else{
                this.msgError('获取登录信息失败：'+res.message)
            }
        },
        async goLoginOut(){
            let requestUrl = location.origin + '/login'
            if(this.$route.query.redirect){
                requestUrl+='?redirect='+this.$route.query.redirect
            }
            let res = await this.$api_plain.get('/sso/logoutUrl',{
                params:{
                    requestUrl
                }
            })
            console.log('loginout...',res)
            if(res.code==20000){
                this.$store.dispatch('user/logout').then(() => {
                    location.replace(res.ssoLogoutUrl)
                })
            }
            else{
                this.msgError(res.message)
            }
        }
    }
}
</script>