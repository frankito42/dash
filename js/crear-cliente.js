// === FUNCIONALIDAD CREAR CLIENTE ===

// Variables del DOM
const nombreClienteInput = document.getElementById('nombreCliente');
const telefonoClienteInput = document.getElementById('telefonoCliente');
const whatsappClienteInput = document.getElementById('whatsappCliente');
const direccionClienteInput = document.getElementById('direccionCliente');
const ciudadClienteInput = document.getElementById('ciudadCliente');
const tipoClienteSelect = document.getElementById('tipoCliente');
const limiteCreditoInput = document.getElementById('limiteCreditoCliente');
const formCrearCliente = document.getElementById('formCrearCliente');
const modalConfirmacion = document.getElementById('modalConfirmacionCliente');
const volverButton = document.getElementById('volverClientes');
const toggleTheme = document.getElementById('toggleThemeCliente');
const testWhatsappBtn = document.getElementById('testWhatsapp');

// Variable para almacenar datos
let clienteData = {};

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeThemeToggle();
});

// === EVENT LISTENERS ===
function initializeEventListeners() {
    // Validación en tiempo real
    nombreClienteInput.addEventListener('input', validateForm);
    telefonoClienteInput.addEventListener('input', () => {
        formatPhone(telefonoClienteInput);
        validateForm();
    });
    direccionClienteInput.addEventListener('input', validateForm);
    
    // Formateo de WhatsApp
    whatsappClienteInput.addEventListener('input', () => {
        formatPhone(whatsappClienteInput);
    });
    
    // Test WhatsApp
    testWhatsappBtn.addEventListener('click', testWhatsApp);
    
    // Auto-completar WhatsApp con teléfono
    telefonoClienteInput.addEventListener('blur', () => {
        if (!whatsappClienteInput.value.trim() && telefonoClienteInput.value.trim()) {
            whatsappClienteInput.value = telefonoClienteInput.value;
        }
    });
    
    // Formatear límite de crédito
    limiteCreditoInput.addEventListener('input', () => {
        const value = parseFloat(limiteCreditoInput.value) || 0;
        if (value < 0) {
            limiteCreditoInput.value = 0;
        }
    });
    
    // Formulario
    formCrearCliente.addEventListener('submit', handleFormSubmit);
    
    // Navegación
    volverButton.addEventListener('click', handleGoBack);
    document.getElementById('cancelarCliente').addEventListener('click', handleGoBack);
    
    // Modal
    document.getElementById('cancelarGuardarCliente').addEventListener('click', closeModal);
    document.getElementById('confirmarGuardarCliente').addEventListener('click', saveCliente);
    
    // Cerrar modal al hacer click fuera
    modalConfirmacion.addEventListener('click', function(e) {
        if (e.target === modalConfirmacion) {
            closeModal();
        }
    });
    
    // Teclas de escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalConfirmacion.classList.contains('active')) {
            closeModal();
        }
        if (e.key === 'Enter' && e.target.type !== 'submit' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
    
    // Inicializar validación
    validateForm();
}

// === FUNCIONES DE VALIDACIÓN ===
function validateForm() {
    const nombre = nombreClienteInput.value.trim();
    const telefono = telefonoClienteInput.value.trim();
    const direccion = direccionClienteInput.value.trim();
    
    let isValid = true;
    
    // Validar nombre
    if (!nombre || nombre.length < 2) {
        setFieldError(nombreClienteInput, 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    } else {
        setFieldSuccess(nombreClienteInput);
    }
    
    // Validar teléfono
    if (!telefono || telefono.length < 8) {
        setFieldError(telefonoClienteInput, 'Ingresa un número de teléfono válido');
        isValid = false;
    } else {
        setFieldSuccess(telefonoClienteInput);
    }
    
    // Validar dirección
    if (!direccion || direccion.length < 10) {
        setFieldError(direccionClienteInput, 'Ingresa una dirección completa');
        isValid = false;
    } else {
        setFieldSuccess(direccionClienteInput);
    }
    
    // Actualizar botón de guardar
    const saveButton = document.getElementById('guardarCliente');
    saveButton.disabled = !isValid;
    
    return isValid;
}



function setFieldError(field, message) {
    field.classList.remove('success');
    field.classList.add('error');
    
    const existingError = field.parentNode.querySelector('.error-message-cliente');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-cliente';
    errorDiv.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        ${message}
    `;
    field.parentNode.appendChild(errorDiv);
}

function setFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    const existingError = field.parentNode.querySelector('.error-message-cliente');
    if (existingError) {
        existingError.remove();
    }
}

// === FORMATEO DE TELÉFONO ===
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.startsWith('54')) {
            // Formato argentino: +54 9 11 1234-5678
            value = value.replace(/(\d{2})(\d{1})(\d{2})(\d{4})(\d{4})/, '+$1 $2 $3 $4-$5');
        } else if (value.length <= 10) {
            // Formato genérico corto
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else {
            // Formato genérico largo
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2-$3-$4');
        }
    }
    input.value = value;
}

// === FUNCIONALIDAD WHATSAPP ===
function testWhatsApp() {
    const whatsapp = whatsappClienteInput.value.trim();
    if (whatsapp) {
        const numeroLimpio = whatsapp.replace(/\D/g, '');
        const mensaje = encodeURIComponent('¡Hola! Te contactamos desde nuestro negocio. ¿Cómo estás?');
        const url = `https://wa.me/${numeroLimpio}?text=${mensaje}`;
        window.open(url, '_blank');
        mostrarNotificacion('Abriendo WhatsApp...', 'success');
    } else {
        mostrarNotificacion('Ingresa un número de WhatsApp primero', 'warning');
        whatsappClienteInput.focus();
    }
}



