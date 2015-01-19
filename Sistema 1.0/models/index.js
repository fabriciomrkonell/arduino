var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , db        = {}

  if (process.env.HEROKU_POSTGRESQL_PURPLE_URL) {
    var match = process.env.HEROKU_POSTGRESQL_PURPLE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    var sequelize = new Sequelize(match[5], match[1], match[2], {
      dialect: 'postgres',
      protocol: 'postgres',
      port: match[4],
      host: match[3],
      loggin: false
    });

  } else {
    var sequelize = new Sequelize('arduino', 'root', 'root', {
      dialect: 'mysql'
    });
  }

var User   = sequelize.import(__dirname + "/user")
  , Log      = sequelize.import(__dirname + "/log")

User.belongsTo(Log)
Log.belongsTo(User)

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) == '.js'))
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate != undefined) {
    db[modelName].associate(db)
  }
})

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)
