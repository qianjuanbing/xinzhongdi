const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {

  res.writeHeader(200, {
    'Content-Type': 'text/html;charset=utf-8'
  })
  res.end('<h1>你好，世界</h1>')
})

server.listen(3000)