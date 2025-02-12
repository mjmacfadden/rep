// Array of video data
const videos = [
    {
        id: 1,
        title: "How to Hit Irons Consistently (Simple Golf Tips)",
        description: "In this video PGA Golf Professional Rick Shiels shows you the simple and easy way to hit your golf irons more consistently.",
        youtubeLink: "https://youtu.be/qdRSOKvjNZU?si=m4XnILMT36nBSlK8",
        complete: false
    },
    {
        id: 2,
        title: "CRUSH YOUR 3 WOOD FROM THE FAIRWAY EVERY TIME!",
        description: "PGA Rick Shiels shows you a very simple way to CRUSH YOUR 3 WOOD FROM THE FAIRWAY everytime!",
        youtubeLink: "https://youtu.be/0rNV1srn85w?si=9eEY_34UxNBHrjt9",
        complete: false
    },
    {
        id: 3,
        title: "Using Wedges Is EASY With The 1-2-3 Method!(Simple Golf Tips)",
        description: "Matt Fryer Golf takes you through a full guide and the 1-2-3 method that help him transform his wedge game. ",
        youtubeLink: "https://youtu.be/pAqoE5Gy328?si=yq00zD74FyO0HRJh",
        complete: false
    },
    {
        id: 4,
        title: "This Technique Makes Fairway Woods & Hybrids So Easy!",
        description: "Learn how to strike your hybrid and fairway woods like never before with this simple golf drill created by Danny Maude. ",
        youtubeLink: "https://youtu.be/wpNbNWv7aDk?si=hBziXvm_i5xyiXBh",
        complete: false
    }





    /*
    {
        id: ,
        title: "",
        description: "",
        youtubeLink: "",
        complete: false
    }
    */
];

// Array of courses
const courses = [
    {
        title: "Golf",
        videoIds: [1, 2, 3, 4]
    },
    {
        title: "Football",
        videoIds: [1]
    },
    {
        title: "Hockey",
        videoIds: [1]
    },
    {
        title: "Soccer",
        videoIds: [1]
    },
    {
        title: "Baseball",
        videoIds: [1]
    }
];
// Function to display courses and populate the first course on load
function displayCourses() {
    const coursesList = document.getElementById("courses");
    const courseTitleElement = document.getElementById("course");

    // Populate courses list
    courses.forEach((course, index) => {
        const courseItem = document.createElement("li");
        courseItem.textContent = course.title;
        courseItem.classList.add('list-group-item', 'course-item');
        courseItem.setAttribute("data-video-ids", course.videoIds.join(','));
        courseItem.addEventListener("click", () => {
            updateVideoList(course.videoIds);
            courseTitleElement.textContent = course.title;
            updateURLWithCourseAndVideo(course.title, course.videoIds[0]); // Update URL with course title and first video ID
        });
        coursesList.appendChild(courseItem);

        // Display the first course on page load if no URL params are present
        if (index === 0 && !window.location.search) {
            updateVideoList(course.videoIds); // Populate video list for the first course
            courseTitleElement.textContent = course.title; // Set course title
            updateURLWithCourseAndVideo(course.title, course.videoIds[0]); // Update URL with course title and first video ID
        }
    });

    // Check URL parameters and display appropriate course and video on page load
    const urlParams = new URLSearchParams(window.location.search);
    const courseTitle = urlParams.get('course');
    const videoId = parseInt(urlParams.get('video'), 10);

    if (courseTitle && videoId) {
        const course = courses.find(c => c.title === courseTitle);
        if (course) {
            updateVideoList(course.videoIds);
            courseTitleElement.textContent = course.title;
            const video = videos.find(v => v.id === videoId);
            if (video) {
                playVideo(video);
            }
        }
    }
}

