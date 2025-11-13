// js/customer.js
import { api } from "./api.js";

const form = document.querySelector("#join-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const partySize = Number(formData.get("party")) || 1;
    const contact = formData.get("contact");

    // In production, the queueId will come from the QR link
    const queueId = 1;

    try {
      document.querySelector("#join-btn").disabled = true;

      const data = await api("/tickets", {
        method: "POST",
        body: JSON.stringify({
          queueId,
          name,
          partySize,
          contactType: contact ? "sms" : null,
          contactValue: contact || null,
        }),
      });

      // Save IDs so status.html can access them later
      localStorage.setItem("ticketId", data.ticket.id);
      localStorage.setItem("queueId", queueId);

      // Redirect to status page
      window.location.href = "status.html";
    } catch (err) {
      alert("Failed to join queue: " + err.message);
    } finally {
      document.querySelector("#join-btn").disabled = false;
    }
  });
}
