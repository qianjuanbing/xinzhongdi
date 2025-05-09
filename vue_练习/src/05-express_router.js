const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('首页')
})
app.get('/index.html', (req, res) => {
  res.send('首页')
})
app.get('/list.html', (req, res) => {
  res.send('列表页')
})
app.get('/detail.html', (req, res) => {
  res.send('详情页')
})
app.get('*', (req, res) => {
  res.send('404 Not Found')
})

app.listen(3000)