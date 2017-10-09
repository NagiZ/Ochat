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
    gender: false
  })
  return item
}

module.exports = User