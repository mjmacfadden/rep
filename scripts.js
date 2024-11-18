// Array of GIFs with IDs, names, and descriptions
const exercises = [
    { id: 1, name: "Kettlebell Snatch", description: "TK-1", gif: "img/kettlebell_snatch.gif" },
    { id: 2, name: "Kettlebell Squat", description: "TK-2", gif: "img/kettlebell_squat.gif" },
    { id: 3, name: "Kettlebell Swing", description: "TK-3", gif: "img/kettlebell_swing.gif" },
    { id: 4, name: "Kettlebell Single Leg Deadlift", description: "TK-4", gif: "img/kettlebell_single_leg_deadlift.gif" },
    { id: 5, name: "Kettlebell Lunge", description: "TK-5", gif: "img/kettlebell_lunge.gif" },
    { id: 6, name: "Kettlebell One Arm Squat", description: "TK-6", gif: "img/kettlebell_one_arm_squat.gif" },
];

const countdownGif = "img/countdown.gif";
const pauseImage = "img/pause.jpg"; // Path to pause image
const countdownDuration = 4200; // Countdown duration in milliseconds
let timer; // Holds the current timeout
let currentIndex = 0;
let isCountdown = false;
let isPaused = true;

// Parse the URL for IDs
const urlParams = new URLSearchParams(window.location.search);
const selectedIDs = urlParams.get("ids")?.split(",").map(Number) || [];
const selectedExercises = exercises.filter((ex) => selectedIDs.includes(ex.id));

const gifContainer = document.getElementById("gifContainer");
const descriptionElement = document.getElementById("description");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const startOverButton = document.getElementById("startOverButton");


const sets = parseInt(urlParams.get("sets"), 10) || 1; // Default to 1 set if not specified
let currentSet = 1;


function displayNext() {
  if (selectedExercises.length === 0) {
      gifContainer.innerHTML = `<p>No exercises selected. Please provide IDs in the URL.</p>`;
      descriptionElement.textContent = "";
      return;
  }

  if (isPaused) return;

  if (currentIndex === 0 && currentSet > sets) {
      // End workout and display success message
      gifContainer.innerHTML = `<p></p>`;
      descriptionElement.textContent = "";
      document.getElementById("successMessage").style.display = "block";
      return;
  }

  if (isCountdown) {
      // Show exercise after countdown
      const exercise = selectedExercises[currentIndex];
      gifContainer.innerHTML = `<img src="${exercise.gif}" alt="${exercise.name}">`;
      descriptionElement.textContent = exercise.description;
      currentIndex++;
      if (currentIndex >= selectedExercises.length) {
          currentIndex = 0;
          currentSet++;
      }
      isCountdown = false;
      timer = setTimeout(displayNext, 5000); // Show the exercise for 5 seconds
  } else {
      // Show countdown
      gifContainer.innerHTML = `<img src="${countdownGif}" alt="Countdown">`;
      descriptionElement.textContent = "Get ready for the next exercise!";
      isCountdown = true;
      timer = setTimeout(displayNext, countdownDuration); // Show countdown for its duration
  }
}

playButton.addEventListener("click", () => {
  isPaused = false;
  playButton.disabled = true;
  pauseButton.disabled = false;

  const imgElement = gifContainer.querySelector("img");

  if (imgElement && imgElement.src.includes(pauseImage)) {
      // Resume from pause
      const currentGif = isCountdown ? countdownGif : selectedExercises[currentIndex].gif;
      gifContainer.innerHTML = `<img src="${currentGif}" alt="Resumed GIF">`;
  }

  displayNext();
});

pauseButton.addEventListener("click", () => {
    isPaused = true;
    playButton.disabled = false;
    pauseButton.disabled = true;

    // Show pause image
    gifContainer.innerHTML = `<img src="${pauseImage}" alt="Paused">`;
    descriptionElement.textContent = "Workout Paused";
    clearTimeout(timer);
});

startOverButton.addEventListener("click", () => {
  isPaused = true;
  playButton.disabled = false;
  pauseButton.disabled = true;
  clearTimeout(timer);
  currentIndex = 0;
  currentSet = 1;
  isCountdown = false;

  gifContainer.innerHTML = `<p>Press Play to Start the Workout!</p>`;
  descriptionElement.textContent = "";
  document.getElementById("successMessage").style.display = "none";
});

descriptionElement.textContent = `Exercise: ${exercise.description} (Set ${currentSet} of ${sets})`;


// Initial State
gifContainer.innerHTML = `<p>Press Play to Start the Workout!</p>`;