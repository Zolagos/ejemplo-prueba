import { getSession } from "@/utils";

export default function ReservationCard(reservation) {
  const { id, workspace, date, startHour, endHour, reason, status } = reservation;
  const user = getSession();
  const isAdmin = user?.role === "admin";
  const isOwner = reservation.userId === user?.id;

  // Status badge color
  const statusColors = {
    pending:   "bg-yellow-100 text-yellow-800",
    approved:  "bg-green-100 text-green-800",
    rejected:  "bg-red-100 text-red-800",
    cancelled: "bg-slate-100 text-slate-500",
  };

  const statusLabels = {
    pending:   "Pendiente",
    approved:  "Aprobada",
    rejected:  "Rechazada",
    cancelled: "Cancelada",
  };

  // --- Build action buttons ---
  const actions = [];

  if (isAdmin) {
    // Admin can approve/reject pending
    if (status === "pending") {
      actions.push(`
        <button
          data-action="approve"
          data-id="${id}"
          class="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
        >
          Aprobar
        </button>
        <button
          data-action="reject"
          data-id="${id}"
          class="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
        >
          Rechazar
        </button>
      `);
    }
    // Admin can always edit and delete
    actions.push(`
      <button
        data-action="edit"
        data-id="${id}"
        class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
      >
        Editar
      </button>
      <button
        data-action="delete"
        data-id="${id}"
        class="text-xs bg-slate-500 hover:bg-slate-600 text-white px-3 py-1 rounded transition"
      >
        Eliminar
      </button>
    `);
  } else if (isOwner) {
    // User: edit only if pending
    if (status === "pending") {
      actions.push(`
        <button
          data-action="edit"
          data-id="${id}"
          class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
        >
          Editar
        </button>
      `);
    }
    // User: cancel if pending or approved
    if (status === "pending" || status === "approved") {
      actions.push(`
        <button
          data-action="cancel"
          data-id="${id}"
          class="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition"
        >
          Cancelar
        </button>
      `);
    }
  }

  return `
    <article
      class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col gap-2"
      data-reservation-id="${id}"
    >
      <div class="flex justify-between items-start">
        <h3 class="font-bold text-slate-800 text-base">${workspace}</h3>
        <span class="text-xs font-medium px-2 py-1 rounded-full ${statusColors[status] || "bg-slate-100 text-slate-500"}">
          ${statusLabels[status] || status}
        </span>
      </div>

      <div class="text-sm text-slate-600 flex flex-col gap-1">
        <p><span class="font-medium">Fecha:</span> ${date}</p>
        <p><span class="font-medium">Horario:</span> ${startHour} — ${endHour}</p>
        <p><span class="font-medium">Motivo:</span> ${reason}</p>
        ${isAdmin ? `<p><span class="font-medium">Usuario ID:</span> ${reservation.userId}</p>` : ""}
      </div>

      ${
        actions.length
          ? `<div class="flex gap-2 mt-2 flex-wrap">${actions.join("")}</div>`
          : ""
      }
    </article>
  `;
}