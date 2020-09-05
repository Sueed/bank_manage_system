// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui' 
import 'element-ui/lib/theme-chalk/index.css' 
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import App from './App'
import router from './router'
import store from './store' //引入 Vuex 状态管理
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';



Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const type = to.meta.type
  // 判断该路由是否需要登录权限
  if (type === 'user_login') {
    if (sessionStorage.getItem('login_type') === 'user') {
      //console.log('userlogin');
      next()
    } else {
      ElementUI.Message('访问客户界面需要先进行登录！');
      next('/')
    }
  }else if(type === 'admin_login'){
    if(sessionStorage.getItem('login_type') === 'admin'){
      //console.log('adminlogin');
      next()
    }else{
      ElementUI.Message('访问管理员界面需要先进行登录！');
      next('/')
    }
  }else if(type === 'dev_login'){
    if(sessionStorage.getItem('login_type') === 'dev'){
      //console.log('devlogin');
      next()
    }else{
      ElementUI.Message('访问开发者界面需要先进行登录！');
      next('/')
    }
  }else{
    next()  // 确保一定要有next()被调用
  }
})

const i18n = new VueI18n({
    locale: 'zh',
    messages
});

/* eslint-disable no-new */
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');



