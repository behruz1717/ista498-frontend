// js/analytics.js
import { api } from "./api.js";

let liveRefreshInterval = null;

document
  .getElementById("live-refresh-toggle")
  .addEventListener("change", (e) => {
    if (e.target.checked) {
      console.log("Live analytics enabled");
      startLiveRefresh();
    } else {
      console.log("Live analytics disabled");
      stopLiveRefresh();
    }
  });

function startLiveRefresh() {
  // Avoid double intervals
  stopLiveRefresh();

  // Refresh every 10 seconds
  liveRefreshInterval = setInterval(() => {
    console.log("Refreshing analytics...");
    loadAnalytics(document.getElementById("range-select").value);

    // If compare section has selections, update it too
    const a = document.getElementById("compare-a").value;
    const b = document.getElementById("compare-b").value;

    if (a && b && a !== b) {
      compareQueues();
    }
  }, 10000); // 10 seconds
}

function stopLiveRefresh() {
  if (liveRefreshInterval) {
    clearInterval(liveRefreshInterval);
    liveRefreshInterval = null;
  }
}

async function loadQueueList() {
  const queues = await api("/queues");

  const selectA = document.getElementById("compare-a");
  const selectB = document.getElementById("compare-b");

  queues.forEach((q) => {
    const optA = document.createElement("option");
    optA.value = q.id;
    optA.textContent = q.name;
    selectA.appendChild(optA);

    const optB = document.createElement("option");
    optB.value = q.id;
    optB.textContent = q.name;
    selectB.appendChild(optB);
  });
}

const rangeSelect = document.getElementById("range-select");
const customRange = document.getElementById("custom-range");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

rangeSelect.addEventListener("change", () => {
  if (rangeSelect.value === "custom") {
    customRange.classList.remove("hidden");
  } else {
    customRange.classList.add("hidden");
    loadAnalytics(rangeSelect.value);
  }
});

document.getElementById("apply-custom").addEventListener("click", () => {
  const start = startDateInput.value;
  const end = endDateInput.value;

  if (!start || !end) {
    alert("Select both start and end dates.");
    return;
  }

  loadAnalytics({ start, end });
});

async function loadAnalytics(range = 7) {
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
    if (!(typeof range === "object")) {
      const daily = await api(`/analytics/daily?days=${range}`);
      renderChart(daily);
      renderServedTrend(daily);
      renderWaitTrend(daily); // placeholder

      // Placeholder heatmap
      renderHeatmap(mockHeatmapData());
    } else {
      const { start, end } = range;
      const daily = await api(`/analytics/custom?start=${start}&end=${end}`);
      renderChart(daily);
      renderServedTrend(daily);
      renderWaitTrend(daily);

      // Placeholder heatmap
      renderHeatmap(mockHeatmapData());
    }
  } catch (err) {
    console.error("Failed to load analytics:", err);
  }
}

