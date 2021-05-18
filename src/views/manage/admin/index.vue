<template>
    <section class="manage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>全局管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="border-card" style='margin-top: 20px;' @tab-click="tabClick" v-model="activeTab">
            <el-tab-pane label="租户管理" name="tab-namespace">
                <namespaceManage ref="namespaceManage"/>
            </el-tab-pane>
            <el-tab-pane label="用户管理" name="tab-user">
                 <userManage ref="userManage"/>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
import namespaceManage from './namespaceManage'
import userManage from './userManage'
export default {
    components:{
        namespaceManage,
        userManage
    },
    data(){
        return{
            activeTab:'tab-namespace',
        }
    },
    mounted(){
        this.$refs.namespaceManage.getData()
    },
    methods:{
        tabClick(tab,e){
            if(tab.name=='tab-namespace'){
                this.$refs.namespaceManage.getData()
            }
            else{
                this.$refs.userManage.getData()
            }
        },
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
