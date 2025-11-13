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

const dashboardPage = document.querySelector("#queues-container");

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
    const container = document.getElementById("queues-container");
    container.innerHTML = "";

    queues.forEach((q) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${q.name}</h3>
        <p class="subtle">Status: <b>${q.isOpen ? "Open" : "Closed"}</b></p>
        <p>Avg Service: ${Math.round((q.avgServiceSec || 300) / 60)} min</p>
        <button class="btn primary tiny" data-id="${q.id}">Manage</button>
      `;
      container.appendChild(card);
    });

    container.addEventListener("click", (e) => {
      if (e.target.matches("button[data-id]")) {
        const id = e.target.dataset.id;
        // store id and navigate
        sessionStorage.setItem("activeQueueId", id);
        window.location.href = `manage-queue.html?queueId=${id}`;
      }
    });
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

// ===============================
// LOGOUT BUTTON
// ===============================
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await api("/auth/logout", { method: "POST" });
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });
}
