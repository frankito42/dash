// === Listar cajas del negocio en la sección de ingresos (balance) ===
function cargarCajasNegocioBalance() {
    const negocioLS = localStorage.getItem('negocio');
    let idNegocio = null;
    if (negocioLS) {
        try {
            const negocioObj = JSON.parse(negocioLS);
            idNegocio = negocioObj.id;
        } catch (e) {}
    }
    const contenedor = document.getElementById('cajas-ingresos-balance');
    if (!idNegocio || !contenedor) {
        if (contenedor) contenedor.innerHTML = '<div style="color:#ff6f00;">No disponible</div>';
        return;
    }
    contenedor.innerHTML = '<div style="color:#fffde8;">Cargando cajas...</div>';
    fetch('php/listar_cajas_negocio.php?idNegocio=' + encodeURIComponent(idNegocio))
        .then(r => r.json())
        .then(res => {
            if (res.success && Array.isArray(res.cajas)) {
                if (res.cajas.length === 0) {
                    contenedor.innerHTML = '<div style="color:#fffde8;">No hay cajas registradas.</div>';
                    return;
                }
                contenedor.innerHTML = res.cajas.map(caja => {
                    const abierta = !caja.fechaFin;
                    return `
                        <div class="caja-item" style="background:#23272f;border-radius:10px;padding:12px 14px;margin-bottom:10px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span style="color:#fffde8;font-weight:600;">Caja #${caja.idCaja}</span>
                                <span style="color:${abierta ? '#00cec9' : '#ff6f00'};font-size:1.1rem;">$${caja.total.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                            </div>
                            <div style="color:#b4b4b4;font-size:0.95rem;">Usuario: ${caja.usuario || 'Desconocido'}</div>
                            <div style="color:#b4b4b4;font-size:0.95rem;">Inicio: ${caja.fechaInicio ? caja.fechaInicio.replace('T',' ').substring(0,19) : '-'}</div>
                            <div style="color:#b4b4b4;font-size:0.95rem;">Fin: ${caja.fechaFin ? caja.fechaFin.replace('T',' ').substring(0,19) : (abierta ? '<span style=\'color:#00cec9\'>En curso</span>' : '-')}</div>
                            <button class="btn-ver-detalles-caja" data-idcaja="${caja.idCaja}" style="margin-top:10px;width:100%;padding:0.6rem 0;background:#00cec9;color:#23272f;font-weight:600;font-size:1rem;border:none;border-radius:8px;cursor:pointer;transition:background 0.2s;">Ver detalles</button>
                        </div>
                    `;
                }).join('');
                // Asignar listeners a los botones de ver detalles
                contenedor.querySelectorAll('.btn-ver-detalles-caja').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const idCaja = this.getAttribute('data-idcaja');
                        if (idCaja) mostrarModalDetallesCaja(idCaja);
                    });
                });
