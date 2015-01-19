module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    nome: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  })

  return User
}
