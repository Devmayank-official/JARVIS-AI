let speechSynthesis = window.speechSynthesis;
let speechBubble = document.getElementById('pulse-animation');
let taskList = document.getElementById('task-list');
let messages = document.getElementById('messages');
let currentTime = document.getElementById('current-time');
let taskMode = false;
let savedTasks = JSON.parse(localStorage.getItem("aiTasks")) || [];

// Real-time clock
setInterval(() => {
    let date = new Date();
    currentTime.innerHTML = `Current Time: ${date.toLocaleTimeString()} | ${date.toLocaleDateString()}`;
}, 1000);

// Speak
function speakText(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === "Google UK English Male");
    speechSynthesis.speak(utterance);
}

// Show animation + speak
function displayAIResponse(response) {
    messages.innerHTML += `<div class="ai-response">${response}</div>`;
    speechBubble.style.display = 'block';
    speakText(response);
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, 3000);
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem("aiTasks", JSON.stringify(savedTasks));
}

// Show tasks
function displayTasks() {
    taskList.innerHTML = "";
    savedTasks.forEach((task, i) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${i + 1}. ${task}`;
        taskList.appendChild(listItem);
    });
}

// Handle input
function handleUserInput() {
    let input = document.getElementById('user-input').value.trim();

    if (taskMode) {
        if (input) {
            savedTasks.push(input);
            updateLocalStorage();
            displayAIResponse(`Task saved: ${input}`);
            displayTasks();
        }
    } else {
        if (input.toLowerCase().includes("date")) {
            displayAIResponse(`Today's date is ${new Date().toLocaleDateString()}`);
        } else if (input.toLowerCase().includes("time")) {
            displayAIResponse(`The time is ${new Date().toLocaleTimeString()}`);
        } else if (input.toLowerCase().includes("reminder")) {
            displayAIResponse("Reminder set!");
        } else if (input.toLowerCase().includes("task") || input.toLowerCase().includes("to-do")) {
            if (savedTasks.length === 0) {
                displayAIResponse("You have no tasks saved.");
            } else {
                let taskText = savedTasks.map((t, i) => `${i + 1}. ${t}`).join("\n");
                displayAIResponse(`Here are your saved tasks:\n${taskText}`);
            }
        } else {
            displayAIResponse("Sorry, I didn’t understand that.");
        }
    }

    document.getElementById('user-input').value = '';
}

// Task mode toggle
document.getElementById('task-mode-btn').addEventListener('click', function () {
    taskMode = !taskMode;
    if (taskMode) {
        displayAIResponse("Task mode activated. Please type your tasks.");
    } else {
        displayAIResponse("Task mode deactivated. Your tasks are saved.");
    }
});

// Send input
document.getElementById('send-btn').addEventListener('click', handleUserInput);

// Startup
window.onload = function () {
    displayTasks();
    setTimeout(() => {
        displayAIResponse("Welcome back, sir. Systems are online and fully operational.");
    }, 1000);
};
