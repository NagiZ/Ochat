const db = require('../db.js')
const pcrypto = require('../schemamds.js').pct

var User = db.defineModel('user', {
  email: {
    type: db.STRING(100),
    unique: true
  },
  name: db.STRING(100),
  password: db.STRING(100),
  currentRoomId: db.STRING(50),
  online: db.BOOLEAN,
  gender: db.BOOLEAN
})

User.findByEmail = async function (email) {
  var result = await this.findOne({
    where: {
      email: email
    }
  })
  return result
}

User.beforeCreate(function(obj){
  obj.password = pcrypto(obj.password, 'users')
})

User.createItem = async function (obj) {
  var item = await this.create({
    email: obj.email,
    name: obj.name,
    password: obj.password,
    currentRoomId: 0,
    online: true,
    gender: false
  })
  return item
}

User.findByRoomId = async function (roomid, tag) {
  var result = null
  if (!tag) {
    result = await this.findAll({
      where: {
        currentRoomId: roomid
      }
    })
  }else {
    result = await this.findAll({
      where: {
        currentRoomId: roomid,
        online: tag
      }
    })
  }
  return result
}

User.updateItem = async function(obj){
    console.log(obj.token)
    await this.update(obj, {
    where: {
      id: obj.token
    }
  })
}

module.exports = User