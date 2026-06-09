import ReservationCard from "@components/ReservationCard";
import {
  getReservations,
  patchReservationStatus,
  deleteReservation,
} from "@services/reservation.service";

const renderReservations = async (container) => {
  const reservations = await getReservations();

  container.innerHTML = reservations.length
    ? reservations.map((r) => ReservationCard(r)).join("")
    : `<div class="col-span-2 text-center py-8 text-slate-400">
         No hay reservas registradas.
       </div>`;
};

export const adminController = async () => {
  const container = document.querySelector("#adminContainer");

  await renderReservations(container);

  container.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);

    switch (action) {
      case "approve":
        await patchReservationStatus(id, "approved");
        await renderReservations(container);
        break;

      case "reject":
        await patchReservationStatus(id, "rejected");
        await renderReservations(container);
        break;

      case "delete":
        if (confirm("¿Eliminar esta reserva?")) {
          await deleteReservation(id);
          await renderReservations(container);
        }
        break;

      case "edit":
        await showEditModal(id, container);
        break;
    }
  });
};