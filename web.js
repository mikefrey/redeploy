const http = require('http')
const fs = require('fs')
const Path = require('path')

const html = fs.readFileSync(Path.join(__dirname, 'html.html'))

function root(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
}

function deploy(req, res) {
  server.emit('deploy')
  res.end('{}')
}

function status(req, res) {
  res.end('ok')
}

const routes = [
  { path: '/', method: 'GET', handler: root },
  { path: '/deploy', method: 'POST', handler: deploy },
  { path: '/status', method: 'GET', handler: status }
]

function router(req, res) {
  const now = Date.now()
  res.on('finish', () => console.log(`${req.method} ${res.statusCode} ${req.url} ${Date.now()-now}ms`))

  const route = routes.find(r => r.path == req.url && r.method == req.method)

  if (!route) {
    res.writeHead(404)
    return res.end('404 Not Found')
  }

  route.handler(req, res)
}

const server = http.createServer(router)

exports.start = function(config) {
  server.listen(config.port, config.host)
  return server
}
