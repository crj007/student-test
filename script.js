// ======= LOGIN FUNCTION =======
async function login() {
  const uid = document.getElementById("userid").value.trim();
  const pw = document.getElementById("password").value.trim();
  const error = document.getElementById("error-msg");

  try {
    const res = await fetch("students.json");
    const students = await res.json();
    const user = students.find(s => s.username === uid && s.password === pw);

    if (user) {
      localStorage.setItem("username", user.username);
      localStorage.setItem("fullname", user.fullname);
      localStorage.setItem("class", user.class);
      window.location.href = "dashboard.html";
    } else {
      error.innerText = "❌ Incorrect username or password.";
    }
  } catch (err) {
    error.innerText = "⚠️ Unable to load student data.";
  }
}

// ======= BEGIN TEST BUTTON =======
function beginTest() {
  localStorage.setItem("testFile", "questions.json");
  window.location.href = "test.html";
}

// ======= DASHBOARD NAME LOAD =======
function loadDashboard() {
  const name = localStorage.getItem("fullname");
  const cls = localStorage.getItem("class");

  if (!name || !cls) {
    window.location.href = "index.html";
  }

  document.getElementById("student-name").innerText = name;
  document.getElementById("student-class").innerText = cls;
}

// ==========================
// Global Variables
// ==========================
let questions = [];
let current = 0;
let score = 0;
let timer = null;

// ==========================
// Begin Test (from dashboard)
// ==========================
function beginTest() {
  localStorage.setItem("testFile", "questions.json");
  window.location.href = "test.html";
}

// ==========================
// Load Student Info on Dashboard
// ==========================
function loadDashboard() {
  const name = localStorage.getItem("fullname");
  const cls = localStorage.getItem("class");
  if (!name || !cls) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("student-name").innerText = name;
  document.getElementById("student-class").innerText = cls;
}

// ==========================
// Load Questions
// ==========================
async function loadQuestions() {
  try {
    const file = localStorage.getItem("testFile") || "questions.json";
    const res = await fetch(file);
    questions = await res.json();
    shuffleArray(questions); // shuffle
    showQuestion();
  } catch (err) {
    alert("⚠️ Failed to load questions.");
  }
}

// ==========================
// Display One Question
// ==========================
function showQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }

  const q = questions[current];

  document.getElementById("qnumber").innerText = `Q${current + 1}`;
  document.getElementById("question-text").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const label = document.createElement("label");
    label.className = "option-label";
    label.innerHTML = `
      <input type="radio" name="option" value="${opt}" onclick="selectOption(this, '${q.answer}')">
      ${opt}
    `;
    optionsDiv.appendChild(label);
  });

  document.getElementById("next-btn").disabled = true;
  startTimer();
}

// ==========================
// Select Option
// ==========================
function selectOption(radio, correct) {
  stopTimer();
  const selected = radio.value;
  const options = document.getElementsByName("option");
  options.forEach(opt => opt.disabled = true);

  if (selected === correct) {
    radio.parentElement.classList.add("correct");
    score++;
    if (typeof confetti === "function") confetti();
  } else {
    radio.parentElement.classList.add("wrong");
  }

  document.getElementById("next-btn").disabled = false;
}

// ==========================
// Timer
// ==========================
function startTimer() {
  let time = 40;
  const timeText = document.getElementById("time");
  const progress = document.getElementById("progress");

  timeText.innerText = time;
  progress.style.width = "100%";

  timer = setInterval(() => {
    time--;
    timeText.innerText = time;
    progress.style.width = `${(time / 40) * 100}%`;

    if (time === 0) {
      clearInterval(timer);
      autoSelect();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// ==========================
// Auto Select (on timeout)
// ==========================
function autoSelect() {
  const correct = questions[current].answer;
  const radios = document.getElementsByName("option");

  radios.forEach(r => {
    r.disabled = true;
    if (r.value === correct) {
      r.parentElement.classList.add("correct");
    }
  });

  document.getElementById("next-btn").disabled = false;
}

// ==========================
// Next Question
// ==========================
function nextQuestion() {
  stopTimer();
  current++;
  showQuestion();
}

// ==========================
// Show Final Result
// ==========================
function showResult() {
  document.getElementById("question-box").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score-result").innerText =
    `🎯 You scored ${score} out of ${questions.length}`;
}

// ==========================
// Shuffle Utility
// ==========================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


