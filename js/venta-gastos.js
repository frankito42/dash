// Modal para abrir caja
function mostrarModalAbrirCaja(idUsuario, idNegocio) {
  // Si ya existe, no crear otro
  if (document.getElementById('abrir-caja-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'abrir-caja-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.45)';
  modal.style.zIndex = '100000';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.innerHTML = `
    <div style="background:#23272f;padding:2.2rem 2.2rem 1.5rem 2.2rem;border-radius:16px;min-width:320px;max-width:95vw;box-shadow:0 8px 32px 0 rgba(0,0,0,0.28);position:relative;">
      <h2 style=\"color:#fffde8;font-size:1.25rem;margin-bottom:1.2rem;text-align:center;\">Abrir caja</h2>
      <div style=\"color:#b4b4b4;font-size:1rem;margin-bottom:1.8rem;text-align:center;\">Debes abrir una caja antes de comenzar a vender en este negocio.</div>
      <div style=\"display:flex;gap:0.5rem;\">
        <button id=\"btn-abrir-caja\" style=\"flex:1;padding:0.7rem 0;background:#00cec9;color:#23272f;font-weight:600;font-size:1.1rem;border:none;border-radius:8px;cursor:pointer;\">Abrir caja</button>
        <button id=\"btn-volver-atras-caja\" style=\"flex:1;padding:0.7rem 0;background:#23272f;color:#fffde8;font-weight:600;font-size:1.1rem;border:1px solid #444;border-radius:8px;cursor:pointer;\">Volver atrás</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // Volver atrás: cerrar panel de ventas
  document.getElementById('btn-volver-atras-caja').onclick = function() {
    modal.remove();
    window.history.back();
  };
  // Abrir caja
  document.getElementById('btn-abrir-caja').onclick = function() {
    this.disabled = true;
    this.textContent = 'Abriendo...';
    fetch('php/abrir_caja.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario, idNegocio })
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        // Si el backend retorna idCaja, usarlo, si no, solo mostrar éxito
        if (res.idCaja) {
          localStorage.setItem('idCaja', res.idCaja);
        }
        showNotification('Caja abierta correctamente', 'success');
        modal.remove();
        cargarVentasCaja();
      } else {
        showNotification(res.msg || 'No se pudo abrir la caja', 'error');
        this.disabled = false;
        this.textContent = 'Abrir caja';
      }
    })
    .catch(() => {
      showNotification('Error de red al abrir caja', 'error');
      this.disabled = false;
      this.textContent = 'Abrir caja';
    });
  };
}
window.mostrarModalAbrirCaja = mostrarModalAbrirCaja;
// === Panel de Ventas de la Caja ===

document.addEventListener('DOMContentLoaded', function() {
  const salesToggle = document.getElementById('sales-toggle');
  const salesPanel = document.getElementById('sales-summary');
  const salesClose = document.getElementById('sales-close');
  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('cart-summary');
  const cartClose = document.getElementById('cart-close');

  if (salesToggle && salesPanel && salesClose && cartToggle && cartPanel && cartClose) {
    // --- VENTAS ---
    salesToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      // Cerrar carrito
      cartPanel.classList.remove('active');
      // Mostrar panel de ventas solo si hay caja abierta
      let idCaja = localStorage.getItem('idCaja');
      if (idCaja) {
        salesPanel.classList.add('active');
        cargarVentasCaja();
      } else {
        showNotification('Debes abrir una caja antes de ver las ventas', 'warning');
      }
    });
  // Al cargar la página, verificar si hay caja abierta para el usuario y negocio
  const user = localStorage.getItem('user');
  const negocio = localStorage.getItem('negocio');
  let idUsuario = null, idNegocio = null;
  try {
    if (user) idUsuario = JSON.parse(user).id || JSON.parse(user).admin_id;
    if (negocio) idNegocio = JSON.parse(negocio).id;
  } catch (e) {}
  if (idUsuario && idNegocio) {
    fetch(`php/verificar_caja.php?idUsuario=${idUsuario}&idNegocio=${idNegocio}`)
      .then(r => r.json())
      .then(res => {
        if (res.abierta && res.idCaja) {
          localStorage.setItem('idCaja', res.idCaja);
          // Opcional: cargar ventas automáticamente si quieres mostrar el panel de ventas al inicio
          // cargarVentasCaja();
        } else {
          localStorage.removeItem('idCaja');
          mostrarModalAbrirCaja(idUsuario, idNegocio);
        }
      })
      .catch(() => {
        showNotification('Error al verificar caja', 'error');
      });
  } else {
    showNotification('No se pudo obtener el usuario o negocio', 'error');
  }
    salesClose.addEventListener('click', function() {
      salesPanel.classList.remove('active');
    });
    // --- CARRITO ---
    cartToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      // Cerrar ventas
      salesPanel.classList.remove('active');
      // Abrir carrito
      cartPanel.classList.add('active');
    });
    cartClose.addEventListener('click', function() {
      cartPanel.classList.remove('active');
    });
    // Cerrar ambos si se hace click fuera
    document.addEventListener('click', function(e) {
      if (!salesPanel.contains(e.target) && e.target !== salesToggle) {
        salesPanel.classList.remove('active');
      }
      if (!cartPanel.contains(e.target) && e.target !== cartToggle) {
        cartPanel.classList.remove('active');
      }
    });
    // Ambos inician ocultos (sin la clase active)
    salesPanel.classList.remove('active');
    cartPanel.classList.remove('active');
  }
});



function cargarVentasCaja() {
  const salesList = document.getElementById('sales-list');
  salesList.innerHTML = '<div style="color: #fffde8; text-align: center;">Cargando ventas...</div>';
  let idCaja = localStorage.getItem('idCaja');
  if (!idCaja) {
    // Intentar obtener idCaja del backend
    const user = localStorage.getItem('user');
    const negocio = localStorage.getItem('negocio');
    let idUsuario = null, idNegocio = null;
    try {
      if (user) idUsuario = JSON.parse(user).id || JSON.parse(user).admin_id;
      if (negocio) idNegocio = JSON.parse(negocio).id;
    } catch (e) {}
    if (idUsuario && idNegocio) {
      fetch(`php/verificar_caja.php?idUsuario=${idUsuario}&idNegocio=${idNegocio}`)
        .then(r => r.json())
        .then(res => {
          if (res.abierta && res.idCaja) {
            localStorage.setItem('idCaja', res.idCaja);
            cargarVentasCaja();
          } else {
            // Mostrar modal para abrir caja
            mostrarModalAbrirCaja(idUsuario, idNegocio);
          }
        })
        .catch(() => {
          salesList.innerHTML = '<div style="color: #ff6f00; text-align: center;">Error al verificar caja.</div>';
        });
      return;
    } else {
      salesList.innerHTML = '<div style="color: #ff6f00; text-align: center;">No se pudo obtener la caja.</div>';
      return;
    }
  }
  fetch(`php/listar_ventas.php?idCaja=${idCaja}`)
    .then(r => r.json())
    .then(res => {
      if (res.success && Array.isArray(res.ventas) && res.ventas.length) {
        // Guardar ventas en memoria para agregar solo la última después
        // Mostrar la última venta primero
        const ventasDesc = [...res.ventas].sort((a, b) => parseInt(b.id) - parseInt(a.id));
        window._ventasCaja = ventasDesc;
        // Header fijo y lista desplazable, solo un título
        salesList.innerHTML = `
          <div id="ventas-header" style="position:sticky;top:0;z-index:2;background:#23232b;padding-bottom:10px;">
            <button id="btn-finalizar-caja" style="width:100%;margin-bottom:10px;padding:0.8rem 0;background:#ff6f00;color:#fffde8;font-weight:700;font-size:1.08rem;border:none;border-radius:10px;cursor:pointer;box-shadow:0 2px 8px rgba(255,140,0,0.10);transition:background 0.2s;">Finalizar caja</button>
          
          </div>
          <div id="ventas-list-scroll" style="max-height:38vh;overflow-y:auto;padding-top:10px;">
            ${ventasDesc.map(v => `
              <div class="venta-item" data-venta-id="${v.id}" style="background:#23272f;border-radius:10px;padding:12px 14px;margin-bottom:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:#fffde8;font-weight:600;">Venta #${v.id}</span>
                  <span style="color:#00cec9;font-size:1.1rem;">$${parseFloat(v.total).toFixed(2)}</span>
                </div>
                <div style="color:#b4b4b4;font-size:0.95rem;">${v.fecha || ''}</div>
              </div>
            `).join('')}
          </div>
        `;
        // Listener para finalizar caja
        setTimeout(() => {
          const btn = document.getElementById('btn-finalizar-caja');
          if (btn) {
            btn.onclick = function() {
              const idCaja = localStorage.getItem('idCaja');
              if (!idCaja) {
                showNotification('No hay caja activa para finalizar', 'warning');
                return;
              }
              btn.disabled = true;
              btn.textContent = 'Finalizando...';
              fetch('php/finalizar_caja.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idCaja })
              })
              .then(r => r.json())
              .then(res => {
                if (res.success) {
                  localStorage.removeItem('idCaja');
                  showNotification('Caja finalizada correctamente', 'success');
                  // Mostrar modal para abrir caja nuevamente
                  // Obtener usuario y negocio de localStorage
                  const user = localStorage.getItem('user');
                  const negocio = localStorage.getItem('negocio');
                  let idUsuario = null, idNegocio = null;
                  try {
                    if (user) idUsuario = JSON.parse(user).id || JSON.parse(user).admin_id;
                    if (negocio) idNegocio = JSON.parse(negocio).id;
                  } catch (e) {}
                  if (idUsuario && idNegocio) {
                    setTimeout(() => mostrarModalAbrirCaja(idUsuario, idNegocio), 500);
                  }
                  cargarVentasCaja();
                } else {
                  showNotification(res.msg || 'No se pudo finalizar la caja', 'error');
                  btn.disabled = false;
                  btn.textContent = 'Finalizar caja';
                }
              })
              .catch(() => {
                showNotification('Error de red al finalizar caja', 'error');
                btn.disabled = false;
                btn.textContent = 'Finalizar caja';
              });
            };
          }
          // Listeners para cada venta
          const ventasScroll = document.getElementById('ventas-list-scroll');
          if (ventasScroll) {
            ventasScroll.querySelectorAll('.venta-item').forEach(item => {
              item.addEventListener('click', function(e) {
                e.stopPropagation();
                const ventaId = this.getAttribute('data-venta-id');
                mostrarTooltipVenta(this, ventaId);
              });
            });
          }
        }, 10);
// Tooltip para mostrar artículos de una venta
function mostrarTooltipVenta(element, ventaId) {
  // Si ya hay un tooltip abierto, quitarlo
  document.querySelectorAll('.venta-tooltip').forEach(t => t.remove());
  // Crear tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'venta-tooltip';
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = 99999;
  tooltip.style.background = '#181c22';
  tooltip.style.color = '#fffde8';
  tooltip.style.border = '1px solid #00cec9';
  tooltip.style.borderRadius = '10px';
  tooltip.style.padding = '16px 18px';
  tooltip.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.28)';
  tooltip.style.minWidth = '260px';
  tooltip.style.maxWidth = '340px';
  tooltip.style.fontSize = '1rem';
  tooltip.style.pointerEvents = 'auto';
  tooltip.innerHTML = `
    <button class="venta-tooltip-close" style="position:absolute;top:8px;right:10px;background:none;border:none;color:#fffde8;font-size:1.3rem;cursor:pointer;z-index:2;line-height:1;">&times;</button>
    <div class="venta-tooltip-content" style="text-align:center;">Cargando detalles...</div>
  `;
  tooltip.querySelector('.venta-tooltip-close').onclick = function(e) {
    e.stopPropagation();
    tooltip.remove();
  };
  document.body.appendChild(tooltip);
  // Posicionar arriba del elemento, asegurando que no se salga de la pantalla
  const rect = element.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  setTimeout(() => {
    const realH = tooltip.offsetHeight;
    const realW = tooltip.offsetWidth;
    let left = rect.left + (rect.width / 2) - (realW / 2);
    let top = rect.top - 12 - realH;
    // Si se sale por la izquierda
    if (left < 8) left = 8;
    // Si se sale por la derecha
    if (left + realW > viewportW - 8) left = viewportW - realW - 8;
    // Si se sale por arriba, mostrar debajo
    if (top < 8) top = rect.bottom + 12;
    // Si se sale por abajo, ajustar
    if (top + realH > viewportH - 8) top = viewportH - realH - 8;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }, 10);
  // Cerrar al hacer click fuera
  setTimeout(() => {
    function closeTooltip(e) {
      if (!tooltip.contains(e.target)) {
        tooltip.remove();
        document.removeEventListener('mousedown', closeTooltip);
      }
    }
    document.addEventListener('mousedown', closeTooltip);
  }, 50);
  // Obtener detalles de la venta por AJAX
  fetch('php/get_venta_detalle.php?idVenta=' + encodeURIComponent(ventaId))
    .then(r => r.json())
    .then(res => {
      const content = tooltip.querySelector('.venta-tooltip-content');
      if (res.success && Array.isArray(res.articulos)) {
        content.innerHTML = `
          <div style=\"font-weight:600;font-size:1.08rem;margin-bottom:8px;\">Artículos de la venta #${ventaId}</div>
          <div style=\"margin-bottom:10px;\">
            ${res.articulos.map(a => `
              <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;'>
                <span>${a.nombre} <span style='color:#b4b4b4;font-size:0.93em;'>x${a.cantidad}</span></span>
                <span style='color:#00cec9;'>$${parseFloat(a.precio).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div style=\"border-top:1px solid #333;padding-top:7px;text-align:right;font-weight:600;\">Total: <span style='color:#00cec9;'>$${parseFloat(res.total).toFixed(2)}</span></div>
        `;
      } else {
        content.innerHTML = '<div style="color:#ff6f00;">No se encontraron detalles de la venta.</div>';
      }
    })
    .catch(() => {
      const content = tooltip.querySelector('.venta-tooltip-content');
      if (content) content.innerHTML = '<div style="color:#ff6f00;">Error al cargar detalles.</div>';
    });
}
// CSS para el tooltip de venta
const ventaTooltipStyle = document.createElement('style');
ventaTooltipStyle.innerHTML = `
.venta-tooltip {
  animation: fadeInTooltip .18s;
}
@keyframes fadeInTooltip {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(ventaTooltipStyle);
      } else {
        window._ventasCaja = [];
        salesList.innerHTML = '<div style="color: #fffde8; text-align: center;">No hay ventas registradas en esta caja.</div>';
      }
    })
    .catch(() => {
      salesList.innerHTML = '<div style="color: #ff6f00; text-align: center;">Error al cargar ventas.</div>';
    });
}

function obtenerVentasCaja(idCaja) {
  const salesList = document.getElementById('sales-list');
  fetch(`php/listar_ventas.php?idCaja=${idCaja}`)
    .then(r => r.json())
    .then(res => {
      if (res.success && Array.isArray(res.ventas) && res.ventas.length) {
        salesList.innerHTML = res.ventas.map(v => `
          <div style="background:#23272f;border-radius:10px;padding:12px 14px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="color:#fffde8;font-weight:600;">Venta #${v.id}</span>
              <span style="color:#00cec9;font-size:1.1rem;">$${parseFloat(v.total).toFixed(2)}</span>
            </div>
            <div style="color:#b4b4b4;font-size:0.95rem;">${v.fecha || ''}</div>
            <div style="color:#b4b4b4;font-size:0.95rem;">${v.detalle || ''}</div>
          </div>
        `).join('');
      } else {
        salesList.innerHTML = '<div style="color: #fffde8; text-align: center;">No hay ventas registradas en esta caja.</div>';
      }
    })
    .catch(() => {
      salesList.innerHTML = '<div style="color: #ff6f00; text-align: center;">Error al cargar ventas.</div>';
    });
}
// Redirigir a login si no hay sesión iniciada
if (!localStorage.getItem('user')) {
  window.location.href = 'login.html';
}
// Variables globales
let currentScreen = 'venta';
let cart = [];
let selectedCategory = 'all';
let searchTimeout;
let currentStream = null;

// Productos cargados dinámicamente desde el backend
let products = [];

const expenses = [
  { id: 1, name: 'Factura Electricidad', category: 'servicios', amount: 45000, date: '2025-05-28', image: '⚡' },
  { id: 2, name: 'Papel Higiénico', category: 'suministros', amount: 8500, date: '2025-05-27', image: '🧻' },
  { id: 3, name: 'Internet Mensual', category: 'servicios', amount: 25000, date: '2025-05-26', image: '📶' },
  { id: 4, name: 'Bolsas Plásticas', category: 'suministros', amount: 3200, date: '2025-05-25', image: '🛍️' },
  { id: 5, name: 'Mantenimiento', category: 'otros', amount: 15000, date: '2025-05-24', image: '🔧' }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();

  // Mostrar mensaje de carrito vacío por defecto
  updateCartUI();

  // Verificar si viene del menú principal con una pantalla específica
  const pantallaDestino = localStorage.getItem('pantallaDestino');
  if (pantallaDestino) {
    localStorage.removeItem('pantallaDestino');
    if (pantallaDestino === 'gastos') {
      switchScreen('gastos');
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-screen="gastos"]').classList.add('active');
      showNotification('¡Bienvenido a la gestión de gastos!', 'success');
    } else {
      showNotification('¡Bienvenido al punto de venta!', 'success');
    }
  }

  // Cargar productos reales desde el backend
  cargarProductosDesdeBackend();
  renderExpenses();
  setupEventListeners();
});

function cargarProductosDesdeBackend() {
  const negocio = localStorage.getItem('negocio');
  if (!negocio) {
    renderProducts([]);
    return;
  }
  let obj;
  try {
    obj = JSON.parse(negocio);
  } catch (e) {
    renderProducts([]);
    return;
  }
  const negocioId = obj.id;
  if (!negocioId) {
    renderProducts([]);
    return;
  }
  fetch('php/listar_productos.php?negocio_id=' + encodeURIComponent(negocioId))
    .then(r => r.json())
    .then(res => {
      if (res.success && Array.isArray(res.productos)) {
        // Mapear los productos del backend al formato esperado
        products = res.productos.map(prod => ({
          id: prod.id,
          name: prod.nombre,
          category: prod.categoria,
          price: parseFloat(prod.precio),
          stock: parseInt(prod.cantidad),
          image: prod.imagen || '',
          barcode: prod.codigo_barras || '',
          costo: prod.costo || 0
        }));
        renderProducts();
      } else {
        products = [];
        renderProducts([]);
      }
    })
    .catch(() => {
      products = [];
      renderProducts([]);
    });
}

function initializeApp() {
  // Toggle entre pantallas
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.getAttribute('data-screen');
      switchScreen(screen);
      
      toggleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Filtro de categoría con custom dropdown
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const selectedCategoryLabel = document.getElementById('selected-category-label');
  if (dropdownToggle && dropdownMenu && selectedCategoryLabel) {
    dropdownToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', function(e) {
      if (!dropdownMenu.contains(e.target) && e.target !== dropdownToggle) {
        dropdownMenu.style.display = 'none';
      }
    });
    dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function() {
        const category = item.getAttribute('data-category');
        selectCategory(category);
        selectedCategoryLabel.textContent = item.textContent.trim();
        dropdownMenu.style.display = 'none';
        if (currentScreen === 'venta') {
          renderProducts();
        } else {
          renderExpenses();
        }
      });
    });
  }

  // Inicializar buscador
  initializeSearch();
  
  // Inicializar cámara
  initializeCamera();
}

function setupEventListeners() {
  // Botón atrás
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.addEventListener('click', goBack);

  // Carrito
  const cartToggle = document.getElementById('cart-toggle');
  if (cartToggle) cartToggle.addEventListener('click', toggleCart);
  const cartClose = document.getElementById('cart-close');
  if (cartClose) cartClose.addEventListener('click', toggleCart);
  const processTransactionBtn = document.getElementById('process-transaction');
  if (processTransactionBtn) processTransactionBtn.addEventListener('click', processTransaction);
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

  // Agregar producto/gasto
  const addProductCard = document.getElementById('add-product-card');
  if (addProductCard) addProductCard.addEventListener('click', showAddProductModal);
  const addExpenseCard = document.getElementById('add-expense-card');
  if (addExpenseCard) addExpenseCard.addEventListener('click', showAddExpenseModal);

  // Cerrar carrito al hacer click fuera
  document.addEventListener('click', (e) => {
    const cartSummary = document.getElementById('cart-summary');
    const cartToggle = document.getElementById('cart-toggle');
    
    if (!cartSummary.contains(e.target) && !cartToggle.contains(e.target)) {
      cartSummary.classList.remove('active');
    }
  });

  // Atajo de teclado para volver atrás
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      goBack();
    }
    
    if (e.ctrlKey && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

function switchScreen(screen) {
  currentScreen = screen;
  
  // Ocultar todas las pantallas
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  // Mostrar pantalla seleccionada
  document.getElementById(`${screen}-screen`).classList.add('active');
  
  // Actualizar título del carrito
  const cartTitle = document.querySelector('.cart-title');
  cartTitle.textContent = screen === 'venta' ? 'Carrito de Venta' : 'Gastos Registrados';
  
  // Reset categoría
  selectedCategory = 'all';
  document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.category-filter[data-category="all"]').forEach(f => f.classList.add('active'));
}

function selectCategory(category) {
  selectedCategory = category;
}

function initializeSearch() {
  // Mejorar el diseño del buscador y botón de cámara en flex
  const searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    searchContainer.style.display = 'flex';
    searchContainer.style.alignItems = 'center';
    searchContainer.style.gap = '0.75rem';
  }

  const searchInput = document.getElementById('product-search');
  const searchClear = document.getElementById('search-clear');
  const barcodeBtn = document.getElementById('barcode-btn');
  const suggestions = document.getElementById('search-suggestions');

  if (searchInput) {
    searchInput.style.flex = '1';
    searchInput.style.minWidth = '0';
  }
  if (barcodeBtn) {
    barcodeBtn.style.flex = 'none';
    barcodeBtn.style.height = '40px';
    barcodeBtn.style.width = '40px';
    barcodeBtn.style.display = 'flex';
    barcodeBtn.style.alignItems = 'center';
    barcodeBtn.style.justifyContent = 'center';
    barcodeBtn.style.background = 'var(--primary-orange)';
    barcodeBtn.style.borderRadius = '50%';
    barcodeBtn.style.color = 'white';
    barcodeBtn.style.fontSize = '1.3rem';
    barcodeBtn.style.border = 'none';
    barcodeBtn.style.cursor = 'pointer';
    barcodeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    barcodeBtn.style.transition = 'background 0.2s';
    barcodeBtn.onmouseover = () => barcodeBtn.style.background = '#ff7f32';
    barcodeBtn.onmouseout = () => barcodeBtn.style.background = 'var(--primary-orange)';
  }

  if (!searchInput) return;

  // Búsqueda en tiempo real
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    searchClear.style.display = query ? 'block' : 'none';
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        showSearchSuggestions(query);
      } else {
        hideSuggestions();
        renderProducts();
      }
    }, 300);
  });

  // Limpiar búsqueda
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    hideSuggestions();
    renderProducts();
    searchInput.focus();
  });

  // Ocultar sugerencias al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideSuggestions();
    }
  });

  // Manejar Enter en búsqueda
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        performSearch(query);
      }
    }
  });
}

function showSearchSuggestions(query) {
  const suggestions = document.getElementById('search-suggestions');
  const results = searchProducts(query);
  
  if (results.length === 0) {
    suggestions.innerHTML = `
      <div class="suggestion-item">
        <div class="suggestion-icon">❌</div>
        <div class="suggestion-info">
          <div class="suggestion-name">No se encontraron productos</div>
          <div class="suggestion-details">Intenta con otro término de búsqueda</div>
        </div>
      </div>
    `;
  } else {
    suggestions.innerHTML = results.slice(0, 5).map(product => `
      <div class="suggestion-item" onclick="selectProduct(${product.id})">
        <div class="suggestion-icon">${product.image}</div>
        <div class="suggestion-info">
          <div class="suggestion-name">${highlightText(product.name, query)}</div>
          <div class="suggestion-details">
            ${product.category} • Stock: ${product.stock} • Código: ${product.barcode}
          </div>
        </div>
        <div class="suggestion-price">$${product.price.toLocaleString()}</div>
      </div>
    `).join('');
  }
  
  suggestions.classList.add('active');
}

function hideSuggestions() {
  const suggestions = document.getElementById('search-suggestions');
  if (suggestions) {
    suggestions.classList.remove('active');
  }
}

function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.barcode.includes(query) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
}

function highlightText(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function selectProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    // Limpiar búsqueda
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.value = '';
      document.getElementById('search-clear').style.display = 'none';
    }
    hideSuggestions();
    
    // Agregar al carrito directamente
    addToCart(productId);
    
    // Scroll al producto en la lista
    scrollToProduct(productId);
    
    showNotification(`${product.name} encontrado y agregado`, 'success');
  }
}

function performSearch(query) {
  const results = searchProducts(query);
  hideSuggestions();
  
  if (results.length > 0) {
    renderProducts(results);
    showNotification(`${results.length} producto(s) encontrado(s)`, 'info');
  } else {
    renderProducts([]);
    showNotification('No se encontraron productos', 'warning');
  }
}

function scrollToProduct(productId) {
  const productCard = document.querySelector(`[data-id="${productId}"]`);
  if (productCard) {
    productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    productCard.style.border = '2px solid var(--primary-orange)';
    setTimeout(() => {
      productCard.style.border = '1px solid var(--border-color)';
    }, 2000);
  }
}

function initializeCamera() {
  const barcodeBtn = document.getElementById('barcode-btn');
  
  if (barcodeBtn) {
    barcodeBtn.addEventListener('click', () => {
      if (currentScreen === 'venta') {
        openCamera();
      } else {
        showNotification('La cámara solo está disponible en modo venta', 'info');
      }
    });
  }
}

function openCamera() {
  showCameraModal();
}

function showCameraModal() {
  // Crear modal de cámara dinámicamente
  const modal = document.createElement('div');
  modal.className = 'camera-modal';
  modal.id = 'camera-modal';
  
  modal.innerHTML = `
    <div class="camera-container">
      <div class="camera-header">
        <h3 class="camera-title">Escanear Código de Barras</h3>
        <button class="camera-close" onclick="closeCamera()">&times;</button>
      </div>
      
      <div class="camera-viewport">
        <video class="camera-video" id="camera-video" autoplay playsinline></video>
        <div class="camera-overlay"></div>
      </div>
      
      <div class="camera-status" id="camera-status">
        Apunta la cámara hacia el código de barras
      </div>
      
      <div class="camera-actions">
        <button class="camera-btn secondary" onclick="closeCamera()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancelar
        </button>
        <button class="camera-btn primary" onclick="simulateScan()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
          </svg>
          Simular Escaneo
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.classList.add('active');
  
  // Iniciar cámara
  startCamera();
}

