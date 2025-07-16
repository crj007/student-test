let questions = [];
let current = 0;
let score = 0;
let timer = null;

// === Load Questions ===
async function loadQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();

  // Shuffle questions
  questions = questions.sort(() => Math.random() - 0.5);

  showQuestion();
}

// === Show a Question ===
function showQuestion() {
  if (current >= questions.length) {
    return showResult();
  }

  const q = questions[current];
  document.getElementById("qnumber").innerText = `Q${current + 1}`;
  document.getElementById("question-text").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(option => {
    const label = document.createElement("label");
    label.className = "option-label";
    label.innerHTML = `
      <input type="radio" name="option" value="${option}" onchange="handleOptionSelect(this, '${q.answer}')">
      ${option}
    `;
    optionsDiv.appendChild(label);
  });

  document.getElementById("next-btn").disabled = false;
  startTimer();
}

// === When Option Selected ===
function handleOptionSelect(input, correctAnswer) {
  stopTimer();
  const selectedValue = input.value;
  const all = document.getElementsByName("option");
  all.forEach(r => r.disabled = true);

  if (selectedValue === correctAnswer) {
    input.parentElement.classList.add("correct");
    score++;
    showConfetti();
  } else {
    input.parentElement.classList.add("wrong");
    // Highlight correct one too
    all.forEach(r => {
      if (r.value === correctAnswer) {
        r.parentElement.classList.add("correct");
      }
    });
    showSadFace();
  }
}

// === Timer Handling ===
function startTimer() {
  let time = 40;
  document.getElementById("time").innerText = time;
  document.getElementById("progress").style.width = "100%";

  timer = setInterval(() => {
    time--;
    document.getElementById("time").innerText = time;
    document.getElementById("progress").style.width = `${(time / 40) * 100}%`;

    if (time <= 0) {
      clearInterval(timer);
      handleTimeOut();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// === Auto Select on Timeout ===
function handleTimeOut() {
  const q = questions[current];
  const all = document.getElementsByName("option");
  all.forEach(r => r.disabled = true);
  all.forEach(r => {
    if (r.value === q.answer) {
      r.parentElement.classList.add("correct");
    }
  });
  showSadFace();
}

// === Next Question ===
function nextQuestion() {
  stopTimer();
  current++;
  showQuestion();
}

// === Show Result ===
function showResult() {
  document.getElementById("question-box").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score-result").innerText = `🎯 You scored ${score} out of ${questions.length}`;
}

// === Visuals ===
function showConfetti() {
  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
}

function showSadFace() {
  const sad = document.createElement("div");
  sad.innerText = "😢";
  sad.style = `
    font-size: 60px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: fadeOut 2s ease-out;
    z-index: 1000;
  `;
  document.body.appendChild(sad);
  setTimeout(() => sad.remove(), 2000);
}

// === Dashboard Page Loader ===
function loadDashboard() {
  document.getElementById("student-name").innerText = localStorage.getItem("fullname") || "Student";
  document.getElementById("student-class").innerText = localStorage.getItem("class") || "5";
}

function beginTest() {
  window.location.href = "test.html";
}

// === Login ===
async function login() {
  const id = document.getElementById("userid").value.trim().toLowerCase();
  const pw = document.getElementById("password").value;

  const res = await fetch("students.json");
  const students = await res.json();

  const student = students.find(s => s.username === id && s.password === pw);

  if (student) {
    localStorage.setItem("fullname", student.fullname);
    localStorage.setItem("class", student.class);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error-msg").innerText = "❌ Invalid name or password.";
  }
}