function renderChart(data) {
  const canvas = document.getElementById("chart-served");
  const existingChart = Chart.getChart("chart-served");
  if (existingChart) {
    existingChart.destroy(); // Destroy the Chart.js instance
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const servedCounts = data
    .filter((d) => d.status === "served")
    .map((d) => d._count.status);

  const labels = servedCounts.map((_, i) => `Day ${i + 1}`);

  new Chart(document.getElementById("chart-served"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Served",
          data: servedCounts,
          backgroundColor: "#0d9488",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

function renderServedTrend(data) {
  const canvas = document.getElementById("chart-served-trend");
  const existing = Chart.getChart("chart-served-trend");
  if (existing) existing.destroy();

  const servedCounts = data
    .filter((d) => d.status === "served")
    .map((d) => d._count.status);

  const labels = servedCounts.map((_, i) => `Day ${i + 1}`);

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Served",
          data: servedCounts,
          borderColor: "#0d9488",
          backgroundColor: "rgba(13, 148, 136, 0.2)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

function renderWaitTrend(data) {
  const canvas = document.getElementById("chart-wait-trend");
  const existing = Chart.getChart("chart-wait-trend");
  if (existing) existing.destroy();

  // Placeholder: Fake wait times between 5–25 minutes
  const waitTimes = data.map(() => Math.floor(Math.random() * 20) + 5);

  const labels = waitTimes.map((_, i) => `Day ${i + 1}`);

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Avg Wait (min)",
          data: waitTimes,
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.2)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

async function verifyAuth() {
  try {
    const user = await api("/auth/me");
    console.log("Authenticated as:", user);
    return true;
  } catch {
    console.warn("Not logged in. Redirecting...");
    window.location.href = "index.html";
    return false;
  }
}

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

document.getElementById("compare-a").addEventListener("change", compareQueues);
document.getElementById("compare-b").addEventListener("change", compareQueues);

async function compareQueues() {
  const idA = document.getElementById("compare-a").value;
  const idB = document.getElementById("compare-b").value;

  if (!idA || !idB || idA === idB) return;

  // Fetch daily analytics for both queues
  const dailyA = await api(`/analytics/queue/${idA}/daily?days=7`).catch(
    () => null
  );

  const dailyB = await api(`/analytics/queue/${idB}/daily?days=7`).catch(
    () => null
  );

  if (dailyA && dailyB) {
    renderCompareServed(dailyA, dailyB);
    renderCompareWait(dailyA, dailyB); // placeholder
  }
}

function renderCompareServed(a, b) {
  const id = "chart-compare-served";
  const existing = Chart.getChart(id);
  if (existing) existing.destroy();

  const servedA = a
    .filter((d) => d.status === "served")
    .map((d) => d._count.status);
  const servedB = b
    .filter((d) => d.status === "served")
    .map((d) => d._count.status);

  const labels = servedA.map((_, i) => `Day ${i + 1}`);

  new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Queue A",
          data: servedA,
          borderColor: "#0d9488",
          backgroundColor: "rgba(13,148,136,0.1)",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Queue B",
          data: servedB,
          borderColor: "#f43f5e",
          backgroundColor: "rgba(244,63,94,0.1)",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });
}

function renderCompareWait(a, b) {
  const id = "chart-compare-wait";
  const existing = Chart.getChart(id);
  if (existing) existing.destroy();

  // Placeholder: generate random wait times
  const waitA = a.map(() => Math.floor(Math.random() * 20) + 5);
  const waitB = b.map(() => Math.floor(Math.random() * 20) + 5);

  const labels = waitA.map((_, i) => `Day ${i + 1}`);

  new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Queue A",
          data: waitA,
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14,165,233,0.1)",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Queue B",
          data: waitB,
          borderColor: "#a855f7",
          backgroundColor: "rgba(168,85,247,0.1)",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });
}

function mockHeatmapData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heatmap = {};

  days.forEach((day) => {
    heatmap[day] = {};
    for (let h = 0; h < 24; h++) {
      heatmap[day][h] = Math.floor(Math.random() * 20); // random 0–20
    }
  });

  return heatmap;
}

function renderHeatmap(data) {
  const grid = document.getElementById("heatmap-grid");
  grid.innerHTML = "";

  const days = Object.keys(data);

  // Header row (empty corner + hours 0–23)
  grid.innerHTML += `<div></div>`;
  for (let h = 0; h < 24; h++) {
    grid.innerHTML += `<div class="text-gray-500 text-center">${h}</div>`;
  }

  // Generate rows
  days.forEach((day) => {
    // Day label
    grid.innerHTML += `<div class="font-medium text-gray-700">${day}</div>`;

    // Hour cells
    for (let h = 0; h < 24; h++) {
      const value = data[day][h];

      // Color intensity (0 = white, 20 = deep green)
      const intensity = Math.min(value * 5, 100); // scale 0–100
      const color = `rgba(13, 148, 136, ${intensity / 100})`;

      grid.innerHTML += `
        <div 
          title="${day} ${h}:00 — ${value} customers"
          class="h-5"
          style="background-color: ${color};"
        ></div>
      `;
    }
  });
}

(async () => {
  const ok = await verifyAuth();
  if (ok) {
    await loadAnalytics();
    await loadQueueList();

    document.getElementById("live-refresh-toggle").checked = true;
    startLiveRefresh();
  }
})();