async function startCamera() {
  try {
    const video = document.getElementById('camera-video');
    const status = document.getElementById('camera-status');
    
    if (!video || !status) return;
    
    status.textContent = 'Iniciando cámara...';
    
    // Solicitar acceso a la cámara
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Cámara trasera preferida
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });
    
    video.srcObject = currentStream;
    status.textContent = 'Apunta la cámara hacia el código de barras';
    
    // Simular detección de códigos (en producción usarías una librería como QuaggaJS)
    simulateBarcodeDetection();
    
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    const status = document.getElementById('camera-status');
    if (status) {
      status.textContent = 'Error al acceder a la cámara. Verifica los permisos.';
      status.style.color = 'var(--danger)';
    }
  }
}

function simulateBarcodeDetection() {
  // En una implementación real, aquí usarías una librería de detección de códigos de barras
  // como QuaggaJS, ZXing-js, etc.
  
  const status = document.getElementById('camera-status');
  if (!status) return;
  
  let attempts = 0;
  
  const detectionInterval = setInterval(() => {
    attempts++;
    
    if (attempts > 3) {
      status.innerHTML = 'Escaneo automático disponible. <button onclick="simulateScan()" style="color: var(--primary-orange); text-decoration: underline; background: none; border: none; cursor: pointer;">Haz clic para simular</button>';
      clearInterval(detectionInterval);
    }
  }, 2000);
}

