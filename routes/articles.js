const express = require('express');
const router = express.Router();

let Article = require('../models/article');


router.get('/add', function(req,res){
  res.render('add',{
    title:'Add Articles'
  });
});

router.post('/add', function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

//get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add', {
      title:'Add Article',
      errors:errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body

    article.save(function(err){
      if(err){
        console.log(err);
      }else {
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  }
});


router.get('/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

router.post('/edit/:id', function(req,res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body

  let query = {_id:req.params.id}


  Article.update(query, article, function(err){
    if(err){
      console.log(err);
    }else {
      req.flash('success','Article Updated');
      res.redirect('/');
    }
  });
});

router.delete('/:id', function(req,res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
        console.log(err);
    }else{
      res.send('success')
    }
  });
});

router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
    });
  });
});

module.exports = router;