// Modal fullscreen para ver detalles de una caja
function mostrarModalDetallesCaja(idCaja) {
    // Si ya hay un modal abierto, quitarlo
    document.querySelectorAll('.modal-detalles-caja').forEach(m => m.remove());
    const modal = document.createElement('div');
    modal.className = 'modal-detalles-caja';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 100001;
        background: rgba(20,22,30,0.98); color: #fffde8; display: flex; flex-direction: column;
        align-items: center; justify-content: flex-start; overflow-y: auto; padding: 0 0 40px 0;`;
    modal.innerHTML = `
        <div style="width:100vw;max-width:600px;margin:32px auto 0 auto;background:#23232b;border-radius:18px;box-shadow:0 8px 32px 0 rgba(0,0,0,0.28);padding:0;position:relative;display:flex;flex-direction:column;max-height:calc(100vh - 64px);">
            <button class="cerrar-modal-detalles-caja" style="position:absolute;top:18px;right:18px;background:none;border:none;color:#fffde8;font-size:2rem;cursor:pointer;z-index:2;">&times;</button>
            <h2 style="color:#00cec9;font-size:1.35rem;text-align:center;margin:2.2rem 0 1.2rem 0;">Detalles de Caja #${idCaja}</h2>
            <div id="detalles-caja-header" style="position:sticky;top:0;z-index:3;background:#23232b;padding:0 1.5rem 1.1rem 1.5rem;"></div>
            <div id="detalles-caja-content" style="flex:1;min-height:120px;text-align:center;overflow-y:auto;padding:0 1.5rem 1.5rem 1.5rem;">Cargando ventas...</div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.cerrar-modal-detalles-caja').onclick = () => modal.remove();
    // Cargar ventas y detalles
    fetch('php/get_ventas_caja.php?idCaja=' + encodeURIComponent(idCaja))
        .then(r => r.json())
        .then(res => {
            const content = modal.querySelector('#detalles-caja-content');
            if (res.success && Array.isArray(res.ventas)) {
                // Calcular total de la caja
                const totalCaja = res.ventas.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);
                // Header fijo
                const headerHtml = `
                    <div style="margin-bottom:0;display:flex;flex-direction:column;align-items:center;">
                        <div style="font-size:1.13rem;font-weight:600;color:#fffde8;">Total de la caja: <span style='color:#00cec9;'>$${totalCaja.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
                        <div style="font-size:1.13rem;font-weight:600;color:#fffde8;margin-top:4px;">Ganancia: <span style='color:#10b981;'>$${parseFloat(res.gananciaCaja).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
                    </div>`;
                modal.querySelector('#detalles-caja-header').innerHTML = headerHtml;
                let html = '';
                if (res.ventas.length === 0) {
                    html += '<div style="color:#fffde8;">No hay ventas en esta caja.</div>';
                } else {
                    html += res.ventas.map(v => `
                        <div style="background:#23272f;border-radius:10px;padding:12px 14px;margin-bottom:10px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span style="color:#fffde8;font-weight:600;">Venta #${v.idVenta}</span>
                                <span style="color:#00cec9;font-size:1.1rem;">$${parseFloat(v.total).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                            </div>
                            <div style="color:#b4b4b4;font-size:0.95rem;">Fecha: ${v.fecha ? v.fecha.replace('T',' ').substring(0,19) : '-'}</div>
                            <div style="margin-top:6px;">
                                <strong style="color:#ffb300;">Artículos:</strong>
                                <ul style="list-style:none;padding:0;margin:0;">
                                    ${v.detalles.map(d => `
                                        <li style="color:#fffde8;font-size:0.97rem;">${d.nombre} <span style="color:#b4b4b4;">x${d.cantidad}</span> <span style="color:#00cec9;">$${parseFloat(d.precio).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}</span> <span style="color:#b4b4b4;">(Costo: $${parseFloat(d.costo).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})})</span></li>
                                    `).join('')}
                                </ul>
                            </div>
                            <div style="color:#10b981;font-size:0.98rem;margin-top:4px;">Ganancia venta: $${parseFloat(v.ganancia).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                        </div>
                    `).join('');
                }
                content.innerHTML = html;
            } else {
                content.innerHTML = '<div style="color:#ff6f00;">Error al cargar ventas</div>';
            }
        })
        .catch(() => {
            const content = modal.querySelector('#detalles-caja-content');
            if (content) content.innerHTML = '<div style="color:#ff6f00;">Error de red</div>';
        });
}
            } else {
                contenedor.innerHTML = '<div style="color:#ff6f00;">Error al cargar cajas</div>';
            }
        })
        .catch(() => {
            contenedor.innerHTML = '<div style="color:#ff6f00;">Error de red</div>';
        });
}
// === Cargar total de ingresos en la sección de balance ===
function cargarTotalIngresosBalance() {
    const negocioLS = localStorage.getItem('negocio');
    let idNegocio = null;
    if (negocioLS) {
        try {
            const negocioObj = JSON.parse(negocioLS);
            idNegocio = negocioObj.id;
        } catch (e) {}
    }
    const totalIngresosElem = document.getElementById('total-ingresos-balance');
    if (!idNegocio || !totalIngresosElem) {
        if (totalIngresosElem) totalIngresosElem.textContent = 'No disponible';
        return;
    }
    totalIngresosElem.textContent = 'Cargando...';
    fetch('php/total_ingresos.php?idNegocio=' + encodeURIComponent(idNegocio))
        .then(r => r.json())
        .then(res => {
            if (res.success) {
                totalIngresosElem.textContent = '$' + (res.total || 0).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2});
            } else {
                totalIngresosElem.textContent = 'Error';
            }
        })
        .catch(() => {
            totalIngresosElem.textContent = 'Error';
        });
}