function simulateScan() {
  // Simular escaneo exitoso con un producto aleatorio
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  const barcode = randomProduct.barcode;
  
  const status = document.getElementById('camera-status');
  if (status) {
    status.textContent = `¡Código detectado! ${barcode}`;
  }
  
  setTimeout(() => {
    closeCamera();
    
    // Buscar producto por código de barras
    const foundProduct = products.find(p => p.barcode === barcode);
    if (foundProduct) {
      addToCart(foundProduct.id);
      showNotification(`Producto escaneado: ${foundProduct.name}`, 'success');
      
      // Mostrar en el buscador
      const searchInput = document.getElementById('product-search');
      if (searchInput) {
        searchInput.value = foundProduct.name;
      }
    } else {
      showNotification(`Código ${barcode} no encontrado en inventario`, 'warning');
    }
  }, 1500);
}

function closeCamera() {
  const modal = document.getElementById('camera-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
  
  // Detener stream de cámara
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

function createProductCard(product) {
  return `
    <div class="product-card-horizontal">
      <div class="product-img-wrap">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-img-rounded">` : '<div class="img-placeholder product-img-rounded">Sin imagen</div>'}
      </div>
      <div class="product-info-horizontal">
        <div class="product-title-row">
          <span class="product-name-h">${product.name}</span>
          <span class="product-price-h">$${parseFloat(product.price).toFixed(2)}</span>
        </div>
        <div class="product-details-row">
          <span class="product-stock-h">Stock: ${product.stock}</span>
          <span class="product-category-h">${product.category}</span>
          ${product.stock > 0
            ? '<span class="product-status-h available">Disponible</span>'
            : '<span class="product-status-h">Sin stock</span>'}
        </div>
        <div class="add-cart-row">
          <input type="number" min="1" max="${product.stock}" value="1" class="add-cart-qty" id="qty-${product.id}" ${product.stock > 0 ? '' : 'disabled'}>
          <button class="add-cart-btn" data-id="${product.id}" ${product.stock > 0 ? '' : 'disabled'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>Agregar
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(customProducts = null) {
  const grid = document.getElementById('products-grid');
  const counter = document.getElementById('product-counter');
  const searchInput = document.getElementById('product-search');
  
  if (!grid || !counter) return;
  
  let filteredProducts;
  
  // Si se pasan productos personalizados (como en búsqueda), usar esos
  if (customProducts !== null) {
    filteredProducts = customProducts;
  } else if (searchInput && searchInput.value.trim()) {
    // Si hay búsqueda activa, usar esos resultados
    filteredProducts = searchProducts(searchInput.value.trim());
  } else {
    // Filtrar por categoría
    filteredProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);
  }
  
  counter.textContent = filteredProducts.length;
  
  if (filteredProducts.length === 0) {
    const emptyMessage = searchInput && searchInput.value.trim() 
      ? 'No se encontraron productos' 
      : 'No hay productos';
    const emptyDescription = searchInput && searchInput.value.trim()
      ? 'Intenta con otro término de búsqueda'
      : 'No se encontraron productos en esta categoría';
      
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h3 class="empty-title">${emptyMessage}</h3>
        <p class="empty-description">${emptyDescription}</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

  // Asignar event listeners a los botones "Agregar" generados dinámicamente
  const addCartButtons = grid.querySelectorAll('.add-cart-btn');
  addCartButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const id = parseInt(btn.getAttribute('data-id'));
      if (!isNaN(id)) {
        addToCart(id);
      }
    });
  });
}

