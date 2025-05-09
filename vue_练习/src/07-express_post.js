const express = require('express')

const app = express()

const db = [
  { id: 1, username: 'xiaoming', age: 20 },
  { id: 2, username: 'xiaomei', age: 18 },
  { id: 3, username: 'xiaopan', age: 2 },
]

app.post('/users', function (req, res) {
  let postData = ''
  req.on('data', (data) => (postData += data))
  req.on('end', () => {
    console.log(postData)
    const obj = JSON.parse(postData)
    db.push(obj)  //将新增数据添加到db
    console, log(db)
    res.send(obj)
  })
})



// 更新
app.put('/users/:id', (req, res) => {
  const { id } = req.params
  let postData = ''
  req.on('data', (data) => (postData += data))
  req.on('end', () => {
    const body = JSON.parse(postData)
    for (let item of db) {
      if (item.id == id) {
        item.username = body.username
        item.age = body.age
        console.log(db)

        return res.send({
          id: item.id,
          username: item.username,
          age: item.age
        })
      }
    }
    res.status(404).send('Not Found')
  })
})

// 删除
app.delete('users/:id', (req, res) => {
  const { id } = req.params
  for (let index in db) {
    if (db[index].id == id) {
      db.splice(index, 1)

      console.log(db)
      return res.status(204)
    }
  }
  return res.status(404).send('Not Found')
})

app.listen(3000)