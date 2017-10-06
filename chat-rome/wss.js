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
const User = require('./models/models/user.js')
const Message = require('./models/models/message.js')
var pcrypto = require('./models/schemamds.js').pct

process.env.NODE_ENV = 'production'
const router = new Router()
const app = new koa()
app.use(serve(__dirname + '/dist'))
app.use(bdp())
app.use(router.routes())
let server = app.listen(3000)
let wss = new WebSocketServer({
	server: server,
	host: '0.0.0.0'
})

let errorInfo = {}

router.get('/', async (ctx, next) => {
  await next()
})

router.get('/idd', async (ctx, next) => {
  ctx.response.type = 'text/html'
  ctx.response.body = '<p>dsafdsfdsafd</p>'
  await next()
})
router.get('/signin', async (ctx, next) => {
  var query = ctx.request.query
  var data = {email: query.email, password: pcrypto(query.password, 'users'), avator: ''}
  var userin = await User.findByEmail(data.email)
  console.log(userin)
  ctx.response.type = 'application/json'
  if (!userin) {
    errorInfo = {message: 'Invalid Email! 用户不存在！', code: '901' }
    console.log(errorInfo)
    ctx.response.body = JSON.stringify(errorInfo)
  }else {
    if (userin.password !== data.password) {
      errorInfo = {message: 'Password Error! 密码错误', code: '902'}
      console.log(errorInfo)
      ctx.response.body = JSON.stringify(errorInfo)
    }else {
      ctx.cookies.set('token', userin.id, {
        httpOnly: false
      })
      ctx.response.body = JSON.stringify(Object.assign({}, data, {code: '200', name: userin.name}))
      // ctx.response.redirect('/room')
    }
  }
  await next()
})
router.post('/signup', async (ctx, next) => {
  var postbody = ctx.request.body
  var data = {name: postbody.name, email: postbody.email, password: postbody.password}
  console.log(data)
  var newUser = await User.findByEmail(data.email)
  if (newUser) {
    errorInfo = {message: 'Register Error! 该邮箱已被注册！', code: '555'}
    ctx.response.type = 'application/json'
    ctx.response.body = JSON.stringify(errorInfo)
  }else {
    (async () => {
      var u = await User.create({
        email: data.email,
        name: data.name,
        password: data.password,
        gender: false
      })
    })()
    data = Object.assign({}, data, {code: '200'})
    ctx.cookies.set('token', u.id, {
      httpOnly: false
    })
    ctx.response.type = 'application/json'
    ctx.response.body = JSON.stringify(data)
  }
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
  ws.on('message', function (msg) {
    console.log('kaishi')
    console.log(msg)
    console.log('jieshu')
    var msgobj = JSON.parse(msg)
    console.log(msgobj);
    (async () => {
      await Message.create({
        username: msgobj.from,
        roomid: msgobj.roomid,
        src: '',
        msg: msgobj.message
      })
    })()
    wss.broadcastToAll(msg)
  })
})