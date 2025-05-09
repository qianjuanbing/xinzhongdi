const http = require('http')

const server = http.createServer()

const BASE_URL = 'http://127.0.0.1:3000'

server.on("request", (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/html;charset=utf-8'
  })

  const url = new URL(req.url, BASE_URL)

  console.log(url.searchParams.get('name'))
  res.end('hello')
})

server.listen(3000, () => {
  console.log('server is running on http://127.0.0.1:3000')
})
