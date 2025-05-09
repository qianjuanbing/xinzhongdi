const express = require('express')
const app = express()

const db = [
  { id: 1, name: 'iphone', price: '5299', number: '10' },
  { id: 2, name: 'MacBookpro M1', price: '11999', number: '20' },
  { id: 3, name: 'iPad pro', price: '4899', number: '30' },
]

app.get('/goods/:id', (req, res) => {
  const { id } = req.params
  const newData = db.filter((item) => item.id == id)

  newData[0] ? res.send(newData[0]) : res.status(404).send('Not Found')
})

app.listen(3000)

// 
app.post('/goods', (req, res) => {
  let postData = ''
  req.on('data', (data) => {
    postData += data
  })
  req.on('end', () => {
    console.log(postData)
    const obj = JSON.parse(postData)
    db.push(obj)
    console.log(db)
    res.send(obj)
  })
})

// 更新
app.put('/goods/:id', (req, res) => {
  const { id } = req.params
  let postData = ''
  req.on('data', (dat) => (postData += data))
  req.on('end', () => {
    const body = JSON.parse(postData)
    for (let item of db) {
      if (item.id == id) {
        item.name = body.name
        item.price = body.price
        item.number = body.number

        console.log(db)

        return res.send({
          id: item.id,
          name: item.name,
          price: item.price,
          number: item.number
        })
      }
    }
    res.status(404).send('Not Found')
  })
})

// 删除
app.delete('/goods/:id', (req, res) => {
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