function renderExpenses() {
  const grid = document.getElementById('expenses-grid');
  const counter = document.getElementById('expenses-counter');
  
  if (!grid || !counter) return;
  
  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === selectedCategory);
  
  counter.textContent = filteredExpenses.length;
  
  if (filteredExpenses.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h3 class="empty-title">No hay gastos</h3>
        <p class="empty-description">No se encontraron gastos en esta categoría</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filteredExpenses.map(expense => `
    <div class="product-card">
      <div class="product-header">
        <div class="product-info">
          <div class="product-name">${expense.name}</div>
          <div class="product-category">${expense.category}</div>
        </div>
        <div class="product-price" style="color: var(--danger);">-${expense.amount.toLocaleString()}</div>
      </div>
      
      <div class="product-details">
        <div class="product-stock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
          </svg>
          ${expense.date}
        </div>
        <div class="stock-status" style="background: rgba(239, 68, 68, 0.2); color: var(--danger);">
          Pagado
        </div>
      </div>
    </div>
  `).join('');
}

function getStockStatus(stock) {
  if (stock === 0) return 'out';
  if (stock <= 5) return 'low';
  return 'available';
}

function getStockText(stock) {
  if (stock === 0) return 'Agotado';
  if (stock <= 5) return 'Poco Stock';
  return 'Disponible';
}

