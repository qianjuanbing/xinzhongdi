import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'


const app = createApp(App)
app.use(VueAxios, axios)
app.mount('#app')

// 测试 - 使用 axios 实例而非 Vue 全局对象
axios.get('http://localhost:3000/todos').then((res) => {
  console.log(res)
})
