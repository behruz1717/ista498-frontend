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
    if (range) {
      const daily = await api(`/analytics/daily?days=${range}`);
      renderChart(daily);
    } else {
      const { start, end } = range;
      const daily = await api(`/analytics/custom?start=${start}&end=${end}`);
      renderChart(daily);
    }
  } catch (err) {
    console.error("Failed to load analytics:", err);
  }
}

function renderChart(data) {
  const canvas = document.getElementById("chart-served");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
