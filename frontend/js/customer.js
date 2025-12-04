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

      // Fetch public status
      const ticket = await api(`/tickets/public/${ticketId}`);

      /* -----------------------------------------------------
       🔔 STATUS CHANGE ALERT (called → sound + notify)
    -----------------------------------------------------*/
      if (lastStatus !== ticket.status) {
        if (ticket.status === "called") {
          if (soundEnabled) callSound.play().catch(() => {});

          if (notifyEnabled && "Notification" in window) {
            try {
              new Notification("You are being called!", {
                body: "Please return to the host stand.",
                icon: "assets/logo.png",
              });
            } catch (e) {}
          }

          const alertBox = document.getElementById("called-alert");
          alertBox.style.display = "block";
        }

        lastStatus = ticket.status;
      }

      /* -----------------------------------------------------
       🧾 BASIC TICKET INFO
    -----------------------------------------------------*/
      document.getElementById("ticket-name").textContent = ticket.name;
      document.getElementById("ticket-id").textContent = "#" + ticket.id;

      const statusEl = document.getElementById("ticket-status");
      statusEl.textContent = ticket.status;

      statusEl.classList.remove(
        "bg-yellow-100",
        "text-yellow-800",
        "bg-blue-100",
        "text-blue-800",
        "bg-green-100",
        "text-green-800",
        "bg-red-100",
        "text-red-800"
      );

      if (ticket.status === "waiting")
        statusEl.classList.add("bg-yellow-100", "text-yellow-800");
      if (ticket.status === "called")
        statusEl.classList.add("bg-blue-100", "text-blue-800");
      if (ticket.status === "served")
        statusEl.classList.add("bg-green-100", "text-green-800");
      if (ticket.status === "left")
        statusEl.classList.add("bg-red-100", "text-red-800");

      /* -----------------------------------------------------
       🧮 POSITION & ETA
    -----------------------------------------------------*/
      document.getElementById("your-position").textContent = ticket.position;
      document.getElementById("your-eta").textContent = ticket.etaSeconds
        ? Math.round(ticket.etaSeconds / 60) + " min"
        : "–";

      /* -----------------------------------------------------
       🔵 CUSTOM QUEUE MESSAGE
    -----------------------------------------------------*/
      const msgBox = document.getElementById("queue-custom-message");
      msgBox.textContent = ticket.customMessage || "";
      msgBox.classList.toggle("hidden", !ticket.customMessage);

      /* -----------------------------------------------------
       📊 SNAPSHOT SECTION (new)
    -----------------------------------------------------*/
      document.getElementById("snapshot-queue-name").textContent =
        ticket.queueName || "—";

      document.getElementById("snapshot-ahead-count").textContent =
        ticket.aheadCount ?? "—";

      document.getElementById("snapshot-avg-service").textContent =
        ticket.avgServiceMinutes ? ticket.avgServiceMinutes + " min" : "—";

      document.getElementById("snapshot-total-waiting").textContent =
        ticket.totalWaiting ?? "—";

      /* -----------------------------------------------------
       👥 AHEAD-OF-YOU LIST
    -----------------------------------------------------*/
      const list = document.getElementById("snapshot-ahead-list");
      list.innerHTML = ""; // clear first

      if (ticket.aheadOfYou && ticket.aheadOfYou.length > 0) {
        ticket.aheadOfYou.forEach((p) => {
          const item = document.createElement("div");
          item.className =
            "text-xs text-gray-700 flex justify-between bg-white border border-gray-200 rounded-md py-1 px-2";
          item.innerHTML = `
          <span>${p.name}</span>
          <span class="text-gray-500">(${p.partySize})</span>
        `;
          list.appendChild(item);
        });
      } else {
        list.innerHTML = `<div class="text-xs text-gray-400">No one ahead.</div>`;
      }
    } catch (err) {
      console.error("Error loading status:", err);
    }
  }

  refreshBtn.addEventListener("click", loadStatus);

  // Auto-refresh every 15 seconds
  loadStatus();
  setInterval(loadStatus, 5000);
}