// === MANEJO DEL FORMULARIO ===
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        mostrarNotificacion('Por favor corrige los errores del formulario', 'warning');
        return;
    }
    
    // Recopilar datos
    clienteData = {
        nombre: nombreClienteInput.value.trim(),
        telefono: telefonoClienteInput.value.trim(),
        whatsapp: whatsappClienteInput.value.trim(),
        direccion: direccionClienteInput.value.trim(),
        ciudad: ciudadClienteInput.value.trim(),
        tipoCliente: tipoClienteSelect.value,
        limiteCredito: parseFloat(limiteCreditoInput.value) || 0,
        fechaCreacion: new Date().toISOString(),
        creditoDisponible: parseFloat(limiteCreditoInput.value) || 0,
        totalCompras: 0,
        ultimaCompra: null
    };
    
    // Mostrar modal de confirmación
    modalConfirmacion.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function saveCliente() {
    closeModal();
    
    const saveButton = document.getElementById('guardarCliente');
    saveButton.disabled = true;
    saveButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        Guardando...
    `;
    
    setTimeout(() => {
        mostrarNotificacion(`Cliente "${clienteData.nombre}" creado exitosamente`, 'success');
        
        // Guardar en localStorage para demo
        try {
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            clienteData.id = Date.now();
            clientes.push(clienteData);
            localStorage.setItem('clientes', JSON.stringify(clientes));
            console.log('Cliente guardado:', clienteData);
        } catch (error) {
            console.error('Error al guardar cliente:', error);
        }
        
        // Volver al menú después de un delay
        setTimeout(() => {
            window.location.href = 'MenuInicio.html';
        }, 2000);
    }, 2000);
}

function closeModal() {
    modalConfirmacion.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// === NAVEGACIÓN ===
function handleGoBack() {
    const hasChanges = 
        nombreClienteInput.value.trim() ||
        telefonoClienteInput.value.trim() ||
        direccionClienteInput.value.trim() ||
        emailClienteInput.value.trim() ||
        numeroDocumentoInput.value.trim() ||
        whatsappClienteInput.value.trim() ||
        ciudadClienteInput.value.trim() ||
        codigoPostalClienteInput.value.trim() ||
        referenciasClienteInput.value.trim() ||
        limiteCreditoInput.value ||
        notasClienteInput.value.trim();
    
    if (hasChanges) {
        if (confirm('¿Estás seguro? Los cambios no guardados se perderán.')) {
            window.location.href = 'MenuInicio.html';
        }
    } else {
        window.location.href = 'MenuInicio.html';
    }
}

// === TEMA ===
function initializeThemeToggle() {
    const body = document.body;
    
    // Sincronizar con el tema guardado
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    body.classList.toggle('light-mode', savedTheme === 'light');
    
    toggleTheme.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        
        body.classList.toggle('dark-mode', !isDark);
        body.classList.toggle('light-mode', isDark);
        
        // Guardar preferencia
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// === NOTIFICACIONES ===
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    
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
`;
document.head.appendChild(style);



// DEBUG - Agregar temporalmente para ver qué pasa
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada');
    
    const botonAtras = document.getElementById('volverClientes');
    const botonCancelar = document.getElementById('cancelarCliente');
    
    console.log('Botón atrás:', botonAtras);
    console.log('Botón cancelar:', botonCancelar);
    
    if (botonAtras) {
        botonAtras.onclick = function() {
            window.location.href = 'MenuInicio.html';
        };
    }
    
    if (botonCancelar) {
        botonCancelar.onclick = function() {
            window.location.href = 'MenuInicio.html';
        };
    }
});