var db = require('../models')

exports.findAll = function(req, res, next) {
  db.Arduino.findAll().success(function(entities) {
    res.json(entities)
  })
}

exports.findAllPager = function(req, res, next) {
  db.Arduino.findAll({ offset:3, limit: 1 }).success(function(entities) {
    retorno.dados = entities;
    res.json(retorno)
  })
}

exports.findLast = function(req, res, next) {
  db.Arduino.findAll({ limit: 1, order: 'id DESC'}).success(function(entity) {
    res.json(entity)
  })
}

exports.find = function(req, res, next) {
  db.Arduino.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      res.json(entity)
    } else {
      res.send(404)
    }
  })
}

exports.create = function(req, res, next) {
  db.Arduino.create(req.body).success(function(entity) {
    res.statusCode = 201
    res.json(entity)
  })
}

exports.createGet = function(req, res, next) {
  var medida = {
    id: "",
    temperature: req.param('temperatura'),
    humidity: req.param('humidade'),
    createdAt: new Date(),
    updateAt: new Date(),
  };
  db.Arduino.create(medida).success(function(entity) {
    res.statusCode = 201
    res.json(entity)
  })
}

exports.update = function(req, res, next) {
  db.Arduino.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.updateAttributes(req.body).success(function(entity) {
        res.json(entity)
      })
    } else {
      res.send(404)
    }
  })
}

exports.destroy = function(req, res, next) {
  db.Arduino.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}
