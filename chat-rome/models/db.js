const Sequelize = require('sequelize')
const config = require('./config.js')
const uuid = require('uuid/v4')

function generateID () {
  return uuid()
}

var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 100,
    min: 0,
    idle: 10000
  }
})

const ID_TYPE = Sequelize.STRING(50)

function defineModel (name, attributes) {
  var attrs = {}
  for (let key in attributes) {
    var value = attributes[key]
    if (typeof value == 'object' && value['type']) {
      value.allowNull = value.allowNull || false
      attrs[key] = value
    }else {
      attrs[key] = {
        type: value,
        allowNull: false
      }
    }
  }
// default setting
  attrs.id = {
    type: ID_TYPE,
    primaryKey: true
  }
  attrs.createAt = {
    type: Sequelize.BIGINT,
    allowNull: false
  }
  attrs.updateAt = {
    type: Sequelize.BIGINT,
    allowNull: false
  }
  attrs.version = {
    type: Sequelize.BIGINT,
    allowNull: false
  }

// return define model
  return sequelize.define (name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeValidate: function (obj) {
        let now = Date.now()
        if (obj.isNewRecord) {
          console.log(`Will create entity ${obj}`)
          if (!obj.id) {
            obj.id = generateID()
          }
          obj.createAt = now
          obj.updateAt = now
          obj.version = 0
        }else {
          console.log(`Will update entity ${obj}`)
          obj.updateAt = now
          obj.version++
        }
      }
    }
  })
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'BOOLEAN']

var exp = {
  defineModel: defineModel,
  sync: () => {
    if (process.env.NODE_ENV !== 'production') {
      return sequelize.sync({force: true})
    }else {
      try{
        return sequelize.sync({force: false})
      }catch (err) {
        console.log(err)
      }finally {
        console.log('Cannot sync when NODE_ENV is not production')
      }
    }
  }
}

for (let type of TYPES) {
  exp[type] = Sequelize[type]
}
exp.ID = ID_TYPE
exp.generateID = generateID

module.exports = exp