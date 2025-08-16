// === FUNCIONALIDAD LISTA DE CLIENTES ===

// Variables globales
let clientes = [];
let clientesFiltrados = [];
let filtroActual = 'todos';
let clienteSeleccionado = null;

// Variables del DOM
const clientesLista = document.getElementById('clientesLista');
const estadoVacio = document.getElementById('estadoVacio');
const sinResultados = document.getElementById('sinResultados');
const searchInput = document.getElementById('searchClientes');
const filterTabs = document.querySelectorAll('.filter-tab');
const nuevoClienteBtn = document.getElementById('nuevoClienteBtn');
const volverInicioBtn = document.getElementById('volverInicio');
const toggleThemeBtn = document.getElementById('toggleThemeListaClientes');

// Modales
const modalEliminar = document.getElementById('modalEliminar');
const modalDetalle = document.getElementById('modalDetalle');

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando lista de clientes...');
    
    try {
        initializeEventListeners();
        initializeTheme();
        cargarClientes();
        filtrarClientes();
        renderizarClientes();
        actualizarContadores();
        
        console.log('Lista de clientes inicializada correctamente');
        console.log('Clientes cargados:', clientes.length);
    } catch (error) {
        console.error('Error al inicializar:', error);
        mostrarNotificacion('Error al cargar la aplicación', 'error');
    }
});

// === EVENT LISTENERS ===
function initializeEventListeners() {
    // Navegación
    if (volverInicioBtn) {
        volverInicioBtn.addEventListener('click', function() {
            window.location.href = 'MenuInicio.html';
        });
    }
    
    // Nuevo cliente
    if (nuevoClienteBtn) {
        nuevoClienteBtn.addEventListener('click', navegarACrearCliente);
    }
    
    const crearPrimerClienteBtn = document.getElementById('crearPrimerCliente');
    if (crearPrimerClienteBtn) {
        crearPrimerClienteBtn.addEventListener('click', navegarACrearCliente);
    }
    
    // Búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filtrarClientes();
            renderizarClientes();
        });
    }
    
    const limpiarBusquedaBtn = document.getElementById('limpiarBusqueda');
    if (limpiarBusquedaBtn) {
        limpiarBusquedaBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                filtrarClientes();
                renderizarClientes();
            }
        });
    }
    
    // Filtros
    filterTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const filtro = tab.getAttribute('data-filter');
            aplicarFiltro(filtro);
        });
    });
    
    // Modal eliminar
    const cancelarEliminar = document.getElementById('cancelarEliminar');
    if (cancelarEliminar) {
        cancelarEliminar.addEventListener('click', cerrarModalEliminar);
    }
    
    const confirmarEliminarBtn = document.getElementById('confirmarEliminar');
    if (confirmarEliminarBtn) {
        confirmarEliminarBtn.addEventListener('click', confirmarEliminar);
    }
    
    // Modal detalle
    const cerrarDetalleBtn = document.getElementById('cerrarDetalle');
    if (cerrarDetalleBtn) {
        cerrarDetalleBtn.addEventListener('click', cerrarModalDetalle);
    }
    
    const editarClienteBtn = document.getElementById('editarCliente');
    if (editarClienteBtn) {
        editarClienteBtn.addEventListener('click', function() {
            mostrarNotificacion('Funcionalidad de edición próximamente', 'info');
            cerrarModalDetalle();
        });
    }
    
    const whatsappClienteBtn = document.getElementById('whatsappCliente');
    if (whatsappClienteBtn) {
        whatsappClienteBtn.addEventListener('click', function() {
            if (clienteSeleccionado && clienteSeleccionado.whatsapp) {
                abrirWhatsAppDirecto(clienteSeleccionado.whatsapp);
                cerrarModalDetalle();
            }
        });
    }
    
    // Cerrar modales al hacer click fuera
    if (modalEliminar) {
        modalEliminar.addEventListener('click', function(e) {
            if (e.target === modalEliminar) {
                cerrarModalEliminar();
            }
        });
    }
    
    if (modalDetalle) {
        modalDetalle.addEventListener('click', function(e) {
            if (e.target === modalDetalle) {
                cerrarModalDetalle();
            }
        });
    }
    
    // Tecla escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModalEliminar();
            cerrarModalDetalle();
        }
        
        // Ctrl + N para nuevo cliente
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            navegarACrearCliente();
        }
    });
    
    // Tema
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', toggleTheme);
    }
}

