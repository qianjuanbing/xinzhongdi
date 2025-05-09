const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
  res.writeHead(200, {
    'Conttent-Type': 'text/html;charset=utf-8'
  })
  let post_data = ''
  req.on('data', (data) => {
    post_data += data
  })
  req.on('end', () => {
    console.log(post_data)
    const obj = JSON.parse(post_data)
    console.log(obj)
  })
  res.end('hello')
})
server.listen(3000, () => {
  console.log('server is runing on http://127.0.0.1:3000')
})