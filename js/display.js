/* display modal message */
function showModal(message){
  if(!lockModal){
    lockModal=true;
    $("#modal h1").text(message);
    $("#modal").modal('show');
      setTimeout(function(){
        $("#modal").modal('hide');
        lockModal=false;
      }, MODAL_TIMEOUT);
  }
}

/* make element identified by selector blinking */
function blink(selector){
  $(selector).fadeOut(1000, function(){
      $(this).fadeIn(1000, function(){
          blink(this);
      });
  });
}


/* enable progress bar to div */
function enableProgressBar  (key){
  $("#song"+key).find(".progress").removeClass("invisible");
  $("#song"+key).find(".media-heading").prepend('<span class="glyphicon glyphicon-play"></span>');
}

/* disable progress bar */
function disableProgressBar(key){
    $("#song"+key).find(".progress").addClass("invisible");
    $("#song"+key).find(".glyphicon-play").remove();
    currentSongIndex=null;
    currentSongKey=null;
}

/* refresh progress bar */
function refreshProgressBar(key){
  $("#sound").on("timeupdate", function() {
    var progress = (this.currentTime / this.duration)*100; 
    //console.log(progress);
    $("#song"+key).find("#progressBar").css("width", progress+"%");
    $("#song"+key).find("#progressBar").attr("aria-valuenow", progress+"%");
    // for case when song ended without pressing stop
    if(progress==100){
      disableProgressBar(key)
    }
  });
}