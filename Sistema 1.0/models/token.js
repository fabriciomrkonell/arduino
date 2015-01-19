module.exports = function(sequelize, DataTypes) {
  var Token = sequelize.define('Token', {
    descricao: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        Token.belongsTo(models.User, { as: "usuario"});
      }
    }
  })

  return Token
}
