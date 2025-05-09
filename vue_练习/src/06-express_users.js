//1.R(read)查询所有记录
// GET /users -> [{}, {}]

// 2.R(read)查询单个记录 ById 根据id查询
// GET /users/:id -> {id:1,xxxx}

const express = require('express')
const app = express()

const data = [
  { id: 1, username: 'xiaoming', age: 20 },
  { id: 2, username: 'xiaomei', age: 18 },
  { id: 3, username: 'xiaopan', age: 2 },
]

app.get('/users', (req, res) => {
  res.send(data)
})

// 法1
// app.get('/users/:id', (req, res) => {
//   console.log(req.params)
//   // res.send(req.params)
//   data.forEach((item) => {
//     if (item.id == req.params.id)
//       res.send(item)
//   })
//   res.status(404).send('404 Not Found')
// })

// 法2
// app.get('/users/:id', (req, res) => {
//   const { id } = req.params

//   for (item of data) {
//     if (item.id == id) {
//       return res.send(item)
//     }
//   }
// })

// 法3：
app.get('/users/:id', (req, res) => {
  const { id } = req.params

  const newData = data.filter((item) => item.id == id)

  newData[0] ? res.send(newData[0]) : res.status(404).send('Not Found')
})

// GET /users?min=18 ->[{}]
app.get('/users', (req, res) => {
  const { min, max } = req.query
  if (min) {
    res.send(data.filter((item) => item.age >= min))
  } else {
    res.send(data)
  }
  res.send('hello')
})

app.listen(3000)