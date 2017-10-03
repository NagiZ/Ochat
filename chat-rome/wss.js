const koa = require('koa')
const WebSocket = require('ws')
// const rm = require('./reqmethods');
const Router = require('koa-router')
const bdp = require('koa-bodyparser')
const url = require('url')
const qs = require('querystring')
const nunjucks = require('nunjucks')
const serve = require('koa-static')
const WebSocketServer = WebSocket.Server

process.env.NODE_ENV = 'production'
const router = new Router()
const app = new koa()
app.use(serve(__dirname + '/dist'))
app.use(router.routes())
let server = app.listen(3000)
let wss = new WebSocketServer({
	server: server,
	host: '0.0.0.0'
})

app.use(bdp())
router.get('/', async (ctx, next) => {
  // ctx.request.url = './asd.html'
  await next()
})

router.get('/idd', async (ctx, next) => {
  ctx.response.type = 'text/html'
  ctx.response.body = '<p>dsafdsfdsafd</p>'
  await next()
})
router.get('/login/check', async (ctx, next) =>{
  var query = ctx.request.query
  var data = JSON.stringify({name: query.name, email: query.email, passwd: query.password})
  ctx.response.type = 'application/json'
  ctx.response.body = data
  await next()
})

wss.broadcastToAll = function(data){
  wss.clients.forEach(function(client){
    client.send(data)
  })
};

wss.broadcastToSpeClients = function(data, userArr){
  wss.clients.forEach(function(client){
    for(var val of userArr){
      if(client.user.id == val){
        client.send(data)
      }
    }
  })
}

wss.on('connection', function (ws) {
  console.log('connection!')
  ws.send('connecion established!')
  ws.on('message', function (msg) {
    wss.broadcastToAll(msg)
  })
})