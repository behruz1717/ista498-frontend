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
    statusEl.innerHTML = queue.isOpen
      ? `<span class="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">Open</span>`
      : `<span class="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-700">Closed</span>`;

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
  const ticketsTable = document.getElementById("tickets-table");

  const callNextBtn = document.getElementById("call-next");

  function formatTime(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderActions(t) {
    if (t.status === "waiting") {
      return `
      <button
        class="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        data-action="call"
        data-id="${t.id}"
      >
        Call
      </button>
    `;
    }

    if (t.status === "called") {
      return `
      <button
        class="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        data-action="serve"
        data-id="${t.id}"
      >
        Serve
      </button>
    `;
    }

    return `<span class="text-gray-400">—</span>`;
  }

  // Load tickets for this queue
  async function loadTickets() {
    try {
      const tickets = await api(`/tickets/${queueId}`);

      const waitingCount = tickets.filter((t) => t.status === "waiting").length;
      const servedCount = tickets.filter((t) => t.status === "served").length;

      // Always clear the table BEFORE adding new rows
      ticketsTable.innerHTML = "";

      if (tickets.length === 0) {
        ticketsTable.innerHTML = `
    <tr>
      <td colspan="4" class="p-6 text-center text-gray-500">
        No active tickets yet.
      </td>
    </tr>
  `;
        return;
      }

      document.getElementById("stat-inqueue").textContent = waitingCount;
      document.getElementById("stat-served").textContent = servedCount;

      function renderStatusBadge(status) {
        if (status === "waiting") {
          return `<span class="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Waiting</span>`;
        }
        if (status === "called") {
          return `<span class="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Called</span>`;
        }
        if (status === "served") {
          return `<span class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Served</span>`;
        }
        if (status === "left") {
          return `<span class="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Left</span>`;
        }

        return status;
      }

      tickets.forEach((t) => {
        const row = document.createElement("tr");
        row.innerHTML = `
  <td class="p-3 font-medium text-gray-800">${t.name}</td>

  <td class="p-3 text-gray-700">${t.partySize}</td>

  <td class="p-3">
    ${renderStatusBadge(t.status)}
  </td>

  <td class="p-3 text-gray-500">
    ${formatTime(t.createdAt)}
  </td>

  <td class="p-3 text-gray-500">
    ${t.calledAt ? formatTime(t.calledAt) : "—"}
  </td>

  <td class="p-3 text-gray-500">
    ${t.servedAt ? formatTime(t.servedAt) : "—"}
  </td>

  <td class="p-3 text-gray-500">
    ${t.leftAt ? formatTime(t.leftAt) : "—"}
  </td>

  <td class="p-3 text-gray-500">
    ${t.contactValue || "—"}
  </td>

  <td class="p-3">
    ${renderActions(t)}
  </td>
`;

        row.className = "hover:bg-gray-50 transition";

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
    let newStatus = null;
    if (action === "call") newStatus = "called";
    if (action === "serve") newStatus = "served";

    try {
      await api(`/tickets/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
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
  setInterval(loadTickets, 5000); // auto-refresh every 20 seconds
}

init();

/* ============================================
   CONTROLS MODAL LOGIC
   ============================================*/

const openControlsBtn = document.getElementById("open-controls");
const controlsModal = document.getElementById("controls-modal");
const controlsBackdrop = document.getElementById("controls-backdrop");

const modalMsg = document.getElementById("modal-input-message");
const modalAvg = document.getElementById("modal-input-avg");
const modalToggleBtn = document.getElementById("modal-toggle-open");

// OPEN MODAL
openControlsBtn.addEventListener("click", () => {
  // preload values
  modalMsg.value = msgInput.value;
  modalAvg.value = avgInput.value;
  modalToggleBtn.textContent = toggleBtn.textContent;

  controlsModal.classList.remove("hidden");
  controlsBackdrop.classList.remove("hidden");
});

// CLOSE MODAL
document.getElementById("controls-cancel").addEventListener("click", () => {
  controlsModal.classList.add("hidden");
  controlsBackdrop.classList.add("hidden");
});

controlsBackdrop.addEventListener("click", () => {
  controlsModal.classList.add("hidden");
  controlsBackdrop.classList.add("hidden");
});

// SAVE CHANGES
document.getElementById("controls-save").addEventListener("click", async () => {
  try {
    await api(`/queues/${queueId}/message`, {
      method: "PATCH",
      body: JSON.stringify({
        message: modalMsg.value,
      }),
    });

    await api(`/queues/${queueId}/avg`, {
      method: "PATCH",
      body: JSON.stringify({ minutes: Number(modalAvg.value) }),
    });

    controlsModal.classList.add("hidden");
    controlsBackdrop.classList.add("hidden");

    await loadQueue(); // refresh UI
  } catch (err) {
    console.error("Failed to update queue:", err);
    alert("Failed to save settings");
  }
});

// Toggle queue from modal
modalToggleBtn.addEventListener("click", async () => {
  try {
    await api(`/queues/${queueId}/toggle`, { method: "PATCH" });
    await loadQueue(); // refresh UI
    modalToggleBtn.textContent = toggleBtn.textContent;
  } catch (err) {
    console.error("Failed to toggle queue:", err);
  }
});

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
