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

//landing page
app.get("/", (req, res) => {
  db.Article.find({}).lean().then(function(dbArticles){ 
    var hbsObject = {
    data: dbArticles
  };
    console.log(dbArticles)
     res.render("index", hbsObject);
  });
});

//saved articles
app.get("/saved", (req, res) => {
  res.render("saved");
});

//clear the database
app.delete("/delete", (req, res) => {
  db.Article.deleteMany({}).then(function(){
    res.status("200").send("deleted")
  })
  
});

//GET scraping route
app.get("/scrape", (req, res) => {
  console.log("get")
  axios.get("https://www.wsj.com").then(function(response) {
    console.log("axios")
    const $ = cheerio.load(response.data);
    const result = {};

    $("article").each(function (i, element) {
      result.title = $(element).find(".WSJTheme--headline--19_2KfxG").children().text();
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
  });
});

// listen for connection
app.listen(PORT, () => {
  console.log(`App running on port ${PORT} http://localhost:${PORT}/`);
});
