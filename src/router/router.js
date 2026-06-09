import loginView from "@/views/loginView";
import homeView from "@/views/homeView";
import adminView from "../views/adminView";
import NotFoundView from "@/views/notFound";
import reservasView from "@/views/reservas";
import { isAuthenticated, isAdmin } from "@/utils";

// Route → View
const routes = {
  "/": loginView,
  "/home": homeView,
  "/reservas": reservasView,
  "/admin": adminView, 
  "/not-found": NotFoundView,
};

// Routes that require auth and a specific role
// null means: any authenticated user can access
const protectedRoutes = {
  "/home": null,
  "/reservas": "user",
  "/admin": "admin",
};

export const navigateTo = (path) => {
  history.pushState({}, "", path);
  router();
};

export const router = () => {
  const app = document.querySelector("#app");
  const path = window.location.pathname;

  // 1. Check if route requires auth
  if (path in protectedRoutes) {
    if (!isAuthenticated()) {
      history.replaceState({}, "", "/");
      app.innerHTML = loginView();
      return;
    }

    // 2. Check role requirement
    const requiredRole = protectedRoutes[path];
    if (requiredRole !== null && !isAdmin() && requiredRole === "admin") {
      history.replaceState({}, "", "/access-denied");
      app.innerHTML = accessDeniedView();
      return;
    }

    // 3. Prevent "user" role from accessing admin
    if (path === "/admin" && !isAdmin()) {
      history.replaceState({}, "", "/access-denied");
      app.innerHTML = accessDeniedView();
      return;
    }
  }

  // 4. Redirect authenticated users away from login
  if (path === "/" && isAuthenticated()) {
    history.replaceState({}, "", "/home");
    app.innerHTML = homeView();
    return;
  }

  const view = routes[path] || NotFoundView;
  app.innerHTML = view();
};

// Inline — no separate file needed, it's a one-liner message
const accessDeniedView = () => `
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
    <h1 class="text-6xl font-bold text-red-600">403</h1>
    <h2 class="text-2xl font-semibold text-slate-700 mt-4">Acceso denegado</h2>
    <p class="text-slate-500 mt-2 text-center max-w-md">
      No tienes permisos para acceder a esta sección.
    </p>
    <button
      onclick="history.back()"
      class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
    >
      Volver
    </button>
  </div>
`;

window.addEventListener("popstate", router);