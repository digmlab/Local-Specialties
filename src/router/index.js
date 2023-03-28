import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Main from '../components/main/Main.vue'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: 'Main',
    children: [
      { path: '/Main', component: Main, name: 'Main', meta: { title: '首页', keepAlive: true } },
      { path: '/Edit', name: 'Edit', component: () => import(/* webpackChunkName: "Edit" */ '../components/edit/Edit.vue'), meta: { title: '发帖' } },
      { path: '/BlogPage', name: 'BlogPage', component: () => import(/* webpackChunkName: "BlogPage" */ '../components/BlogPage/BlogPage.vue'), meta: { title: '展示页面', keepAlive: false } },
      { path: '/About', name: ' About', component: () => import(/* webpackChunkName: "About" */ '../components/about/About'), meta: { title: '关于' } },
      { path: '/Gitee', name: ' Gitee', component: () => import(/* webpackChunkName: "About" */ '../components/Gitee/Gitee'), meta: { title: '源码' } },
      { path: '/Group', name: ' Group', component: () => import(/* webpackChunkName: "About" */ '../components/Group/Group'), meta: { title: '小组' } }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../components/login/Login'),
    meta: { title: '登录页面' }
  },
  {
    path: '/Regist',
    name: 'Regist',
    component: () => import(/* webpackChunkName: "Login" */ '../components/Regist/Regist'),
    meta: { title: '注册页面' }
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: () => import(/*webpackChunkName:"Admin" */ '../components/Admin'),
    meta: { title: '后台主页' },
    redirect: 'Welcome',
    children: [
      { path: '/container', name: 'Container', component: () => import(/*webpackChunkName*/ '../components/Admin/Container'), meta: { title: '文章列表' } },
      { path: '/Comment', name: 'Comment', component: () => import(/*webpackChunkName*/ '../components/Admin/Comment'), meta: { title: '评论列表' } },
      { path: '/Category', name: 'Category', component: () => import(/*webpackChunkName*/ '../components/Admin/Category'), meta: { title: '分类列表' } },
      { path: '/CommentReplay', name: 'CommentReplay', component: () => import(/*webpackChunkName*/ '../components/Admin/CommentReplay'), meta: { title: '回复列表' } },
      { path: '/ResourceImges', name: 'ResourceImges', component: () => import(/*webpackChunkName*/ '../components/Admin/ResourceImges'), meta: { title: '图片管理' } },
      { path: '/SLPGroup', name: 'SLPGroup', component: () => import(/*webpackChunkName*/ '../components/Admin/SLPGroup'), meta: { title: '小组管理' } },
      { path: '/Welcome', name: 'Welcome', component: () => import(/*webpackChunkName*/ '../components/Admin/Welcome'), meta: { title: '首页' } }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

//Vue2 history 路由模式 apache配置上线 教程 http://t.zoukankan.com/litings-p-10802972.html

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === "production" ? '/vue_blog/dist/' : './',
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 进入这些页面需要 blogs_check_token 存在，blogs_check_token不存在，则强制跳转Login页面
  const path = ['/Admin','/Container','/ResourceImges','/Welcome','/Comment','/CommentReplay','/Category','SLPGroup'];
  if(path.some(ele => ele === to.path)) {
    const tokenStr = window.sessionStorage.getItem('blogs_check_token')
    if (!tokenStr) {
      next('/Login')
    } 
  }
  // if (to.path === '/Admin' || to.path === '/Container' || to.path === '/Welcome' || top.path === '/Comment') {
  //   const tokenStr = window.sessionStorage.getItem('blogs_check_token')
  //   if (!tokenStr) {
  //     next('/Login')
  //   } 
  // }
  
  // 判断是否需要缓存(从BlogPage路径跳转到 Main，不刷新 Main页面)
  if (to.path === '/Main' && from.path === '/BlogPage') {
    // 让页面缓存，即不刷新页面
    to.meta.keepAlive = true
  } else {
    to.meta.keepAlivev = false
  }
  next()
})

export default router
