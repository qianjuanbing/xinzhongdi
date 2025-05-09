import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000', // 确保与后端API路径匹配
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.reject(error)
)

// 修改响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => {
    if (!error.response) {
      console.error('Network Error - Check Backend Server')
    }
    return Promise.reject(error)
  }
)

export default {
  install(app) {
    // Vue 3 compatible installation
    app.config.globalProperties.$http = instance
    app.provide('$http', instance) // For composition API usage
  }
}