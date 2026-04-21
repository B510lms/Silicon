import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/index.scss'
import 'virtual:svg-icons-register'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import gloablComponent from './components';

//配置element-plus国际化
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
import router from './router'
import pinia from './store'
//引入路由鉴权
import './permisstion'

const app = createApp(App);
app.use(ElementPlus, {
    locale: zhCn
})
app.use(gloablComponent);
app.use(router);
app.use(pinia);
//引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)
app.mount('#app')

