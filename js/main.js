// FIX ME : avoid width and height on img 
// FIXE ME : if we insert coin and chose song then stop quickly, stop is not taken in account (with keyboard :  C 1 S)

// current page index  
var currentPage=0;

// current song playing index (from songs array) 
var currentSongIndex=null; 

// all songs from subsonic playlist (contains full songs info)
var songs = [];

// current page songs indices from songs array (contains songs positions from songs array)
var page = [];

// current playlist songs indices from songs array (contains songs positions from songs array)
var currentPlaylist = [];

// current credits count
var credits = 0;

// a coin is inserted
var coinInserted = false; 

// to avoid multiple modal display
var lockModal = false; 

// the html 5 audio element
var audioElement = $("#sound")[0];

// current song is paused
var paused = false;


$(function(){

  // check subsonic 
  pingSubsonic();
  
  // get playlist content to populate songs array
  getPlaylist();

  // listen to keyboard
  listenKeyboard();

  // end of song listener
  checkSongPlaying()

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

/* true if next page exists */
function hasNextPage(){
  return (currentPage+1)*MAX_THUMBS<songs.length;
}

/* true if previous page exists */
function hasPreviousPage(){
  return currentPage>0;
}

// register keyboard event listener
function listenKeyboard(){
  $('#page').bind('keyup', keyboard);
}

// keyboard event listener
function keyboard(event) {
    // work both from uinput event or real keyboard (http://stackoverflow.com/questions/5630918/get-correct-keycode-for-keypadnumpad-keys)
    var key=event.key || String.fromCharCode(event.keyCode);
    console.log('key: '+ key);
    if(isSongSelection(key)){
        processSong(key);
    }else{
      switch (key) { 
        case 'n': 
          nextPage();
          break;
        case 'p': 
          previousPage();
          break;
        case 'c':
          insertCoin()
          break;
        case 's':
          stopSong()
          break;
        case 'h':
          $("#keyboardControls").toggle();
          break;
        default:
          console.log('key input : unknown command');
      }
    }

}

// true if key is mapped to a song in thumbs page
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


// a coin is inserted
function insertCoin(){
    credits++;
    console.log("coin inserted, credits : "+credits)
    showModal("Thanks! "+credits+" more song(s) to add to the playlist");  
}

// return song index in page (from 0 to MAX_THUMBS-1) 
function getPageSongIndex(songSongsIndex){
  return songSongsIndex%MAX_THUMBS
}

// return true if current song playing is displayed 
function isCurrentSongInCurrentPage(songSongsIndex){
  return currentPage==Math.floor(songSongsIndex/MAX_THUMBS);
}

// play or add to currentPlaylist song identified by its position in thumbs page
function processSong(key){
  if(credits==0){
      showModal("Please, insert a coin before adding a song");
      console.log("can't add song, no coin inserted!");  
  }else{
    credits--;
     // map key to page song index
    var pageSongIndex=eval(key)-1;
    songSongsIndex=(currentPage*MAX_THUMBS)+pageSongIndex;
    // play song if none playing, else add to playlist
    if(currentSongIndex==null){
      playSong(songSongsIndex);
    }else{
      addToCurrentPlaylist(songSongsIndex);
    }
  }
}

/* add song identified by its position in songs array to current playlist */
function addToCurrentPlaylist(songSongsIndex){
    console.log("song playing, add to playlist");
    currentPlaylist.push(songSongsIndex);
    console.log(currentPlaylist);
    displayCurrentPlaylist(currentPlaylist);
}

/* play song identified by its position in songs array */
function playSong(songSongsIndex){
    console.log("play song index "+songSongsIndex);
    console.log('play song '+songSongsIndex+'" : "'+songs[songSongsIndex].title+'" ('+songs[songSongsIndex].artist+')');
    
    showModal("Playing : <br />"+songs[songSongsIndex].title+" ("+songs[songSongsIndex].artist+")");

    currentSongIndex=songSongsIndex;

    var streamSongUrl = SUBSONIC_API_URL + "/stream.view?id="+songs[songSongsIndex].id+"&"+$.param(SUBSONIC_API_CREDENTIALS);

    audioElement.src = streamSongUrl;
    audioElement.load();
    audioElement.play();
    coinInserted=false;
    
    // add progress bar and play icon if current song playing is in current page
    if(isCurrentSongInCurrentPage(songSongsIndex)){
      var pageSongIndex = getPageSongIndex(songSongsIndex);
      enableProgressBar(pageSongIndex)
      refreshProgressBar(pageSongIndex);
      blink($("#song"+pageSongIndex).find(".glyphicon-play"));
    }
}

/* play next song in currentPlaylist */
function playNext(){
    if(currentPlaylist.length>0){
      var nextSong=currentPlaylist.shift();
      playSong(nextSong);
      console.log("remaining playlist  : ", currentPlaylist);
    }
}

/* stop current playing song */
function stopSong(){
  if(!audioElement.paused){
    audioElement.pause();
    audioElement.currentTime = 0;
    coinInserted=false;
    disableProgressBar(getPageSongIndex(currentSongIndex))
    playNext();
  }else{
    // showModal("No song playing now"); 
    console.log("no song to stop");
  }
}

/* listen to end of song */
function checkSongPlaying(){
  $("#sound").on("ended", function() {
    console.log("fin");
    playNext();
  });
}
