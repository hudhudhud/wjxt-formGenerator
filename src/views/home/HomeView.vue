<template>
    <div class="container">
        <el-row>
            <div class="home-banner">
                <div class="banner-content animate onView">
                    <div class="banner-text fade-animate">
                        <h1><span class="zh">问卷调查平台</span></h1>
                        <h4>问卷创建所见即所得</h4>
                        <h4>助力数据分析</h4>
                    </div>
                    <div class="banner-img dynamic-wrap fade-in">
                        <img src="../../assets/images/1.png" height="400px"  class="dynamic-intro dynamic-banner">
                        <div class="dynamic-intro home-icon-dynamic-banner-plane"></div>
                    </div>
                </div>
            </div>
            <HomeFunction/>
        </el-row>
    </div>
</template>

<script>
    import HomeFunction from './HomButton'
    import Dashboard from './dashboard'

    export default {
        name: 'HomeView',
        components: {HomeFunction, Dashboard}
    }
</script>
<style lang="scss" scoped>
    .container {
        text-align: center;
        // padding-top: 20px;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }
    .el-carousel__item:nth-child(2n) {
        background-color: #99a;
    }
    .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
    }
    .el-col {
        margin-bottom: 20px;
    }

    // .el-card ::v-deep .el-card__header {
    //    background-color: #eaedf1;
    // }
    .home-banner {
        width: 100%;
        // height: 820px;
        min-width: 1200px;
    }
    .home-banner .banner-content {
        min-width: 1200px;
        height: 426px; //410px;
        // padding-top: 170px;
        background: #f5f7ff;
        background: linear-gradient(to bottom, #fff, #f5f7ff);
        text-align: center;
        margin: 0 auto;
    }
    .home-banner .banner-content .banner-text {
        padding-top: 40px;
        text-align: left;
        width: 450px;
    }
    .onView .fade-animate {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }
    .home-banner .banner-content .banner-img {
        width: 750px;
        margin-top: 40px;
    }
    .home-banner .banner-content .banner-text,
    .home-banner .banner-content .banner-img {
        display: inline-block;

        /* height: 320px; */
        vertical-align: top;
    }
    .dynamic-wrap .dynamic-banner {
        top: 0;
        left: 0;
        -webkit-transition: all 1.2s ease-out;
        transition: all 1.2s ease-out;
        -webkit-transition-delay: 0.2s;
        transition-delay: 0.2s;
        // background-position: center center;
        // height: 320px;
    }
    .home-banner .banner-content h1 .en {
        vertical-align: top;
        font-size: 57px;
        letter-spacing: 0;
    }
    .home-banner .banner-content h1 .zh {
        font-size: 50px;
        vertical-align: top;
    }
    .home-banner .banner-content .banner-register {
        width: 230px;
        height: 56px;
        margin-left: 4px;
        float: left;
        line-height: 56px;
        font-size: 16px;
        margin-top: 10px;
        border-radius: 30px;
        cursor: pointer;
    }
    .home-banner .index-bg img {
        width: 100%;
    }
    .home-banner .banner-content h1 {
        /* font-family: */

        /*    "official", */

        /*    Arial, */

        /*    "Microsoft Yahei", */

        /*    "Helvetica Neue", */

        /*    Helvetica Neue, */

        /*    Helvetica, */

        /*    Lantinghei SC, */

        /*    Hiragino Sans GB, */

        /*    sans-serif; */
        color: #45586c;
        font-weight: lighter;
        letter-spacing: 3px;
        line-height: 120px;
    }
    .home-banner .banner-content h4 {
        /* font-family: */

        /*    "official", */

        /*    Arial, */

        /*    "Microsoft Yahei", */

        /*    "Helvetica Neue", */

        /*    Helvetica Neue, */

        /*    Helvetica, */

        /*    Lantinghei SC, */

        /*    Hiragino Sans GB, */

        /*    sans-serif; */
        font-size: 22px;
        color: #8091a5;
        font-weight: lighter;
        line-height: 10px;
        text-indent: 3px;
        letter-spacing: 1px;
    }

    //新增样式
    .home-page {
        width: 1200px;
        margin: 0 auto;
        padding-top: 20px;
        text-align: center;
    }
    .home-page.category .category-list li {
        display: inline-block;
        width: 290px;
        height: 160px;
        position: relative;
        padding: 20px 0;
        letter-spacing: 0;
        background-color: #f7f8fa; // #fff;
        border: 1px solid #f5f7ff; // #eaedf1;
        margin: 5px;
        // border-bottom: 1px solid #f5f7ff;
        // border-right: 1px solid #f5f7ff;
        // box-shadow: 0.5px 0px 0px 0px #e5e5e5;
    }

    // .home-page.category .category-list :hover {
    //   color: red;
    // }
    .home-page.category .category-list :hover {
        background-color: #1485e1;
        cursor: pointer;

        // color: white;
    }
    .home-page.category .category-list :hover * {
        color: white;
    }
    .home-page.category .category-list :hover .category-main {
        color: white;
    }
    .home-page.category .category-list :hover .category-second {
        color: white;
    }
    .home-page.category .category-list li .category-content {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 25px;
        z-index: 2;
    }
    .home-page.category .category-list .category-main {
        font-size: 18px;
        color: #536981;
        margin: 10px 0 10px;
    }
    .home-page.category .category-list .category-second {
        font-size: 14px;
        color: #acb6c2;
        margin: 10px 0;
        border: true;
    }
    .home-page.category .category-list li i {
        font-size: 60px;
        color: #8eb2d7;
        vertical-align: middle;
    }
    .el-card ::v-deep .el-card__body {
        padding: 0;
    }
</style>
