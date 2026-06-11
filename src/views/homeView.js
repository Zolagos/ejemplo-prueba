import Sidebar from "@/components/Sidebar";
import { getSession } from "@/utils";
import { homeController } from "@/controllers/home.controller";

export default function homeView() {
  const user = getSession();

  setTimeout(() => {
    homeController();
  });

  return `
    <div class="flex">

      ${Sidebar()}

      <main class="flex-1 p bg-slate-100 min-h-screen">

        <div class="p-6">

          <h1 class="text-sm font-bold">
            Bienvenido ${user?.name}
          </h1>

          <p class="text-orange-900 mb-4">
            Rol: ${user?.role}
          </p>

          ${
            user?.role === "admin"
              ? `
                <section class="bg-white p-5 rounded-lg shadow mb-6">
                  <h2 class="font-bold text-xl mb-2">
                    Panel Administrador
                  </h2>

                  <p class="text-slate-600 mb-3">
                    Puedes visualizar todas las reservas de la organización y gestionar el catálogo de salas.
                  </p>

                  <button id="btnCreateSpace" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                    Crear Nueva Sala
                  </button>

                </section>
              `
              : `
                <section class="bg-white p-5 rounded-lg shadow mb-6">
                  <h2 class="font-bold text-xl mb-2">
                    Panel Usuario
                  </h2>

                  <p class="text-slate-600 mb-3">
                    Puedes visualizar únicamente tus reservas.
                  </p>

                  <button id="botonReservaU" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
                    Nueva Reserva
                  </button>

                </section>
              `
          }

          <section class="bg-white p-5 rounded-lg shadow">

            <div class="flex justify-between items-center mb-4">
              <h2 class="font-bold text-xl">
                Reservas
              </h2>

              <span class="text-sm text-slate-500">
                ${
                  user?.role === "admin"
                    ? "Mostrando todas las reservas"
                    : "Mostrando únicamente tus reservas"
                }
              </span>
            </div>

            <div id="reservationsContainer" class="grid gap-4 md:grid-cols-2">
              <div class="w-full text-center py-8 col-span-2">
                <p class="text-emerald-800">
                  Cargando reservas ...
                </p>
              </div>
            </div>

          </section>

        </div>

      </main>

    </div>
  `;
}