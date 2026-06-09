import Sidebar from "@/components/Sidebar";
import { getSession } from "@/utils";
import { reservasController } from "@/controllers/reservas.js";

export default function reservasView() {
  const user = getSession();

  setTimeout(() => {
    reservasController();
  });

  return `
    <div class="flex">

      ${Sidebar()}

      <main class="flex-1 bg-slate-100 min-h-screen p-8">

        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Nueva Reserva</h1>
          <p class="text-slate-500 text-sm mt-1">
            Bienvenido ${user?.name} — completa el formulario para reservar un espacio.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow max-w-xl">

          <div id="reservasError" class="hidden mb-4 p-3 bg-red-100 text-red-700 rounded text-sm"></div>
          <div id="reservasSuccess" class="hidden mb-4 p-3 bg-green-100 text-green-700 rounded text-sm"></div>

          <form id="reservasForm" novalidate>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Espacio
              </label>
              <select
                name="spaceId"
                id="spaceSelect"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Cargando espacios...</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div class="mb-4 flex gap-4">

              <div class="flex-1">
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Hora inicio
                </label>
                <input
                  type="time"
                  name="startHour"
                  class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div class="flex-1">
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Hora fin
                </label>
                <input
                  type="time"
                  name="endHour"
                  class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Motivo
              </label>
              <textarea
                name="reason"
                rows="3"
                placeholder="Describe el motivo de la reserva"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition font-medium"
            >
              Crear reserva
            </button>

          </form>

        </div>

      </main>

    </div>
  `;
}