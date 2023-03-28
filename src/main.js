import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入代码高亮css样式
import 'highlight.js/styles/monokai-sublime.css'

// 加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入全局样式,js表
import './assets/css/global.css'
import './assets/js/global.js'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import { Quill } from 'vue-quill-editor'
import Video from './quill/video'
// 导入富文本编辑器的 css 样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


axios.defaults.baseURL = 'http://api-vueblog.czc.cool/'

// 在 request求拦截 ,在拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  // config.headers.Authorization = window.sessionStorage.getItem('blogs_check_token')
  // 最后必须return
  return config
})

// 在 response 拦截器中 ,隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  // 最后必须return
  return config
})


Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.use(VueQuillEditor, /* { default global options } */)

Quill.register(Video,true);

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
