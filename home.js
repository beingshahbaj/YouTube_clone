// const API = "AIzaSyBzSTXIrBHXKoQPLmhHTeGL87z-DyGUYBY";
// const API = "AIzaSyDa95KzoCkJIH-3CILO7QsE67ufMF7bkLM";
const API = "AIzaSyD8O_WLqEMxyxPXQzgKQo6taUE2REbw5Wk";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

const videoList = document.getElementById("videoList");

const details = "contentDetails";
const stats = "statistic";
const thumb = document.querySelector("thumbnail");

document.addEventListener("DOMContentLoaded", function () {
  fetchVideo("all", 50);
  //
  addavideoCategory();
});

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  
  let searchInput = document.getElementById("search").value;
  searchVideos(searchInput);
})

async function searchVideos(searchInput) {
  if (searchInput.trim() !== "") {
    // Clear existing video list
    document.getElementById("videoList").innerHTML = "";
    
    // Fetch videos based on the search query
    await fetchVideo(searchInput, 50);
  }
}






async function fetchVideo(searchQuery, maxResult) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API}&q=${searchQuery}&maxResults=${maxResult}&part=snippet`
  );
  const data = await response.json();

  renderVideo(data.items);
}

async function renderVideo(list) {
  for (let video of list) {
    const logo = await getChannelLogo(video.snippet.channelId);
    const isoTimestamp = video.snippet.publishTime;
    const date = new Date(isoTimestamp);
    const now = new Date();

    const timeDiffInSeconds = Math.floor((now - date) / 1000);

    let formattedTime;

    if (timeDiffInSeconds < 60) {
      formattedTime = "Just now";
    } else if (timeDiffInSeconds < 3600) {
      const minutes = Math.floor(timeDiffInSeconds / 60);
      formattedTime = `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
    } else if (timeDiffInSeconds < 86400) {
      const hours = Math.floor(timeDiffInSeconds / 3600);
      formattedTime = `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    } else if (timeDiffInSeconds < 2592000) {
      const days = Math.floor(timeDiffInSeconds / 86400);
      formattedTime = `${days} ${days > 1 ? "days" : "day"} ago`;
    } else if (timeDiffInSeconds < 31536000) {
      const months = Math.floor(timeDiffInSeconds / 2592000);
      formattedTime = `${months} ${months > 1 ? "months" : "month"} ago`;
    } else {
      const months = date.getMonth() + 1;
      const years = now.getFullYear() - date.getFullYear();
      formattedTime = `${years > 1 ? years + " years" : "a year"}`;
    }

    const viewCount = await getVideoViewCount(video.id.videoId);

    const videoProfile = document.createElement("div");
    videoProfile.classList.add("videoprofile");
    videoProfile.dataset.videoId = video.id.videoId;
    videoProfile.dataset.videoTitle = video.snippet.title;
    videoProfile.dataset.videoChannel = video.snippet.channelTitle;

    videoProfile.innerHTML = `<div class="thumbnail">
              <img  src="${video.snippet.thumbnails.high.url}" alt="">
          </div>
          <div class="discription">
              <div class="channel-logo">
                  <img src="${logo}" alt="Channel Logo">
              </div>
              <a href="#" class="title">${video.snippet.title}</a>
          </div>
          <div class="channeltitle">${video.snippet.channelTitle}</div>
           <div class="channeltitle">${formattedTime}  </div>`;

    videoProfile.addEventListener("click", function () {
      const videoId = this.dataset.videoId; 
      const videoTitle = this.dataset.videoTitle; 
      const videoChannel = this.dataset.videoChannel; 

      // Store selected video information in sessionStorage
      sessionStorage.setItem(
        "selectedVideo",
        JSON.stringify({
          videoId: videoId,
          videoTitle: videoTitle,
          videoChannel: videoChannel,
        })
      );

      // Redirect to the videoplayer.html page
      window.location.href = "videoplayer.html";
    });

    videoList.appendChild(videoProfile);
  }
}

async function getVideoViewCount(videoId) {
  const response = await fetch(
    `${BASE_URL}/videos?key=${API}&part=statistics&id=${videoId}`
  );
  const data = await response.json();
  return data;
}

// views ${viewCount.items[0].statistics.viewCount}

async function getChannelLogo(channelId) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API}`
  );

  const data = await response.json();
  const url = data.items[0].snippet.thumbnails.default.url;
  return url;
}

// async function getVideoStatus(videoId, contentDetails) {
//   const response = await fetch(
//     `${BASE_URL}/videos?key=${API}&part=${contentDetails}&id=${videoId}`
//   );

//   const data = await response.json();
//   console.log(data);
// }

// getVideoStatus("3YJvtBqhEJ0", stats);

const youtubeCategories = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Movies",
  "TV Shows",
  "Comedy",
  "Education",
  "Science & Technology",
  "Sports",
  "Travel",
  "Food",
  "Health & Fitness",
  "Fashion",
  "Beauty",
  "Home & Garden",
  "Pets & Animals",
  "Vehicles",
  "Business & Finance",
  "Technology",
  "Science",
  "Art & Creativity",
  "How-to & DIY",
  "Entertainment",
  "Family & Kids",
  "Books & Literature",
  "History",
  "Philosophy",
  "Religion",
  "Spirituality",
  "Nature",
  "Documentaries",
  "Social Issues",
  "Lifestyle",
  "Gadgets & Gear",
  "Reviews",
  "Unboxing",
  "Events",
  "Conspiracy Theories",
  "Fitness & Workouts",
  "Do It Yourself (DIY)",
  "Cooking & Recipes",
  "Gardening",
  "Travel Guides",
  "Motivation",
  "Productivity",
  "Languages",
  "Photography",
  "Virtual Reality (VR)",
];
const videoCategory = document.querySelector(".video-category");
function addavideoCategory() {
  youtubeCategories.forEach((i) => {
    const item = document.createElement("li");
    item.innerHTML = i;
    // item.addEventListener("click", () => {
    //   document.getElementById("videoList").innerHTML = "";
    //   let searchInput = document.getElementById("search").value;

    //   searchVideos(searchInput);
      
    // })
    videoCategory.appendChild(item);
  });
}
