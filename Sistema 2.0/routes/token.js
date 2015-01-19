var db = require('../models')

exports.findAll = function(req, res, next) {
  db.Token.findAll().success(function(entities) {
    res.json(entities)
  })
}

exports.newToken = function(req, res, next) {
  db.Token.find({ where: { descricao: req.body.descricao } }).success(function(entity) {
    if (entity) {
      res.send({ error: 2, message: "Token já cadastrado!" })
    } else {
      var token = req.body;
      token.token = getToken();
      token.usuarioId = req.user.id;
      db.Token.create(token).success(function(entity) {
        res.json({ error: 0, message: "Salvo com sucesso!" })
      });
    }
  })
}

exports.update = function(req, res, next) {
  db.Token.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      db.Token.find({ where: { email: req.body.email } }).success(function(entity) {
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
  db.Token.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}

function getToken(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}