// === NAVEGACIÓN ===
function navegarACrearCliente() {
    mostrarNotificacion('Navegando a crear cliente...', 'info');
    setTimeout(function() {
        window.location.href = 'crear-cliente.html';
    }, 500);
}

// === GESTIÓN DE DATOS ===
function cargarClientes() {
    try {
        const clientesGuardados = localStorage.getItem('clientes');
        if (clientesGuardados) {
            clientes = JSON.parse(clientesGuardados);
        } else {
            clientes = [];
        }
        console.log('Clientes cargados desde localStorage:', clientes.length);
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        clientes = [];
        mostrarNotificacion('Error al cargar los clientes', 'error');
    }
}

function guardarClientes() {
    try {
        localStorage.setItem('clientes', JSON.stringify(clientes));
        console.log('Clientes guardados en localStorage');
    } catch (error) {
        console.error('Error al guardar clientes:', error);
        mostrarNotificacion('Error al guardar los cambios', 'error');
    }
}

// === RENDERIZADO ===
function renderizarClientes() {
    console.log('Renderizando clientes...', clientesFiltrados.length);
    
    // Limpiar contenedor
    if (clientesLista) {
        clientesLista.innerHTML = '';
    }
    
    // Mostrar estado apropiado
    if (clientes.length === 0) {
        mostrarEstadoVacio();
        return;
    }
    
    if (clientesFiltrados.length === 0) {
        mostrarSinResultados();
        return;
    }
    
    // Ocultar estados vacíos
    if (estadoVacio) {
        estadoVacio.style.display = 'none';
    }
    if (sinResultados) {
        sinResultados.style.display = 'none';
    }
    
    // Renderizar clientes
    clientesFiltrados.forEach(function(cliente, index) {
        const clienteCard = crearClienteCard(cliente, index);
        if (clientesLista) {
            clientesLista.appendChild(clienteCard);
        }
    });
}

function crearClienteCard(cliente, index) {
    const card = document.createElement('div');
    card.className = 'cliente-card';
    card.style.animationDelay = (index * 0.1) + 's';
    
    const tipoEmoji = obtenerEmojiTipo(cliente.tipoCliente);
    const fechaCreacion = formatearFecha(cliente.fechaCreacion);
    
    card.innerHTML = `
        <div class="cliente-header">
            <div class="cliente-info">
                <h3 class="cliente-nombre">${cliente.nombre}</h3>
                <span class="cliente-tipo">${tipoEmoji} ${cliente.tipoCliente || 'Particular'}</span>
            </div>
            <div class="cliente-actions">
                <button class="cliente-action-btn" title="Ver detalles">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                    </svg>
                </button>
                ${cliente.whatsapp ? `
                    <button class="cliente-action-btn whatsapp-btn" title="WhatsApp">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </button>
                ` : ''}
                <button class="cliente-action-btn delete" title="Eliminar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                    </svg>
                </button>
            </div>
        </div>
        
        <div class="cliente-details">
            <div class="cliente-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>${cliente.telefono}</span>
            </div>
            
            <div class="cliente-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>${cliente.direccion}</span>
            </div>
            
            ${cliente.limiteCredito > 0 ? `
                <div class="cliente-detail">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Crédito: $${cliente.limiteCredito.toLocaleString()}</span>
                </div>
            ` : ''}
            
            <div class="cliente-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Desde ${fechaCreacion}</span>
            </div>
        </div>
    `;
    
    // Event listeners para la card
    const detalleBtn = card.querySelector('.cliente-action-btn:first-child');
    if (detalleBtn) {
        detalleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mostrarDetalle(cliente.id);
        });
    }
    
    const whatsappBtn = card.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            abrirWhatsAppDirecto(cliente.whatsapp);
        });
    }
    
    const deleteBtn = card.querySelector('.delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            confirmarEliminarCliente(cliente.id, cliente.nombre);
        });
    }
    
    // Click en la card para mostrar detalles
    card.addEventListener('click', function() {
        mostrarDetalle(cliente.id);
    });
    
    return card;
}

function mostrarEstadoVacio() {
    if (estadoVacio) {
        estadoVacio.style.display = 'block';
    }
    if (sinResultados) {
        sinResultados.style.display = 'none';
    }
}

function mostrarSinResultados() {
    if (estadoVacio) {
        estadoVacio.style.display = 'none';
    }
    if (sinResultados) {
        sinResultados.style.display = 'block';
    }
}

