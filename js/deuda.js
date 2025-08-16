// Archivo: deudas.js

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      // Aquí podrías añadir lógica para mostrar contenido diferente según la pestaña
      console.log(`Pestaña activa: ${tab.textContent}`);
    });
  });

  const nuevaVentaBtn = document.querySelector(".btn.green");
  const nuevoGastoBtn = document.querySelector(".btn.red");

  nuevaVentaBtn.addEventListener("click", () => {
    alert("Redirigiendo a Nueva Venta...");
    // Lógica para redireccionar o mostrar modal
  });

  nuevoGastoBtn.addEventListener("click", () => {
    alert("Redirigiendo a Nuevo Gasto...");
    // Lógica para redireccionar o mostrar modal
  });

  const navItems = document.querySelectorAll(".bottom-nav div");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      // Lógica de navegación aquí
      console.log(`Navegando a: ${item.textContent.trim()}`);
    });
  });
});
