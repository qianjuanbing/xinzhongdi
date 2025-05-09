var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// 导入cors包
const cors = require('cors')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
const todosRouter = require('./routes/todos')
// 添加以下路由引用
var articleRouter = require('./routes/article')



var app = express()

// 添加跨域支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// 注册全局中间件
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/todos', todosRouter)
app.use('/api', articleRouter);  // 确保路由正确挂载

module.exports = app
