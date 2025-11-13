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
