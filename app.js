//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////Request targetting all Articles

app.route("/articles")

.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){ // post an article

const newArticle = new Article ({ 
  title: req.body.title,
  connect: req.body.content
});

newArticle.save(function(err){
  if (!err){
    res.send("Successfully added a new article.")
  }else {
    res.send(err);
  }
});
})

.delete(function(req, res){ //delete everything
  Article.deleteMany(function(err){
    if(!err) {
      res.send("Successfully deleted all articles.");
    }else {
      res.send(err);
    }
  });
}); //entire method (chaining method)


////////////Request targetting a specific  Articles

app.route("/articles/:articleTitle")

.get(function(req, res){  // show an article

  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle) {
      res.send(foundArticle);
    }else {
      res.send("No articles matching that title was found");
    }
  });
})

.put(function(req, res){ // change entire document
  Article.replaceOne({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send("Record successfully updated.");
      }
    });
})

.patch(function(req, res){ //change only selected value
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.")
      } else {
        res.send(err);
      }
    });
})


.delete(function(req, res){ // deleted only selected value
  Article.deleteOne(
    {title: req.params.articleTitle},
    function (err) {
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
      res.send(err);
    }
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
