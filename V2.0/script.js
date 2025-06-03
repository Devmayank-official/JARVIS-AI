// Jarvis AI V2.0 - Full with Calculator & Features

// Globals
const output = document.getElementById('output');
const commandInput = document.getElementById('commandInput');
const speakingPulse = document.getElementById('speakingPulse');
const todoListDiv = document.getElementById('todoList');
const remindersListDiv = document.getElementById('remindersList');
const taskModeDiv = document.getElementById('taskMode');
const taskInputArea = document.getElementById('taskInput');
const calculatorDiv = document.getElementById('calculator');

// --- Start Up Message with Voice ---
window.onload = () => {
  appendOutput("Jarvis AI V2.0 Online. Ready for your commands, Sir.");
  speak("Jarvis AI V 2 point 0 online. Ready for your commands, Sir.");

  // Load saved tasks and reminders from localStorage
  loadTasks();
  loadReminders();
};

// --- Append messages to output window ---
function appendOutput(text) {
  output.textContent += text + "\n";
  output.scrollTop = output.scrollHeight;
}

// --- Speak Text with AI Pulse ---
function speak(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.pitch = 1.1;
  utter.rate = 1;
  utter.volume = 1;

  utter.onstart = () => { speakingPulse.style.display = 'block'; };
  utter.onend = () => { speakingPulse.style.display = 'none'; };

  window.speechSynthesis.speak(utter);
}

// --- Handle Enter key on command input ---
commandInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    processCommand(commandInput.value.trim());
    commandInput.value = '';
  }
});

// --- Command Processor ---
function processCommand(cmd) {
  if (!cmd) return;
  appendOutput("> " + cmd.toLowerCase());

  if (cmd.toLowerCase() === 'help') {
    appendOutput("Commands: task, reminder, date, time, calculator, clear, exit");
    speak("Here are some commands: task, reminder, date, time, calculator, clear, exit");
  }
  else if (cmd.toLowerCase() === 'task' || cmd.toLowerCase() === 'to-do list') {
    showTasks();
    speak("Here are your saved tasks.");
  }
  else if (cmd.toLowerCase().startsWith('reminder')) {
    handleReminderCommand(cmd);
  }
  else if (cmd.toLowerCase() === 'date') {
    let today = new Date();
    appendOutput("Today's date is " + today.toDateString());
    speak("Today's date is " + today.toDateString());
  }
  else if (cmd.toLowerCase() === 'time') {
    let now = new Date();
    appendOutput("Current time is " + now.toLocaleTimeString());
    speak("Current time is " + now.toLocaleTimeString());
  }
  else if (cmd.toLowerCase() === 'clear') {
    output.textContent = '';
  }
  else if (cmd.toLowerCase() === 'calculator') {
    toggleCalculator(true);
    speak("Calculator is now visible.");
  }
  else {
    appendOutput("Unknown command. Type 'help' for commands.");
    speak("Unknown command. Please try again.");
  }
}

// --- Tasks ---
let taskMode = false;
function toggleTaskMode() {
  taskMode = !taskMode;
  taskModeDiv.style.display = taskMode ? 'block' : 'none';
  if (taskMode) {
    speak("Task mode activated. Please type your tasks.");
  } else {
    saveTasks();
    speak("Task mode deactivated. Tasks saved.");
  }
}

function saveTasks() {
  const tasks = taskInputArea.value.trim();
  localStorage.setItem('jarvisTasks', tasks);
  taskInputArea.value = tasks;
  showTasks();
}

function loadTasks() {
  const savedTasks = localStorage.getItem('jarvisTasks') || '';
  taskInputArea.value = savedTasks;
  showTasks();
}

function showTasks() {
  const tasks = localStorage.getItem('jarvisTasks') || '';
  if (!tasks) {
    todoListDiv.textContent = 'No tasks saved.';
  } else {
    let list = tasks.split('\n').map(task => '- ' + task).join('\n');
    todoListDiv.textContent = "Your Tasks:\n" + list;
  }
}

// --- Reminders ---
function handleReminderCommand(cmd) {
  // Example: reminder 13:30 Take medicine
  const parts = cmd.split(' ');
  if (parts.length < 3) {
    appendOutput("Reminder format: reminder HH:MM your message");
    speak("Please say reminder followed by time and message.");
    return;
  }
  const timePart = parts[1];
  const message = parts.slice(2).join(' ');
  if (!/^\d{1,2}:\d{2}$/.test(timePart)) {
    appendOutput("Invalid time format. Use HH:MM 24 hour format.");
    speak("Invalid time format. Please use hours and minutes.");
    return;
  }
  addReminder(timePart, message);
}

let reminders = [];

function addReminder(timeStr, msg) {
  reminders.push({ time: timeStr, message: msg });
  localStorage.setItem('jarvisReminders', JSON.stringify(reminders));
  appendOutput(`Reminder set for ${timeStr}: ${msg}`);
  speak(`Reminder set for ${timeStr}`);
  showReminders();
}

function loadReminders() {
  const saved = localStorage.getItem('jarvisReminders');
  if (saved) {
    reminders = JSON.parse(saved);
  }
  showReminders();
}

function showReminders() {
  if (reminders.length === 0) {
    remindersListDiv.textContent = 'No reminders set.';
    return;
  }
  remindersListDiv.textContent = 'Reminders:\n' + reminders.map(r => `${r.time} - ${r.message}`).join('\n');
}

// Check reminders every minute
setInterval(() => {
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
  reminders.forEach((r, i) => {
    if (r.time === currentTime) {
      speak(`Reminder: ${r.message}`);
      appendOutput(`Reminder: ${r.message}`);
      // Remove reminder after alerting
      reminders.splice(i, 1);
      localStorage.setItem('jarvisReminders', JSON.stringify(reminders));
      showReminders();
    }
  });
}, 60000);

// --- Calculator ---
let calcExpression = "";

function toggleCalculator(show) {
  if (typeof show === 'boolean') {
    calculatorDiv.style.display = show ? 'block' : 'none';
  } else {
    calculatorDiv.style.display = calculatorDiv.style.display === 'none' ? 'block' : 'none';
  }
}

function press(val) {
  if (calcExpression === "0" && val !== ".") {
    calcExpression = val;
  } else {
    calcExpression += val;
  }
  updateCalcDisplay();
}

function updateCalcDisplay() {
  const display = document.getElementById('calcDisplay');
  display.textContent = calcExpression || "0";
}

function clearDisplay() {
  calcExpression = "";
  updateCalcDisplay();
  speak("Calculator cleared.");
}

function calculate() {
  try {
    // Replace × and ÷ with * and /
    let exp = calcExpression.replace(/×/g, "*").replace(/÷/g, "/");
    // Eval is safe here because input is restricted to calculator buttons
    let result = eval(exp);
    calcExpression = result.toString();
    updateCalcDisplay();
    speak(`Your result is ${result}`);
  } catch {
    calcExpression = "";
    updateCalcDisplay();
    speak("Invalid calculation.");
  }
}

