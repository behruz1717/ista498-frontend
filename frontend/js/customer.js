// js/customer.js
import { api } from "./api.js";

const urlParams = new URLSearchParams(window.location.search);
const queueIdFromUrl = urlParams.get("queueId");

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
