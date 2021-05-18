<template>
    <section class="namespace">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="">
                <el-input v-model="searchForm.name" placeholder="请输入租户名称搜索" clearable @keyup.enter.native="getData"
                          @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData(false,$event)">查询</el-button>
                <el-button type="primary" @click="handleAddClick">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="namespaceList" style="width: 100%;">
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="code" label="code" width="180"/>
            <el-table-column prop="description" label="描述">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleEditClick(scope.row)">编辑</el-button>
                    <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :total="total" :page-size.sync="size"
                       :current-page.sync="current"
                       @current-change="currentPageChange" @prev-click="prevPageClick"
                       @next-click="nextPageClick"></el-pagination>

        <el-dialog :title="form.id?'修改租户':'新增租户'" :visible.sync="dialogVisible" width="40%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="code">
                    <el-input v-model="form.code"></el-input>
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
    </section>
</template>
<script>
    import {debounce} from 'lodash'

    export default {
        data() {
            return {
                current: 1,
                size: 10,
                namespaceList: [],
                total: 0,
                dialogVisible: false,
                form: {
                    id: '',
                    name: '',
                    code: '',
                    description: ''
                },
                searchForm: {
                    name: ''
                }
            }
        },
        methods: {
            async getData(needReset) {
                let res = await this.$api.get('/namespace/list', {
                    params: {
                        current: this.current,
                        size: this.size,
                        name: this.searchForm.name
                    }
                })
                this.namespaceList = res.data.records
                this.total = res.data.total
                //需要重置租户切换的数据
                if (needReset) {
                    let res = await this.$api.get('/namespace/list')
                    this.$store.dispatch('user/login', {namespace: res.data})
                }
            },
            currentPageChange(current) {
                this.current = current
                this.getData()
            },
            prevPageClick(current) {
                this.current--
                this.getData()
            },
            nextPageClick(current) {
                this.current++
                this.getData()
            },
            inputChange: debounce(function () {
                this.getData()
            }, 300),
            handleAddClick() {
                this.dialogVisible = true
                delete this.form.id
                this.form.name = ''
                this.form.description = ''
                this.form.code = ''
            },
            handleEditClick(row) {
                this.dialogVisible = true
                this.form.name = row.name
                this.form.description = row.description
                this.form.id = row.id
                this.form.code = row.code
            },
            handleDelClick(row) {
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    await this.$api.delete('/namespace/remove/' + row.id)
                    this.getData(true)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                });
            },
            async saveClick() {
                if (this.form.id) {
                    await this.$api.put('/namespace/update', this.form)
                } else {
                    await this.$api.post('/namespace/add', this.form)
                }
                this.dialogVisible = false
                this.getData(true)
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
