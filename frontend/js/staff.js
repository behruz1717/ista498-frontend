// js/staff.js
import { api } from "./api.js";

// ===============================
// STAFF LOGIN PAGE LOGIC
// ===============================

// Detect if we're on index.html (login page)
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      // Send login request to backend
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("Login success:", res);

      // Redirect to staff dashboard after login
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Login failed:", err);
      const msg = document.querySelector("#login-error");
      msg.style.display = "block";
      msg.textContent = "Invalid login. Please try again.";
    }
  });
}

// ===============================
// DASHBOARD PAGE LOGIC
// ===============================

const dashboardPage = document.querySelector("#queue-stats");

async function verifyAuth() {
  try {
    const user = await api("/auth/me");
    console.log("Authenticated as:", user);
    return true;
  } catch {
    console.warn("Not logged in. Redirecting...");
    window.location.href = "index.html";
    return false;
  }
}

async function loadQueues() {
  try {
    const queues = await api("/queues");
    console.log("Queues:", queues);

    const statusEl = document.getElementById("stat-status");
    const avgEl = document.getElementById("stat-avg");
    const inQueueEl = document.getElementById("stat-inqueue");

    // assuming you have one main queue for now
    const q = queues[0];
    statusEl.textContent = q.isOpen ? "Open" : "Closed";
    avgEl.textContent = Math.round((q.avgServiceSec || 300) / 60);
    inQueueEl.textContent = q._count?.tickets ?? 0;
  } catch (err) {
    console.error("Error loading queues:", err);
  }
}

if (dashboardPage) {
  (async () => {
    const ok = await verifyAuth();
    if (ok) await loadQueues();
  })();
}
