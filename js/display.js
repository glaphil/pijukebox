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

/* display thumbs songs page based on songs ids contained in page array */
function displayPage(page){
  console.log("page count : "+page.length)
  $( "#thumbs" ).empty();
  
  var thumbsByRowCount=0;
  var currentRow;
  var divId=0;
  for(i = 0; i < page.length ; i++) {
     // start new row
    if(thumbsByRowCount==0){
      currentRow=$('<div class="row">');
    }
    // cover left or right
    if(i%2==0){
      currentRow.append(createThumbSong(songs[page[i]],true,divId));
    }else{
      currentRow.append(createThumbSong(songs[page[i]],false,divId));
    }
    divId++;
    thumbsByRowCount++;
    // close current row and append to parent div
    if(thumbsByRowCount==2 || i == page.length-1){
      currentRow.append('</div>');
      $("#thumbs").append(currentRow)
      thumbsByRowCount=0
    }
  }
  // if current song playing present in page, add progress bar
  var currentSongPosition=$.inArray(currentSongIndex, page);
  if (currentSongPosition > -1) {
    enableProgressBar(currentSongPosition);
    refreshProgressBar(currentSongPosition);
    blink($("#song"+currentSongPosition).find(".glyphicon-play"));
  }
//   if no song playing remove eventual progress bar
//  if(currentSongIndex==null){
//    removeProgressBar();
//  }
}

/* create thumb with covert art and song info */
function createThumbSong(song,left,divId){
  var div = '<div id="song'+divId+'" class="col-md-6"><div class="media">';
  if(left){
    div+='<div class="media-left"><img class="media-object img-thumbnail" src='+getCoverArt(song)+' width="'+COVER_SIZE+'" height="'+COVER_SIZE+'"></div>';
   }
  div+='<div class="media-body">'+
          '<h3 class="media-heading">'+song.title+'</h3>'+
          '<h4>'+song.artist+'</h4>'+
          '<span class="glyphicon glyphicon-music"></span> '+song.album+' ('+song.year+')</br>'+
          '<span class="glyphicon glyphicon-headphones"></span> '+song.genre+'</br>'+
          '<span class="glyphicon glyphicon-time"></span> '+convertDurationToMMSS(song.duration)+'</br>'+
          '<div class="progress invisible">'+
            '<div id="progressBar" class="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'+
            '</div>'+
          '</div>'+
        '</div>';
  if(!left){
    div+='<div class="media-right"><img class="media-object img-thumbnail" src='+getCoverArt(song)+' width="'+COVER_SIZE+'" height="'+COVER_SIZE+'"></div>';
   } 
   div+='</div></div>';
  return div;
}

/* retrieve covert art if exist, else return NO_COVER_URL */
function getCoverArt(song){
  if(song.cover){
    console.log("found cover art : " + song.cover)
    var coverUrl = SUBSONIC_API_URL + "//getCoverArt.view?id="+song.cover+"&size="+COVER_SIZE+"&"+$.param(SUBSONIC_API_CREDENTIALS);
    return coverUrl
  }else{
    console.log("no cover art found : use no cover")
    return NO_COVER_URL;
  }
}

/* enable progress bar located in div identified by div+key */
function enableProgressBar(key){
  $("#song"+key).find(".progress").removeClass("invisible");
  $("#song"+key).find(".media-heading").prepend('<span class="glyphicon glyphicon-play"></span>');
}

/* disable progress bar located in div identified by div+key */
function disableProgressBar(key){
    $("#song"+key).find(".progress").addClass("invisible");
    $("#song"+key).find(".glyphicon-play").remove();
    currentSongIndex=null;
    currentSongKey=null;
}

/* refresh progress bar located in div identified by div+key, disable it if reached to its end */
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

/* make element identified by selector blinking */
function blink(selector){
  $(selector).fadeOut(1000, function(){
      $(this).fadeIn(1000, function(){
          blink(this);
      });
  });
}
