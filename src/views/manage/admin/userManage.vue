<template>
    <section class="user-manage">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="">
                <el-input v-model="searchForm.name" placeholder="请用户名称搜索" clearable @keyup.enter.native="getData"
                          @input="inputChange"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="primary" @click="synchronizeUser">同步用户</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="namespaceList" style="width: 100%;">
            <el-table-column prop="realName" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="domainAccount" label="域账号">
            </el-table-column>
            <el-table-column prop="deptName" label="部门">
            </el-table-column>
            <el-table-column prop="isAdmin" label="是否为超级管理员" width="200">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isAdmin" @change="switchChange(scope.row,$event,'admin')"></el-switch>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :total="total" :page-size.sync="size"
                       :current-page.sync="current"
                       @current-change="currentPageChange" @prev-click="prevPageClick"
                       @next-click="nextPageClick"></el-pagination>
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
                    description: ''
                },
                searchForm: {
                    name: ''
                }
            }
        },
        methods: {
            async getData() {
                let res = await this.$api.get('/userInfo/list', {
                    params: {
                        current: this.current,
                        size: this.size,
                        searchParam: this.searchForm.name
                    }
                })
                this.namespaceList = res.data.records
                this.total = res.data.total
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
                this.form.id = ''
                this.form.name = ''
                this.form.description = ''
            },
            handleEditClick(row) {
                this.dialogVisible = true
                this.form.name = row.name
                this.form.description = row.description
                this.form.id = row.id
            },
            handleDelClick(row) {
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    await this.$api.delete('/namespace/remove/' + row.id)
                    this.getData()
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
                this.getData()
            },
            async switchChange(row, val, from) {
                if (from == "namespace") {
                    await this.$api.put('/userInfo/update', {
                        "domainAccount": row.domainAccount,
                        "enableNamespace": val ? 1 : 0,
                        "isAdmin": row.isAdmin ? 1 : 0
                    })
                } else if (from == "admin") {
                    await this.$api.put('/userInfo/update', {
                        "domainAccount": row.domainAccount,
                        "enableNamespace": row.enableNamespace ? 1 : 0,
                        "isAdmin": val ? 1 : 0
                    })
                }
                this.$message({
                    type: 'success',
                    message: '设置成功!'
                });
            },
            async synchronizeUser() {
                await this.$api.post('/userInfo/synchronize')
                this.$message({
                    type: 'success',
                    message: '同步成功!'
                });
            }
        }
    }
</script>
<style scoped lang='scss'>
    .user-manage {
        height: 100%;
    }
    .el-pagination {
        text-align: right;
        margin-top: 20px;
    }
</style>
