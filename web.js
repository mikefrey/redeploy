const http = require('http')
const fs = require('fs')
const Path = require('path')

const html = fs.readFileSync(Path.join(__dirname, 'html.html'))

let statusMessages = []

// ROUTES

function root(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
}

function deploy(req, res) {
  server.setStatus('deploying')
  server.emit('deploy')
  res.end('{}')
}

function status(req, res) {
  let data
  try {
    data = JSON.stringify(statusMessages)
  } catch(ex) {
    res.writeHead(500)
    res.end('Error stringifying JSON')
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(data)
}

const routes = [
  { path: '/', method: 'GET', handler: root },
  { path: '/deploy', method: 'POST', handler: deploy },
  { path: '/status', method: 'GET', handler: status }
]

// ROUTER

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

// SERVER

const server = http.createServer(router)

server.setStatus = function(type, err) {
  statusMessages.push({ type, err, timestamp: new Date() })
  const len = statusMessages.length
  statusMessages = statusMessages.slice(Math.max(len-100, 0))
}

// EXPORTS

exports.start = function(config) {
  server.listen(config.port, config.host)
  return server
}