function increaseQuantity(productId) {
  const input = document.getElementById(`qty-${productId}`);
  const product = products.find(p => p.id === productId);
  
  if (!input || !product) return;
  
  const currentValue = parseInt(input.value);
  
  if (currentValue < product.stock) {
    input.value = currentValue + 1;
  }
}

function decreaseQuantity(productId) {
  const input = document.getElementById(`qty-${productId}`);
  
  if (!input) return;
  
  const currentValue = parseInt(input.value);
  
  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const quantityInput = document.getElementById(`qty-${productId}`);
  if (!product) return;
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      costo: product.costo || 0,
      quantity: quantity
    });
  }
  updateCartUI();
  showNotification(`${product.name} agregado al carrito`, 'success');
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const cartItems = document.getElementById('cart-items');
  const totalAmount = document.getElementById('cart-total-amount');
  
  if (!badge || !cartItems || !totalAmount) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';
  
  // Limpiar el contenedor antes de asignar el nuevo HTML
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 22V12h6v10M9 12L4.91 4.91a2.78 2.78 0 0 1 .49-3.4 2.78 2.78 0 0 1 3.4.49L19.09 12"/>
          </svg>
        </div>
        <h3 class="empty-title">Carrito vacío</h3>
        <p class="empty-description">Agrega productos para comenzar</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = `
      <div style="position: relative;">
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
          ${cart.map(item => {
            return `
              <div class="product-card-horizontal" style="position:relative;">
                <button class="remove-cart-item-btn" data-id="${item.id}" title="Quitar" style="position:absolute;top:10px;right:10px;background:none;border:none;color:#ff6f00;font-size:1.3rem;cursor:pointer;z-index:2;line-height:1;">&times;</button>
                <div class="product-info-horizontal">
                  <div class="product-title-row">
                    <span class="product-name-h">${item.name}</span>
                    <span class="product-price-h">$${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  <div class="product-details-row">
                    <span class="product-stock-h">Cantidad: ${item.quantity}</span>
                    <span class="product-category-h">Unitario: $${item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  totalAmount.textContent = `${total.toLocaleString()}`;
  // Asignar event listener solo al botón de cerrar carrito (que sí es dinámico)
  const cartCloseBtn = document.getElementById('cart-close');
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', toggleCart);

  // Asignar event listeners a los botones de quitar artículo
  const removeBtns = cartItems.querySelectorAll('.remove-cart-item-btn');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const id = parseInt(btn.getAttribute('data-id'));
      if (!isNaN(id)) {
        removeFromCart(id);
      }
    });
  });
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  showNotification('Producto eliminado del carrito', 'warning');
}

