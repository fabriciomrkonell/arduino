var db = require('../models')

exports.logar = function(req, res, next) {
  db.User.find({ where: { email: req.body.email, password: req.body.password } }).success(function(entity) {
    if (entity) {
      res.json({ success: 1})
    } else {
      res.json({ error: "Usuário inválido!"})
    }
  })
}
