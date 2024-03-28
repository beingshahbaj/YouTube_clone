window.addEventListener("load", function () {
  const selectedVideoInfo = sessionStorage.getItem("selectedVideo");

  if (selectedVideoInfo) {
    const { videoId, videoTitle, videoChannel, channellogo } =
      JSON.parse(selectedVideoInfo);

    console.log(videoId, videoTitle, channellogo);

    fetchComments(videoId)
      .then((comments) => {
        displayComments(comments);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });

    if (typeof YT !== "undefined") {
      new YT.Player("videoPlayer", {
        height: "480",
        width: "853",
        videoId: videoId,
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    } else {
      console.error("YouTube Player API not loaded.");
    }
  }
});

async function fetchComments(VIDEO_ID) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&key=${API_KEY}`
    );
    const data = await response.json();
    console.log("Fetched comments:", data);
    return data.items;
  } catch (error) {
    throw new Error("Error fetching comments:", error);
  }
}

function onPlayerReady(event) {
  // event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo(); // Make sure 'player' is defined somewhere in your code
}

function displayComments(comments) {
  const commentsContainer = document.getElementById("comments");

  commentsContainer.innerHTML = ""; // Clear existing comments

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsContainer.appendChild(commentElement);
  });
}

function createCommentElement(comment) {
  const commentElement = document.createElement("div");
  commentElement.classList.add("comment");

  const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
  const text = comment.snippet.topLevelComment.snippet.textDisplay;

  commentElement.innerHTML = `
    <p><strong>${author}</strong></p>
    <p>${text}</p>
    <hr/>
    
  `;

  return commentElement;
}
