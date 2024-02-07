// const API_KEY = "AIzaSyBzSTXIrBHXKoQPLmhHTeGL87z-DyGUYBY";
// // const API_KEY = "AIzaSyDa95KzoCkJIH-3CILO7QsE67ufMF7bkLM";
// // const API_KEY = "AIzaSyD8O_WLqEMxyxPXQzgKQo6taUE2REbw5Wk";

window.addEventListener("load", function () {
  const selectedVideoInfo = sessionStorage.getItem("selectedVideo");

  
  if (selectedVideoInfo) {
    const { videoId, videoTitle, videoChannel, channellogo } =
      JSON.parse(selectedVideoInfo);

      
    console.log(videoId, videoTitle, channellogo);
    
    fetchComments(videoId)
      

    // Ensure that the YT object is available
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
      // Handle the case when the YT object is not available
      console.error("YouTube Player API not loaded.");
    }
  }
});

async function fetchComments(VIDEO_ID) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    const data = await response.json();
    createCommentElement(data);
    console.log(data)
    return data.items;
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return [];
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
  player.stopVideo();
}


// Function to fetch comments (assuming you have implemented fetchComments as shown in the previous example)
async function displayComments() {
  
  const commentsContainer = document.getElementById('comments');

  commentsContainer.innerHTML = ''; // Clear existing comments

  comments.forEach(comment => {
    const commentElement = createCommentElement(comment);
    commentsContainer.appendChild(commentElement);
  });
}

// Function to create a comment element
function createCommentElement(comment) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('comment');

  const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
  const text = comment.snippet.topLevelComment.snippet.textDisplay;

  commentElement.innerHTML = `
    <p><strong>${author}</strong></p>
    <p>${text}</p>
  `;

  return commentElement;
}

// Usage: Call displayComments to fetch and display comments
displayComments().catch(error => {
  console.error('Error:', error);
});
