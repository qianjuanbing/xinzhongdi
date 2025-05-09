import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
const app = createApp(App)
app.config.globalProperties.$axios = axios

app.use(router)
app.use(ElementPlus)  // 添加 Element Plus 插件
app.mount('#app')
