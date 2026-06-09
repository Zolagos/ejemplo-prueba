import { saveSession } from "@/utils";
import { navigateTo } from "@/router/router";
import { http } from "@/api/http";

export const loginController = () => {
  const form = document.querySelector("#loginForm");
  const errorBox = document.querySelector("#loginError");

  const showError = (msg) => {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.add("hidden");

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      return showError("Por favor completa todos los campos.");
    }

    try {
      const users = await http.get(
        `/users?email=${email}&password=${password}`
      );

      if (!users.length) {
        return showError("Correo o contraseña incorrectos.");
      }

      saveSession({
        id: users[0].id,
        name: users[0].name,
        role: users[0].role,
      });

      navigateTo("/home");

    } catch {
      showError("Error conectando con el servidor.");
    }
  });
};