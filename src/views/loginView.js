import { loginController } from "@/controllers/login.controller";

export default function loginView() {
  setTimeout(() => {
    loginController();
  });

  return `
    <div class="min-h-screen flex justify-center items-center bg-slate-100">

      <div class="bg-white p-8 rounded-lg shadow w-96">

        <h1 class="text-3xl font-bold mb-5">Login</h1>

        <div id="loginError" class="hidden mb-4 p-3 bg-red-100 text-red-700 rounded text-sm"></div>

        <form id="loginForm" novalidate>

          <input
            type="email"
            name="email"
            placeholder="Correo"
            class="border w-full p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition"
          >
            Ingresar
          </button>

        </form>

      </div>

    </div>
  `;
}