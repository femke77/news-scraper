$(document).ready(function () {

  $(document).on("click", "#unsave", function () {
    const articleId = $(this).attr("data-id");
    $.ajax({
      type: "put",
      url: "/unsave/" + articleId
    }).then(function () {
      location.reload();
    })
  });

  //see and edit article notes in modal
  $(document).on("click", "#note", function () {
    //get the article id from the article note button
    const articleId = $(this).attr("data-id");
    //attach it to the save note button
    $("#modalSaveNote").attr("data-id", articleId)

    $("#noteMod").modal("show");
  });

   //save a note
  $("#modalSaveNote").on("click", function(){
    const articleId = $(this).attr("data-id");
    const note = {
      text: $("#textArea").val().trim()
    }
    //post a new note to the collection
    $.ajax({
      type: "post",
      url: "/article/" + articleId,
      data: note
    }).then(function(){
      $("#noteMod").modal("hide");
    })
  });

});