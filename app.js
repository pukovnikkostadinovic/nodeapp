const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlibreman',
  database: 'beer'
});

connection.connect();



mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to MongoDB');
});

db.on('error', function (err) {
  console.log(err);
});

const app = express();

let Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '['+ namespace.shift() + ']';
        }
        return {
          param: formParam,
          msg: msg,
          value: value
        };
  }
}));

//passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res, next){
  res.locals.user = req.user || null;
  next();
});

app.get('/', function(req,res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }else{
      res.render('index',{
        title:'Articles',
        articles:articles
      });
    }
  });
});
app.get('/arduino', function(req, res){
  let query = 'select t.ime_komponente, sum(k.kolicina) kolicina from komponente t, komp_lok_kol k where t.id=k.komp_id group by t.ime_komponente';
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('komponente',{
      rows:rows
    });
  });
  //connection.end();
});

app.get('/arduino/kategorije', function(req, res){
  let query = 'select id, ime_kategorije from kategorije_komponenti';
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('kategorije',{
      rows:rows
    });
  });

});

app.get('/arduino/kategorije/:id', function(req, res){
  let query = 'select t.id, t.ime_komponente, sum(k.kolicina) kolicina from komponente t, komp_lok_kol k where t.id=k.komp_id and t.kateg_id ='+req.params.id+' group by t.id,t.ime_komponente';
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('komponente1',{
      rows:rows
    });
  });

});

app.get('/arduino/kategorije/komp/:id', function(req, res){
  let query = 'select t.ime_komponente, t.kratak_opis_komp, t.kateg_id, k.kolicina, l.ime_lokacije from komponente t, komp_lok_kol k, lokacije l where t.id=k.komp_id and l.id=k.lok_id and t.id='+req.params.id;
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('komponente2',{
      rows:rows
    });
  });

});

let articles=require('./routes/articles');
let users=require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);
//connection.end();
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
