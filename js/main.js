// FIX ME : avoid width and height on img 
// FIX ME : use object and design patterns to avoid spaghetti code :D
// FIX ME : use a javascript mvc framework :D :D
// FIX ME : remove playlist limit to simplify code !!!

// workflow
// insert coin -> play song ->  stop song
// nextpage/previous page
// insert coin refused when coin already inserted (current song must be stoped before)
// stop song set coin inserted to false if song is playing
// can't play song if no coin inserted

// current page index  
var currentPage=0;

// current song playing index (from songs array) 
var currentSongIndex=null; 

// current song playing index (from page array) 
var pageSongIndex=null; 

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
    var key=String.fromCharCode(event.keyCode);
    console.log('key: '+ key);
    if(isSongSelection(key)){
        console.log("key input : add song "+key)
        // FIX ME juste besoin du play qui ajoute à la set list si current déjà occupé
        playOrAddSong(key);
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
  if(!isCreditsMax() || !isPlaylistFull){
    credits++;
    console.log("coin inserted, credits : "+credits)
    showModal("Thanks! "+credits+" more song(s) to add to the playlist");  
  }else{
    console.log("max credit reach")
    showModal("Sorry, max credit reached or playlist is full");
  }
}

function playOrAddSong(key){
 
   // map key to page song index
    pageSongIndex=eval(key)-1;
    songSongsIndex=(currentPage*MAX_THUMBS)+eval(pageSongIndex);

 if(currentSongIndex==null){
    credits--;
  
    playSong(songSongsIndex)
  }else{
     addSong(songSongsIndex)
 
  }
}

// add song identified by its position in thumbs page to playlist
function addSong(songSongsIndex){
  if(hasMoreCredits() && !isPlaylistFull()){
    
      console.log("add song to playlist");
     
      currentPlaylist.push(songsSongIndex)
      
      credits--;
      console.log(currentPlaylist)
    
  }else{
    if(credits==0 && !isPlaylistFull()){
      showModal("Please, insert a coin before adding a song");
      console.log("can't add song, no coin inserted!");  
    }else{
      showModal("Playlist is complete, stop current song or wait until its end");
      console.log("can't add song, playlist is full!");  
    }
  }
}

// play song identified by its position in thumbs page
function playSong(songSongsIndex){
  
  console.log("play song index "+songSongsIndex);
  
  var streamSongUrl = SUBSONIC_API_URL + "/stream.view?id="+songs[songSongsIndex].id+"&"+$.param(SUBSONIC_API_CREDENTIALS);

  audioElement.src = streamSongUrl;
  audioElement.load();
  audioElement.play();
  coinInserted=false;
  console.log('play "'+songs[currentSongIndex].title+'" ('+songs[songSongsIndex].title+')');
  
  // add progress bar and play icon
  enableProgressBar(pageSongIndex)
  refreshProgressBar(pageSongIndex);
  blink($("#song"+pageSongIndex).find(".glyphicon-play"));
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
  
function hasMoreCredits(){
  return credits>0;
}

function isPlaylistFull(){
  return currentPlaylist.length>=MAX_PLAYLIST;
}

function isCreditsMax(){
  return credits>=MAX_PLAYLIST || (currentPlaylist.length>0 && (MAX_PLAYLIST-currentPlaylist.length<=credits));
}



// a coin is inserted
function insertCoin2(){
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