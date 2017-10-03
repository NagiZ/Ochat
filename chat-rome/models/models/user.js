const db = require('../db.js')

module.exports = db.defineModel('user', {
  email: {
    type: db.STRING(100),
    unique: true
  },
  name: db.STRING(100),
  password: db.STRING(100),
  gender: db.BOOLEAN
})