var db = require('../models');
var sequelize = require('sequelize');

exports.findAll = function(req, res, next) {
  db.Sensor.findAll({ include: [ { model: db.User, as: "usuario" } ], where: { usuarioId: req.user.id } }).success(function(entities) {
    res.json(entities)
  })
}

exports.find = function(req, res, next) {
  db.Sensor.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      res.json(entity)
    } else {
      res.send(404)
    }
  })
}

exports.newSensor = function(req, res, next) {
  db.Sensor.count({ where: { usuarioId: req.user.id } }).success(function(result) {
    var favorito = false;
    if(parseInt(result) == 0){
      var favorito = true;
    }
    db.Sensor.find({ where: { nome: req.body.nome, usuarioId: req.user.id } }).success(function(entity) {
      if (entity) {
        res.send({ error: 2, message: "Sensor já cadastrado!" })
      } else {
        var sensor = req.body;
        sensor.status = false;
        sensor.favorito = favorito;
        sensor.usuarioId = req.user.id;
        db.Sensor.create(sensor).success(function(entity) {
          res.json({ error: 0, message: "Salvo com sucesso!" })
        }).error(function(error, e){
        });
      }
    })
  })
}

exports.getConfiguracoes = function(req, res, next) {
  db.Token.find({ where: { token: req.param('token') }}).success(function(entity) {
    if(entity){
      db.Sensor.findAll({ order: 'id ASC', where: { usuarioId: entity.usuarioId } }).success(function(entities) {
        var retorno = "";
        for(var i = 0; i < entities.length; i++){
          retorno = retorno + entities[i].id + "-" + entities[i].status + ";";
        }
        if(entities.length > 0){
          res.json('<' + retorno + '>')
        }else{
          res.json("");
        }
      })
    }else{
      res.json("");
    }
  });
}

exports.updateFavorito = function(req, res, next) {
  db.Sensor.update({favorito: false}, { where: { usuarioId: req.user.id }}).success(function(status) {
    db.Sensor.find({ where: { id: req.param('id') } }).success(function(entitySensor) {
      if (entitySensor) {
        req.body.favorito = !req.body.favorito;
        entitySensor.updateAttributes(req.body).success(function(entity) {
          db.Sensor.findAll({ include: [ { model: db.User, as: "usuario" } ], where: { usuarioId: req.user.id } }).success(function(entities) {
            res.json(entities)
          })
        })
      } else {
        res.send({ error: 0, message: "Sensor não encontrado!" })
      }
    })
  });
}

exports.destroy = function(req, res, next) {
  db.Acao.destroy({ where:
    sequelize.or( { "sensorOrigemId": req.param('id') },
    sequelize.or( { "sensorDestinoId": req.param('id') }))
  }).success(function(){
    db.Sensor.find({ where: { id: req.param('id') } }).success(function(entitySensor) {
      if (entitySensor) {
        entitySensor.destroy().success(function() {
          res.send(204)
        })
      } else {
        res.send(404)
      }
    })
  });
}