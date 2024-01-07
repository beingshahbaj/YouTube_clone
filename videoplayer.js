

window.addEventListener("load",  function() {
  // Retrieve the selected video information from sessionStorage
  const selectedVideoInfo = sessionStorage.getItem('selectedVideo');

  if (selectedVideoInfo) {
    const { videoId, videoTitle, videoChannel } = JSON.parse(selectedVideoInfo);



    // Ensure that the YT object is available
    if (typeof YT !== 'undefined') {
      new YT.Player('videoPlayer', {
        height: "480",
        width: "853",
        videoId: videoId,
        playerVars: {
          'playsinline': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    } else {
      // Handle the case when the YT object is not available
      console.error('YouTube Player API not loaded.');
    }
  }

  
});
function onPlayerReady(event) {
  event.target.playVideo();
}
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}
