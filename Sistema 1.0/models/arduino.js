module.exports = function(sequelize, DataTypes) {
  var Arduino = sequelize.define('Arduino', {
    temperature: {
      type: DataTypes.FLOAT
    },
    humidity: {
      type: DataTypes.FLOAT
    },
  })
  return Arduino
}
