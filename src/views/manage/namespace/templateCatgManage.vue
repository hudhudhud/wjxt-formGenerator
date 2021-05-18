<template>
    <section class="namespace" v-if="hasPermi('template-category-list')">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="">
                <el-input v-model="searchForm.name" placeholder="请输入模板分类名称搜索" clearable @keyup.enter.native="getData"
                 @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="primary"  @click="handleAddClick" v-if="hasPermi('template-category-edit')">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list" style="width: 100%;">
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
                <el-table-column prop="sort" label="排序" >
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200">
            </el-table-column>
            <el-table-column  label="操作" v-if="hasPermi('template-category-edit')">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleEditClick(scope.row)" >编辑</el-button>
                    <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :total="total" :page-size.sync="size" :current-page.sync="current"
        @current-change="currentPageChange" @prev-click="prevPageClick" @next-click="nextPageClick"></el-pagination>

        <el-dialog :title="form.id?'修改模板':'新增模板'" :visible.sync="dialogVisible" width="40%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort" type='number'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveClick">确 定</el-button>
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
            list:[],
            total:0,
            dialogVisible:false,
            form:{
                id:'',
                name:'',
                sort:''
            },
            searchForm:{
                name:''
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
           let res =  await this.$api.get('/template/category/list',{params:{
                current:this.current,
                size:this.size,
                name:this.searchForm.name
            }})
            this.list = res.data.records
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
            this.form.sort = ''
        },
        handleEditClick(row){
            this.dialogVisible = true
            this.form.name=row.name
            this.form.sort = row.sort
            this.form.id = row.id
        },
        handleDelClick(row){
            this.$confirm('确认删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }).then(async () => {
                await this.$api.delete('/template/category/remove/'+row.id)
                this.getData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {});
        },
        async saveClick(){
            if(this.form.id){
                await this.$api.put('/template/category/update',this.form)
            }
            else{
                await this.$api.post('/template/category/add',this.form)
            }
            this.dialogVisible = false
            this.getData()
        }
    }
}
</script>
<style scoped lang='scss'>
.namespace {
    height: 100%;
}
.el-pagination {
    text-align: right;
    margin-top: 20px;
}
</style>
