<template>
    <section class="namespace-user" v-if="hasPermi('user-list')">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="">
                <el-input v-model="searchForm.name" placeholder="请输入用户名称搜索" clearable @keyup.enter.native="getData"
                @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="primary"  @click="handleAddClick" v-if="hasPermi('user-edit')">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" style="width: 100%;">
            <el-table-column prop="realName" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="domainAccount" label="域账号" >
            </el-table-column>
            <el-table-column prop="deptName" label="部门" >
            </el-table-column>
            <el-table-column  label="操作" >
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleRoleManageClick(scope.row)" v-if="hasPermi('user-role')">角色设置</el-button>
                    <el-button @click="handleDelClick(scope.row)" type="text" size="small" v-if="hasPermi('user-edit')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :total="total" :page-size.sync="size" :current-page.sync="current"
        @current-change="currentPageChange" @prev-click="prevPageClick" @next-click="nextPageClick"></el-pagination>
        <el-dialog title="新增用户" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
            <el-form ref="form" label-width="80px">
                <el-select style="width: 100%;" v-model="selectUserIds" multiple filterable default-first-option placeholder="请输入用户关键字搜索" :remote="true"
                :remote-method="userSearch" :multiple-limit="0" :loading="userSearchLoading">
                    <el-option v-for="item in searchUserList" :key="item.domainAccount" :label="item.realName+' '+item.domainAccount" :value="item.domainAccount"></el-option>
                </el-select>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveClick">确 定</el-button>
            </span>
        </el-dialog>
         <el-dialog title="角色设置" :visible.sync="roleDialogVisible" width="40%" :close-on-click-modal="false">
             <el-checkbox-group v-model="selectRoleList">
                <el-checkbox v-for="(role,i) in userRoleList" :label="role.id" :key="i">{{role.name}}</el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleClick">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import {debounce} from 'lodash'
export default {
    data(){
        return{
            current:1,
            size:10,
            userList:[],
            total:0,
            dialogVisible:false,
            searchForm:{
                name:''
            },
            searchUserList:[],
            userSearchLoading:false,
            selectUserIds:[],
            userRoleList:[],
            selectRoleList:[],
            roleDialogVisible:false,
        }
    },
    computed: {
        hasPermi() {
            return this.$store.getters['user/hasPermi']
        },
    },
    methods:{
        async getData(){
           let res =  await this.$api.get('/userInfo/namespace/list',{params:{
                current:this.current,
                size:this.size,
                searchParam:this.searchForm.name
            }})
            this.userList = res.data.records
            this.total = res.data.total
        },
        currentPageChange(current){
            this.current = current
            this.getData()
        },
        prevPageClick(current){
            this.current--
            this.getData()
        },
        nextPageClick(current){
            this.current++
            this.getData()
        },
        inputChange:debounce(function(){
	      this.getData()
	    }, 300),
        handleAddClick(){
            this.dialogVisible = true
        },
        handleDelClick(row){
            this.$confirm('确认删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }).then(async () => {
                await this.$api.delete('/userInfo/namespace/delete',{params:{
                    userId:row.domainAccount
                }})
                this.getData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {});
        },
        async userSearch(searchParam){
            if(!searchParam.trim())return
            try{
                this.userSearchLoading = true
                let res = await this.$api.get('/userInfo/namespace/uncheck/list',{params:{
                    searchParam:searchParam
                }})
                this.searchUserList = res.data.slice(0,50)
            }
            finally{
                this.userSearchLoading = false
            }
        },
        async saveClick(){
            await this.$api.post('/userInfo/namespace/add',{
                userIds:this.selectUserIds
            })
            this.dialogVisible = false
            this.getData()
        },
        async handleRoleManageClick(row){
            let res = await this.$api.get('/userInfo/role',{params:{
                userId:row.domainAccount
            }})
            this.userRoleList = res.data
            this.selectRoleList = this.userRoleList.filter(it=>it.check).map(it=>it.id)
            this.roleDialogVisible = true
            this.currentRowId = row.domainAccount
        },
        async saveRoleClick(){
            await this.$api.post('/userInfo/bindRole',{
                userId:this.currentRowId,
                roleIds:this.selectRoleList
            })
            this.roleDialogVisible = false
            this.$message({
                type: 'success',
                message: '设置成功!'
            });
        }
    }
}
</script>
<style scoped lang='scss'>
.namespace-user {
    height: 100%;
}
.el-pagination {
    text-align: right;
    margin-top: 20px;
}
</style>
