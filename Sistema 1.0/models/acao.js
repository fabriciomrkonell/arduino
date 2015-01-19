module.exports = function(sequelize, DataTypes) {
  var Acao = sequelize.define('Acao', {
    statusOrigem: {
      type: DataTypes.STRING
    },
    statusDestino: {
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        Acao.belongsTo(models.Sensor, { as: "sensorOrigem"});
        Acao.belongsTo(models.Sensor, { as: "sensorDestino"});
        Acao.belongsTo(models.User, { as: "usuario"});
      }
    }
  })

  return Acao
}
