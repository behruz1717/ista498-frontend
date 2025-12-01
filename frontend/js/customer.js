// js/customer.js
import { api } from "./api.js";

let lastStatus = null;

const urlParams = new URLSearchParams(window.location.search);
const queueIdFromUrl = urlParams.get("queueId");

const enableSoundBtn = document.getElementById("enable-sound");
const callSound = document.getElementById("call-sound");
let soundEnabled = false;

if (enableSoundBtn) {
  enableSoundBtn.addEventListener("click", () => {
    callSound.play().catch(() => {});
    soundEnabled = true;
    enableSoundBtn.style.display = "none";
  });
}

// ===============================
// BROWSER NOTIFICATION PERMISSION
// ===============================
const notifyBtn = document.getElementById("enable-browser-notify");
let notifyEnabled = false;

if (notifyBtn) {
  notifyBtn.addEventListener("click", async () => {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications.");
      return;
    }

    // Ask user for permission
    let permission = await Notification.requestPermission();

    if (permission === "granted") {
      notifyEnabled = true;
      notifyBtn.style.display = "none";
    } else {
      alert("Notifications are disabled.");
    }
  });
}

// ===============================
// VIBRATION PERMISSION
// ===============================
const vibrationBtn = document.getElementById("enable-vibration");
let vibrationEnabled = false;

if (vibrationBtn) {
  vibrationBtn.addEventListener("click", () => {
    // Check if vibration API exists
    if (!navigator.vibrate) {
      alert("Your device does not support vibration.");
      return;
    }

    // Test a very small vibration (1 ms) to unlock permission
    navigator.vibrate(1);

    vibrationEnabled = true;
    vibrationBtn.style.display = "none";
  });
}

const form = document.querySelector("#join-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const partySize = Number(formData.get("party")) || 1;
    const contact = formData.get("contact");

    try {
      document.querySelector("#join-btn").disabled = true;

      const data = await api("/tickets", {
        method: "POST",
        body: JSON.stringify({
          queueId: Number(queueIdFromUrl) || 1,
          name,
          partySize,
          contactType: contact ? "sms" : null,
          contactValue: contact || null,
        }),
      });

      // Save IDs so status.html can access them later
      localStorage.setItem("ticketId", data.ticket.id);
      localStorage.setItem("queueId", queueId);

      // Redirect to status page
      window.location.href = "status.html";
    } catch (err) {
      alert("Failed to join queue: " + err.message);
    } finally {
      document.querySelector("#join-btn").disabled = false;
    }
  });
}

// ===============================
// STATUS PAGE LOGIC
// ===============================

const ticketId = localStorage.getItem("ticketId");
const queueId = localStorage.getItem("queueId");

// Only run this part if we're on status.html
if (document.querySelector("#status-card")) {
  const nameEl = document.getElementById("ticket-name");
  const idEl = document.getElementById("ticket-id");
  const statusEl = document.getElementById("ticket-status");
  const positionEl = document.getElementById("your-position");
  const etaEl = document.getElementById("your-eta");
  const refreshBtn = document.getElementById("refresh-btn");

  async function loadStatus() {
    try {
      if (!ticketId || !queueId) {
        alert("Missing ticket info. Please join the queue again.");
        window.location.href = "join-queue.html";
        return;
      }

      const ticket = await api(`/tickets/public/${ticketId}`);

      if (lastStatus !== ticket.status) {
        if (ticket.status === "called") {
          // 🔔 Play sound
          if (soundEnabled) {
            callSound.play().catch(() => {});
          }

          // 🛎️ Show browser notification
          if (notifyEnabled && "Notification" in window) {
            try {
              new Notification("You are being called!", {
                body: "Please return to the host stand.",
                icon: "assets/logo.png", // optional
              });
            } catch (e) {
              console.warn("Notification blocked or failed:", e);
            }
          }

          // 📱 optional: we add vibration later (Step 3)
          // 📳 Vibrate (Android + iOS 16.4+)
          if (vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
        }

        lastStatus = ticket.status;
      }

      if (!ticket) {
        statusEl.textContent = "not found";
        return;
      }

      nameEl.textContent = ticket.name;
      idEl.textContent = "#" + ticket.id;
      statusEl.textContent = ticket.status;
      positionEl.textContent = ticket.position || "–";
      etaEl.textContent = ticket.etaSeconds
        ? Math.round(ticket.etaSeconds / 60) + " min"
        : "–";
    } catch (err) {
      console.error("Error loading status:", err);
    }
  }

  refreshBtn.addEventListener("click", loadStatus);

  // Auto-refresh every 15 seconds
  loadStatus();
  setInterval(loadStatus, 15000);
}