"use strict";

// Redirigir a login si no hay sesión iniciada
if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
}

// Variables globales
const body = document.body;
const bgColorsBody = ["#0f0f23", "#1a1a2e", "#16213e", "#0f172a", "#1e1b4b"];
const menu = document.querySelector(".menu");
const menuItems = menu.querySelectorAll(".menu__item");
let activeItem = menu.querySelector(".active");

// Función para manejar clicks en el menú
function clickItem(item, index) {
    if (activeItem == item) return;

    if (activeItem) {
        activeItem.classList.remove("active");
    }

    item.classList.add("active");
    activeItem = item;
}

// Navegación entre secciones
const secciones = {
    inicio: document.getElementById('inicio'),
    inventario: document.getElementById('inventario'),
    deuda: document.getElementById('deuda'),
    balance: document.getElementById('balance'),
    configuracion: document.getElementById('configuracion'),
};

// Función para mostrar sección con animación
function mostrarSeccion(seccionActiva) {
    Object.keys(secciones).forEach(key => {
        if (key === seccionActiva) {
            secciones[key].style.display = 'block';
            secciones[key].style.opacity = '0';
            setTimeout(() => {
                secciones[key].style.opacity = '1';
                secciones[key].style.transition = 'opacity 0.3s ease';
                // Si es balance, cargar ingresos y cajas
                if (key === 'balance') {
                    cargarTotalIngresosBalance();
                    cargarCajasNegocioBalance();
                }
            }, 10);
        } else {
            secciones[key].style.display = 'none';
        }
    });
}

// Event listeners para navegación
menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        clickItem(item, index);

        // Navegar a la sección correspondiente
        switch (index) {
            case 0:
                mostrarSeccion('inicio');
                break;
            case 1:
                mostrarSeccion('inventario');
                break;
            case 2:
                mostrarSeccion('deuda');
                break;
            case 3:
                mostrarSeccion('balance');
                break;
            case 4: // NUEVA: Configuración
                mostrarSeccion('configuracion');
                break;
            default:
                mostrarSeccion('inicio');
        }
    });
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;

    let bgColor, borderColor, icon;
    switch (tipo) {
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

    notificacion.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ${borderColor}; color: white; font-size: 0.85rem; font-weight: bold;">${icon}</div>
            <span style="flex: 1; font-size: 0.9rem;">${mensaje}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; width: 20px; height: 20px;">&times;</button>
        </div>
    `;

    notificacion.style.cssText = `
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

    document.body.appendChild(notificacion);

    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }
    }, 4000);
}

// Función para navegar a la pantalla de venta/gastos
function navegarAPuntoVenta(pantalla = 'venta') {
    mostrarNotificacion(`Navegando a ${pantalla}...`, 'info');

    // Guardar la pantalla de destino en localStorage para que la app sepa qué mostrar
    localStorage.setItem('pantallaDestino', pantalla);

    // Redireccionar después de un breve delay para mostrar la notificación
    setTimeout(() => {
        window.location.href = 'venta-gastos.html';
    }, 800);
}

// === FUNCIÓN ACTUALIZADA PARA NAVEGAR A CREAR PRODUCTO ===
function navegarACrearProducto() {
    mostrarNotificacion('Navegando a crear producto...', 'info');

    // Guardar estado actual
    localStorage.setItem('pantallaOrigen', 'inventario');

    // Crear overlay de transición
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 111, 0, 0.95), rgba(255, 140, 0, 0.95));
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;

    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <h3 style="margin: 0; font-size: 1.2rem;">Cargando...</h3>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    // Navegar después de la animación
    setTimeout(() => {
        window.location.href = 'crear-producto.html';
    }, 1200);
}

// Funcionalidad principal