function toggleCart() {
  // Ya no se usa toggle, solo abrir/cerrar directo con los listeners arriba
}

function clearCart() {
  cart = [];
  updateCartUI();
  showNotification('Carrito limpiado', 'warning');
}

function processTransaction() {
  // Filtrar solo productos con cantidad > 0
  const validCart = cart.filter(item => item.quantity > 0);
  if (validCart.length === 0) {
    showNotification('El carrito está vacío', 'error');
    return;
  }
  const total = validCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Usar idCaja directamente de localStorage
  const idCaja = localStorage.getItem('idCaja');
  if (!idCaja) {
    showNotification('No hay caja abierta', 'error');
    return;
  }
  // Preparar datos de venta
  const articulos = validCart.map(item => ({
    id: item.id,
    nombre: item.name,
    costo: item.costo || 0,
    precio: item.price,
    cantidad: item.quantity
  }));
  showNotification('Procesando venta...', 'info');
  fetch('php/registrar_venta.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idCaja, total, articulos })
  })
  .then(r => r.json())
  .then(resVenta => {
    if (resVenta.success) {
      // Descontar stock localmente
      articulos.forEach(art => {
        const prod = products.find(p => p.id == art.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - art.cantidad);
        }
      });
      clearCart();
      toggleCart();
      showNotification(`Venta procesada por ${total.toLocaleString()}`, 'success');
      renderProducts(); // Actualizar stock en UI
      // Si el panel de ventas está abierto, recargar toda la lista de ventas
      cargarVentasCaja();
    } else {
      showNotification(resVenta.msg || 'Error al registrar venta', 'error');
    }
  })
  .catch(() => showNotification('Error de red al registrar venta', 'error'));
}

