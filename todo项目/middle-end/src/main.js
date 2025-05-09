import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import MyAxios from './request'
import {
  Delete, Edit, Plus, Eleme, HomeFilled,
  UserFilled,
  Menu,
  Document
} from '@element-plus/icons-vue'
// 在已有导入后添加
import { ElForm, ElFormItem } from 'element-plus'

const app = createApp(App)
app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
// app.use(ElInput)
app.component('HomeFilled', HomeFilled)
app.component('UserFilled', UserFilled)
app.component('Menu', Menu)
app.component('Document', Document)
app.component('Delete', Delete)
app.component('Edit', Edit)
app.component('Plus', Plus)
app.component('Eleme', Eleme)

app.use(MyAxios)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
