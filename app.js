const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const socket = require('socket.io');
const EventEmitter = require('events')

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to MongoDB');
});

db.on('error', function (err) {
  console.log(err);
});

const app = express();
const events = new EventEmitter()


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




let articles=require('./routes/articles');
let users=require('./routes/users');
let arduino=require('./routes/arduino');
let beer=require('./routes/beer');
app.use('/articles',articles);
app.use('/users',users);
app.use('/arduino',arduino);
app.use('/beer', beer);
var server = app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
var io = socket(server);

io.on('connection', function(socket){
  console.log('made socket connection', socket.id);
  events.on('temperature', function(value1,value2){
    socket.emit('temperature', {
      temp1:value1,
      temp2:value2
    });
  });
});

setInterval(() => {
  const temperature1 = Math.round(Math.random() * 10)
  const temperature2 = Math.round(Math.random() * 10)
  //console.log('temp 1 je: '+temperature);
  events.emit('temperature', temperature1,temperature2)
}, 1000);
