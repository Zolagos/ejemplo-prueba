import Sidebar from "@/components/Sidebar";
import { getSession } from "@/utils";
import { adminController } from "@/controllers/admin.controller";

export default function adminView() {
  const user = getSession();

  setTimeout(() => {
    adminController();
  });

  return `
    <div class="flex">

      ${Sidebar()}

      <main class="flex-1 bg-slate-100 min-h-screen p-8">

        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Panel Administrador</h1>
          <p class="text-slate-500 text-sm mt-1">
            Bienvenido ${user?.name} — todas las reservas del sistema.
          </p>
        </div>

        <div
          id="adminContainer"
          class="grid gap-4 md:grid-cols-2"
        >
          <div class="col-span-2 text-center py-8 text-slate-400">
            Cargando reservas...
          </div>
        </div>

      </main>

    </div>
  `;
}