document.addEventListener('DOMContentLoaded', function () {
    // 1. Cargar negocio del usuario
    const user = localStorage.getItem('user');
    let adminId = null;
    if (user) {
        try {
            const userObj = JSON.parse(user);
            adminId = userObj.id || userObj.admin_id;
        } catch (e) {}
    }
    if (adminId) {
        fetch(`php/get_business.php?admin_id=${encodeURIComponent(adminId)}`)
            .then(r => r.json())
            .then(res => {
                if (res.success && res.business) {
                    localStorage.setItem('negocio', JSON.stringify(res.business));
                    // Actualizar nombre del negocio en el header si existe el span
                    const nombreNegocioSpan = document.getElementById('nombreNegocio');
                    if (nombreNegocioSpan && res.business.name) {
                        nombreNegocioSpan.textContent = res.business.name;
                    }
                } else {
                    localStorage.removeItem('negocio');
                }
            })
            .catch(() => {
                localStorage.removeItem('negocio');
            });
    } else {
        localStorage.removeItem('negocio');
    }

    // Al cargar, si ya hay negocio en localStorage, mostrar el nombre inmediatamente
    const negocioLS = localStorage.getItem('negocio');
    if (negocioLS) {
        try {
            const negocioObj = JSON.parse(negocioLS);
            const nombreNegocioSpan = document.getElementById('nombreNegocio');
            if (nombreNegocioSpan && negocioObj.name) {
                nombreNegocioSpan.textContent = negocioObj.name;
            }
        } catch (e) {}
    }

    // Funcionalidad del header modernizado
    initializeHeader();

    // Animaciones de entrada para las cards
    const cards = document.querySelectorAll('.action-card, .dashboard-card, .suggested-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Efectos hover mejorados
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ...existing code...

    // Funcionalidad para botones de acción principales - ACTUALIZADO
    const sellButton = document.querySelector('.sell-action');
    const buyButton = document.querySelector('.buy-action');

    if (sellButton) {
        sellButton.addEventListener('click', function () {
            navegarAPuntoVenta('venta');
        });
    }

    if (buyButton) {
        buyButton.addEventListener('click', function () {
            navegarAPuntoVenta('gastos');
        });
    }

    // ...existing code...

    // Funcionalidad para cards de gestión
    const managementCards = document.querySelectorAll('.suggested-card');
    managementCards.forEach((card, index) => {
        card.addEventListener('click', function () {
            switch (index) {
                case 0:
                    mostrarSeccion('deuda');
                    menuItems[2].click();
                    break;
                case 1:
                    setTimeout(() => {
                        window.location.href = 'estadisticas.html';
                    }, 500);
                    break;
                case 2:
                    // NUEVA FUNCIONALIDAD - NAVEGAR A LISTA DE CLIENTES
                    mostrarNotificacion('Navegando a lista de clientes...', 'info');
                    setTimeout(() => {
                        window.location.href = 'lista-clientes.html';
                    }, 500);
                    break;
                case 3:
                    setTimeout(() => {
                        window.location.href = 'lista-proveedores.html';
                    }, 500);
                    break;
            }
        });
    });

    // ...existing code...

    // Tabs functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parentTabs = this.closest('.modern-tabs');
            const allTabsInGroup = parentTabs.querySelectorAll('.tab-button');

            allTabsInGroup.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');

            const tabType = this.getAttribute('data-tab');
            handleTabChange(tabType);
        });
    });

    // ...existing code...

    // Botones de acción en pantallas - ACTUALIZADO CON NAVEGACIÓN A crear-producto.html
    setTimeout(() => {
        // Inventario - NAVEGACIÓN A CREAR PRODUCTO ACTUALIZADA
        const createProductBtn = document.querySelector('.btn-primary-large');
        if (createProductBtn) {
            createProductBtn.addEventListener('click', () => {
                navegarACrearProducto(); // Navega a crear-producto.html
            });
        }

        const categoriesBtn = document.querySelector('.btn-secondary-large');
        if (categoriesBtn) {
            categoriesBtn.addEventListener('click', () => {
                if (typeof abrirModalCategorias === 'function') {
                    abrirModalCategorias();
                } else {
                    mostrarNotificacion('Funcionalidad de categorías próximamente', 'info');
                }
            });
        }

        // Balance y Deuda - Ahora navegan a punto de venta
        const newSaleButtons = document.querySelectorAll('.btn-success-large');
        newSaleButtons.forEach(button => {
            button.addEventListener('click', () => {
                navegarAPuntoVenta('venta');
            });
        });

        const newExpenseButtons = document.querySelectorAll('.btn-danger-large');
        newExpenseButtons.forEach(button => {
            button.addEventListener('click', () => {
                navegarAPuntoVenta('gastos');
            });
        });

        const balanceLinks = document.querySelectorAll('.balance-link');
        balanceLinks.forEach(link => {
            link.addEventListener('click', () => {
                const linkText = link.textContent.trim();
                if (linkText.includes('Descargar')) {
                    mostrarNotificacion('Descarga de reportes próximamente', 'info');
                } else {
                    mostrarNotificacion('Vista detallada próximamente', 'info');
                }
            });
        });
    }, 500);

    // ...existing code...

    // === LISTAR PRODUCTOS ===
    function listarProductos() {
        fetch('php/listar_productos.php')
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    renderizarProductos(res.productos);
                } else {
                    mostrarNotificacion('Error al cargar productos: ' + res.message, 'error');
                }
            })
            .catch(() => mostrarNotificacion('Error de red al cargar productos', 'error'));
    }

    function renderizarProductos(productos) {
        let contenedor = document.getElementById('listaProductos');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'listaProductos';
            contenedor.className = 'product-list';
            const mainContainer = document.querySelector('.main-container');
            const refSection = document.querySelector('.quick-actions-section');
            if (mainContainer && refSection) {
                mainContainer.insertBefore(contenedor, refSection.nextSibling);
            } else {
                document.body.appendChild(contenedor);
            }
        }
        if (!productos.length) {
            contenedor.innerHTML = '<div class="no-productos">No hay productos registrados.</div>';
            return;
        }
        contenedor.innerHTML = productos.map(prod => `
            <div class="product-card-modern" style="position:relative;">
                <div class="edit-btn-container" style="position:absolute; top:10px; right:10px; z-index:2;">
                    <button class="btn-edit-producto product-action-btn" data-id="${prod.id}" title="Editar producto">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
                        </svg>
                    </button>
                </div>
                <div class="product-image">
                    ${prod.imagen ? `<img src="${prod.imagen}" alt="${prod.nombre}">` : '<div class="img-placeholder">Sin imagen</div>'}
                </div>
                <div class="product-info-modern">
                    <div class="product-header">
                        <span class="product-name">${prod.nombre}</span>
                        <span class="product-price">$${parseFloat(prod.precio).toFixed(2)}</span>
                    </div>
                    <div class="product-details">
                        <span class="product-stock">Stock: ${prod.cantidad}</span>
                        <span class="product-category">${prod.categoria}</span>
                        ${prod.cantidad > 0
                            ? '<span class="product-status available">Disponible</span>'
                            : '<span class="product-status">Sin stock</span>'}
                    </div>
                </div>
            </div>
        `).join('');

        // Agregar listeners a los botones de editar
        const editBtns = contenedor.querySelectorAll('.btn-edit-producto');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                if (id) {
                    window.location.href = `crear-producto.html?id=${id}`;
                }
            });
        });
    }

    listarProductos();
});

