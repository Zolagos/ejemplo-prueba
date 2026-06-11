import { createSpace } from "@services/space.service";
import { navigateTo } from "@/router/router";

export const createSpaceController = async () => {
  const form = document.querySelector("#createSpaceForm");
  const errorBox = document.querySelector("#spaceError");
  const successBox = document.querySelector("#spaceSuccess");
  const btnCancel = document.querySelector("#btnCancelSpace");

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

  if (!form) return;

  // Botón cancelar
  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      navigateTo("/home");
    });
  }

  // --- submit ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessages();

    const name = form.name.value.trim();
    const type = form.type.value;
    const capacity = parseInt(form.capacity.value, 10);
    const location = form.location.value.trim();
    const status = form.status.value;

    // --- validation ---
    if (!name) return showError("Ingresa el nombre del espacio.");
    if (!type) return showError("Selecciona el tipo de espacio.");
    if (!capacity || capacity <= 0) return showError("Ingresa una capacidad válida mayor a 0.");
    if (!location) return showError("Ingresa la ubicación del espacio.");
    if (!status) return showError("Selecciona el estado inicial.");

    // --- create ---
    try {
      await createSpace({
        name,
        type,
        capacity,
        location,
        status,
      });

      showSuccess("¡Sala creada exitosamente! Redirigiendo...");
      form.reset();

      setTimeout(() => navigateTo("/home"), 1500);

    } catch {
      showError("Error al conectar con el servidor. Intenta de nuevo.");
    }
  });
};