import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const constantRouterMap = [
  //配置默认的路径，默认显示登录页
  { path: '/', component: () => import('@/components/page/Login')},

  {
    path: '/admin',
        component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
        meta: { title: '管理' ,type:'admin_login'},
        children: [
                {
                    path: '/admin/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard-admin.vue'),
                    meta: { title: '系统首页' ,type:'admin_login'}
                },
                {
                    path: '/admin/client_account_manage',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/Client_Account_Manage.vue'),
                    meta: { title: '客户账户管理' ,type:'admin_login'}
                }
            ]
        },
        {
            path: '/user',
                component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
                meta: { title: '用户' , type:'user_login'},
                children: [
                        {
                            path: '/user/dashboard',
                            component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard-user.vue'),
                            meta: { title: '系统首页' ,type:'user_login'}
                        },
                        {
                            path: '/user/account_manage',
                            component: () => import(/* webpackChunkName: "account_manage" */ '../components/page/Account_manage.vue'),
                            meta: { title: '账户信息' ,type:'user_login'}
                        },
                        {
                            path: '/user/money_manage',
                            component: () => import(/* webpackChunkName: "money_manage" */ '../components/page/Money_Manage.vue'),
                            meta: { title: '账户操作' ,type:'user_login'}
                        },
                        {
                            path: '/user/transfer',
                            component: () => import(/* webpackChunkName: "transfer" */ '../components/page/Transfer.vue'),
                            meta: { title: '银证转账' ,type:'user_login'}
                        }
                    ]
                },
                {
                    path: '/dev',
                        component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
                        meta: { title: '开发者' ,type:'dev_login'},
                        children: [
                                {
                                    path: '/dev/dashboard',
                                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard-dev.vue'),
                                    meta: { title: '系统首页' ,type:'dev_login'}
                                }
                            ]
                        }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap //指定路由列表
})
