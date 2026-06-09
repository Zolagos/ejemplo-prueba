import ReservationCard from "@components/ReservationCard";
import {
  getReservations,
  patchReservationStatus,
  deleteReservation,
  updateReservation,
  getSpaces,
} from "@services/reservation.service";
import { getSession } from "@/utils";
import { navigateTo } from "@/router/router";

const renderReservations = async (container) => {
  const user = getSession();
  const reservations = await getReservations();

  const filtered =
    user.role === "admin"
      ? reservations
      : reservations.filter((r) => r.userId === user.id);

  container.innerHTML = filtered.length
    ? filtered.map((r) => ReservationCard(r)).join("")
    : `<div class="w-full text-center py-8 col-span-2">
         <p class="text-slate-500">No hay reservas disponibles</p>
       </div>`;
};

const showEditModal = async (reservationId) => {
  const [reservations, spaces] = await Promise.all([
    getReservations(),
    getSpaces(),
  ]);

  const reservation = reservations.find((r) => r.id === reservationId);
  if (!reservation) return;

  const modalHTML = `
    <div id="editModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">

        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-slate-800">Editar Reserva</h2>
          <button id="closeModal" class="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
        </div>

        <div id="editError" class="hidden mb-3 p-3 bg-red-100 text-red-700 rounded text-sm"></div>

        <form id="editForm" novalidate class="flex flex-col gap-4">

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Espacio</label>
            <select name="spaceId" class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
              ${spaces
                .filter((s) => s.status === "available")
                .map(
                  (s) => `
                    <option
                      value="${s.id}"
                      data-name="${s.name}"
                      ${s.id === reservation.spaceId || s.name === reservation.workspace ? "selected" : ""}
                    >
                      ${s.name} — ${s.type} (${s.location})
                    </option>
                  `
                )
                .join("")}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input
              type="date"
              name="date"
              value="${reservation.date}"
              min="${new Date().toISOString().split("T")[0]}"
              class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Hora inicio</label>
              <input
                type="time"
                name="startHour"
                value="${reservation.startHour}"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Hora fin</label>
              <input
                type="time"
                name="endHour"
                value="${reservation.endHour}"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
            <textarea
              name="reason"
              rows="3"
              class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            >${reservation.reason}</textarea>
          </div>

          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition font-medium"
          >
            Guardar cambios
          </button>

        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.querySelector("#editModal");
  const editForm = document.querySelector("#editForm");
  const editError = document.querySelector("#editError");

  document.querySelector("#closeModal").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    editError.classList.add("hidden");

    const spaceSelect = editForm.querySelector("[name='spaceId']");
    const spaceOption = spaceSelect.options[spaceSelect.selectedIndex];
    const spaceId = Number(spaceSelect.value);
    const spaceName = spaceOption?.dataset?.name || reservation.workspace;
    const date = editForm.date.value;
    const startHour = editForm.startHour.value;
    const endHour = editForm.endHour.value;
    const reason = editForm.reason.value.trim();

    if (!date) {
      editError.textContent = "Selecciona una fecha.";
      editError.classList.remove("hidden");
      return;
    }
    if (!startHour || !endHour) {
      editError.textContent = "Ingresa hora de inicio y fin.";
      editError.classList.remove("hidden");
      return;
    }
    if (startHour >= endHour) {
      editError.textContent = "La hora de inicio debe ser anterior a la hora de fin.";
      editError.classList.remove("hidden");
      return;
    }
    if (!reason) {
      editError.textContent = "Escribe el motivo de la reserva.";
      editError.classList.remove("hidden");
      return;
    }

    try {
      const all = await getReservations();
      const conflict = all.find(
        (r) =>
          r.id !== reservationId &&
          r.spaceId === spaceId &&
          r.date === date &&
          r.status !== "cancelled" &&
          r.status !== "rejected" &&
          startHour < r.endHour &&
          endHour > r.startHour
      );

      if (conflict) {
        editError.textContent = `Conflicto con reserva existente: ${conflict.startHour} — ${conflict.endHour}.`;
        editError.classList.remove("hidden");
        return;
      }

      await updateReservation(reservationId, {
        ...reservation,
        spaceId,
        workspace: spaceName,
        date,
        startHour,
        endHour,
        reason,
      });

      modal.remove();
      const container = document.querySelector("#reservationsContainer");
      await renderReservations(container);

    } catch {
      editError.textContent = "Error al guardar. Intenta de nuevo.";
      editError.classList.remove("hidden");
    }
  });
};

export const homeController = async () => {
  const container = document.querySelector("#reservationsContainer");

  await renderReservations(container);

  document.querySelector("#botonReservaU")?.addEventListener("click", () => {
    navigateTo("/reservas");
  });

  document.querySelector("#botonGestionAdmin")?.addEventListener("click", () => {
    navigateTo("/admin");
  });

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

      case "cancel":
        await patchReservationStatus(id, "cancelled");
        await renderReservations(container);
        break;

      case "delete":
        if (confirm("¿Seguro que deseas eliminar esta reserva?")) {
          await deleteReservation(id);
          await renderReservations(container);
        }
        break;

      case "edit":
        await showEditModal(id);
        break;
    }
  });
};