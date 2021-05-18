<template>
    <div class="form-edit-container">
        <div class="left-board">
            <el-scrollbar class="left-scrollbar">
                <div class="components-list">
                    <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                        <div class="components-title">
                            <svg-icon name="component"/>
                            {{ item.title }}
                        </div>
                        <draggable
                            class="components-draggable"
                            :list="item.list"
                            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                            :clone="cloneComponent"
                            draggable=".components-item"
                            :sort="false"
                            @end="onEnd"
                        >
                            <div
                                v-for="(element, index) in item.list"
                                :key="index"
                                class="components-item"
                                @click="addComponent(element)"
                            >
                                <div class="components-body">
                                    <svg-icon :name="element.__config__.tagIcon"/>
                                    {{ element.__config__.label }}
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="center-board">
            <el-scrollbar class="center-scrollbar">
                <el-row class="center-board-row" v-if="formConf" :gutter="formConf.gutter">
                    <el-row type="flex" justify="center" align="middle">
                        <el-col :span="20" style="text-align: center">
                            <h4 class="form-name-text" contenteditable="true"
                                @blur="(event)=>{
                                    this.formConf.title=event.target.innerText;
                                    this.saveProjectInfo()}">
                                {{ formConf.title }}</h4>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="middle">
                        <el-col :span="23">
                            <Tinymce v-model="formConf.description" @input="saveProjectInfo"
                                     v-if="editDescription"
                                     @blur="editDescription=false" placeholder="请输入表单描述"/>
                            <div v-else v-html="formConf.description" class="form-name-text"
                                 @click="editDescription=true" style="min-height: 100px">

                            </div>
                            <!--                            <p class="form-name-text" contenteditable="true"-->
                            <!--                               @blur="(event)=>{-->
                            <!--                                   formConf.description=event.target.innerText;-->
                            <!--                                   this.saveProjectInfo()}">-->
                            <!--                                {{ formConf.description }}-->
                            <!--                            </p>-->
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-form
                        :size="formConf.size"
                        :label-position="formConf.labelPosition"
                        :disabled="formConf.disabled"
                        :label-width="formConf.labelWidth + 'px'"
                        @click.native="activeFormItem(null,$event)"
                    >
                        <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup"
                                   @end="onItemEnd" @change="onItemChange">
                            <template  v-for="(item,index) in drawingList">
                                <draggable-item
                                    :key="item.renderKey"
                                    :drawing-list="drawingList"
                                    :current-item="item"
                                    :index="index"
                                    :active-id="activeId"
                                    :form-conf="formConf"
                                    @activeItem="activeFormItem"
                                    @changeLabel="changeLabel"
                                    @copyItem="drawingItemCopy"
                                    @deleteItem="drawingItemDelete"
                                    @onItemEnd="onItemEnd"
                                />
                            </template>
                        </draggable>
                        <div v-show="!drawingList.length" class="empty-info">
                            从左侧拖入或点选组件进行表单设计
                        </div>
                    </el-form>
                </el-row>
            </el-scrollbar>
        </div>
        <right-panel
            v-if="activeData"
            :active-data="activeData"
            :form-conf="formConf"
            :show-field="!!drawingList.length"
            @tag-change="tagChange"
            @data-change="updateProjectItemInfo"
        />
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {debounce} from 'throttle-debounce'
import render from '@/components/render/render'
import RightPanel from './RightPanel'

