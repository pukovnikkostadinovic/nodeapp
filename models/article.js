let mongoose = require('mongoose');

let articleSchema= mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  on_off:{
    type: String,
    required: false
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
