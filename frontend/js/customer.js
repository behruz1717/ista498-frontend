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

          // 🚨 Visual blinking alert
          const alertBox = document.getElementById("called-alert");
          alertBox.style.display = "block";
          alertBox.classList.add("called-blink");
        }

        lastStatus = ticket.status;
      }

      if (!ticket) {
        statusEl.textContent = "not found";
        return;
      }

      const messageEl = document.getElementById("queue-custom-message");
      messageEl.textContent = ticket.customMessage || "";
      if (messageEl.textContent != "") {
        messageEl.classList.remove("hidden");
      }
      if (messageEl.textContent == "") {
        messageEl.classList.add("hidden");
      }

      nameEl.textContent = ticket.name;
      idEl.textContent = "#" + ticket.id;
      statusEl.textContent = ticket.status;

      // Remove old classes first
      statusEl.classList.remove(
        "bg-yellow-100",
        "text-yellow-800",
        "bg-blue-100",
        "text-blue-800",
        "bg-green-100",
        "text-green-800"
      );

      // Apply colors based on status
      if (ticket.status === "waiting") {
        statusEl.classList.add("bg-yellow-100", "text-yellow-800");
      } else if (ticket.status === "called") {
        statusEl.classList.add("bg-blue-100", "text-blue-800");
      } else if (ticket.status === "served") {
        statusEl.classList.add("bg-green-100", "text-green-800");
      }

      function animateUpdate(el) {
        el.classList.add("transition", "duration-300", "ease-out", "opacity-0");
        setTimeout(() => {
          el.classList.remove("opacity-0");
        }, 10);
      }

      positionEl.textContent = ticket.position || "–";
      animateUpdate(positionEl);

      etaEl.textContent = ticket.etaSeconds
        ? Math.round(ticket.etaSeconds / 60) + " min"
        : "–";
      animateUpdate(etaEl);
    } catch (err) {
      console.error("Error loading status:", err);
    }
  }

  refreshBtn.addEventListener("click", loadStatus);

  // Auto-refresh every 15 seconds
  loadStatus();
  setInterval(loadStatus, 5000);
}
