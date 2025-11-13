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
          customMessage: msgInput.value,
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

  await loadQueue();
}

init();