function showAddProductModal() {
  //showNotification('Modal de agregar producto próximamente', 'info');
  window.location.href = 'crear-producto.html';
}

function showAddExpenseModal() {
  showNotification('Modal de agregar gasto próximamente', 'info');
}

// Función para volver atrás
function goBack() {
  // Verificar si hay modales abiertos
  const cameraModal = document.getElementById('camera-modal');
  const cartSummary = document.getElementById('cart-summary');
  
  // Si hay modal de cámara abierto, cerrarlo
  if (cameraModal && cameraModal.classList.contains('active')) {
    closeCamera();
    return;
  }
  
  // Si el carrito está abierto, cerrarlo
  if (cartSummary && cartSummary.classList.contains('active')) {
    toggleCart();
    return;
  }
  
  // Si hay búsqueda activa, limpiarla
  const searchInput = document.getElementById('product-search');
  if (searchInput && searchInput.value.trim()) {
    searchInput.value = '';
    document.getElementById('search-clear').style.display = 'none';
    hideSuggestions();
    renderProducts();
    showNotification('Búsqueda limpiada', 'info');
    return;
  }
  
  // Si hay un filtro de categoría activo (no "Todos"), resetear
  if (selectedCategory !== 'all') {
    selectedCategory = 'all';
    document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.category-filter[data-category="all"]').forEach(f => f.classList.add('active'));
    
    if (currentScreen === 'venta') {
      renderProducts();
    } else {
      renderExpenses();
    }
    showNotification('Filtro resetado', 'info');
    return;
  }
  
  // Si estamos en gastos, ir a venta
  if (currentScreen === 'gastos') {
    document.querySelector('[data-screen="venta"]').click();
    showNotification('Volviste a la pantalla de venta', 'info');
    return;
  }
  
  // Simular salida de la aplicación o volver al menú principal
  showExitConfirmation();
}

