$(document).ready(function() {


$("#clear").on("click", function(e){
  e.preventDefault();
  $.ajax({
    type: "delete",
    url: "/delete"
  }).then(function(){
    console.log("everything deleted")
    location.reload();
  })

});

$("#scrape").on("click", function(e){
  e.preventDefault();
  $.get("/scrape").then(function(){
    location.reload();
  })
})






});