// Funcionalidad del header modernizado
function initializeHeader() {
    const profileIcon = document.getElementById('profileIcon');
    const profileMenu = document.getElementById('profileMenu');
    const notificationBadge = document.getElementById('notificationBadge');
    const configButton = document.getElementById('configButton');

    // Toggle del menú de perfil
    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            profileMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function (e) {
            if (!profileMenu.contains(e.target) && !profileIcon.contains(e.target)) {
                profileMenu.classList.remove('active');
            }
        });

        // Logout usando confirm nativo
        const cerrarSesionBtn = document.getElementById('cerrarSesion');
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
                if (confirmed) {
                    mostrarNotificacion('Cerrando sesión...', 'success');
                    setTimeout(() => {
                        localStorage.clear();
                        sessionStorage && sessionStorage.clear && sessionStorage.clear();
                        window.location.href = 'login.html';
                    }, 1000);
                }
                profileMenu.classList.remove('active');
            });
        }

        // Funcionalidad de los otros items del menú
        const menuItems = profileMenu.querySelectorAll('.profile-menu-item');
        menuItems.forEach((item) => {
            if (item.id === 'cerrarSesion') return; // Ya manejado arriba
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const itemText = this.textContent.trim().toLowerCase();
                if (itemText.includes('perfil')) {
                    mostrarNotificacion('Perfil de usuario próximamente', 'info');
                } else if (itemText.includes('negocio')) {
                    mostrarNotificacion('Información del negocio próximamente', 'info');
                } else if (itemText.includes('configuración')) {
                    mostrarNotificacion('Panel de configuración próximamente', 'info');
                }
                profileMenu.classList.remove('active');
            });
        });
    }

    // Funcionalidad de notificaciones
    if (notificationBadge) {
        notificationBadge.addEventListener('click', function () {
            mostrarNotificacion('Panel de notificaciones próximamente', 'info');
            // Simular que se leyeron las notificaciones
            setTimeout(() => {
                const count = this.querySelector('.notification-count');
                if (count) {
                    count.style.transform = 'scale(0)';
                    setTimeout(() => {
                        count.textContent = '0';
                        count.style.display = 'none';
                    }, 300);
                }
            }, 1000);
        });
    }

    // Funcionalidad del botón de configuración
    if (configButton) {
        configButton.addEventListener('click', function () {
            mostrarNotificacion('Configuración avanzada próximamente', 'info');
        });
    }
}

