// const API_KEY = "AIzaSyBzSTXIrBHXKoQPLmhHTeGL87z-DyGUYBY";
// const API_KEY = "AIzaSyDa95KzoCkJIH-3CILO7QsE67ufMF7bkLM";
const API_KEY = "AIzaSyD8O_WLqEMxyxPXQzgKQo6taUE2REbw5Wk";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

const videoList = document.getElementById("videoList");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search");
const videoCategory = document.querySelector(".video-category");
const videosuggestion = document.getElementById("video-suggestions");

document.addEventListener("DOMContentLoaded", () => {
  fetchVideos("all", 10);
  addVideoCategory();
});

searchBtn.addEventListener("click", () => {
  searchVideos();
});

async function fetchVideos(searchQuery, maxResults) {
  try {
    const response = await fetch(
      `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
    );

    const data = await response.json();
    renderVideos(data.items);
  } catch (error) {
    console.error("Error fetching videos:", error.message);
  }
}

async function renderVideos(videos) {
  for (const video of videos) {
    const videoProfile = await createVideoProfile(video);
    videoList.appendChild(videoProfile);
  }
}

async function createVideoProfile(video) {
  const videoProfile = document.createElement("div");
  videoProfile.classList.add("videoprofile");
  const viewCount = await getVideoViewCount(video.id.videoId);
  const logo = await getChannelLogo(video.snippet.channelId);

  videoProfile.dataset.videoId = video.id.videoId;
  videoProfile.dataset.videoTitle = video.snippet.title;
  videoProfile.dataset.videoChannel = video.snippet.channelTitle;
  videoProfile.dataset.channellogo = logo;

  const formattedTime = formatPublishTime(video.snippet.publishTime);

  videoProfile.innerHTML = `
        <div class="thumbnail">
            <img src="${video.snippet.thumbnails.high.url}" alt="">
        </div>
        <div class="discription">
            <div class="channel-logo">
                <img src="${logo}" alt="Channel Logo">
            </div>
            <a href="#" class="title">${video.snippet.title}</a>
        </div>
         <div class="channeltitle">${video.snippet.channelTitle}</div>
       <div class = "title-count">
        <div class="channeltitle">${formattedTime}</div>
        <div class=""> view :${" " + viewCount}</div>
        </div>
       
    `;

  videoProfile.addEventListener("click", () => {
    const videoId = videoProfile.dataset.videoId;
    const videoTitle = videoProfile.dataset.videoTitle;
    const videoChannel = videoProfile.dataset.videoChannel;
    const channellogo = videoProfile.dataset.channellogo;

    sessionStorage.setItem(
      "selectedVideo",
      JSON.stringify({
        videoId,
        videoTitle,
        videoChannel,
        channellogo,
      })
    );

    window.location.href = "videoplayer.html";
  });

  // console.log(videoProfile);
  return videoProfile;
}

async function getChannelLogo(channelId) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
  );

  const data = await response.json();

  const url = data.items[0].snippet.thumbnails.default.url;
  return url;
}

async function getVideoViewCount(videoId) {
  const response = await fetch(
    `${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`
  );
  const data = await response.json();
  const viewCount = data.items[0].statistics.viewCount;
  return viewCount;
}

function formatPublishTime(isoTimestamp) {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const timeDiffInSeconds = Math.floor((now - date) / 1000);

  if (timeDiffInSeconds < 60) return "Just now";
  else if (timeDiffInSeconds < 3600)
    return `${Math.floor(timeDiffInSeconds / 60)} minute${
      timeDiffInSeconds >= 120 ? "s" : ""
    } ago`;
  else if (timeDiffInSeconds < 86400)
    return `${Math.floor(timeDiffInSeconds / 3600)} hour${
      timeDiffInSeconds >= 7200 ? "s" : ""
    } ago`;
  else if (timeDiffInSeconds < 2592000)
    return `${Math.floor(timeDiffInSeconds / 86400)} day${
      timeDiffInSeconds >= 172800 ? "s" : ""
    } ago`;
  else if (timeDiffInSeconds < 31536000)
    return `${Math.floor(timeDiffInSeconds / 2592000)} month${
      timeDiffInSeconds >= 5184000 ? "s" : ""
    } ago`;
  else
    return `${now.getFullYear() - date.getFullYear()} year${
      now.getFullYear() - date.getFullYear() > 1 ? "s" : ""
    } ago`;
}

function searchVideos() {
  const searchQuery = searchInput.value.trim();
  if (searchQuery !== "") {
    videoList.innerHTML = "";
    fetchVideos(searchQuery, 10);
  }
}

function addVideoCategory() {
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
  ];

  const listItems = youtubeCategories.map((category) => {
    const listItem = document.createElement("li");
    listItem.textContent = category;
    listItem.addEventListener("click", () => {
      listItems.forEach((item) => {
        item.classList.remove("active");
      });

      listItem.classList.add("active");

      searchInput.value = "";
      const search = listItem.textContent;
      searchInput.value = search;
      searchVideos();
      searchInput.value = "";
    });
    return listItem;
  });

  listItems.forEach((item) => {
    videoCategory.appendChild(item);
  });
}

// theam.style.display = "none";
const text = document.querySelectorAll(
  ".sidebar li , span , a , p, h1 , div #videoList div"
);

const theam = document.getElementById("theam");

theam.addEventListener("click", async () => {
  document.body.classList.toggle("dark");
  for (let i = 0; i < text.length; i++) {
    text[i].classList.toggle("white");
  }
});
