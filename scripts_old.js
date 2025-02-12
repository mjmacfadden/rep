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

let workoutProgressBar, setProgressBar;
let workoutProgressValue = 0, setProgressValue = 0;
let workoutProgressInterval, setProgressInterval;
const exerciseDuration = 10000; // Duration of each exercise in milliseconds

function startProgressAnimation() {
    if (workoutProgressBar && setProgressBar) {
        // Animate workout progress bar for each exercise
        workoutProgressValue = 0; // Reset for each exercise
        clearInterval(workoutProgressInterval);
        workoutProgressInterval = setInterval(() => {
            workoutProgressValue += 100 / (exerciseDuration / 1000); // Increment per second
            if (workoutProgressValue >= 100) {
                workoutProgressValue = 100;
            }
            workoutProgressBar.style.width = `${workoutProgressValue}%`;
            workoutProgressBar.setAttribute("aria-valuenow", workoutProgressValue);
        }, 1000); // Update every second

        // Animate set progress bar
        clearInterval(setProgressInterval);
        setProgressInterval = setInterval(() => {
            setProgressValue += (100 / sets) / (selectedExercises.length * (exerciseDuration / 1000)); // Increment based on total workout time
            if (setProgressValue >= 100) {
                setProgressValue = 100;
            }
            setProgressBar.style.width = `${setProgressValue}%`;
            setProgressBar.setAttribute("aria-valuenow", setProgressValue);
        }, 1000); // Update every second
    }
}

function stopProgressAnimation() {
    clearInterval(workoutProgressInterval);
    clearInterval(setProgressInterval);
}

function displayNext() {
    if (selectedExercises.length === 0) {
        gifContainer.innerHTML = `<p>Choose a workout from the list below.</p>`;
        descriptionElement.textContent = "";
        stopProgressAnimation();
        return;
    }

    if (isPaused) return;

    if (currentIndex === 0 && currentSet > sets) {
        gifContainer.innerHTML = `<p></p>`;
        descriptionElement.textContent = "";
        document.getElementById("successMessage").style.display = "block";
        stopProgressAnimation();
        return;
    }

    if (isCountdown) {
        const exercise = selectedExercises[currentIndex];
        gifContainer.innerHTML = `<img src="${exercise.gif}" alt="${exercise.name}">`;
        descriptionElement.textContent = `Exercise: ${exercise.description} (Set ${currentSet} of ${sets})`;
        startProgressAnimation();
        currentIndex++;
        if (currentIndex >= selectedExercises.length) {
            currentIndex = 0;
            currentSet++;
        }
        isCountdown = false;
        timer = setTimeout(() => {
            stopProgressAnimation();
            displayNext();
        }, exerciseDuration); // Show the exercise for 10 seconds
    } else {
        gifContainer.innerHTML = `<img src="${countdownGif}" alt="Countdown">`;
        descriptionElement.textContent = "Get ready for the next exercise!";
        stopProgressAnimation();  // Stop animation during countdown
        isCountdown = true;
        timer = setTimeout(displayNext, countdownDuration); // Show countdown for its duration
    }
}

function initializeProgressBars() {
    workoutProgressBar = document.querySelector("#workoutProgress .progress-bar");
    setProgressBar = document.querySelector("#setProgress .progress-bar");
    
    if (!workoutProgressBar || !setProgressBar) {
        console.error("Progress bar elements not found");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initializeProgressBars();
});

playButton.addEventListener("click", () => {
    if (selectedExercises.length === 0) {
        alert("Please select a workout first.");
        isPaused = true;
        playButton.disabled = false;
        pauseButton.disabled = true;
        return;
    }
    isPaused = false;
    playButton.disabled = true;
    pauseButton.disabled = false;

    const imgElement = gifContainer.querySelector("img");
    if (imgElement && imgElement.src.includes(pauseImage)) {
        const currentGif = isCountdown ? countdownGif : selectedExercises[currentIndex].gif;
        gifContainer.innerHTML = `<img src="${currentGif}" alt="Resumed GIF">`;
        startProgressAnimation();
    }

    displayNext();
});

pauseButton.addEventListener("click", () => {
    isPaused = true;
    playButton.disabled = false;
    pauseButton.disabled = true;

    gifContainer.innerHTML = `<img id="pause_logo" src="${pauseImage}" alt="Paused">`;
    descriptionElement.textContent = "Workout Paused";
    clearTimeout(timer);
    stopProgressAnimation();
});

startOverButton.addEventListener("click", () => {
    isPaused = true;
    playButton.disabled = false;
    pauseButton.disabled = true;
    clearTimeout(timer);
    stopProgressAnimation();
    currentIndex = 0;
    currentSet = 1;
    isCountdown = false;
    workoutProgressBar.style.width = "0%";
    setProgressBar.style.width = "0%";
    gifContainer.innerHTML = `<p>Press Play to Start the Workout!</p>`;
    descriptionElement.textContent = "";
    document.getElementById("successMessage").style.display = "none";
});

// Initial State
if (selectedExercises.length === 0) {
    gifContainer.innerHTML = `<p>Choose a workout from the list below.</p>`;
} else {
    gifContainer.innerHTML = `<p>Press Play to Start the Workout!</p>`;
}