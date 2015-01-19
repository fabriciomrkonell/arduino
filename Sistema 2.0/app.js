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
  , users = require('./routes/user')
  , login = require('./routes/login')
  , token = require('./routes/token')
  , nodemailer = require('nodemailer')

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

app.get('/schroeder/users/info', naoAutenticado, function(req, res, next){
  res.json({
    id: req.user.id,
    nome: req.user.nome,
    email: req.user.email,
    password: req.user.password
  });
});

app.get('/schroeder/token', naoAutenticado, token.findAll)

// Retorno de páginas
app.get('/views/user/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/user/index.html', { user: req.user });
});

app.get('/views/historico/:page', naoAutenticado, function(req, res, next){
  res.sendfile('public/views/historico/index.html', { user: req.user });
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
  res.sendfile('public/views/arduino/index.html', { user: req.user });
});

app.get('/medicoes', naoAutenticado, token.findAll)

app.get('/create', function(req, res, next){
  if(req.param('temperatura') != "" && req.param('temperatura') != null){
    if(req.param('humidade') != "" && req.param('humidade') != null){
      db.Token.find({ where: { token: req.param('token') } }).success(function(entity) {
        if (entity) {
          var medida = {
            temperature: req.param('temperatura'),
            humidity: req.param('humidade'),
            TokenId: entity.id,
            createdAt: new Date(),
            updateAt: new Date(),
          };
          io.emit('new-medicao', medida);
          if(parseInt(req.param('temperatura')) > 22){
            mailOptions.html = '<h1>Sensor ' + entity.descricao + '</h1><br>';
            mailOptions.html = mailOptions.html + '<h2>Temperatura ' + req.param('temperatura') + '</h2><br>';
            mailOptions.html = mailOptions.html + '<h2>Humidade ' + req.param('humidade') + '</h2>';
            transporter.sendMail(mailOptions);
            res.send("Enviando email!")
          }else{
            res.send("Sensores normais!")
          }
        } else {
          res.send("Sensor não encontrado!")
        }
      })
    }else{
      res.send("Parâmetros humidade inválidos!")
    }
  }else{
    res.send("Parâmetros temperatura inválidos!")
  }
});

app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

app.post('/schroeder/login',
  passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  function(req, res, next) {
    res.json({ success: 1})
});

app.post('/schroeder/users', users.newUser)

app.post('/schroeder/token', naoAutenticado, token.newToken)

app.put('/schroeder/users/:id', naoAutenticado, users.update)

app.del('/schroeder/users/:id', naoAutenticado, users.destroy)

app.del('/schroeder/token/:id', naoAutenticado, token.destroy)

if ('development' === app.get('env')) {
  app.use(errorHandler())
}

var transporter = nodemailer.createTransport("SMTP", {
  service: 'Gmail',
  auth: {
    user: 'email',
    pass: 'senha'
  }
});

var mailOptions = {
  from: 'fabricioronchii@gmail.com',
  to: 'fabricioronchii@gmail.com',
  subject: 'Sensor - Alteração',
  text: ''
};

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