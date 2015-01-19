var db = require('../models')

exports.findAll = function(req, res, next) {
  db.User.findAll().success(function(entities) {
    res.json(entities)
  })
}

exports.find = function(req, res, next) {
  db.User.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      res.json(entity)
    } else {
      res.send(404)
    }
  })
}

exports.newUser = function(req, res, next) {
  db.User.find({ where: { email: req.body.email } }).success(function(entity) {
    if (entity) {
      res.json({ error: "Usuário já cadastrado!"})
    } else {
      var usuario = req.body;
      usuario.type = "1";
      db.User.create(usuario).success(function(entity) {
        res.statusCode = 201
        res.json(entity)
      }).error(function(error, e){
      });
    }
  })
}

exports.update = function(req, res, next) {
  db.User.find({ where: { id: req.param('id') } }).success(function(entityUser) {
    if (entityUser) {
      db.User.find({ where: { email: req.body.email } }).success(function(entity) {
        if (entity && entity.id != req.param('id')) {
          res.send({ error: 2, message: "Usuário já cadastrado!" })
        }else{
          entityUser.updateAttributes(req.body).success(function(entity) {
            res.send({ error: 0, message: "Salvo com sucesso!" })
          })
        }
      });
    } else {
      res.send(404)
    }
  })
}

exports.destroy = function(req, res, next) {
  db.User.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}
