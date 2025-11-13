// js/analytics.js
import { api } from "./api.js";

async function loadAnalytics() {
  try {
    // --- Summary metrics ---
    const global = await api("/analytics/global");
    document.getElementById("total-tickets").textContent =
      global.totalTickets ?? "–";
    document.getElementById("served-tickets").textContent =
      global.servedTickets ?? "–";
    document.getElementById("total-queues").textContent =
      global.totalQueues ?? "–";
    document.getElementById("avg-party").textContent =
      global.avgPartySize ?? "–";

    // --- Daily stats ---
    const daily = await api("/analytics/daily?days=7");
    renderChart(daily);
  } catch (err) {
    console.error("Failed to load analytics:", err);
  }
}

function renderChart(data) {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  // Normalize structure: [{ status:"served", _count:{status:5}}, ...]
  const bars = data
    .filter((d) => d.status === "served")
    .map((d) => d._count.status);

  const max = Math.max(...bars, 1);
  bars.forEach((count, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(count / max) * 200}px`;
    bar.innerHTML = `<span>${count}</span>`;
    chart.appendChild(bar);
  });
}

// Run immediately on load
loadAnalytics();
