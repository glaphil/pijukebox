function convertDurationToMMSS(duration){
  var minutes = Math.floor(duration / 60); 
  var seconds = ("0" + duration % 60).slice(-2); 
  return minutes+":"+seconds;
}
