const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 3000;

const app = express();

// Require all models
var db = require("./models");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public file server 
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  }),
);

app.set("view engine", "handlebars");

// connect to the database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(function () {
  console.log(`Connected to database ${MONGODB_URI}`);
});

//Routes

//landing page get articles
app.get("/", (req, res) => {
  db.Article.find({ saved: false }).lean().then(function (dbArticles) {
    var hbsObject = {
      data: dbArticles
    };
    res.render("index", hbsObject);
  });
});

//get route - get saved articles
app.get("/saved", (req, res) => {
  db.Article.find({ saved: true }).lean().then(function (dbArticles) {
    var hbsObject = {
      data: dbArticles
    };
    res.render("saved", hbsObject);
  });
});

//put route for changing save status of article to saved
app.put("/save/:id", (req, res) => {
  //using id from params, find the aritcle and update saved to true
  db.Article.updateOne({ _id: req.params.id }, {
    saved: true
  }).then(function (response) {
    res.json(response);
  });
});

//put route for changing save status of article to unsaved
app.put("/unsave/:id", (req, res) => {
  //using id from params, find the aritcle and update saved to true
  db.Article.updateOne({ _id: req.params.id }, {
    saved: false
  }).then(function (response) {
    res.json(response);
  });
});

//route for getting specific article with all of its notes
app.get("/article/:id", (req, res) => {
  db.Article.findOne({ _id: req.params.id })
  .populate("notes")
  .then(function(dbArticle){
    res.json(dbArticle);
  })
});

//route to delete a note
app.delete("/note/:id", (req, res) => {
  db.Note.deleteOne({_id: req.params.id}).then(function(){
    res.status("200").send("deleted");
    //THIS IS LEAVING ORPHANED REFERENCES IN ARTICLE. NEED TO $PULL
  });
});

//create note and add the reference to the article record
app.post("/article/:id", (req, res) => {
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote._id}}, {new: true})
  }).then(function(dbArticle){
    res.json(dbArticle);
  })
});

//Delete route - clear the database collection of articles
app.delete("/delete", (req, res) => {
  db.Article.deleteMany({}).then(function () {
    res.status("200").send("deleted collection")
  });
});

//Get route for scraping wsj articles
app.get("/scrape", (req, res) => {
  axios.get("https://www.wsj.com").then(function (response) {
    const $ = cheerio.load(response.data);
    const result = {};

    $("article").each(function (i, element) {
      result.title = $(element).find(".WSJTheme--headline--19_2KfxG").children().first().text();
      result.link = $(element).find("a").attr("href");
      result.summary = $(element).find(".WSJTheme--summary--12br5Svc ").children().remove().end().text()

      if (result.title && result.link && result.summary) {
        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          })
      }
    });
    res.send("Scrape Completed!");
  }).catch(function(err){
    console.log(err);
  })
});

// listen for connection
app.listen(PORT, () => {
  console.log(`App running on port ${PORT} http://localhost:${PORT}/`);
});
