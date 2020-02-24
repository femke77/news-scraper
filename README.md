# news-scraper
A node/express app that scrapes the latest news articles from Wall Street Journal.com and allows user to save favorites and then make and delete comments on the article.

# How to Use

https://glacial-taiga-91523.herokuapp.com/

Use the scrape button to fill up new articles. Only unique articles can be scraped, and new articles come out every 24 hours. You can also clear all the articles and scrape again. Please note that deleting all the articles will, for now, delete any saved articles as well. 

Click save to move an article to the saved section. Click read full article to go to the full page article and read more. On the saved page, you can remove from saved, or you can click article notes and make/delete comments on your articles. 

# Tech/Framework Used

This is a Node/Express app written in JS, styled by Bootstrap, and it uses several npm packages, axios, express-handlebars, mongoose, and cheerio. 
Scraping is done with axios and cheerio from the Wall Street Journal site. Express-handlebars renders the two pages. Mongoose is the ODM over our MongoDB NoSQL database.  

# Known Issues

This app is meant to have a sign-on feature and the comments will be expanded so that all users can comment on any article. Saving an article should not be the entry point to making comments. 

Additionally, the database has orphaned references happening and those need to be cleaned up. 

The button to clear the collection should not disrupt the saved articles. 

The styling is currently quite boring. 

The code is not following the principle of DRY. Partials should be used for the article cards as well as several other areas that are not refactored yet. 

# Credits

Thank you to WSJ.com for the data!