// Modal de confirmación
function mostrarModalConfirmacion(mensaje, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirmar Acción</h3>
            </div>
            <div class="modal-body">
                <p>${mensaje}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel">Cancelar</button>
                <button class="btn-confirm">Confirmar</button>
            </div>
        </div>
    `;

    // Estilos del modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999 !important;
        backdrop-filter: blur(5px);
        opacity: 1 !important;
        pointer-events: all;
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: #23272f;
        border: 1px solid #ff8c00;
        border-radius: 16px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        backdrop-filter: blur(20px);
        transform: scale(1) !important;
        opacity: 1 !important;
        z-index: 1000000 !important;
    `;

    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        margin-bottom: 1rem;
        color: #fffbe8;
        font-size: 1.25rem;
        font-weight: 600;
    `;

    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        margin-bottom: 2rem;
        color: #e0e0e0;
        line-height: 1.5;
    `;

    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    `;

    const btnCancel = modal.querySelector('.btn-cancel');
    const btnConfirm = modal.querySelector('.btn-confirm');

    btnCancel.style.cssText = `
        padding: 0.75rem 1.5rem;
        border: 2px solid #ff8c00;
        background: transparent;
        color: #ff8c00;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    btnConfirm.style.cssText = `
        padding: 0.75rem 1.5rem;
        background: #ff8c00;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(modal);

    // Animar entrada
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Event listeners
    btnCancel.addEventListener('click', () => {
        modal.remove();
    });

    btnConfirm.addEventListener('click', () => {
        onConfirm();
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Manejar cambios de tab
function handleTabChange(tabType) {
    if (tabType === 'cobrar' || tabType === 'pagar') {
        const debtContent = document.querySelector('#deuda .debt-content');
        const emptyTitle = debtContent.querySelector('.empty-title');
        const emptyDescription = debtContent.querySelector('.empty-description');

        if (tabType === 'cobrar') {
            emptyTitle.textContent = 'No tienes deudas por cobrar';
            emptyDescription.textContent = 'Créalas registrando una nueva venta a crédito';
        } else {
            emptyTitle.textContent = 'No tienes deudas por pagar';
            emptyDescription.textContent = 'Registra tus gastos y compromisos pendientes';
        }
    }

    if (tabType === 'ingresos' || tabType === 'egresos') {
        const movementsContent = document.querySelector('#balance .movements-content');
        const emptyTitle = movementsContent.querySelector('.empty-title');
        const emptyDescription = movementsContent.querySelector('.empty-description');

        if (tabType === 'ingresos') {
            emptyTitle.textContent = 'No tienes ingresos registrados';
            emptyDescription.textContent = 'Registra tus ventas y otros ingresos';
        } else {
            emptyTitle.textContent = 'No tienes egresos registrados';
            emptyDescription.textContent = 'Registra tus gastos y compras';
        }
    }
}

// Configuración de gráficos ECharts
const getOptionChart4 = () => {
    return {
        backgroundColor: 'transparent',
        dataset: [
            {
                dimensions: ['name', 'score'],
                source: [
                    ['Harina', 314],
                    ['CocaCola', 351],
                    ['Fideos', 287],
                    ['Pan', 219],
                    ['Arroz', 253],
                ]
            },
            {
                transform: {
                    type: 'sort',
                    config: { dimension: 'score', order: 'desc' }
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0,
                rotate: 30,
                color: '#b4b4b4',
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        yAxis: {
            axisLabel: {
                color: '#b4b4b4',
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        series: {
            type: 'bar',
            encode: { x: 'name', y: 'score' },
            datasetIndex: 1,
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#ff8c00'
                    }, {
                        offset: 1, color: '#ff6f00'
                    }]
                },
                borderRadius: [4, 4, 0, 0]
            }
        }
    };
};

// Inicializar gráficos cuando se carga la página
const initCharts = () => {
    const chartElement = document.getElementById("grafico");
    if (chartElement && typeof echarts !== 'undefined') {
        const chart4 = echarts.init(chartElement);
        chart4.setOption(getOptionChart4());

        window.addEventListener('resize', () => {
            chart4.resize();
        });
    }
};

// Inicializar cuando se carga la página
window.addEventListener("load", () => {
    initCharts();
});

// Agregar estilos para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// === FUNCIONALIDAD MODAL DE CATEGORÍAS ===

// Variables del modal
const modalCategorias = document.getElementById('modalCategorias');
const nombreCategoriaInput = document.getElementById('nombreCategoria');
const btnCrearCategoria = document.getElementById('crearCategoria');
const btnCancelarCategoria = document.getElementById('cancelarCategoria');
const btnCerrarModal = document.getElementById('closeModalCategorias');

// Función para abrir el modal
function abrirModalCategorias() {
    if (!modalCategorias) return;

    modalCategorias.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll del body

    // Enfocar el input después de la animación
    setTimeout(() => {
        if (nombreCategoriaInput) nombreCategoriaInput.focus();
    }, 300);

    // Resetear el formulario
    resetearFormularioCategoria();
}

// Función para cerrar el modal
function cerrarModalCategorias() {
    if (!modalCategorias) return;

    modalCategorias.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaurar scroll del body

    // Limpiar el input después de la animación
    setTimeout(() => {
        resetearFormularioCategoria();
    }, 300);
}

// Función para resetear el formulario
function resetearFormularioCategoria() {
    if (nombreCategoriaInput) {
        nombreCategoriaInput.value = '';
        actualizarEstadoBotonCrear();
    }
}

// Función para validar y actualizar el estado del botón crear
function actualizarEstadoBotonCrear() {
    if (!nombreCategoriaInput || !btnCrearCategoria) return;

    const nombreCategoria = nombreCategoriaInput.value.trim();
    const esValido = nombreCategoria.length >= 2 && nombreCategoria.length <= 50;

    btnCrearCategoria.disabled = !esValido;

    if (esValido) {
        btnCrearCategoria.style.opacity = '1';
        btnCrearCategoria.style.cursor = 'pointer';
    } else {
        btnCrearCategoria.style.opacity = '0.6';
        btnCrearCategoria.style.cursor = 'not-allowed';
    }
}

// Función para crear la categoría
function crearCategoria() {
    if (!nombreCategoriaInput || !btnCrearCategoria) return;

    const nombreCategoria = nombreCategoriaInput.value.trim();

    // Validación
    if (nombreCategoria.length < 2) {
        mostrarNotificacion('El nombre debe tener al menos 2 caracteres', 'warning');
        return;
    }

    if (nombreCategoria.length > 50) {
        mostrarNotificacion('El nombre no puede superar los 50 caracteres', 'warning');
        return;
    }

    // Simular creación de categoría
    btnCrearCategoria.disabled = true;
    btnCrearCategoria.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        Creando...
    `;

    // Simular delay de creación
    setTimeout(() => {
        mostrarNotificacion(`Categoría "${nombreCategoria}" creada exitosamente`, 'success');
        cerrarModalCategorias();

        // Restaurar botón
        btnCrearCategoria.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
            </svg>
            Crear Categoría
        `;
        btnCrearCategoria.disabled = false;

        // Aquí puedes agregar la lógica para guardar la categoría
        console.log('Nueva categoría creada:', nombreCategoria);

    }, 1500);
}

// Event Listeners para categorías
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar configuración después de que todo esté cargado
    setTimeout(() => {
        inicializarConfiguracion();
        inicializarModalCategorias();
    }, 500);
});

