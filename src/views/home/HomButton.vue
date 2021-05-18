<template>
    <el-row style="padding: 40px 20px;" type="flex" justify="center">
        <el-col :span="6" v-if="hasPermi('project-edit')">
            <el-button class="home-fun-btn" @click="$router.push({path:'/project/createProject'})">
                <img src="../../assets/images/add.png" class="button-img" align="left">
                <p><strong class="button-title">创建问卷</strong></p>
                <p class="button-text">高效/便捷/实时预览</p>
            </el-button>
        </el-col>
        <el-col :span="6" v-if="hasPermi('project-menu')">
            <el-button class="home-fun-btn" @click="$router.push({path:'/project/my'})">
                <img src="../../assets/images/my.png" class="button-img" align="left">
                <p><strong class="button-title">我的问卷</strong></p>
                <p class="button-text">快捷统计数据</p>
            </el-button>
        </el-col>
        <el-col :span="6" v-if="hasPermi('template-menu')">
            <el-button class="home-fun-btn" @click="$router.push({path:'/project/create'})">
                <img src="../../assets/images/template.png" class="button-img" align="left">
                <p><strong class="button-title">问卷模板</strong></p>
                <p class="button-text">定制各类模板</p>
            </el-button>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: 'HomeFunction',
        computed: {
            hasPermi() {
                return this.$store.getters['user/hasPermi']
            },
        },
    }
</script>
<style scoped>
    .home-fun-btn {
        width: 70%;
        height: 145px;
        line-height: 20px;
        border-radius: 15px;
        font-weight: 580;

        /* background-color: #f7f7f7; */
        color: rgba(16, 16, 16, 100);
        font-size: 16px;
        text-align: center;
        border: 1px solid #fff;

        /* border: 1px solid rgba(187, 187, 187, 100); */
        box-shadow: 0 0 5px 0 rgba(59, 59, 59, 0.15);
    }
    .fl {
        /* float: left; */
    }
    .button-title {
        font-size: 16px;
        color: #666;
        margin: 10px 0 10px;
    }
    .button-text {
        font-size: 13px;
        color: #c4cbcf;
    }
    .button-img {
        padding-right: 10px;
        width: 100px;
    }
</style>

