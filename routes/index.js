var express = require('express');
//passport para el authentication
var passport = require('passport');
//load el modelo que cree con mongoose
var Account = require('../models/account');
//Extiendo express para usar el router
var router = express.Router();

//Estoy pasando como data la variable user que se encuentra en el request object req.user
//La data user que va a ser disponible en el template, si está el template va a ser algo
//if (!user) {...}
router.get('/', function (req, res) {
  res.render('index', {
    user: req.user,
    message: req.flash('info'),
    messageSuccess: req.flash('infoSuccess')
  });
});

router.get('/register', function(req, res) {
  if(req.user){
    req.flash('info', 'Already registered BEEYATCH!')
    res.redirect('/')
  } else {
    res.render('register', { });
  }
});

//Este post de register debe ser algo parecido algo signup
//El programa busca en la base de datos si ya el email está
//Si es nuevo, crea un usuario nuevo y lo salva en la base de datos utilizando el modelo.
router.post('/register', function(req, res, next) {
    //No sé de donde sale el .register pero estoy creando una nueva instancia de la clase Account
    //new Account coge tres parámetros, el username, el password y un callback
    //Accede los valores del username y password del request.body (Gracias a body parser)
    //Y los valores de name en el form
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.render('register', { error : err.message });
      }

      passport.authenticate('local')(req, res, function () {
        req.session.save(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('infoSuccess', 'Succesfull registration!');
            res.redirect('/');
        });
      });

    });
});

router.get('/login', function(req, res) {
  if(req.user){
    req.flash('info', 'Already logged in BEEYATCH!');
    res.redirect('/');
  } else {
    res.render('login', {user : req.user});
  }
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    req.flash('infoSuccess', 'Succesfull login!');
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
