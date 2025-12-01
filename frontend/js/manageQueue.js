// js/manageQueue.js
import { api } from "./api.js";

async function init() {
  const params = new URLSearchParams(window.location.search);
  const queueId =
    params.get("queueId") || sessionStorage.getItem("activeQueueId");

  if (!queueId) {
    alert("Missing queue ID");
    window.location.href = "dashboard.html";
    return;
  }

  const statusEl = document.getElementById("stat-status");
  const avgEl = document.getElementById("stat-avg");
  const nameEl = document.getElementById("queue-name");
  const msgInput = document.getElementById("input-message");
  const avgInput = document.getElementById("input-avg");
  const toggleBtn = document.getElementById("toggle-open");

  async function loadQueue() {
    const queues = await api("/queues");
    const queue = queues.find((q) => q.id === Number(queueId));
    if (!queue) throw new Error("Queue not found");

    nameEl.textContent = queue.name;
    statusEl.textContent = queue.isOpen ? "Open" : "Closed";
    avgEl.textContent = Math.round((queue.avgServiceSec || 300) / 60);
    avgInput.value = Math.round((queue.avgServiceSec || 300) / 60);
    msgInput.value = queue.customMessage || "";
    toggleBtn.textContent = queue.isOpen ? "Close" : "Open";
  }

  async function toggleQueue() {
    try {
      await api(`/queues/${queueId}/toggle`, { method: "PATCH" });
      await loadQueue();
    } catch (err) {
      console.error("Failed to toggle queue:", err);
    }
  }

  async function updateQueueSettings() {
    try {
      await api(`/queues/${queueId}/message`, {
        method: "PATCH",
        body: JSON.stringify({
          message: msgInput.value,
        }),
      });
      await loadQueue();
    } catch (err) {
      console.error("Failed to update queue settings:", err);
    }
  }

  toggleBtn.addEventListener("click", toggleQueue);
  avgInput.addEventListener("change", updateQueueSettings);
  msgInput.addEventListener("change", updateQueueSettings);

  // ===============================
  // ACTIVE TICKETS TABLE
  // ===============================
  const ticketsTable = document
    .getElementById("tickets-table")
    .querySelector("tbody");
  const callNextBtn = document.getElementById("call-next");

  // Load tickets for this queue
  async function loadTickets() {
    try {
      const tickets = await api(`/tickets/${queueId}`);
      ticketsTable.innerHTML = "";

      tickets.forEach((t) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${t.name}</td>
        <td>${t.status}</td>
        <td>${new Date(t.createdAt).toLocaleTimeString()}</td>
        <td>
          ${
            t.status === "waiting"
              ? `<button class="btn tiny" data-action="call" data-id="${t.id}">Call</button>`
              : t.status === "called"
              ? `<button class="btn tiny" data-action="serve" data-id="${t.id}">Serve</button>`
              : ""
          }
        </td>
      `;
        ticketsTable.appendChild(row);
      });
    } catch (err) {
      console.error("Error loading tickets:", err);
    }
  }

  // Handle ticket actions
  ticketsTable.addEventListener("click", async (e) => {
    if (!e.target.dataset.action) return;
    const id = e.target.dataset.id;
    const action = e.target.dataset.action;

    try {
      await api(`/tickets/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: action === "call" ? "called" : "served",
        }),
      });
      await loadTickets();
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  });

  // "Call Next" button
  if (callNextBtn) {
    callNextBtn.addEventListener("click", async () => {
      try {
        const tickets = await api(`/tickets/${queueId}`);
        const next = tickets.find((t) => t.status === "waiting");
        if (!next) {
          alert("No waiting tickets to call.");
          return;
        }

        await api(`/tickets/${next.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "called" }),
        });

        await loadTickets();
        alert(`Called ticket #${next.id} (${next.name})`);
      } catch (err) {
        console.error("Failed to call next ticket:", err);
      }
    });
  }

  await loadQueue();

  await loadTickets();
  setInterval(loadTickets, 20000); // auto-refresh every 20 seconds
}

init();

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
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });
}
