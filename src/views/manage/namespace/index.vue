<template>
    <section class="manage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="border-card" style='margin-top: 20px;' @tab-click="tabClick" v-model="activeTab">
            <el-tab-pane label="角色管理" name="tab-role" v-if="hasPermi('role-menu')">
                <roleManage ref="roleManage"/>
            </el-tab-pane>
            <el-tab-pane label="用户管理" name="tab-user" v-if="hasPermi('user-menu')">
                <userManage ref="userManage"/>
            </el-tab-pane>
            <el-tab-pane label="模板分类管理" name="tab-template" v-if="hasPermi('template-category-menu')">
                <templateCatgManage ref="templateCatgManage"/>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
import userManage from './userManage'
import roleManage from './roleManage'
import templateCatgManage from './templateCatgManage'
export default {
    components:{
        userManage,
        roleManage,
        templateCatgManage
    },
    computed: {
        hasPermi() {
            return this.$store.getters['user/hasPermi']
        },
        getUserInfo() {
            return this.$store.getters['user/userInfo']
        },
    },
    watch:{
        //切换租户时更新界面数据
        // "getUserInfo.userResourceNsDto.namespaceId"(val){
        //     this.$nextTick(()=>{
        //         this.init()
        //     })
        // }
    },
    data(){
        return{
            activeTab:''
        }
    },
    mounted(){
      this.init()
    },
    methods:{
        init(){
            if(this.hasPermi('role-menu')){
                this.activeTab='tab-role'
                this.$refs.roleManage.getData()
            }
            else if(this.hasPermi('user-menu')){
                this.activeTab='tab-user'
                this.$refs.userManage.getData()
            }
            else if(this.hasPermi('template-category-menu')){
                this.activeTab='tab-template'
                this.$refs.templateCatgManage.getData()
            }
        },
        tabClick(tab,e){
            if(tab.name=='tab-role'){
                this.$refs.roleManage.getData()
            }
            else if(tab.name=='tab-user'){
                this.$refs.userManage.getData()
            }
            else if(tab.name=='tab-template'){
                this.$refs.templateCatgManage.getData()
            }
        }
    }
}
</script>
<style scoped lang='scss'>
.manage {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    .el-breadcrumb {
        padding-top: 20px;
    }
}

</style>
