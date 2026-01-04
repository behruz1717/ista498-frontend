// js/customer.js
import { api } from "./api.js";

const urlParams = new URLSearchParams(window.location.search);
const queueIdFromUrl = urlParams.get("queueId");

const form = document.querySelector("#join-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const partySize = Number(formData.get("party")) || 1;
    const contact = formData.get("contact");

    // First validate party size
    if (partySize > 6) {
      alert("Party size limit: 6");
      return; // ⛔ STOP — do NOT create ticket
    }

    // Check queue open state before attempting to join
    try {
      const queueId = Number(queueIdFromUrl) || 1;
      const queues = await api('/queues');
      const q = Array.isArray(queues) ? queues.find(x => x.id === Number(queueId)) : null;
      if (q && q.isOpen === false) {
        const msg = window.QueueLeafI18n && window.QueueLeafI18n.t ? window.QueueLeafI18n.t('queue_closed_join') : 'This queue is currently closed. You cannot join.';
        alert(msg);
        return;
      }
    } catch (err) {
      // If the check fails (network), we proceed and let server validate, but do not block UX silently
      console.warn('Failed to check queue open state:', err);
    }

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
      localStorage.setItem("queueId", queueIdFromUrl || 1);

      // Redirect to status page
      window.location.href = "status.html";
    } catch (err) {
      alert("Failed to join queue: " + err.message);
    } finally {
      document.querySelector("#join-btn").disabled = false;
    }
  });
}
/* ============================
   PRIVACY MODAL (JOIN QUEUE)
   ============================ */

const privacyModal = document.getElementById("privacy-modal");
const privacyBtn = document.getElementById("privacy-btn");
const privacyAccept = document.getElementById("privacy-accept");
const joinForm = document.getElementById("join-form");

// Always show modal on page load
if (privacyModal) {
  privacyModal.classList.remove("hidden");
}

// On load: check whether the queue is open and disable join if closed
(async function checkQueueOpen() {
  try {
    if (!queueIdFromUrl) return;
    const queues = await api('/queues');
    const qId = Number(queueIdFromUrl) || 1;
    const q = Array.isArray(queues) ? queues.find(x => x.id === qId) : null;
    if (q && q.isOpen === false) {
      const joinBtn = document.querySelector('#join-btn');
      if (joinBtn) joinBtn.disabled = true;
      const msg = window.QueueLeafI18n && window.QueueLeafI18n.t ? window.QueueLeafI18n.t('queue_closed_join') : 'This queue is currently closed. You cannot join.';
      const warn = document.createElement('div');
      warn.className = 'text-sm text-red-500 mt-3';
      warn.textContent = msg;
      // insert warning after the form
      joinForm?.parentNode?.insertBefore(warn, joinForm.nextSibling);
    }
  } catch (err) {
    // ignore — allow user to attempt join, server will validate
    console.warn('Failed to check queue open state on load', err);
  }
})();

// Allow user to reopen modal
privacyBtn?.addEventListener("click", () => {
  privacyModal.classList.remove("hidden");
});

// Accept & enable form
privacyAccept?.addEventListener("click", () => {
  privacyModal.classList.add("hidden");

  // Re-enable form
  joinForm.classList.remove("opacity-30", "pointer-events-none");
});
