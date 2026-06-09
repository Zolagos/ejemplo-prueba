import { removeSession, getSession } from "@/utils";
import { navigateTo } from "@/router/router";

export default function Sidebar() {
  const user = getSession();

  setTimeout(() => {
    document
      .querySelector("#logoutBtn")
      ?.addEventListener("click", () => {
        removeSession();
        navigateTo("/");
      });
  });

  return `
    <aside class="w-64 bg-slate-900 text-white h-screen p-5 flex flex-col">

      <h2 class="text-2xl font-bold mb-8">SPA Base</h2>

      <nav class="flex flex-col gap-4 flex-1">

        <a href="/home" class="px-3 py-1 bg-gray-500 rounded-xl">
          Home
        </a>

        ${
          user?.role === "user"
            ? `<a href="/reservas" class="px-3 py-1 bg-green-700 hover:bg-green-600 rounded-xl transition">
                Nueva Reserva
               </a>`
            : ""
        }

        ${
          user?.role === "admin"
            ? `<a href="/admin" class="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-xl transition">
                Gestionar Reservas
               </a>`
            : ""
        }

        <button
          id="logoutBtn"
          class="text-left cursor-pointer text-red-400 hover:text-white hover:bg-red-400 px-3 py-1 rounded-xl mt-auto"
        >
          Cerrar sesión
        </button>

      </nav>

    </aside>
  `;
}