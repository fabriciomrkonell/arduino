module.exports = function(sequelize, DataTypes) {
  var Token = sequelize.define('Token', {
    descricao: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    },
  })

  return Token
}
