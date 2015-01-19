var db = require('../models')

exports.findAll = function(req, res, next) {
  db.Acao.findAll({ include: [ { model: db.Sensor, as: "sensorOrigem" }, { model: db.Sensor, as: "sensorDestino" }], where: { usuarioId: req.user.id } }).success(function(entities) {
    res.json(entities)
  })
}

exports.find = function(req, res, next) {
  db.Acao.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      res.json(entity)
    } else {
      res.send(404)
    }
  })
}

exports.newAcao = function(req, res, next) {
  db.Acao.find({ where: { sensorDestinoId: req.body.sensorDestino, sensorOrigemId: req.body.sensorOrigem } }).success(function(entity) {
    if (entity) {
      res.send({ error: 2, message: "Ação já cadastrada!" })
    } else {
      var acao = req.body;
      acao.sensorDestinoId = req.body.sensorDestino;
      acao.sensorOrigemId = req.body.sensorOrigem;
      acao.usuarioId = req.user.id;
      db.Acao.create(acao).success(function(entity) {
        res.json({ error: 0, message: "Salvo com sucesso!" })
      });
    }
  })
}

exports.update = function(req, res, next) {
  db.Acao.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      db.Acao.find({ where: { email: req.body.email } }).success(function(entity) {
        if (entity && entity.id != req.param('id')) {
          res.send({ error: 2, message: "Usuário já cadastrado!" })
        }else{
          entity.updateAttributes(req.body).success(function(entity) {
            res.json({ error: 0, message: "Salvo com sucesso!" })
          })
        }
      });
    } else {
      res.send(404)
    }
  })
}

exports.destroy = function(req, res, next) {
  db.Acao.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}
