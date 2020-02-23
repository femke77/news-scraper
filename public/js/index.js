$(document).ready(function() {

//clear the mongoose collection of all articles 
$("#clear").on("click", function(e){
  e.preventDefault();
  $.ajax({
    type: "delete",
    url: "/delete"
  }).then(function(){
    console.log("everything deleted")
    location.reload();
  }).catch(function(err){
    console.log(err);
  });

});

//scrape WSJ.com for the latest articles
$("#scrape").on("click", function(e){
  e.preventDefault();
  $.get("/scrape").then(function(){
    location.reload();
  }).catch(function(err){
    console.log(err);
  });
});

//save an article. article then appears on the saved page. 
$(document).on("click", "#save", function(){
  //get id from button element
  const articleId = $(this).attr("data-id")
  //ajax call to "save" route with id
  $.ajax({
    type: "put",
    url: "/save/" + articleId
  }).then(function(){
    location.reload();
  });
});



});