import {
    inputComponents, selectComponents, formConf,layoutComponents
} from '@/components/generator/config'
import {
    exportDefault, beautifierConf, isNumberStr, titleCase, deepClone, jsonClone
} from '@/utils/index'
import {dbDataConvertForItemJson, formItemConvertData} from '@/utils/convert'
import drawingDefalut from '@/components/generator/drawingDefalut'
import DraggableItem from './DraggableItem'
import {
    getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'
let oldActiveId
let tempActiveData
let drawingListInDB
let idGlobal
let apiPath = ''
export default {
    components: {
        draggable,
        render,
        RightPanel,
        DraggableItem
    },
    props: {
        projectKey: '',
        isEdit: true //是编辑状态进入
    },
    created(){
        if(this.$route.name=='formProject'){
            apiPath = '/user/project'
        }
        else{
            apiPath = '/project/template'
        }
    },
    data() {
        return {
            idGlobal,
            formConf,
            editDescription: true,
            inputComponents,
            selectComponents,
            layoutComponents,
            labelWidth: 100,
            drawingList: drawingDefalut,
            drawingData: {},
            activeId: drawingDefalut.length != 0 ? drawingDefalut[0].formId : 0,
            formData: {},
            dialogVisible: false,
            generateConf: null,
            showFileName: false,
            activeData: drawingDefalut ? drawingDefalut[0] : null,
            saveDrawingListDebounce: debounce(340, saveDrawingList),
            saveIdGlobalDebounce: debounce(340, saveIdGlobal),
            leftComponents: [
                {
                    title: '输入型组件',
                    list: inputComponents
                },
                {
                    title: '选择型组件',
                    list: selectComponents
                },
                {
                    title: '布局型组件',
                    list: layoutComponents
                },
            ],
            currentMoveItem:null,
        }
    },
    computed: {},
    watch: {
        // eslint-disable-next-line func-names
        'activeData.__config__.label': function(val, oldVal) {
            if (
                !this.activeData
                || this.activeData.placeholder === undefined
                || !this.activeData.__config__.tag
                || oldActiveId !== this.activeId
            ) {
                return
            }
            this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
        },
        activeId: {
            handler(val) {
                oldActiveId = val
            },
            immediate: true
        },
        drawingList: {
            handler(val) {
                this.saveDrawingListDebounce(val, this.projectKey)
                if (val.length === 0) this.idGlobal = 100
            },
            deep: true
        },
        idGlobal: {
            handler(val) {
                if (val) {
                    this.saveIdGlobalDebounce(val, this.projectKey)
                }
            },
            immediate: true
        }
    },
    mounted() {
        // 复制对象 避免修改改变原始对象
        this.formConf = JSON.parse(JSON.stringify(formConf))
        //项目key
        let projectKey = this.projectKey
        //从服务端获取
        this.queryProjectItems()
        //全局组件Id
        this.$api.get(apiPath+`/item/max-form-id`, {params: {key: this.projectKey}}).then(res => {
            this.idGlobal = res.data ? res.data : 100
        })
        this.projectKey = projectKey

    },
    methods: {
        saveProjectInfo: debounce(430, true, function() {
            this.$api.post(apiPath+'/update', {
                'key': this.projectKey,
                'name': this.formConf.title,
                'describe': this.formConf.description
            }).then((res) => {

            })
        }),
        updateProjectItemInfo(val) {
            console.log('update....',val)
            let data = formItemConvertData(val, this.projectKey)
            this.$api.post(apiPath+'/item/update', data).then((res) => {

            })
        },
        deleteProjectItemInfo(val) {
            let data = formItemConvertData(val, this.projectKey)
            this.$api.post(apiPath+'/item/delete', data)
        },
        saveProjectItemInfo(item,from) {
            let params = formItemConvertData(item, this.projectKey)
            this.$api.post(apiPath+'/item/create', params).then(res => {
                item.sort = res.data.sort
                this.$set(item,'dataId',res.data.formItemId)
                this.$set(item,'dId',res.data.itemDataId)
                if(from=='copy'){
                    //点复制之后更新结构顺序
                    this.onItemEnd()
                }
            })
        },
        queryProjectItems() {
            this.$api.get(apiPath+`/details/`+this.projectKey).then(res => {
                if(res.data.project){
                    this.formConf.title = res.data.project.name
                    this.formConf.description = res.data.project.describe
                }
                if(Array.isArray(res.data.projectItems)){
                    let resList = res.data.projectItems.map((item,index) => dbDataConvertForItemJson(item,index))
                    let newList = []
                    let hasAddObj = {}
                    resList.forEach(item=>{
                        //容器内children结构
                        if(item.typeId==18){
                            let children = resList.filter(it=>it.dataId!=it.pid&&it.pid==item.dataId)
                            this.$set(item.__config__,'children',children)
                            children.forEach(it=>{
                                hasAddObj[it.dataId]=true
                            })
                        }
                        //折叠组件内children
                        else if(item.enableFold){
                            let children = resList.filter(it=>it.dataId!=it.pid&&it.pid==item.dataId)
                            this.$set(item,'children',children)
                            // this.buidNewStruct(item,resList)
                            children.forEach(it=>{
                                hasAddObj[it.dataId]=true
                            })
                        }
                    })
                    resList.forEach(item=>{
                        if(!hasAddObj[item.dataId]){
                            if(item.pid&&!resList.find(it=>it.dataId==item.pid)){

                            }
                            else{
                                newList.push(item)
                            }
                        }
                    })
                    this.drawingList = newList
                    console.log('init....',this.drawingList)
                }
            })
        },
        buidNewStruct(item,list){
            if(item.enableFold){
                let children = list.filter(it=>it.pid!==it.id&&it.pid==item.dataId)
                children.forEach(it=>{
                    list.splice(list.indexOf(item),1)
                    this.buidNewStruct(it,children)
                })
                this.$set(item,'children',children)
            }
        },
        activeFormItem(currentItem) {
            console.log('activeFormItem...',currentItem)
            if(!currentItem){
                this.activeData = null
                this.activeId = null
                return 
            }
            this.activeData = currentItem
            this.activeId = currentItem.__config__.formId
        },
        changeLabel(currentItem, value) {
            console.log(currentItem)
            console.log(value)
        },
        //从左边标签处移动触发
        onEnd(obj) {
           // console.log('onEnd...',obj)
            if (obj.from !== obj.to) {
                this.activeData = tempActiveData
                this.activeId = this.idGlobal
                this.currentMoveItem = tempActiveData
            }
            this.onItemEnd(obj)
        },
        onItemChange(item){
           // console.log('onItemChange...',item)
            if(item.added){
                this.currentMoveItem = item.added.element
            }
            else if(item.moved){
                this.currentMoveItem = item.moved.element
            }
        },
        buildItemStruct(par,resList){
            if(par.enableFold&&Array.isArray(par.children)){
                par.children.forEach(it=>{
                    resList.push({
                        id:it.dId,
                        pid:par.dataId
                    })
                    this.buildItemStruct(it,resList)
                })
            }
            else if(par.typeId==18&&Array.isArray(par.__config__.children)){
                par.__config__.children.forEach(cpar=>{
                    resList.push({
                        id:cpar.dId,
                        pid:par.dataId
                    })
                    this.buildItemStruct(cpar,resList)
                })
            }
        },
        onItemEnd(obj) {
            //判断移动项是否是从展开项移除，或移入展开项
            // console.log('onItemEnd...',obj)  
            console.log('drawingList...',JSON.parse(JSON.stringify(this.drawingList)))  
            let resList=[]
            this.drawingList.forEach(par=>{
                let item = {
                    id:par.dId,
                    pid:''
                }
                resList.push(item)
                this.buildItemStruct(par,resList)
            })

            console.log('resList...',resList)
            // return
            this.$api.post(apiPath+'/item/saveStructure', {itemList:resList,projectKey:this.projectKey})
            return
            // let fromClass = obj.from.className
            // let toClass = obj.to.className
            // let childClass = 'drawing-board-child' //展开项容器class
            // let changeType = ''

            // //移出
            // if(fromClass.indexOf(childClass)>-1&&toClass.indexOf(childClass)==-1){
            //     changeType = 'out'
            // }
            // //移入
            // else if(fromClass.indexOf(childClass)==-1&&toClass.indexOf(childClass)>-1){               
            //     changeType = 'in'
            // }
            // //从一端移出，移到另一端
            // else if(fromClass.indexOf(childClass)>-1&&toClass.indexOf(childClass)>-1){
            //     changeType = 'change'
            // }

            // //更新顺序
            // let currentList = this.drawingList
            // let params = {'projectKey': this.projectKey}
            // if(changeType=="out"){
            //     currentList = this.drawingList
            // }
            // else if(changeType=='in'||changeType=='change'){
            //     //容器class
            //     let wrapperChildClass = 'drag-wrapper'
            //     let to_pid = toClass.split('_')[1]
            //     let findPar = this.drawingList.find(it=>it.dataId==to_pid)
               
            //     //移动到容器
            //     if(toClass.indexOf(wrapperChildClass)>-1){
            //         currentList = findPar.__config__.children
            //     } 
            //     //移动到折叠
            //     else{
            //         currentList = findPar.children
            //     }    
                           
            //     // if(findPar){
            //         // if(!findPar.children){
            //         //     this.$set(findPar,'children',[this.currentMoveItem])
            //         // }
            //         // currentList = findPar.children
            //     // }
            // }
            // console.log('onItemEnd...currentList...',currentList)
            // //传新项顺序的前后两项sort，进行对新项重新定sort
            // if (currentList[obj.newIndex - 1]) {
            //     let sort1 = currentList[obj.newIndex - 1].sort
            //     params.beforePosition = sort1
            // }
            // if (currentList[obj.newIndex + 1]) {
            //     let sort2 = currentList[obj.newIndex + 1].sort
            //     params.afterPosition = sort2
            // }
            // params.formItemId = currentList[obj.newIndex].__config__.formId
            // this.$api.post(apiPath+'/item/sort', params).then(res => {
            //     if(res.data){
            //         currentList[obj.newIndex].sort =res.data.sort
            //     }
            // })

            // //更新pid
            // let currentItem;//= this.drawingList[obj.newIndex]
            // if(changeType=='out'){
            //     currentItem = this.drawingList[obj.newIndex]
            //     currentItem.pid = ''
            //     console.log('clear pid..',currentItem)
            //     this.updateProjectItemInfo(currentItem)
            // }
            // else if(changeType=='in'){               
            //     let pid = toClass.split('_')[1]
            //     currentItem = currentList[obj.newIndex]
            //     currentItem.pid = pid
            //     console.log('add pid..',pid,currentItem)
            //     this.updateProjectItemInfo(currentItem)
            // }
            // else if(changeType=='change'){
            //     let from_pid = fromClass.split('_')[1]
            //     let to_pid = toClass.split('_')[1]
            //     if(from_pid!==to_pid){
            //         currentItem = currentList[obj.newIndex]
            //         currentItem.pid = to_pid
            //         console.log('change pid..',from_pid,to_pid,currentItem)
            //         this.updateProjectItemInfo(currentItem)
            //     }
            // }
        },
        addComponent(item) {
            console.log('add...',item)
            const clone = this.cloneComponent(item,true)
            if(this.activeData&&this.activeData.enableFold){
                if(!Array.isArray(this.activeData.children)){
                    this.$set(this.activeData,'children',[])
                }
                clone.pid = this.activeData.dataId
                this.activeData.children.push(clone)
                this.updateProjectItemInfo(clone)
                // this.activeFormItem(clone)
            }
            else{
                this.drawingList.push(clone)
                this.activeFormItem(clone)
            }
        },
        cloneComponent(origin, save = true) {
            const clone = deepClone(origin)
            const config = clone.__config__
            config.span = this.formConf.span // 生成代码时，会根据span做精简判断
            this.createIdAndKey(clone)
            clone.placeholder !== undefined && (clone.placeholder += config.label)
            tempActiveData = clone
            // if(this.activeData&&this.activeData.enableFold){
            //     if(!Array.isArray(this.activeData.children)){
            //         this.$set(this.activeData,'children',[])
            //     }
            //     clone.pid = this.activeData.dataId
            //     // this.activeData.children.push(clone)
            // }
            if (save) {
                this.saveProjectItemInfo(clone)
            }
            return tempActiveData
        },
        createIdAndKey(item) {
            const config = item.__config__
            config.formId = ++this.idGlobal
            config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
            if (config.layout === 'colFormItem') {
                item.__vModel__ = `field${this.idGlobal}`
            } else if (config.layout === 'rowFormItem') {
                // config.componentName = `row${this.idGlobal}`
                !Array.isArray(config.children) && (config.children = [])
                // delete config.label // rowFormItem无需配置label属性
                // delete config.layoutTree
                // delete config.span
                delete config.enableFold
            }
            if (Array.isArray(config.children)) {
                config.children = config.children.map(childItem => this.createIdAndKey(childItem))
            }
            if (Array.isArray(item.children)) {
                item.children = item.children.map(childItem => this.createIdAndKey(childItem))
            }
            return item
        },
        empty() {
            this.$confirm('确定要清空所有组件吗？', '提示', {type: 'warning'})
                .then(
                    () => {
                        this.drawingList = []
                        this.idGlobal = 100
                    }
                )
        },
        drawingItemCopy(item, list) {
            let clone = deepClone(item)
            clone = this.createIdAndKey(clone)
            list.push(clone)
            this.activeFormItem(clone)
            this.saveProjectItemInfo(clone,'copy')
        },
        async drawingItemDelete(index, list,currentItem) {
            console.log('drawingItemDelete...',index,list,currentItem)
            //删折叠项里的组件
            if(currentItem&&currentItem.pid){
                // let par = this.drawingList.find(it=>it.dataId==currentItem.pid)
                // list = this.drawingList.find(it=>it.dataId==currentItem.pid).children
                list.splice(index, 1)
                this.deleteProjectItemInfo(currentItem)
                return 
            }

            if(currentItem.enableFold&&currentItem.children&&currentItem.children.length){
                await this.$confirm('确认删除该组件，该操作将删除折叠项下所有组件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                })
            }
            else if(currentItem.typeId==18&&currentItem.__config__.children&&currentItem.__config__.children.length){
                await this.$confirm('确认删除该组件，该操作将删除该容器下所有组件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                })
            }

            let item = list[index]
            list.splice(index, 1)
            this.$nextTick(() => {
                const len = this.drawingList.length
                if (len) {
                    this.activeFormItem(this.drawingList[len - 1])
                }
            })
            this.deleteProjectItemInfo(item)
        },
        tagChange(newTag) {
            newTag = this.cloneComponent(newTag, false)
            const config = newTag.__config__
            newTag.__vModel__ = this.activeData.__vModel__
            newTag.sort = this.activeData.sort
            config.formId = this.activeId
            config.span = this.activeData.__config__.span
            this.activeData.__config__.tag = config.tag
            this.activeData.__config__.tagIcon = config.tagIcon
            this.activeData.__config__.document = config.document
            this.activeData.typeId = newTag.typeId
            if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
                config.defaultValue = this.activeData.__config__.defaultValue
            }
            Object.keys(newTag)
                .forEach(key => {
                    if (this.activeData[key] !== undefined) {
                        newTag[key] = this.activeData[key]
                    }
                })
            this.activeData = newTag
            this.updateProjectItemInfo(newTag)
            this.updateDrawingList(newTag, this.drawingList)
        },
        updateDrawingList(newTag, list) {
            const index = list.findIndex(item => item.__config__.formId === this.activeId)
            if (index > -1) {
                list.splice(index, 1, newTag)
            } else {
                list.forEach(item => {
                    if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
                })
            }
        }
    }
}
</script>

<style lang='scss'>
@import '@/assets/styles/form/home';
@import '@/assets/styles/form/index';
.el-collapse-item__header{
    height:unset;
    // [class*=el-col-]{
    //     float:none;
    // }
}
.el-collapse{
    margin-bottom:15px;
   .el-collapse-item__content{
        min-height:100px;
    }
    .el-collapse{
        margin:0 20px;
    }
}
.drawing-board-child{
    min-height:100px;
}

</style>
