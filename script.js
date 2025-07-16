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

let questions = [];
let current = 0;
let score = 0;
let timer = null;

// ========== Load & Shuffle Questions ==========
async function loadQuestions() {
  try {
    const res = await fetch("questions.json");
    const data = await res.json();

    questions = shuffleArray(data); // Shuffle questions
    current = 0;
    score = 0;

    showQuestion();
  } catch (err) {
    alert("❌ Error loading questions.");
    console.error(err);
  }
}

// ========== Shuffle ==========
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ========== Show a Question ==========
function showQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }

  const q = questions[current];
  document.getElementById("qnumber").innerText = `Q${current + 1}`;
  document.getElementById("question-text").innerText = q.question;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options.forEach(opt => {
    const label = document.createElement("label");
    label.className = "option-label";
    label.innerHTML = `
      <input type="radio" name="option" value="${opt}" onclick="selectOption(this, '${q.answer}')">
      ${opt}
    `;
    optDiv.appendChild(label);
  });

  document.getElementById("next-btn").disabled = true;
  startTimer();
}

// ========== Timer ==========
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
      document.getElementById("next-btn").disabled = false;
      autoSelect();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// ========== Select Option ==========
function selectOption(radio, correct) {
  stopTimer();
  const selected = radio.value;
  const all = document.getElementsByName("option");
  all.forEach(r => r.disabled = true);

  if (selected === correct) {
    radio.parentElement.classList.add("correct");
    showConfetti();
    score++;
  } else {
    radio.parentElement.classList.add("wrong");
    showSadFace();
  }

  document.getElementById("next-btn").disabled = false;
}

// ========== Auto Select when Time Over ==========
function autoSelect() {
  const correct = questions[current].answer;
  const radios = document.getElementsByName("option");
  radios.forEach(r => r.disabled = true);

  radios.forEach(r => {
    if (r.value === correct) r.parentElement.classList.add("correct");
  });

  showSadFace();
}

// ========== Go to Next ==========
function nextQuestion() {
  stopTimer();
  current++;
  showQuestion();
}

// ========== Show Result ==========
function showResult() {
  document.getElementById("question-box").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score-result").innerText = `You scored ${score} out of ${questions.length}`;
}

// ========== Effects ==========
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

