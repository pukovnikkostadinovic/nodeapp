const express = require('express');
const router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');


router.get('/add', ensureAuthenticated, function(req,res){
  res.render('add',{
    title:'Add Articles'
  });
});

router.post('/add', function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
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
    article.author = req.user._id;
    article.body = req.body.body;

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

router.post('/arduino/:id', function(req,res){
  //console.log(req.params.id);
  let on_off = {};
  let query = {_id:req.params.id}
  if(req.body.on){
    on_off.on_off='1';
  }else{
    on_off.on_off='0'
    //console.log(req.body.off);
  }
  Article.update(query, on_off, function(err){
    res.redirect('/articles/'+req.params.id);
  });
});

router.get('/arduino/:id', function(req,res){
  Article.findById(req.params.id, function(err, state){
      res.render('arduino',{
        state:state.on_off
    });
  });
});

router.get('/edit/:id', ensureAuthenticated, function(req,res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not authorized');
      res.redirect('/');
    }
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

router.post('/edit/:id', function(req,res){
  let article = {};
  article.title = req.body.title;
  //article.author = req.body.author;
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
  if(!req.user._id){
    res.status(500).send();
  }
  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
            console.log(err);
        }else{
          res.send('success');
        }
      });
    }
  });
});

router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('article',{
        article:article,
        author: user.name
      });
    });
  });
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
