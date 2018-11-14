const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/nodeapp');
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

app.get('/', function(req,res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }else{
      res.render('index',{
        title:'title',
        articles:articles
      });
    }
  });
});

app.get('/articles/add', function(req,res){
  res.render('add',{
    title:'title'
  });
});

app.post('/articles/add', function(req,res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body

  article.save(function(err){
    if(err){
      console.log(err);
    }else {
      res.redirect('/');
    }
  });
});

app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
