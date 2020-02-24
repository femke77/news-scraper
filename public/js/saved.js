$(document).ready(function(){

  $(document).on("click", "#unsave", function(){
    const articleId = $(this).attr("data-id");
    $.ajax({
      type: "put",
      url: "/unsave/" + articleId
    }).then(function(){
      location.reload();
    })
  });








});