// Function to update video list based on selected course
function updateVideoList(videoIds) {
    const videoList = document.getElementById("videoList");
    videoList.innerHTML = ''; // Clear existing video list

    videoIds.forEach(videoId => {
        const video = videos.find(v => v.id === videoId);
        if (video) {
            const listItem = document.createElement("li");
            const completionIcon = document.createElement("i");

            // Retrieve completion status from local storage
            const completionStatus = localStorage.getItem(`video_${videoId}_completed`);
            video.complete = completionStatus === 'true'; // Set video's completion status

            // Determine icon and color based on completion status
            if (video.complete) {
                completionIcon.classList.add('bi', 'bi-check-circle-fill');
                completionIcon.style.color = 'green';
            } else {
                completionIcon.classList.add('bi', 'bi-check-circle');
                completionIcon.style.color = 'inherit';
            }

            listItem.textContent = video.title;
            listItem.classList.add('list-group-item');
            listItem.setAttribute("data-id", video.id);

            // Add completion icon to the list item
            listItem.appendChild(completionIcon);
            videoList.appendChild(listItem);

            // Clicking on video list item should play the video and update the URL
            listItem.addEventListener("click", () => {
                playVideo(video); // Play the video
                updateURLWithCourseAndVideo(document.getElementById("course").textContent, video.id); // Update URL with current course and video ID
            });

            // Toggle completion status on icon click
            completionIcon.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent click event from propagating to the list item
                video.complete = !video.complete; // Toggle completion status
                saveVideoCompletionStatus(video.id, video.complete); // Save to local storage

                // Update the completion icon appearance based on the new completion status
                if (video.complete) {
                    completionIcon.classList.remove('bi-check-circle');
                    completionIcon.classList.add('bi-check-circle-fill');
                    completionIcon.style.color = 'green';
                } else {
                    completionIcon.classList.remove('bi-check-circle-fill');
                    completionIcon.classList.add('bi-check-circle');
                    completionIcon.style.color = 'inherit';
                }
            });
        }
    });

    // Load the first video from the updated video list into the video player
    if (videoIds.length > 0) {
        const firstVideoId = videoIds[0];
        const firstVideo = videos.find(v => v.id === firstVideoId);
        if (firstVideo) {
            playVideo(firstVideo);
        }
    }
}

// Function to save video completion status to local storage
function saveVideoCompletionStatus(videoId, completed) {
    localStorage.setItem(`video_${videoId}_completed`, completed);
}

// Function to play selected video and update the URL
function playVideo(video) {
    const videoId = getYouTubeVideoId(video.youtubeLink);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const videoData = document.getElementById("videoData");
    videoData.innerHTML = `
        <h2>${video.title}</h2>
        <p>${video.description}</p>
    `;

    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.innerHTML = `
        <iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
    `;
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return 'Invalid video URL';
    }
}

// Function to update URL with course and video ID
function updateURLWithCourseAndVideo(courseTitle, videoId) {
    const url = new URL(window.location);
    url.searchParams.set('course', courseTitle);
    url.searchParams.set('video', videoId);
    window.history.pushState({}, '', url);
}

// Display initial list of courses and populate the first course on load
displayCourses();



const shareButton = document.getElementById('learnShareButton');
//const url = window.location.href;
const baseUrl = window.location.origin + window.location.pathname; // Get base URL without query parameters
const queryParams = window.location.search; // Get query parameters if they exist

const shareMessage = `Check out this cigar box guitar lesson: ${baseUrl}${queryParams}`;

shareButton.addEventListener('click', function() {
    //const url = window.location.href;
    const baseUrl = window.location.origin + window.location.pathname; // Get base URL without query parameters
    const queryParams = window.location.search; // Get query parameters if they exist
    const shareMessage = `Check out this cigar box guitar lesson: ${baseUrl}${queryParams}`;
    if (navigator.share) {
        // Share using Web Share API (mobile)
        navigator.share({
            title: document.title,
            text: `Check out this cigar box guitar lesson: ${baseUrl}${queryParams}`
        })
    } else {
        // Copy URL to clipboard (non-mobile)
        copyToClipboard(shareMessage);
    }
});

// Function to display a message on the webpage
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.backgroundColor = 'rgba(0, 123, 255, 1)';
    messageElement.style.color = '#fff';
    messageElement.style.padding = '10px';
    messageElement.style.position = 'fixed';
    messageElement.style.top = '70px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.zIndex = '9999';
    document.body.appendChild(messageElement);

    // Remove the message after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
        messageElement.remove();
    }, 3000); // Remove after 3 seconds
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    const textField = document.createElement('textarea');
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    document.body.removeChild(textField);
    displayMessage("Link copied to clipboard!");
}