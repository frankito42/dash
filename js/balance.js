// balance-dark.js

document.addEventListener('DOMContentLoaded', () => {
  // Cambiar pestañas Ingresos/Egresos
  const tabs = document.querySelectorAll('.tabs div');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('activo'));
      tab.classList.add('activo');
      // Aquí podrías cargar dinámicamente los datos según la pestaña seleccionada
      console.log(`Pestaña activa: ${tab.textContent}`);
    });
  });

  // Botones de acción
  document.querySelector('.venta').addEventListener('click', () => {
    alert('Crear nueva venta');
  });

  document.querySelector('.gasto').addEventListener('click', () => {
    alert('Registrar nuevo gasto');
  });

  // Selector de fecha (puedes mejorarlo con estados activos)
  const fechas = document.querySelectorAll('.fecha-selector div');
  fechas.forEach(f => {
    f.addEventListener('click', () => {
      fechas.forEach(el => el.classList.remove('fecha-activa'));
      f.classList.add('fecha-activa');
      // Podrías recargar los datos del balance para la fecha seleccionada
      console.log(`Fecha seleccionada: ${f.textContent}`);
    });
  });

  // Navegación inferior (puedes enlazar esto con otras pantallas)
  const navItems = document.querySelectorAll('footer div');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('activo'));
      item.classList.add('activo');
      alert(`Navegar a: ${item.textContent.trim()}`);
    });
  });
});
