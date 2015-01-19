module.exports = function(sequelize, DataTypes) {
  var Log = sequelize.define('Log', {
    descricao: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Log.belongsTo(models.User)
      }
    }
  })

  return Log
}
