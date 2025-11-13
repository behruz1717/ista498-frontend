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

  try {
    const queues = await api("/queues");
    const queue = queues.find((q) => q.id === Number(queueId));
    if (!queue) throw new Error("Queue not found");

    document.getElementById("queue-name").textContent = queue.name;
    document.getElementById("stat-status").textContent = queue.isOpen
      ? "Open"
      : "Closed";
    document.getElementById("stat-avg").textContent = Math.round(
      (queue.avgServiceSec || 300) / 60
    );
  } catch (err) {
    console.error("Error loading queue:", err);
  }
}

init();