function inicializarModalCategorias() {
    // Solo inicializar si los elementos existen
    if (!modalCategorias) return;

    // Abrir modal cuando se hace click en el botón de categorías
    const categoriesBtn = document.querySelector('.btn-secondary-large');
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', () => {
            abrirModalCategorias();
        });
    }

    // Cerrar modal
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalCategorias);
    if (btnCancelarCategoria) btnCancelarCategoria.addEventListener('click', cerrarModalCategorias);

    // Cerrar modal al hacer click fuera del contenido
    modalCategorias.addEventListener('click', function (e) {
        if (e.target === modalCategorias) {
            cerrarModalCategorias();
        }
    });

    // Crear categoría
    if (btnCrearCategoria) btnCrearCategoria.addEventListener('click', crearCategoria);

    // Validación en tiempo real del input
    if (nombreCategoriaInput) {
        nombreCategoriaInput.addEventListener('input', function () {
            actualizarEstadoBotonCrear();

            // Remover caracteres especiales si es necesario
            let valor = this.value;
            // Permitir solo letras, números, espacios y algunos caracteres especiales básicos
            valor = valor.replace(/[^\w\sáéíóúñü\-&]/gi, '');
            this.value = valor;
        });

        // Crear categoría al presionar Enter
        nombreCategoriaInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !btnCrearCategoria.disabled) {
                e.preventDefault();
                crearCategoria();
            }
        });
    }

    // Cerrar modal al presionar Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalCategorias.classList.contains('active')) {
            cerrarModalCategorias();
        }
    });

    // Inicializar estado del botón
    actualizarEstadoBotonCrear();
}

