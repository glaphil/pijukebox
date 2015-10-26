// check subsonic server is up
function pingSubsonic(){
    var url = SUBSONIC_API_URL + "/ping.view";
    $.getJSON(url, SUBSONIC_API_CREDENTIALS, function (response) {          
          // console.log(response);
        })  
        .fail(function(response) {
           alert("Can't connect to susonic");
        })
};

// get playlist by name and call setPlaylistContent
function getPlaylist(){
    var url = SUBSONIC_API_URL + "/getPlaylists.view";
    $.getJSON(url, SUBSONIC_API_CREDENTIALS, function (response) {      
          playlist=response["subsonic-response"]["playlists"]["playlist"];
          $.each(playlist, function( index, playlist ) {
              if(playlist["name"]===SUBSONIC_PLAYSLIST_NAME){
                console.log( "playlist name"+" : "+playlist["name"]+" : "+playlist["id"]);
                setPlaylistContent(playlist["id"])
                return false;
              }
          });
        })
        .fail(function(response) {
           alert("Can't get play list "+ SUBSONIC_PLAYSLIST_NAME);
        })
}

// populate songs array from subsonic playlist identified by its id
function setPlaylistContent(playlistId){
    var url = SUBSONIC_API_URL + "/getPlaylist.view?id="+playlistId;
    $.getJSON(url, SUBSONIC_API_CREDENTIALS, function (response) {      
          playlistContent=response["subsonic-response"]["playlist"]["entry"];
          $.each(playlistContent, function( index, song ) {
            songs.push({
              id: song.id, 
              title: song.title,
              artist: song.artist,
              album: song.album,
              year: song.year,
              genre: song.genre,
              cover: song.coverArt,
              duration: song.duration
            })
          })
        })
        .fail(function(response) {
           alert("Can't get play list "+ playlistId);
        })
        .complete(function(data){
          console.log("["+songs.length+"] songs from playlist");
          loadPage(0);
        });
}