function showExitConfirmation() {
  const modal = document.createElement('div');
  modal.className = 'camera-modal'; // Reutilizar estilos del modal de cámara
  modal.id = 'exit-modal';
  
  modal.innerHTML = `
    <div class="camera-container">
      <div class="camera-header">
        <h3 class="camera-title">¿Salir del Punto de Venta?</h3>
        <button class="camera-close" onclick="closeExitModal()">&times;</button>
      </div>
      
      <div style="text-align: center; padding: 2rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🏪</div>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          ¿Estás seguro de que quieres salir del punto de venta?
        </p>
      </div>
      
      <div class="camera-actions">
        <button class="camera-btn secondary" onclick="closeExitModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancelar
        </button>
        <button class="camera-btn primary" onclick="exitApp()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/>
          </svg>
          Salir
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.classList.add('active');
}

function closeExitModal() {
  const modal = document.getElementById('exit-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

function exitApp() {
  closeExitModal();
  
  // Limpiar todo
  cart = [];
  updateCartUI();
  selectedCategory = 'all';
  
  // Limpiar búsqueda
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.value = '';
    document.getElementById('search-clear').style.display = 'none';
  }
  hideSuggestions();
  
  // Volver a pantalla de venta
  currentScreen = 'venta';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('venta-screen').classList.add('active');
  
  // Reset toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-screen="venta"]').classList.add('active');
  
  // Reset filtros
  document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.category-filter[data-category="all"]').forEach(f => f.classList.add('active'));
  
  renderProducts();
  
  //showNotification('Volviendo al menú principal...', 'success');
  
  // Redireccionar al menú principal después de 1 segundo
  setTimeout(() => {
    window.location.href = 'MenuInicio.html';
  }, 1000);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  let bgColor, borderColor, icon;
  switch(type) {
    case 'success':
      bgColor = 'rgba(16, 185, 129, 0.2)';
      borderColor = '#10b981';
      icon = '✓';
      break;
    case 'warning':
      bgColor = 'rgba(245, 158, 11, 0.2)';
      borderColor = '#f59e0b';
      icon = '⚠';
      break;
    case 'error':
      bgColor = 'rgba(239, 68, 68, 0.2)';
      borderColor = '#ef4444';
      icon = '✕';
      break;
    default:
      bgColor = 'rgba(255, 255, 255, 0.05)';
      borderColor = '#ff6f00';
      icon = 'ℹ';
  }
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ${borderColor}; color: white; font-size: 0.85rem; font-weight: bold;">${icon}</div>
      <span style="flex: 1; font-size: 0.9rem;">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; width: 20px; height: 20px;">&times;</button>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    border: 1px solid ${borderColor};
    border-radius: 12px;
    padding: 1rem;
    color: white;
    backdrop-filter: blur(10px);
    z-index: 10000;
    max-width: 320px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 4000);
}

// Toggle de tema (opcional)
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
}

// Agregar atajo de teclado para tema
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 't') {
    e.preventDefault();
    toggleTheme();
  }
});

// Funciones globales para el HTML
window.closeCamera = closeCamera;
window.simulateScan = simulateScan;
window.selectProduct = selectProduct;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCart = addToCart;
window.closeExitModal = closeExitModal;
window.exitApp = exitApp;