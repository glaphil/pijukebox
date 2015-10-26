// FIX ME : avoid width and height on img 
// FIX ME : use objects to avoid spaghetti code :D
// FIX ME : use a javascript mvc framework :D :D

// workflow
// insert coin -> play song ->  stop song
// nextpage/previous page
// insert coin refused when coin already inserted (current song must be stoped before)
// stop song set coin inserted to false if song is playing
// can't play song if no coin inserted

  var currentPage=0;
  // current song playing
  var currentSongIndex=null; 
  var pageSongIndex=null; 
 
  // all songs from playlist
  var songs = [];
 
  // current page songs indices (from songs array)
  var page = [];

  var coinInserted = false; 
  
  // to avoid multiple modal display
  var lockModal = false; 

  var audioElement = $("#sound")[0];

  var paused = false;

// pour la set list utiliser 
// array.pop()


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

// play song identified by its position in thumbs page
function playSong(key){
  console.log("coin inserted "+coinInserted);
  if(coinInserted){

    // map key to page song index
    pageSongIndex=eval(key)-1;
    
    console.log("song index "+pageSongIndex);
    
    currentSongIndex=(currentPage*MAX_THUMBS)+eval(pageSongIndex);
    
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

/* stop current playing song */
function stopSong(){
  if(!audioElement.paused){
    // showModal("Song has been stopped");
    audioElement.pause();
    audioElement.currentTime = 0;
    coinInserted=false;
    disableProgressBar(pageSongIndex)
  }else{
    // showModal("No song playing now"); 
    console.log("no song to stop");
  }
}

/* listen to end of song */
function checkSongPlaying(){
  $("#sound").on("ended", function() {
    console.log("fin")
  });
}
  
