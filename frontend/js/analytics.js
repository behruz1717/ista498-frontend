// js/analytics.js
import { api } from "./api.js";

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
    } else {
      const { start, end } = range;
      const daily = await api(`/analytics/custom?start=${start}&end=${end}`);
      renderChart(daily);
      renderServedTrend(daily);
      renderWaitTrend(daily);
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

(async () => {
  const ok = await verifyAuth();
  if (ok) await loadAnalytics();
})();

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
