// ========== LOGIN FUNCTION ==========
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
      error.innerText = "❌ Incorrect username or password";
    }
  } catch (err) {
    error.innerText = "⚠️ Error loading student data.";
  }
}
// ========== LOAD DASHBOARD ==========
function loadDashboard() {
  const fullname = localStorage.getItem("fullname");
  const cls = localStorage.getItem("class");

  if (!fullname || !cls) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("student-name").innerText = fullname;
  document.getElementById("student-class").innerText = cls;
}

// ========== START TEST ==========
function beginTest() {
  localStorage.setItem("testFile", "questions.json");
  window.location.href = "test.html";
}
// ========== VARIABLES ==========
let questions = [];
let current = 0;
let score = 0;
let timer = null;

// Load Questions (shuffle)
async function loadQuestions() {
  try {
    const file = localStorage.getItem("testFile") || "questions.json";
    const res = await fetch(file);
    if (!res.ok) throw new Error("Failed to load questions");
    questions = await res.json();
    questions = questions.sort(() => Math.random() - 0.5);
    showQuestion();
  } catch (err) {
    alert("❌ Could not load questions.");
    console.error(err);
  }
}

// Show question
function showQuestion() {
  if (current >= questions.length) return showResult();

  const q = questions[current];
  document.getElementById("question-text").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach(opt => {
    const label = document.createElement("label");
    label.className = "option-label";
    label.innerHTML = `
      <input type="radio" name="option" value="${opt}" onclick="selectOption(this, '${q.answer}')"> ${opt}
    `;
    optionsDiv.appendChild(label);
  });

  document.getElementById("next-btn").disabled = true;
  document.getElementById("result-box").classList.add("hidden");
  startTimer();
}

// Select option
function selectOption(input, correct) {
  stopTimer();
  const all = document.getElementsByName("option");
  all.forEach(r => r.disabled = true);

  if (input.value === correct) {
    input.parentElement.classList.add("correct");
    showConfetti();
    score++;
  } else {
    input.parentElement.classList.add("wrong");
    showSadFace();
  }

  document.getElementById("next-btn").disabled = false;
}

// Timer
function startTimer() {
  let time = 40;
  document.getElementById("time").innerText = time;
  document.getElementById("progress").style.width = "100%";

  timer = setInterval(() => {
    time--;
    document.getElementById("time").innerText = time;
    document.getElementById("progress").style.width = `${(time / 40) * 100}%`;

    if (time === 0) {
      clearInterval(timer);
      autoSelect();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// Auto-select correct
function autoSelect() {
  const correct = questions[current].answer;
  const radios = document.getElementsByName("option");
  radios.forEach(r => {
    r.disabled = true;
    if (r.value === correct) r.parentElement.classList.add("correct");
  });
  showSadFace();
  document.getElementById("next-btn").disabled = false;
}

// Go to next question
function nextQuestion() {
  stopTimer();
  current++;
  showQuestion();
}

// Show final result
function showResult() {
  document.getElementById("question-box").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score-result").innerText = `You scored ${score} out of ${questions.length}`;
}

// Confetti and sad face
function showConfetti() {
  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
}
function showSadFace() {
  const sad = document.createElement("div");
  sad.innerText = "😢";
  sad.style = `
    font-size: 80px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    animation: fadeOut 2s ease-out;
  `;
  document.body.appendChild(sad);
  setTimeout(() => sad.remove(), 2000);
}


