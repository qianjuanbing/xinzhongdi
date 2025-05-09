const http = require('http')

const url = require('url')
const server = http.createServer()

server.on('request', (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/html;charset=utf-8'
  })

  const { query, pathname } = url.parse(req.url, true)

  if (pathname == '/' || pathname == '/index') {
    if (req.method == 'GET') {
      console.log(query)
    } else if (req.method == 'POST') {
      let post_data = ''
      req.on('data', (data) => (post_data += data))
      req.on('end', () => {
        console.log(post_data)
        res.end(post_data)
      })
    }
  } else if (pathname == '/list') {
    res.end('列表页')
  } else {
    res.writeHead('404')
    res.end('Not Found')
  }
})

server.listen(3000)
console.log('server is running on localhost:3000')