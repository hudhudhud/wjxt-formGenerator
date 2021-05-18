<template>
    <div>
        <el-container>
            <el-header height="80" class="home-header-view-container">
                <el-row type="flex" align="middle" justify="space-between" class="home-header-view"
                        style="height: 100%;">
                    <el-col :span="4">
                        <img src="@/assets/images/indexLogo.png" class="header-logo-img"
                             @click="$router.push({path:'/'})"
                        >
                    </el-col>
                    <div class="right-info">
                        <!--                        <span>租户切换：</span>-->
                        <el-select v-model="namespaceId" placeholder="请选择">
                            <el-option
                                v-for="item in getNamespace"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-popover
                            placement="bottom-end"
                            width="200"
                            trigger="click"
                            v-model="popoverVisible"
                        >
                            <div class="user-person-menu">
                                <div>
                                    <p class="person-menu-item"
                                       @click="$router.push({path: '/manage/namespace'});popoverVisible=false">
                                        <font-icon class="fas fa-user-circle"/>
                                        管理
                                    </p>
                                    <p class="person-menu-item"
                                       @click="$router.push({path: '/manage/admin'});popoverVisible=false"
                                       v-if="getUserInfo.isAdmin">
                                        <font-icon class="fas fa-user-circle"/>
                                        全局管理
                                    </p>
                                    <div class="person-menu-divider"/>
                                    <p class="person-menu-item" @click="logoutHandle">
                                        <font-icon class="fas fa-sign-out"/>
                                        退出登录
                                    </p>
                                </div>
                            </div>
                            <div slot="reference" style="padding-left: 30px; cursor: pointer;">
                                <span v-if="getUserInfo">
                                欢迎您，{{getUserInfo.realName}} {{getUserInfo.domainAccount}} <i
                                    class="el-icon-caret-bottom"></i>
                                </span>
                            </div>
                        </el-popover>
                    </div>
                </el-row>
            </el-header>
            <el-main class="home-main-view">
                <router-view/>
            </el-main>
            <el-divider></el-divider>
            <el-footer class="home_footer_view" style="height: 0;">
                Copyright © 2021 信息技术部 AI及中台方案部 技术支持
            </el-footer>
        </el-container>
    </div>
</template>
<script>
    import store from '@/store/index.js'
    import FontIcon from '@/components/FontIcon'
    import router from '@/router'
    import {openUrl, checkIsUrl} from '@/utils/index'
    import {Message} from 'element-ui'

    export default {
        name: 'Home',
        components: {FontIcon},
        data() {
            return {
                menuIndex: null,
                menuRouters: [
                ],
                popoverVisible: false,
            }
        },
        computed: {
            getStore() {
                return store
            },
            getUserInfo() {
                let user = this.getStore.getters['user/userInfo']
                return user
            },
            getNamespace() {
                return this.getStore.getters['user/namespace']
            },
            namespaceId: {
                get() {
                    return this.getStore.getters['user/namespaceId']
                },
                set(val) {
                    this.$store.dispatch('user/update', {namespaceId: val}).then(() => {
                        //重新获取当前用户信息、权限信息
                        this.$api.get('/userInfo/currentUser').then(res => {
                            this.$store.dispatch('user/login', {userInfo: res.data}).then(() => {
                                this.$router.push('/')
                            })
                        })
                    })
                }
            }
        },
        mounted() {
            //获取当前用户拥有的租户列表
            this.$api.get('/namespace/list').then(res => {
                this.$store.dispatch('user/login', {namespace: res.data})
                this.namespaceList = res.data
                if (Array.isArray(res.data) && res.data.length) {
                    //从其他项目跳转过来，带租户code,直接切换到该code的租户下
                    if(this.$route.query.namespaceCode){
                        let findItem = this.namespaceList.find(it=>it.code==this.$route.query.namespaceCode)
                        if(findItem){
                            this.$store.dispatch('user/login', {namespaceId: findItem.id})
                            return
                        }
                    }
                    //当前没有租户，默认第一项
                    if (!this.namespaceId || !this.namespaceList.find(it => it.id == this.namespaceId)) {
                        this.$store.dispatch('user/login', {namespaceId: this.namespaceList[0].id})
                    }
                }
            })
            this.menuIndex = this.$route.path
        },
        methods: {
            activeMenuHandle(routerPath) {
                if (checkIsUrl(routerPath)) {
                    openUrl(routerPath)
                } else {
                    this.menuIndex = routerPath
                }
            },
            async logoutHandle() {
                this.popoverVisible = false
                this.$confirm('您确定要退出登录吗？', '退出确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let requestUrl = location.origin + '/login'
                        let res = await this.$api_plain.get('/sso/logoutUrl', {
                            params: {
                                requestUrl
                            }
                        })
                        console.log('loginout...', res)
                        if (res.code == 20000) {
                            this.$store.dispatch('user/logout').then(() => {
                                location.replace(res.ssoLogoutUrl)
                            })
                        } else {
                            this.msgError(res.message)
                        }
                    } catch (e) {
                        this.msgError(e)
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .menu-item {
        line-height: 80px;
        height: 80px;
        text-align: left;
        font-weight: 550;
        color: rgba(32, 91, 181, 100);
        font-size: 20px;
        &:hover {
            cursor: pointer;
        }
    }
    .el-menu.el-menu--horizontal {
        border-bottom: none;
    }
    .home-header-view-container {
        width: 100%;
        height: 80px;
        box-shadow: 0 1px 0 0 #ebebeb;
        background-color: #fff;
    }
    .home-header-view {
        line-height: 80px;
        height: 80px;
        width: 100%;
        min-width: 1200px;
        background-color: rgba(255, 255, 255, 100);
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
        // text-align: center;
        position: relative;
        margin: auto;
        .header-logo-img {
            display: block;
            width: 104px;
            // height: 40px;
            margin: auto 0;
            cursor: pointer;
        }
        .right-info {
            position: absolute;
            right: 0;
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
    .user-person-menu {
        .nick-name {
            height: 16px;
            color: rgba(70, 70, 70, 86);
            font-size: 14px;
            line-height: 16px;
            text-align: left;
        }
        .person-menu-item {
            color: rgba(70, 70, 70, 86);
            font-size: 14px;
            text-align: left;
        }
        .person-menu-item:hover {
            cursor: pointer;
            color: rgba(32, 91, 181, 100);
        }
        .person-menu-divider {
            background-color: rgba(210, 210, 210, 78);
            border: 1px solid rgba(210, 210, 210, 78);
        }
    }
    .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 100px;
        cursor: pointer;
    }
    .home-main-view {
        height: calc(100vh - 100px);
        min-width: 1200px;
        background-color: #fff;
        padding: 0;
    }
    .home_footer_view {
        text-align: center;
        color: #888;
        font-family: "Microsoft Yahei", PingFangSC, 微软雅黑, Arial, sans-serif;
        font-size: 13px;
    }
    .el-divider {
        color: #eee;
        margin: 8px 0;
        background: 0 0;
        border-top: 1px solid #e6ebf5;
    }
</style>
