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

    //show all the previous notes for the article id when the modal opens
    $.ajax({
      type: "get",
      url: "/article/" + articleId
    }).then(function (dbArticle) {
      console.log(dbArticle)
      const notes = dbArticle.notes.length > 0 ? dbArticle.notes : "";
      console.log(notes)
      if (notes !== "") {
        notes.forEach(note => {
          $(".modal-body").prepend("<div>"+ note.text + 
          "<button class='delete btn btn-danger float-right'>X</button></div><hr><br>");
          $(".delete").attr("data-id", note._id);
        });
      }
    });
    $("#noteMod").modal("show");
  });

  //remove note
  $(".modal").on("click", ".delete", function(){
    console.log("clicked")
     const noteId = $(this).attr("data-id")
     console.log(noteId)
     $.ajax({
       type: "delete",
       url: "/note/" + noteId
     }).then(function(){
       location.reload();
       //need to refresh the modal here instead
     })
  });

  //save a note
  $("#modalSaveNote").on("click", function () {
    const articleId = $(this).attr("data-id");
    const text = $("#textArea").val().trim();
    if (text) {
      const note = {
        text: text
      }
      //post a new note to the collection
      $.ajax({
        type: "post",
        url: "/article/" + articleId,
        data: note
      }).then(function () {
        $("#noteMod").modal("hide");
        $("#textArea").val("");
      })
    } else {
      $("#noteMod").modal("hide");
    }
  });



});




