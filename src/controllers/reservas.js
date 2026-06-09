import { getSession } from "@/utils";
import { getReservations, createReservation, getSpaces } from "@services/reservation.service";
import { navigateTo } from "@/router/router";

export const reservasController = async () => {
  const form = document.querySelector("#reservasForm");
  const spaceSelect = document.querySelector("#spaceSelect");
  const errorBox = document.querySelector("#reservasError");
  const successBox = document.querySelector("#reservasSuccess");

  // --- helpers ---
  const showError = (msg) => {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
    successBox.classList.add("hidden");
  };

  const showSuccess = (msg) => {
    successBox.textContent = msg;
    successBox.classList.remove("hidden");
    errorBox.classList.add("hidden");
  };

  const hideMessages = () => {
    errorBox.classList.add("hidden");
    successBox.classList.add("hidden");
  };

  // --- load spaces into select ---
  try {
    const spaces = await getSpaces();
    spaceSelect.innerHTML = `
      <option value="">Selecciona un espacio</option>
      ${spaces
        .filter((s) => s.status === "available")
        .map((s) => `<option value="${s.id}" data-name="${s.name}">${s.name} — ${s.type} (${s.location})</option>`)
        .join("")}
    `;
  } catch {
    spaceSelect.innerHTML = `<option value="">Error cargando espacios</option>`;
  }

  // --- set min date to today ---
  const dateInput = form.querySelector("[name='date']");
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);

  // --- submit ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessages();

    const user = getSession();

    const spaceOption = spaceSelect.options[spaceSelect.selectedIndex];
    const spaceId = Number(spaceSelect.value);
    const spaceName = spaceOption?.dataset?.name || "";
    const date = form.date.value;
    const startHour = form.startHour.value;
    const endHour = form.endHour.value;
    const reason = form.reason.value.trim();

    // --- validation ---
    if (!spaceId) return showError("Selecciona un espacio.");
    if (!date) return showError("Selecciona una fecha.");
    if (!startHour || !endHour) return showError("Ingresa hora de inicio y fin.");
    if (startHour >= endHour) return showError("La hora de inicio debe ser anterior a la hora de fin.");
    if (!reason) return showError("Escribe el motivo de la reserva.");

    // --- duplicate check: same space + date + overlapping time ---
    try {
      const existing = await getReservations();
      const conflict = existing.find(
        (r) =>
          r.spaceId === spaceId &&
          r.date === date &&
          r.status !== "cancelled" &&
          r.status !== "rejected" &&
          startHour < r.endHour &&
          endHour > r.startHour
      );

      if (conflict) {
        return showError(
          `El espacio ya tiene una reserva de ${conflict.startHour} a ${conflict.endHour} en esa fecha.`
        );
      }

      // --- create ---
      await createReservation({
        userId: user.id,
        spaceId,
        workspace: spaceName,
        date,
        startHour,
        endHour,
        reason,
        status: "pending",
      });

      showSuccess("¡Reserva creada exitosamente! Redirigiendo...");
      form.reset();

      setTimeout(() => navigateTo("/home"), 1500);

    } catch {
      showError("Error al conectar con el servidor. Intenta de nuevo.");
    }
  });
};