// === FILTROS Y BÚSQUEDA ===
function aplicarFiltro(filtro) {
    filtroActual = filtro;
    console.log('Aplicando filtro:', filtro);
    
    // Actualizar tabs activos
    filterTabs.forEach(function(tab) {
        if (tab.getAttribute('data-filter') === filtro) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Aplicar filtro
    filtrarClientes();
    renderizarClientes();
}

function filtrarClientes() {
    const busqueda = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    clientesFiltrados = clientes.filter(function(cliente) {
        // Filtro por tipo
        const cumpleTipo = filtroActual === 'todos' || cliente.tipoCliente === filtroActual;
        
        // Filtro por búsqueda
        const cumpleBusqueda = !busqueda || 
            cliente.nombre.toLowerCase().includes(busqueda) ||
            cliente.telefono.toLowerCase().includes(busqueda) ||
            cliente.direccion.toLowerCase().includes(busqueda) ||
            (cliente.ciudad && cliente.ciudad.toLowerCase().includes(busqueda));
        
        return cumpleTipo && cumpleBusqueda;
    });
    
    console.log('Clientes filtrados:', clientesFiltrados.length);
}

function actualizarContadores() {
    const contadores = {
        todos: clientes.length,
        particular: clientes.filter(function(c) { return c.tipoCliente === 'particular'; }).length,
        empresa: clientes.filter(function(c) { return c.tipoCliente === 'empresa'; }).length,
        vip: clientes.filter(function(c) { return c.tipoCliente === 'vip'; }).length
    };
    
    // Actualizar contadores en los tabs
    Object.keys(contadores).forEach(function(tipo) {
        const elemento = document.getElementById('count' + tipo.charAt(0).toUpperCase() + tipo.slice(1));
        if (elemento) {
            elemento.textContent = contadores[tipo];
        }
    });
    
    console.log('Contadores actualizados:', contadores);
}

// === MODAL DE DETALLE ===
function mostrarDetalle(clienteId) {
    console.log('Mostrando detalle del cliente:', clienteId);
    
    const cliente = clientes.find(function(c) { 
        return c.id == clienteId; 
    });
    
    if (!cliente) {
        mostrarNotificacion('Cliente no encontrado', 'error');
        return;
    }
    
    clienteSeleccionado = cliente;
    
    const contenido = document.getElementById('contenidoDetalle');
    if (contenido) {
        contenido.innerHTML = generarContenidoDetalle(cliente);
    }
    
    if (modalDetalle) {
        modalDetalle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function generarContenidoDetalle(cliente) {
    return `
        <div class="detalle-group">
            <div class="detalle-title">Información Personal</div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Nombre</div>
                    <div class="detalle-value">${cliente.nombre}</div>
                </div>
            </div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Tipo de Cliente</div>
                    <div class="detalle-value">${cliente.tipoCliente || 'Particular'}</div>
                </div>
            </div>
        </div>
        
        <div class="detalle-group">
            <div class="detalle-title">Contacto</div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Teléfono</div>
                    <div class="detalle-value">${cliente.telefono}</div>
                </div>
            </div>
            ${cliente.whatsapp ? `
                <div class="detalle-item">
                    <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <div class="detalle-content">
                        <div class="detalle-label">WhatsApp</div>
                        <div class="detalle-value">${cliente.whatsapp}</div>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="detalle-group">
            <div class="detalle-title">Dirección</div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Dirección</div>
                    <div class="detalle-value">${cliente.direccion}</div>
                </div>
            </div>
            ${cliente.ciudad ? `
                <div class="detalle-item">
                    <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                    </svg>
                    <div class="detalle-content">
                        <div class="detalle-label">Ciudad</div>
                        <div class="detalle-value">${cliente.ciudad}</div>
                    </div>
                </div>
            ` : ''}
        </div>
        
        ${cliente.limiteCredito > 0 ? `
            <div class="detalle-group">
                <div class="detalle-title">Información Financiera</div>
                <div class="detalle-item">
                    <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <div class="detalle-content">
                        <div class="detalle-label">Límite de Crédito</div>
                        <div class="detalle-value">$${cliente.limiteCredito.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        ` : ''}
        
        <div class="detalle-group">
            <div class="detalle-title">Información Adicional</div>
            <div class="detalle-item">
                <svg class="detalle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <div class="detalle-content">
                    <div class="detalle-label">Cliente desde</div>
                    <div class="detalle-value">${formatearFechaCompleta(cliente.fechaCreacion)}</div>
                </div>
            </div>
        </div>
    `;
}

function cerrarModalDetalle() {
    if (modalDetalle) {
        modalDetalle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    clienteSeleccionado = null;
}

// === ELIMINAR CLIENTE ===
function confirmarEliminarCliente(clienteId, nombreCliente) {
    console.log('Confirmando eliminar cliente:', clienteId, nombreCliente);
    
    clienteSeleccionado = { id: clienteId, nombre: nombreCliente };
    
    const mensaje = document.getElementById('mensajeEliminar');
    if (mensaje) {
        mensaje.textContent = '¿Estás seguro de eliminar a "' + nombreCliente + '"?';
    }
    
    if (modalEliminar) {
        modalEliminar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModalEliminar() {
    if (modalEliminar) {
        modalEliminar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    clienteSeleccionado = null;
}

function confirmarEliminar() {
    if (!clienteSeleccionado) {
        return;
    }
    
    console.log('Eliminando cliente:', clienteSeleccionado.id);
    
    const index = clientes.findIndex(function(c) { 
        return c.id == clienteSeleccionado.id; 
    });
    
    if (index !== -1) {
        clientes.splice(index, 1);
        guardarClientes();
        
        mostrarNotificacion('Cliente "' + clienteSeleccionado.nombre + '" eliminado', 'success');
        
        // Actualizar vista
        filtrarClientes();
        renderizarClientes();
        actualizarContadores();
    }
    
    cerrarModalEliminar();
}

// === WHATSAPP ===
function abrirWhatsAppDirecto(numero) {
    console.log('Abriendo WhatsApp para:', numero);
    
    const numeroLimpio = numero.replace(/\D/g, '');
    const mensaje = encodeURIComponent('¡Hola! Te contactamos desde nuestro negocio.');
    const url = 'https://wa.me/' + numeroLimpio + '?text=' + mensaje;
    
    window.open(url, '_blank');
    mostrarNotificacion('Abriendo WhatsApp...', 'success');
}

// === TEMA ===
function initializeTheme() {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(savedTheme + '-mode');
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(isDark ? 'light-mode' : 'dark-mode');
    
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// === FUNCIONES DE UTILIDAD ===
function formatearFecha(fecha) {
    try {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

function formatearFechaCompleta(fecha) {
    try {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

function obtenerEmojiTipo(tipo) {
    const emojis = {
        'particular': '👤',
        'empresa': '🏢',
        'mayorista': '📦',
        'vip': '⭐'
    };
    return emojis[tipo] || '👤';
}

// === NOTIFICACIONES ===
function mostrarNotificacion(mensaje, tipo) {
    tipo = tipo || 'info';
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion notificacion-' + tipo;
    
    let bgColor, borderColor, icon;
    switch(tipo) {
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
            borderColor = '#10b981';
            icon = 'ℹ';
    }
    
    notificacion.innerHTML = '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
        '<div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ' + borderColor + '; color: white; font-size: 0.85rem; font-weight: bold;">' + icon + '</div>' +
        '<span style="flex: 1; font-size: 0.9rem;">' + mensaje + '</span>' +
        '<button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; width: 20px; height: 20px;">&times;</button>' +
    '</div>';
    
    notificacion.style.cssText = 'position: fixed; top: 20px; right: 20px; background: ' + bgColor + '; border: 1px solid ' + borderColor + '; border-radius: 12px; padding: 1rem; color: white; backdrop-filter: blur(10px); z-index: 10000; max-width: 320px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); animation: slideInRight 0.3s ease;';
    
    document.body.appendChild(notificacion);
    
    setTimeout(function() {
        if (notificacion.parentNode) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(function() {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }
    }, 4000);
}

// === ESTILOS PARA ANIMACIONES ===
function agregarEstilosAnimaciones() {
    const style = document.createElement('style');
    style.textContent = '@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
    document.head.appendChild(style);
}

// === ACTUALIZACIÓN AUTOMÁTICA ===
window.addEventListener('focus', function() {
    console.log('Ventana enfocada, verificando actualizaciones...');
    
    const clientesActuales = clientes.length;
    cargarClientes();
    
    if (clientes.length !== clientesActuales) {
        console.log('Se detectaron cambios en los clientes');
        filtrarClientes();
        renderizarClientes();
        actualizarContadores();
        
        if (clientes.length > clientesActuales) {
            mostrarNotificacion('Lista actualizada con nuevos clientes', 'success');
        }
    }
});

// === GESTIÓN DE ERRORES ===
window.addEventListener('error', function(e) {
    console.error('Error en lista de clientes:', e.error);
    mostrarNotificacion('Ha ocurrido un error inesperado', 'error');
});

// === LLAMAR FUNCIÓN DE ESTILOS ===
agregarEstilosAnimaciones();

// === FIN DEL ARCHIVO ===