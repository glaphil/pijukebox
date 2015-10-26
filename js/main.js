// TODO format : remove uppercase/lowercase, title begin with uppercase, duration in min sec, remove track number from title (ex : 01 - title)
// TODO optim : utiliser la pagination
// TOOD qualité : faire un truc pour recalculer le gain moyen de la playlist, replaygain, etc.. en se basant sur les infos tags
// TODO bug : 
//  ne pas utiliser le width et height sur img (comment gérer la taile des nocover?)

// workflow
// insert coin -> play song ->  stop song
// nextpage/previous page
// insert coin refused when coin already inserted (current song must be stoped before)
// stop song set coin inserted to false if song is playing
// can't play song if no coin inserted

// TODO numéroter à partir de 0 et faire juste -1 sur les chiffres des morceaux 

// subsonic
 var SUBSONIC_URL = "http://localhost:4040";
 var SUBSONIC_API_URL = SUBSONIC_URL+"/rest"
 var SUBSONIC_API_CREDENTIALS = {
          u : 'admin',
          p : 'admin',
          c : 'myJukebox',
          v : '1.12.0',
          f : 'json'
      };
  var SUBSONIC_PLAYSLIST_NAME = "myjukebox";
  
  // display & controls
  var MAX_THUMBS=8;
  var NO_COVER_URL="img/nocover.png"
  // size ok for 1440x900, try 250 for my laptop (1920*1080)
  var COVER_SIZE=200;
  var MODAL_TIMEOUT=1500;

  var currentPage=0;
  // current song playing
  var currentSongIndex=null; 
  var currentSongKey=null; 
  // all songs from playlist
  var songs = [];
  var songsCount = 0;
  // current page songs positions in songs array
  var page = [];

  var coinInserted = false; 
  // to avoid multiple modal display
  var lockModal = false; 

  var audioElement = $("#sound")[0];

// to test display on smaller resolution

// pour la set list utiliser 
// array.pop()


$(function(){

  // check subsonic 
  pingSubsonic();
  
  // get playlist content to populate songs array
  getPlaylist();

  // listen to keyboard
  listenKeyboard();

});


/* load songs from playlist to current page */
function loadPage(pageId){
  console.log("Load page ["+pageId+"]");
  currentPage = pageId;
  index = pageId*MAX_THUMBS;
  page.length=0;
  for(i = index; i < (MAX_THUMBS+(pageId*MAX_THUMBS))  && i<songs.length ; i++) {
    page.push(i);
  }
  console.log(page);
  displayPage(page);
}

/* swich to next page */
function nextPage(){
  if(hasNextPage()){
    loadPage(currentPage+1);
  }else{
    console.log("last page reached")
  }
}

/* swich to previous page */
function previousPage(){
  if(hasPreviousPage()){
    loadPage(currentPage-=1);
  }else{
    console.log("first page reached")
  }
}

function hasNextPage(){
  return (currentPage+1)*MAX_THUMBS<songsCount;
}

function hasPreviousPage(){
  return currentPage>0;
}

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
  // if no song playing remove eventual progress bar
//  if(currentSongIndex==null){
//    removeProgressBar();
//  }

}

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


function listenKeyboard(){
  $('#page').bind('keyup', keyboard);
}

function keyboard(event) {
    var key=String.fromCharCode(event.keyCode);
    console.log('key: '+ key);
    if(isSongSelection(key)){
        console.log("key input : play song "+key)
        playSong(key);
    }else{
      switch (key) { 
        case 'N': 
          console.log('key input : next page');
          nextPage();
          break;
        case 'P': 
          console.log('key input : previous page');
          previousPage();
          break;
        case 'C':
          console.log('key input : coin inserted');
          insertCoin()
          break;
        case 'S':
          console.log('key input : stop song');
          stopSong()
          break;
        case 'H':
          console.log('key input : toggle diplay controls');
          $("#keyboardControls").toggle();
          break;
        default:
          console.log('key input : unknown command');
      }
    }

}

function isSongSelection(key) {
  // number 
  if(isNaN(parseFloat(key)) || !isFinite(key)){
    return false;
  }
  // between 1 and MAX_THUMBS
  if(key>MAX_THUMBS || key==0){
    return false
  }
  // count page + the eventual uncomplete page
  pageCount= Math.floor(songs.length/MAX_THUMBS);
  residualSongs=songs.length%MAX_THUMBS; 
  if(residualSongs>0){
    pageCount++;
  }
  // last page and key > rest division
  if((currentPage+1==pageCount) && key>residualSongs){
    return false;
  }
  return true;
}

function insertCoin(){
   // music playing 
  if(!audioElement.paused){
    console.log("music is playing, stop song before inserting coin")
    showModal("Wait for current song's ending or stop it");  
  }
  // no music
  else{
    // no coin
    if(!coinInserted){
      coinInserted=true;
      console.log("coin inserted, choose song")
      showModal("Thanks! Now, choose a song");
    }
    // coin
    else{
      console.log("coin already inserted, choose a song")
      showModal("A coin is already inserted, choose a song"); 
    }
  }
}

function playSong(key){
  console.log("coin inserted "+coinInserted);
  if(coinInserted){

    // map key to song index
    var pageSongIndex=eval(key)-1;
    
    console.log("song index "+pageSongIndex);
    
    currentSongIndex=(currentPage*MAX_THUMBS)+eval(pageSongIndex);
    
    currentSongKey=key;

    var streamSongUrl = SUBSONIC_API_URL + "/stream.view?id="+songs[currentSongIndex].id+"&"+$.param(SUBSONIC_API_CREDENTIALS);


    audioElement.src = streamSongUrl;
    audioElement.load();
    audioElement.play();
    coinInserted=false;
    console.log('play "'+songs[currentSongIndex].title+'" ('+songs[currentSongIndex].title+')');
    
    // add progress bar and play icon
    enableProgressBar(pageSongIndex)
    refreshProgressBar(pageSongIndex);
    blink($("#song"+pageSongIndex).find(".glyphicon-play"));

  }else{
    showModal("Please, insert a coin before choosing a song");
    console.log("can't play song no coin inserted!");
  }
}


function stopSong(){
  if(!audioElement.paused){
    // showModal("Song has been stopped");
    audioElement.pause();
    audioElement.currentTime = 0;
    coinInserted=false;
    disableProgressBar(currentSongKey-1)
  }else{
    // showModal("No song playing now"); 
    console.log("no song to stop");
  }
}


  
