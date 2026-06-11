import { createSpaceController } from "@/controllers/createSpace.controller";
import { getSession } from "@/utils";
import loginView from "@/views/loginView";

export default function createSpaceView() {
  const user = getSession();

  // Protección de ruta por autenticación
  if (!user) {
    return loginView();
  }

  // Protección de ruta por rol administrativo
  if (user.role !== "admin") {
    setTimeout(() => {
      const btnBackHome = document.getElementById("btnBackHome");
      if (btnBackHome) {
        btnBackHome.addEventListener("click", () => {
          import("@/router/router").then((m) => m.navigateTo("/home"));
        });
      }
    });

    return `
      <div class="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <h2 class="text-2xl font-bold text-red-600">Acceso denegado</h2>
        <p class="text-slate-600 mt-2">No tienes permisos para acceder a este módulo administrativo.</p>
        <button id="btnBackHome" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Volver al Inicio
        </button>
      </div>
    `;
  }

  setTimeout(() => {
    createSpaceController();
  });

  return `
    <div class="min-h-screen bg-slate-100 flex justify-center items-center p-4">
      <div class="bg-white p-8 rounded-lg shadow w-full max-w-md">
        
        <h1 class="text-2xl font-bold mb-5 text-slate-800">
          Crear Nueva Sala
        </h1>

        <div id="spaceError" class="hidden mb-3 p-3 bg-red-100 text-red-700 rounded text-sm"></div>
        <div id="spaceSuccess" class="hidden mb-3 p-3 bg-green-100 text-green-700 rounded text-sm"></div>

        <form id="createSpaceForm">
          
          <label class="block mb-1 text-sm font-medium text-slate-700">Nombre del espacio</label>
          <input
            type="text"
            name="name"
            placeholder="Ej. Sala de Conferencias A"
            class="border w-full p-2 rounded mb-3"
            required
          >

          <label class="block mb-1 text-sm font-medium text-slate-700">Tipo de espacio</label>
          <select name="type" class="border w-full p-2 rounded mb-3" required>
            <option value="Oficina privada">Oficina privada</option>
            <option value="Sala de reuniones">Sala de reuniones</option>
            <option value="Espacio de coworking">Espacio de coworking</option>
            <option value="Auditorio">Auditorio</option>
          </select>

          <label class="block mb-1 text-sm font-medium text-slate-700">Capacidad (personas)</label>
          <input
            type="number"
            name="capacity"
            placeholder="Ej. 10"
            class="border w-full p-2 rounded mb-3"
            min="1"
            required
          >

          <label class="block mb-1 text-sm font-medium text-slate-700">Ubicación</label>
          <input
            type="text"
            name="location"
            placeholder="Ej. Piso 2 - Ala Sur"
            class="border w-full p-2 rounded mb-3"
            required
          >

          <label class="block mb-1 text-sm font-medium text-slate-700">Estado inicial</label>
          <select name="status" class="border w-full p-2 rounded mb-5" required>
            <option value="available">Disponible</option>
            <option value="unavailable">No disponible</option>
          </select>

          <div class="flex flex-col gap-2">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition font-medium">
              Guardar Sala
            </button>
            <button type="button" id="btnCancelSpace" class="bg-slate-500 hover:bg-slate-600 text-white w-full py-2 rounded transition">
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  `;
}