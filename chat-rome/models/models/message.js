const db = require('../db.js')
const User = require('./user.js')

// src: for img
var message = db.defineModel('message', {
  username: db.STRING(100),
  src: db.STRING(100),
  roomid: db.STRING(50),
  msg: {
    type: db.STRING,
    defaultValue: ''
  },
  img: {
    type: db.STRING(100),
    defaultValue: ''
  },
  time: {
    type: db.STRING(100),
    defaultValue: Date.now()
  }
})

message.belongsTo(User, {foreignKey: 'userid', targetKey: 'id'})

module.exports = message