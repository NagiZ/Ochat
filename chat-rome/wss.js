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
var schemamds = require('./models/schemamds.js')
var pcrypto = schemamds.pct
var cd = schemamds.cd
var pui = schemamds.pui

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
  if (!ctx.cookies.get('name')) {
    ctx.response.redirect('/login')
  }
  await next()
})

//登录
router.get('/signin', async (ctx, next) => {
  var query = ctx.request.query
  var data = {email: query.eMail, password: pcrypto(query.password, 'users'), avator: ''}
  var userin = await User.findByEmail(data.email)
  ctx.response.type = 'application/json'
  if (!userin) {
    errorInfo = {message: 'Invalid Email! 用户不存在！', code: '901' }
    ctx.response.body = JSON.stringify(errorInfo)
  }else {
    if (userin.password !== data.password) {
      errorInfo = {message: 'Password Error! 密码错误', code: '902'}
      ctx.response.body = JSON.stringify(errorInfo)
    }else {
      ctx.cookies.set('token', userin.id, {
        httpOnly: false,
        expires: new Date(2017, 9, 28, 20, 45, 30)
      })
      ctx.cookies.set('isLogin', true, {
        httpOnly: false,
        expires: new Date(2017, 9, 28, 20, 45, 30)
      })
      var objUp = {token: userin.id, online: true}
      await User.updateItem(objUp)
      delete data.password
      ctx.response.body = JSON.stringify(Object.assign({}, data, {code: '200', name: userin.name, token: userin.id, online: true}))
    }
  }
  await next()
})

//register
router.post('/signup', async (ctx, next) => {
  var postbody = ctx.request.body
  var data = {name: postbody.name, email: postbody.email, password: postbody.password}
  var newUser = await User.findByEmail(data.email)
  if (newUser) {
    errorInfo = {message: 'Register Error! 该邮箱已被注册！', code: '555'}
    ctx.response.type = 'application/json'
    ctx.response.body = JSON.stringify(errorInfo)
  }else {
    var u = await User.createItem(data)
    data = Object.assign({}, data, {code: '200', token: u.id, online: u.online})
    ctx.cookies.set('token', u.id, {
      httpOnly: false,
      expires: new Date(2017, 9, 24, 20, 30, 30)
    })
    ctx.cookies.set('isLogin', true, {
      httpOnly: false,
      expires: new Date(2017, 9, 24, 20, 30, 30)
    })
    ctx.response.type = 'application/json'
    ctx.response.body = JSON.stringify(data)
  }
  await next()
})

router.get('/roominfoget_userlist', async (ctx, next) => {
  var roomId = ctx.request.query.id
  var token = ctx.cookies.get('token')
  var objUp = {token: token, currentRoomId: roomId}
  console.log(roomId)
  await User.updateItem(objUp)
  var userList = await User.findByRoomId(roomId, true)
  userList.map((v) => {
    return pui(v)
  })
  console.log('enter channel!!!!!!!!!!!!!!')
  console.log(userList)
  var resData = {code: '200', rid: roomId, userList: userList}
  ctx.response.type = 'application/json'
  ctx.response.body = JSON.stringify(resData)
})

router.get('/login_out', async (ctx, next) => {
  ctx.response.type = 'application/json'
  try{
    var id = ctx.request.query.token
    if (id) {
      var obj = {token: id, online: false, currentRoomId: 0}
      await User.updateItem(obj)
      ctx.response.body = JSON.stringify({code: '200', message: 'Login out successfully!'})
    }else {
      ctx.response.body = JSON.stringify({code: '200', message: 'Reset successfully !'})
    }
  }catch(e) {
    console.log(e)
    ctx.response.body = JSON.stringify({code: '456', message: 'Unknown Error!'})
  }
})

router.get('/users/detail', async (ctx, next) => {
  var email = ctx.request.query.email
  var targetUser = pui(await User.findByEmail(email))
  var responseData = {code: '200', data: targetUser}
  ctx.response.type = 'application/json'
  ctx.response.body = JSON.stringify(responseData)
})

wss.broadcastToAll = function(data){
  wss.clients.forEach(function(client){
    client.send(data)
  })
};

// @param : userArr -> 从数据库获取的当前房间内的用户
wss.broadcastToSpeClients = function(data, wsobj){
  wss.clients.forEach(function(client){
    if(client.token !== wsobj.id && client.roomId === wsobj.rid){
      client.send(data)
    }
  })
}

wss.on('connection', function (ws) {
  console.log('connection!')
  ws.on('message', function (msg) {
    var msgobj = JSON.parse(msg)
    // console.log(msgobj);
    switch(msgobj.method){
      case 'login':
        ws.token = msgobj.data.token
        ws.email = msgobj.data.email
        console.log('ws.token=====' + ws.token)
        break
      case 'getInChannel':
        ws.roomId = msgobj.data.roomId
        var u = null;
        (async () => {
          u = await User.findByEmail(msgobj.data.email)
          console.log('iiiiiiiiiiiiiiiiiiiiii')
          console.log(u)
          var r = {method: 'getInChannel', data: pui(u)}
          wss.broadcastToSpeClients(JSON.stringify(r), {id: ws.token, rid: ws.roomId})
        })()
        console.log(ws.roomId)
        break
      case 'leaveChannel':
        var lr = {method: 'leaveChannel', data: {email: msgobj.data.email}}
        wss.broadcastToSpeClients(JSON.stringify(lr), {id: ws.token, rid: ws.roomId})
        break
      case 'sendMessage':
        (async () => {
          await Message.create({
            username: msgobj.data.from,
            roomid: msgobj.data.roomid,
            src: '',
            msg: msgobj.data.message
          })
        })();
        wss.broadcastToSpeClients(JSON.stringify(msgobj), {id: ws.token, rid: ws.roomId})
        break
      default: break
    }
  })
  ws.on('close', function () {
    console.log('ws close')
    var lr = {method: 'leaveChannel', data: {email: ws.email}}
    wss.broadcastToSpeClients(JSON.stringify(lr), {id: ws.token, rid: ws.roomId})
    var obj = {token: ws.token, online: false, currentRoomId: 0};
    (async () => {
      await User.updateItem(obj)
    })()
  })
})