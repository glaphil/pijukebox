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


/* create progress bar */
function getProgressbar(){
  var bar=$('<div class="progress">'+
              '<div id="progressBar" class="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'+
              '</div>'+
            '</div>');
  return bar;
}

/* add progress bar to div */
function addProgressBar(key){
  $("#song"+key).find(".media-body").append(getProgressbar());
  $("#song"+key).find(".media-heading").prepend('<span class="glyphicon glyphicon-play"></span>');
}

/* remove progress bar */
function removeProgressBar(){
    $(".progress").remove();
    $(".glyphicon-play").remove();
    currentSongIndex=null;
    currentSongKey=null;
}

/* refresh progress bar */
function refreshProgressBar(){
  $("#sound").on("timeupdate", function() {
    var progress = (this.currentTime / this.duration)*100; 
    //console.log(progress);
    $("#progressBar").css("width", progress+"%");
    $("#progressBar").attr("aria-valuenow", progress+"%");
    // for case when song ended without pressing stop
    if(progress==100){
      $(".progress").remove();
      $(".glyphicon-play").remove();
    }
  });
}