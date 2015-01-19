var express        = require('express')
  , app            = express()
  , http           = require('http').Server(app)
  , bodyParser     = require('body-parser')
  , errorHandler   = require('errorhandler')
  , methodOverride = require('method-override')
  , path           = require('path')
  , db             = require('./models')
  , passport = require('passport')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy
  , arduinos = require('./routes/arduino')
  , users = require('./routes/user')
  , login = require('./routes/login')
  , acao = require('./routes/acao')
  , log = require('./routes/log')
  , sensor = require('./routes/sensor')
  , token = require('./routes/token')

app.set('port', process.env.PORT || 3000)
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))

// Configurações
app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'schroeder-arduino' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

// Procurar usuário pelo Id
function findById(id, fn) {
  db.User.find({ where: { id: id } }).success(function(entity) {
    if (entity) {
      fn(null, entity);
    } else {
      fn(new Error(id));
    }
  });
}

// Procurar usuário pelo Nome
function findByUsername(username, fn) {
  db.User.find({ where: { email: username } }).success(function(entity) {
    if (entity) {
      return fn(null, entity);
    } else {
      return fn(null, null);
    }
  });
}

function naoAutenticado(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send({ error: 1 });
}

function naoAutenticadoHome(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

// Configurações autenticação
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user == null) {
          return done(null, null);
        }
        return done(null, user);
      })
    });
  }
));

app.get('/', function(req, res, next){
  res.sendfile('public/index.html', { user: req.user, message: req.flash('error') });
});

app.get('/home', naoAutenticadoHome, function(req, res, next){
  res.sendfile('public/home.html', { user: req.user });
});

app.get('/schroeder/configuracoes/:token', sensor.getConfiguracoes)

app.get('/schroeder/users/info', naoAutenticado, function(req, res, next){
  res.json({
    id: req.user.id,
    nome: req.user.nome,
    email: req.user.email,
    password: req.user.password
  });
});

app.get('/schroeder/acao', naoAutenticado, acao.findAll)

app.get('/schroeder/token', naoAutenticado, token.findAll)

app.get('/schroeder/sensores', naoAutenticado, function(req, res, next){
  io.autenticarSocket(req.user);
  sensor.findAll(req, res, next);
});

app.get('/schroeder/medicoes', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  arduinos.findAll(req, res, next);
});

app.get('/schroeder/logs/', naoAutenticado, log.findAll)


// Retorno de páginas
app.get('/views/user/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/user/index.html', { user: req.user });
});

app.get('/views/sensor/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/sensor/index.html', { user: req.user });
});

app.get('/views/sensor/new/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/sensor/new/index.html', { user: req.user });
});

app.get('/views/token/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/token/index.html', { user: req.user });
});

app.get('/views/token/new/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/token/new/index.html', { user: req.user });
});

app.get('/views/home/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/home/index.html', { user: req.user });
});

app.get('/views/arduino/temporeal/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/arduino/temporeal/index.html', { user: req.user });
});

app.get('/views/arduino/sensores/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/arduino/sensores/index.html', { user: req.user });
});

app.get('/views/log/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/log/index.html', { user: req.user });
});

app.get('/views/acao/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/acao/index.html', { user: req.user });
});

app.get('/views/acao/new/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/acao/new/index.html', { user: req.user });
});

app.get('/schroeder/medicoes/last', naoAutenticado, arduinos.findLast)

app.get('/schroeder/autenticar/:password', function(req, res, next){
  db.User.find({ where: { password: req.param('password') } }).success(function(entityUser) {
    if (entityUser) {
      db.Sensor.find({ where: { favorito: true, usuarioId: entityUser.id } }).success(function(entity) {
        if (entity) {
          var _log;
          if(!entity.status){
            _log = { UserId: entityUser.id, descricao: entity.on };
          }else{
            _log = { UserId: entityUser.id, descricao: entity.off };
          }
          entity.status = !entity.status;
          entity.updateAttributes(entity).success(function(entity) {
            db.Log.create(_log).success(function(entityLog) {
              io.emit('new-log', entityLog, entityUser);
              io.to(entity.usuarioId).emit('update-sensor', entity);
              db.Sensor.findAll().success(function(entities) {
                var retorno = "";
                for(var i = 0; i < entities.length; i++){
                  retorno = retorno + entities[i].id + "-" + entities[i].status + ";";
                }
                if(entities.length > 0){
                  res.send('<' + retorno + '>')
                }else{
                  res.send(retorno)
                }
              })
            });
          })
        } else {
          res.send("f")
        }
      });
    } else {
      res.send("d")
    }
  })
});

app.get('/schroeder/create', function(req, res, next){
  arduinos.createGet(req, res);
  io.emit('new-medicao', {
    temperature: req.param('temperatura'),
    humidity: req.param('humidade'),
    createdAt: new Date(),
    updateAt: new Date(),
  });
});

app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

app.post('/schroeder/login',
  passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  function(req, res, next) {
    db.Log.create({ UserId: req.user.id, descricao: "Logou no sistema" }).success(function(entityLog) {
      res.json({ success: 1})
    });
});

app.post('/schroeder/users', users.newUser)

app.post('/schroeder/token', naoAutenticado, token.newToken)

app.post('/schroeder/acao', naoAutenticado, acao.newAcao)

app.post('/schroeder/sensor', naoAutenticado, sensor.newSensor)

app.post('/schroeder/arduinos', naoAutenticado, arduinos.create)

app.put('/schroeder/sensor/:id', naoAutenticado, function(req, res, next){
  db.Sensor.find({ where: { id: req.param('id'), usuarioId: req.user.id } }).success(function(entity) {
    if (entity) {
      db.User.find({ where: { password: req.user.password } }).success(function(entityUser) {
        if (entityUser) {
          var _log;
          if(!entity.status){
            _log = { UserId: entityUser.id, descricao: entity.on };
          }else{
            _log = { UserId: entityUser.id, descricao: entity.off };
          }
          entity.status = !entity.status;
          entity.updateAttributes(entity).success(function(entity) {
            db.Log.create(_log).success(function(entityLog) {
              if(req.user){
                io.to(req.user.id).emit('new-log', entityLog, entityUser);
                io.to(req.user.id).emit('update-sensor', entity);
              }
              res.json({ error: 0, message: "Salvo com sucesso!", entity: entity })
            });
          })
        } else {
          res.send({ error: 2, message: "Usuário não cadastrado!" })
        }
      });
    } else {
      res.send({ error: 2, message: "Sensor não cadastrado!" })
    }
  })
});

app.put('/schroeder/users/:id', naoAutenticado, users.update)

app.put('/schroeder/sensor/favorito/:id', naoAutenticado, sensor.updateFavorito)

app.del('/schroeder/arduinos/:id', naoAutenticado, arduinos.destroy)

app.del('/schroeder/users/:id', naoAutenticado, users.destroy)

app.del('/schroeder/token/:id', naoAutenticado, token.destroy)

app.del('/schroeder/sensor/:id', naoAutenticado, sensor.destroy)

app.del('/schroeder/acao/:id', naoAutenticado, acao.destroy)

if ('development' === app.get('env')) {
  app.use(errorHandler())
}

var io = null;

db.sequelize.sync({ force: false }).complete(function(err) {
  if (err) {
    throw err
  } else {
    http.listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'))
    });
    io = require('socket.io')(http);
    io.autenticarSocket = function(data){};
    io.on('connection', function (socket) {
      io.autenticarSocket = function(data){
        socket.join(data.id);
      };
    });
  }
})