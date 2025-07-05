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
