// js/staff.js
import { api } from "./api.js";

let queuesClickBound = false;

// ===============================
// STAFF LOGIN PAGE LOGIC
// ===============================

// Detect if we're on index.html (login page)
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      // Send login request to backend
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("Login success:", res);

      // Redirect to staff dashboard after login
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Login failed:", err);
      const msg = document.querySelector("#login-error");
      msg.style.display = "block";
      msg.textContent = "Invalid login. Please try again.";
    }
  });
}

// ===============================
// DASHBOARD PAGE LOGIC
// ===============================

const dashboardPage = document.querySelector("#queues-container");

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

async function loadQueues() {
  try {
    const queues = await api("/queues");
    const container = document.getElementById("queues-container");
    container.innerHTML = "";

    queues.forEach((q) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
  <h3>${q.name}</h3>
  <p class="subtle">Status: <b>${q.isOpen ? "Open" : "Closed"}</b></p>
  <p>Avg Service: ${Math.round((q.avgServiceSec || 300) / 60)} min</p>

  <div class="row" style="gap:8px; margin-top:8px;">
    <button class="btn primary tiny" data-action="manage" data-id="${q.id}">
      Manage
    </button>
    <button class="btn tiny" data-action="qr" data-id="${q.id}">
      QR
    </button>
    <button class="btn tiny warn" data-action="delete" data-id="${q.id}">
      Delete
    </button>
  </div>
`;

      container.appendChild(card);
    });

    if (!queuesClickBound) {
      queuesClickBound = true;

      container.addEventListener("click", async (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        // ---------------------------
        // MANAGE
        // ---------------------------
        if (action === "manage") {
          sessionStorage.setItem("activeQueueId", id);
          window.location.href = `manage-queue.html?queueId=${id}`;
          return;
        }

        // ---------------------------
        // DELETE
        // ---------------------------
        if (action === "delete") {
          const confirmDelete = confirm(
            "Are you sure you want to delete this queue?"
          );
          if (!confirmDelete) return;

          try {
            await api(`/queues/${id}`, { method: "DELETE" });
            await loadQueues();
          } catch (err) {
            // If backend returned 409, the message will say "Queue has tickets..."
            const msg = err.message.toLowerCase();

            if (msg.includes("queue has tickets")) {
              const force = confirm("This queue has tickets. Force delete?");
              if (force) {
                await api(`/queues/${id}?force=true`, { method: "DELETE" });
                await loadQueues();
              }
              return;
            }

            console.error("Delete failed:", err);
            alert("Delete failed: " + err.message);
          }

          return;
        }

        // ---------------------------
        // QR (handled in next step)
        // ---------------------------
        // -------- QR --------
        if (action === "qr") {
          // 1. Build the join URL for this queue
          const joinUrl = `https://queueleaf-frontend.vercel.app/join-queue.html?queueId=${id}`;

          // 2. Clear previous QR state
          qrCanvas.innerHTML = "";
          qrUrl.textContent = "";

          // 3. Generate QR code
          new QRCode(qrCanvas, {
            text: joinUrl,
            width: 256,
            height: 256,
          });

          // 4. Show URL underneath
          qrUrl.textContent = joinUrl;

          // 5. Show modal
          qrModal.style.display = "block";

          return;
        }
      });
    }
  } catch (err) {
    console.error("Error loading queues:", err);
  }
}

if (dashboardPage) {
  (async () => {
    const ok = await verifyAuth();
    if (ok) await loadQueues();
  })();
}

// ===============================
// QR MODAL OPEN/CLOSE
// ===============================
const qrModal = document.getElementById("qr-modal");
const qrClose = document.getElementById("qr-close");
const qrCanvas = document.getElementById("qr-canvas");
const qrUrl = document.getElementById("qr-url");

// Close modal
if (qrClose && qrModal) {
  qrClose.addEventListener("click", () => {
    qrModal.style.display = "none";
    qrCanvas.innerHTML = ""; // clear old QR
    qrUrl.textContent = ""; // clear URL text
  });
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

// ===============================
// NEW QUEUE MODAL OPEN/CLOSE
// ===============================
const modal = document.getElementById("new-queue-modal");
const btnNewQueue = document.getElementById("btn-new-queue");
const btnCancelModal = document.getElementById("new-queue-cancel");

if (btnNewQueue && modal && btnCancelModal) {
  // Open modal
  btnNewQueue.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal
  btnCancelModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

const btnCreateModal = document.getElementById("new-queue-create");
const inputName = document.getElementById("new-queue-name");
const inputAvg = document.getElementById("new-queue-avg");

if (btnCreateModal && modal && inputName && inputAvg) {
  btnCreateModal.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const avg = Number(inputAvg.value.trim());

    if (!name) {
      alert("Queue name is required.");
      return;
    }

    try {
      // Send to backend
      await api("/queues", {
        method: "POST",
        body: JSON.stringify({
          name,
          avgServiceSec: (avg || 5) * 60,
        }),
      });

      // Hide modal
      modal.style.display = "none";

      // Clear inputs
      inputName.value = "";
      inputAvg.value = 5;

      // Reload dashboard queues
      await loadQueues();
    } catch (err) {
      console.error("Create queue failed:", err);
      alert("Failed to create queue. Check console.");
    }
  });
}
