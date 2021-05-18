export default [
/*    {
        path: '/test',
        meta: {requireLogin: false},
        component: () => import(/!* webpackChunkName: 'root' *!/ '@/views/test')
    },*/
/*    {
        path: '/redirect/:type',
        meta: {requireLogin: false},
        component: () => import(/!* webpackChunkName: 'root' *!/ '@/views/redirect')
    },*/
    {
        path: '/login',
        name:'login',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/account/login.vue')
    },
    {
        path: '/afterLogin',
        name:'afterLogin',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/account/login.vue')
    },
    {
        path: '/loginOut',
        name:'loginOut',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/account/login.vue')
    },
    {
        path: '/',
        meta: {requireLogin: true},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/home/index.vue'),
        children: [
            {
                path: '/',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/home/HomeView')
            },
            {
                path: '/home',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/home/HomeView')
            },
            /*{
                path: 'member',
                meta: {requireLogin: true},
                component: () => import(/!* webpackChunkName: 'root' *!/ '@/views/account/member')
            }*/
        ]
    }, {
        path: '/project',
        meta: {requireLogin: true},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/home/index.vue'),
        children: [
            {
                path: 'create',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/create.vue')
            },
            {
                path: 'createProject',
                name:'createProject',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/create.vue')
            },
            {
                path: 'my',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/MyProject.vue')
            },
            {
                path: 'recycle',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/RecycleBin.vue')
            },
            {
                path: 'template/preview',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/TemplatePreview.vue')
            },
            {
                path: 'form',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/index.vue')
            },
            {
                path: 'formProject',
                name:'formProject',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/index.vue')
            }
        ]
    }, {
        path: '/project/preview',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/PreView.vue')
    }, {
        path: '/project/view',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/ProjectForm.vue')
    },
    {
        path: '/project/write',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/write.vue')
    },
    //管理
    {
        path: '/manage',
        meta: {requireLogin: true},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/home/index.vue'),
        children: [
            {
                path: 'admin',
                name:'admin',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/manage/admin/index.vue')
            },
            {
                path: 'namespace',
                name:'namespace',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/manage/namespace/index.vue')
            }
        ],
    }
]
