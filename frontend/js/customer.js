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

      if (ticket.status === "left") {
        // Replace card with a message
        document.getElementById("status-card").innerHTML = `
    <div class="text-center py-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        You have left the queue
      </h2>
      <p class="text-gray-600 mb-6">We hope to see you again.</p>
      <button
        onclick="window.location.href='join-queue.html'"
        class="px-4 py-2 bg-brand text-white rounded-lg shadow hover:bg-brandDark transition"
      >
        Join Again
      </button>
    </div>
  `;

        // Stop refresh
        if (window.__statusInterval) {
          clearInterval(window.__statusInterval);
        }

        return; // exit early
      }

      if (ticket.status === "served") {
        // Replace card with a message
        document.getElementById("status-card").innerHTML = `
    <div class="text-center py-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        All Set!!!
      </h2>
      <p class="text-gray-600 mb-6">Thank you for using Queueleaf.</p>
      <button
        onclick="window.location.href='join-queue.html'"
        class="px-4 py-2 bg-brand text-white rounded-lg shadow hover:bg-brandDark transition"
      >
        Join Again
      </button>
    </div>
  `;
        // Stop refresh
        if (window.__statusInterval) {
          clearInterval(window.__statusInterval);
        }

        return; // exit early
      }

      /* -----------------------------------------------------
       🔔 STATUS CHANGE ALERT (called → sound + notify)
    -----------------------------------------------------*/
      if (lastStatus !== ticket.status) {
        if (ticket.status === "called") {
          if (soundEnabled) callSound.play().catch(() => {});

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
        ticket.aheadOfYou.length ?? "—";

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
  // ===============================
  // LEAVE QUEUE BUTTON
  // ===============================
  const leaveBtn = document.getElementById("leave-queue");

  if (leaveBtn) {
    leaveBtn.addEventListener("click", async () => {
      if (!ticketId) {
        alert("Missing ticket. Please rejoin the queue.");
        return;
      }

      const confirmLeave = confirm("Are you sure you want to leave the queue?");
      if (!confirmLeave) return;

      try {
        await api(`/tickets/${ticketId}/leave`, { method: "PATCH" });

        // 🧹 CLEAR LOCAL STORAGE
        localStorage.removeItem("ticketId");
        //localStorage.removeItem("queueId");

        // 🛑 Stop auto-refresh
        if (window.__statusInterval) {
          clearInterval(window.__statusInterval);
        }

        // 🎨 Replace UI with exit screen
        document.getElementById("status-card").innerHTML = `
        <div class="text-center py-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            You have left the queue
          </h2>
          <p class="text-gray-600 mb-6">
            Thanks for using QueueLeaf!
          </p>

          <button
            onclick="window.location.href='join-queue.html?queueId=${queueId}'"
            class="px-4 py-2 bg-brand text-white rounded-lg shadow hover:bg-brandDark transition"
          >
            Join Again
          </button>
        </div>
      `;
      } catch (err) {
        console.error("Failed to leave queue:", err);
        alert("Unable to leave queue. Please try again.");
      }
    });
  }

  // Auto-refresh every 15 seconds
  loadStatus();
  window.__statusInterval = setInterval(loadStatus, 5000);
}
