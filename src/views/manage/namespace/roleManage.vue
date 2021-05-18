<template>
    <section class="namespace-role" v-if="hasPermi('role-list')">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="">
                <el-input v-model="searchForm.name" placeholder="请输入角色名称搜索" clearable @keyup.enter.native="getData"
                 @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="primary"  @click="handleAddClick" v-if="hasPermi('role-edit')">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="roleList" style="width: 100%;">
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
                <el-table-column prop="description" label="描述" >
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200">
            </el-table-column>
            <el-table-column  label="操作" >
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleUserManageClick(scope.row)" v-if="hasPermi('role-user')">用户设置</el-button>
                    <el-button type="text" size="small" @click="handlePermissionClick(scope.row)" v-if="hasPermi('role-permission')">权限设置</el-button>
                    <template v-if="hasPermi('role-edit')">
                        <el-button type="text" size="small" @click="handleEditClick(scope.row)">编辑</el-button>
                        <el-button  @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :total="total" :page-size.sync="size" :current-page.sync="current"
        @current-change="currentPageChange" @prev-click="prevPageClick" @next-click="nextPageClick"></el-pagination>
        <el-dialog :title="form.id?'修改角色':'新增角色'" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" type='textarea'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveClick">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 角色用户设置 -->
        <el-dialog title="用户设置" :visible.sync="userDialogVisible" width="700px" :close-on-click-modal="false">
            <el-transfer filterable :filter-method="transferFilterMethod" filter-placeholder="请输入用户" v-model="userSelectList" :data="userList"
            :titles="['未关联用户', '已关联用户']"
             :props="{
                key: 'domainAccount',
                label: 'name'
            }">
            </el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="userDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userSave">确 定</el-button>
            </span>
        </el-dialog>
         <el-dialog title="权限设置" :visible.sync="permissionVisible" width="700px" class="permission-dialog" :close-on-click-modal="false">
           <el-tree :data="permisitionList"
            show-checkbox node-key="id"
            :default-expanded-keys="selectPermission"
            :default-expand-all = "false"
            :default-checked-keys="selectPermission"
            :props="treeDefaultProps"
            :check-strictly="true"
            @check-change="treeCheckChange"
            ref="permissionTree">
          </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="permissionVisible = false">取 消</el-button>
                <el-button type="primary" @click="permissionSave">确 定</el-button>
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
            roleList:[],
            total:0,
            dialogVisible:false,
            userDialogVisible:false,
            permissionVisible:false,
            form:{
                id:'',
                name:'',
                description:''
            },
            searchForm:{
                name:''
            },
            userSelectList:[],
            userList:[],
            permisitionList:[],
            selectPermission:[],
            treeDefaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
   computed: {
        hasPermi() {
            return this.$store.getters['user/hasPermi']
        },
    },
    methods:{
        async getData(){
           let res =  await this.$api.get('/role/list',{params:{
                current:this.current,
                size:this.size,
                name:this.searchForm.name
            }})
            this.roleList = res.data.records
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
            this.form.id = ''
            this.form.name=''
            this.form.description = ''
        },
        handleEditClick(row){
            this.dialogVisible = true
            this.form.name=row.name
            this.form.description = row.description
            this.form.id = row.id
        },
        handleDelClick(row){
            this.$confirm('确认删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }).then(async () => {
                await this.$api.delete('/role/remove/'+row.id)
                this.getData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {});
        },
        async saveClick(){
            if(this.form.id){
                await this.$api.put('/role/update',this.form)
            }
            else{
                await this.$api.post('/role/add',this.form)
            }
            this.dialogVisible = false
            this.getData()
        },
        async handleUserManageClick(row){
            this.userList = []
            this.userSelectList = []
            let res = await this.$api.get('/role/checkUser',{params:{
                roleId:row.id
            }})
            let checkList = res.data
            this.userSelectList = checkList.map(it=>{
                // it.name = it.realName+' '+it.domainAccount
                return it.domainAccount
            })
            res = await this.$api.get('/role/uncheckUser',{params:{
                roleId:row.id
            }})
            let uncheckList = res.data.map(it=>{
                it.name = it.realName+' '+it.domainAccount
                return it
            })
            this.userList=uncheckList.concat(...checkList.map(it=>{
                it.name = it.realName+' '+it.domainAccount
                return it
            }))
            this.userDialogVisible = true
            this.currentRowId = row.id
        },
        transferFilterMethod(query, item) {
          return item.name.indexOf(query) > -1;
        },
        async userSave(){
            await this.$api.post('/role/bindUser',{
                roleId:this.currentRowId,
                userIds:this.userSelectList
            })
            this.userDialogVisible = false
            this.$message({
                type: 'success',
                message: '设置成功!'
            });
        },
        async handlePermissionClick(row){
            this.permisitionList = []
            this.selectPermission = []
            let res = await this.$api.get('/permission/tree')
            this.permisitionList = res.data
            res = await this.$api.get('/role/permission',{params:{
                roleId:row.id
            }})
            this.selectPermission = res.data
            this.permissionVisible = true
            this.currentRowId = row.id
        },
        async permissionSave(){
            let selected = this.$refs.permissionTree.getCheckedKeys()
            await this.$api.post('/role/bindPermission',{
                roleId:this.currentRowId,
                permissionIds:selected
            })
            this.permissionVisible = false
            this.$message({
                type: 'success',
                message: '设置成功!'
            });
        },
        //选中子时，自动选中父
        //传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
        treeCheckChange(currentNode,isCheck,isChildrenCheck) {
            // console.log('treeCheckChange...',arguments)
            if(isCheck&&currentNode.pid){
                let parNode = this.permisitionList.find(it=>it.id==currentNode.pid)
                if(parNode){
                    this.$refs.permissionTree.setChecked(parNode.id,true)
                }
            }
            //isChildrenCheck无效？？
            // else if(!isCheck && isChildrenCheck){
            //     this.$refs.permissionTree.setChecked(currentNode.id,true)
            // }
        },
    }
}
</script>
<style scoped lang='scss'>
.namespace-role {
    height: 100%;
}
.el-pagination {
    text-align: right;
    margin-top: 20px;
}
.permission-dialog {
    ::v-deep.el-dialog {
        // max-height: 500px;
        // overflow-y: scroll;
    }
    .el-tree {
        max-height: 500px;
        overflow-y: scroll;
    }
}
</style>
