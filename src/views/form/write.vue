<template>
    <div class="write-container">
        <h1 id="inActiveTime" style="display: none"></h1>
        <div v-if="writeStatus==0" class="title-icon-view">
            <div class="icon-view">
                <i class="el-icon-check success-icon"/>
            </div>
            <p style="text-align: center" v-if="writeNotStartPrompt">
                <span v-if="writeNotStartPrompt">{{ writeNotStartPrompt }}</span>
            </p>
        </div>
        <div v-if="writeStatus==1">
            <div class="user-name" v-if="needLogin">
                <img src="../../assets/images/indexLogo.png" alt="">
                <el-form class="user-name-form">
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="username" />
                    </el-form-item>
                    <el-button type="primary" class="login-btn" @click="intoForm">登录</el-button>
                </el-form>
            </div>
            <div v-else>
                <project-form
                    @submit="submitForm"
                    :projectConfig="projectConfig"
                    v-if="projectConfig.projectKey"/>
            </div>

        </div>
        <div v-if="writeStatus==2" class="title-icon-view">
            <div class="icon-view">
                <i class="el-icon-check success-icon"/>
            </div>
            <p style="text-align: center">
                <span v-if="userProjectSetting.submitPromptText">{{ userProjectSetting.submitPromptText }}</span>
                <span v-else>{{ globalDefaultValue.projectSubmitPromptText }}</span>
            </p>
            <div>
                <el-image
                    v-if="userProjectSetting.submitPromptImg"
                    :src="userProjectSetting.submitPromptImg"
                    fit="cover"></el-image>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectForm from './ProjectForm'
import loadWXJs from '@/utils/loadWxSdk'
import defaultValue from '@/utils/defaultValue'
import {getCurrentDomain, getQueryString} from '@/utils'

const uaParser = require('ua-parser-js')
const ua = uaParser(navigator.userAgent)

require('@/utils/ut')
export default {
    name: 'WriteView',
    props: {},
    data() {
        return {
            inActiveTime: 0,
            projectConfig: {
                projectKey: '',
                preview: false,
                showBtns: true
            },
            writeStatus: 1,
            writeNotStartPrompt: '',
            userProjectSetting: {
                submitPromptText: ''
            },
            globalDefaultValue: defaultValue,
            //微信授权地址
            wxAuthorizationUrl: '',
            wxAuthorizationCode: '',
            wxUserInfo: {},
            wxSignature: {},
            needLogin: false,
            username: '',
        }
    },
    beforeCreate() {
        let meta = document.createElement('meta')
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        meta.name = 'viewport'
        document.getElementsByTagName('head')[0].appendChild(meta)
    },
    created() {
        let key = this.$route.query.key
        this.projectConfig.projectKey = key
        // let wxCode = getQueryString('code')
/*        if (wxCode) {
            this.wxAuthorizationCode = wxCode
            this.getWxAuthorizationUserInfo()
        }*/
        // this.getWxAuthorizationUrl()
        this.queryProjectSettingStatus()
        this.queryProjectSetting()
        //加载微信相关 获取签名
        // this.$api.get('/wx/jsapi/signature', {params: {url: window.location.href}}).then(res => {
        //     this.wxSignature = res.data
        //     this.setWxConfig()
        // })
        // console.log(ua)

        this.$api.get(`/user/project/details/${this.projectConfig.projectKey}`, {params: {projectKey: this.projectConfig.projectKey}}).then(res => {
            if (res.data) {
                this.needLogin = res.data.project.needLogin
            }
        })
    },
    mounted() {
        this.viewProjectHandle()
    },
    components: {
        ProjectForm
    }, methods: {
        viewProjectHandle() {
            //是否能进入填写
            this.$api.post(`/user/project/result/view/${this.projectConfig.projectKey}`, {params: {projectKey: this.projectConfig.projectKey}}).then(res => {

            })
        },
        queryProjectSettingStatus() {
            //是否能进入填写
            this.$api.get(`/user/project/setting-status`, {params: {projectKey: this.projectConfig.projectKey}}).then(res => {
                if (res.msg) {
                    this.writeNotStartPrompt = res.msg
                    this.writeStatus = 0
                }
            })
        },
        intoForm() {
            if (!this.username) return this.msgError('请填写用户名')
            this.needLogin = false;
        },
        queryProjectSetting() {
            this.$api.get(`/user/project/setting/${this.projectConfig.projectKey}`).then(res => {
                if (res.data) {
                    this.userProjectSetting = res.data
                    //仅在微信环境打开
             /*       if (res.data && res.data.wxWrite) {
                        //记录微信用户信息
                        if (res.data.recordWxUser && !this.wxAuthorizationCode) {
                            console.log(this.wxAuthorizationUrl)
                            location.href = this.wxAuthorizationUrl
                        } else {
                            this.onlyWxOpenHandle()
                        }
                    }*/
                }
            })
        },
        convertDataKey(data) {
            let newData = {}
            for(let [key, value] of Object.entries(data)) {
                newData[key.replace('field', '')] = value
            }
            return newData
        },
        submitForm(data) {
            //完成时间
            let inActiveTime = document.getElementById('inActiveTime').innerText
            this.$api.post('/user/project/result/create', {
                'completeTime': inActiveTime,
                'projectKey': this.projectConfig.projectKey,
                'submitOs': ua.os.name,
                'submitBrowser': ua.browser.name,
                'submitUa': ua,
                'originalData': this.convertDataKey(data.formModel),
                'processData': this.convertDataKey(data.labelFormModel),
                'username': this.username,
            }).then(res => {
                this.writeStatus = 2
            })
        },

    }
}
</script>

<style lang="scss" scoped>
.write-container {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;

}

.project-grid-container {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: center;
}

.title-icon-view {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.icon-view {
    width: 59px;
    height: 59px;
    border-radius: 100px;
    background-color: #0076FF;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
}

.success-icon {
    text-align: center;
    color: white;
    font-size: 30px;
}

.user-name {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 800px;
    margin: 0 auto;
    background-color: rgba(229, 239, 247, 0.87);

    img {
        display: block;
        width: 40%;
        margin: 0 auto;
    }

    .user-name-form {
        width: 60%;
        margin: 60px auto;
    }

    .login-btn {
        display: block;
        width: 120px;
        margin: 40px auto 0;
    }
}
@media screen and (max-width: 750px) {
    .user-name {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
}
</style>
<style lang='scss'>
.el-collapse-item__header{
    height:unset;
}
.el-collapse{
    margin-bottom:15px;
    .el-collapse-item__content{
        min-height:100px;
    }
}
</style>
