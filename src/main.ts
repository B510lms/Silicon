import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import gloablComponent from '@/components';
// import '@/styles/index.scss'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from './router'

const app = createApp(App);
app.use(ElementPlus, {
    locale: zhCn
})
app.use(gloablComponent);
app.use(router);
app.mount('#app')