// === FUNCIONALIDAD DE CONFIGURACIÓN ===
function inicializarConfiguracion() {
    const configCards = document.querySelectorAll('[data-config]');

    if (configCards.length === 0) return; // Evitar errores si no existen

    configCards.forEach((card, index) => {
        card.addEventListener('click', function () {
            const configType = this.getAttribute('data-config');
            manejarConfiguracion(configType);
        });

        // Animaciones de entrada
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

function manejarConfiguracion(tipo) {
    if (!tipo) return;

    switch (tipo) {
        case 'negocio':
            mostrarNotificacion('Navegando a información del negocio...', 'info');
            setTimeout(() => {
                window.location.href = 'info-negocio.html';
            }, 800);
            break;

        case 'estadisticas':
            mostrarNotificacion('Navegando a estadísticas...', 'info');
            setTimeout(() => {
                window.location.href = 'estadisticas.html';
            }, 800);
            break;

        case 'cliente':
            mostrarNotificacion('Navegando a crear cliente...', 'info');
            setTimeout(() => {
                window.location.href = 'crear-cliente.html';
            }, 800);
            break;

        case 'empleado':
            mostrarNotificacion('Gestión de empleados próximamente', 'info');
            break;

        case 'nuevo-negocio':
            mostrarNotificacion('Navegando a crear negocio...', 'info');
            setTimeout(() => {
                window.location.href = 'crear-negocio.html';
            }, 800);
            break;

        case 'proveedores':
            mostrarNotificacion('Navegando a crear proveedor...', 'info');
            setTimeout(() => {
                window.location.href = 'crear-proveedor.html';
            }, 800);
            break;

        case 'catalogo':
            setTimeout(() => {
                window.location.href = 'catalogo-virtual.html';
            }, 800);
            break;

        case 'pedidos':
            mostrarNotificacion('Gestión de pedidos próximamente', 'info');
            break;

        case 'planes':
            mostrarNotificacion('Planes y suscripción próximamente', 'info');
            break;

        case 'ayuda':
            mostrarNotificacion('Centro de ayuda próximamente', 'info');
            break;

        default:
            mostrarNotificacion('Funcionalidad próximamente', 'info');
    }
}

// Función adicional para mostrar categorías existentes (opcional)
function mostrarCategorias() {
    // Aquí puedes agregar lógica para mostrar las categorías existentes
    // Por ejemplo, actualizar la UI con las categorías guardadas
    console.log('Mostrar categorías existentes');
}

// Función para eliminar categoría (opcional para futuro)
function eliminarCategoria(nombreCategoria) {
    // Lógica para eliminar categoría
    console.log('Eliminar categoría:', nombreCategoria);
}