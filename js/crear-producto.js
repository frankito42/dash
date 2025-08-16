// === FUNCIONALIDAD CREAR PRODUCTO ===

// Variables del DOM
const imageUploadArea = document.getElementById('imageUploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const codigoBarraInput = document.getElementById('codigoBarra');
const scanButton = document.getElementById('scanButton');
const nombreProductoInput = document.getElementById('nombreProducto');
const categoriaSelect = document.getElementById('categoriaProducto');
const cantidadInput = document.getElementById('cantidad');
const costoInput = document.getElementById('costo');
const precioInput = document.getElementById('precio');
const formCrearProducto = document.getElementById('formCrearProducto');
const modalConfirmacion = document.getElementById('modalConfirmacion');
const volverButton = document.getElementById('volverInventario');
const decreaseQtyBtn = document.getElementById('decreaseQty');
const increaseQtyBtn = document.getElementById('increaseQty');
const marginIndicator = document.getElementById('marginIndicator');
const marginValue = document.getElementById('marginValue');
const marginAmount = document.getElementById('marginAmount');
const marginFill = document.getElementById('marginFill');

// Variables para almacenar datos
let imagenSeleccionada = null;
let productoData = {};

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeThemeToggle();
    // Insertar botón y modal para crear categoría
    insertarBotonYModalCategoria();
// === MODAL CREAR CATEGORÍA ===
function insertarBotonYModalCategoria() {
    // Agrupar select y botón en un contenedor flex
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '0.5rem';
    categoriaSelect.parentNode.insertBefore(wrapper, categoriaSelect);
    wrapper.appendChild(categoriaSelect);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btnNuevaCategoria';
    btn.title = 'Crear nueva categoría';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;
    btn.style.background = 'var(--primary-orange, #ff6f00)';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.padding = '0.25rem 0.5rem';
    btn.style.cursor = 'pointer';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.height = categoriaSelect.offsetHeight ? categoriaSelect.offsetHeight + 'px' : '38px';
    btn.style.transition = 'background 0.2s';
    btn.onmouseover = () => btn.style.background = '#ff8c00';
    btn.onmouseout = () => btn.style.background = 'var(--primary-orange, #ff6f00)';
    wrapper.appendChild(btn);

    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'modalNuevaCategoria';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.4)';
    modal.style.zIndex = '10001';
    modal.innerHTML = `
        <div style="background: var(--bg-card,#222); color: var(--text-primary,#fff); max-width: 350px; margin: 10vh auto; border-radius: 16px; box-shadow: var(--shadow-lg,#0006); padding: 2rem; position: relative;">
            <h3 style="margin-bottom:1rem;">Crear nueva categoría</h3>
            <input id="inputNuevaCategoria" type="text" placeholder="Nombre de la categoría" style="width:100%;padding:0.5rem 1rem;border-radius:8px;border:1px solid #ccc;margin-bottom:1rem;outline:none;">
            <div style="display:flex;gap:1rem;justify-content:flex-end;">
                <button id="btnCancelarCategoria" style="background:#eee;color:#333;padding:0.5rem 1.2rem;border-radius:8px;border:none;">Cancelar</button>
                <button id="btnGuardarCategoria" style="background:var(--primary-orange,#ff6f00);color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;">Guardar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Eventos
    btn.addEventListener('click', () => {
        document.getElementById('inputNuevaCategoria').value = '';
        modal.style.display = 'block';
    });
    document.getElementById('btnCancelarCategoria').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    document.getElementById('btnGuardarCategoria').addEventListener('click', () => {
        const nombre = document.getElementById('inputNuevaCategoria').value.trim();
        if (!nombre) {
            showNotification('El nombre de la categoría es obligatorio', 'warning');
            return;
        }
        // Llamar a PHP para guardar la categoría
        fetch('php/insert_categoria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'nombre=' + encodeURIComponent(nombre)
        })
        .then(r => r.json())
        .then(res => {
            if (res.success && res.id) {
                // Agregar al select y seleccionar
                const option = document.createElement('option');
                option.value = res.id;
                option.textContent = nombre;
                categoriaSelect.appendChild(option);
                categoriaSelect.value = res.id;
                showNotification('Categoría creada', 'success');
                modal.style.display = 'none';
            } else {
                showNotification(res.message || 'No se pudo crear la categoría', 'error');
            }
        })
        .catch(() => showNotification('Error de red al crear categoría', 'error'));
    });
}

    // Modo edición: si hay id en la URL, cargar datos después de cargar categorías
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    loadCategorias().then(() => {
        if (idProducto) {
            cargarProductoParaEditar(idProducto);
        }
    });
});

// Cargar datos del producto para editar

// Cargar datos del producto para editar
function cargarProductoParaEditar(id) {
    fetch(`php/get_producto.php?id=${id}`)
        .then(r => r.json())
        .then(res => {
            if (res.success && res.producto) {
                // Llenar campos
                nombreProductoInput.value = res.producto.nombre;
                categoriaSelect.value = res.producto.categoria;
                cantidadInput.value = res.producto.cantidad;
                costoInput.value = res.producto.costo;
                precioInput.value = res.producto.precio;
                codigoBarraInput.value = res.producto.codigo_barra || '';
                if (res.producto.imagen) {
                    imagenSeleccionada = res.producto.imagen;
                    displayImage(res.producto.imagen);
                }
                // Cambiar texto del botón
                const guardarBtn = document.getElementById('guardarProducto');
                if (guardarBtn) {
                    guardarBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg> Guardar Cambios`;
                }
                // Guardar id en productoData
                productoData.id = res.producto.id;
            } else {
                showNotification('No se pudo cargar el producto', 'error');
            }
        })
        .catch(() => showNotification('Error al cargar producto', 'error'));
}

// === EVENT LISTENERS ===
function initializeEventListeners() {
    // Imagen
    imageUploadArea.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageUpload);
    
    // Escáner de código de barras
    scanButton.addEventListener('click', handleBarcodeScan);
    
    // Cantidad
    decreaseQtyBtn.addEventListener('click', () => adjustQuantity(-1));
    increaseQtyBtn.addEventListener('click', () => adjustQuantity(1));
    cantidadInput.addEventListener('input', validateQuantity);
    
    // Precios y margen
    costoInput.addEventListener('input', calculateMargin);
    precioInput.addEventListener('input', calculateMargin);
    
    // Validación en tiempo real
    nombreProductoInput.addEventListener('input', validateForm);
    categoriaSelect.addEventListener('change', validateForm);
    codigoBarraInput.addEventListener('input', validateBarcode);
    
    // Formulario
    formCrearProducto.addEventListener('submit', handleFormSubmit);
    
    // Navegación
    volverButton.addEventListener('click', handleGoBack);
    
    // Modal
    document.getElementById('cancelarGuardar').addEventListener('click', closeModal);
    document.getElementById('confirmarGuardar').addEventListener('click', saveProduct);
    
    // Crear nueva categoría
    document.getElementById('crearNuevaCategoria').addEventListener('click', handleCreateCategory);
    
    // Prevenir envío accidental
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'submit') {
            e.preventDefault();
        }
    });
}

// === MANEJO DE IMAGEN ===
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor selecciona un archivo de imagen válido', 'warning');
        return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('La imagen no puede superar los 5MB', 'warning');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        imagenSeleccionada = e.target.result;
        displayImage(e.target.result);
        showNotification('Imagen cargada correctamente', 'success');
    };
    reader.readAsDataURL(file);
}

function displayImage(src) {
    imagePreview.innerHTML = `
        <img src="${src}" alt="Producto">
        <button type="button" class="remove-image" onclick="removeImage()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
}

function removeImage() {
    imagenSeleccionada = null;
    imageInput.value = '';
    imagePreview.innerHTML = `
        <div class="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>Toca para agregar imagen</span>
            <small>JPG, PNG o WEBP (máx. 5MB)</small>
        </div>
    `;
    showNotification('Imagen removida', 'info');
}

// === ESCÁNER DE CÓDIGO DE BARRAS ===
function handleBarcodeScan() {
    // Simular escaneo (en una app real se integraría con la cámara)
    showNotification('Funcionalidad de escáner próximamente disponible', 'info');
    
    // Simular código escaneado para demo
    setTimeout(() => {
        const codigoDemo = '7891234567890';
        codigoBarraInput.value = codigoDemo;
        showNotification('Código escaneado: ' + codigoDemo, 'success');
        validateBarcode();
    }, 1500);
}

function validateBarcode() {
    const codigo = codigoBarraInput.value.trim();
    if (codigo && (codigo.length < 8 || codigo.length > 13)) {
        setFieldError(codigoBarraInput, 'El código debe tener entre 8 y 13 dígitos');
    } else {
        setFieldSuccess(codigoBarraInput);
    }
}

// === MANEJO DE CANTIDAD ===
function adjustQuantity(change) {
    const currentValue = parseInt(cantidadInput.value) || 0;
    const newValue = Math.max(0, currentValue + change);
    cantidadInput.value = newValue;
    validateQuantity();
}

function validateQuantity() {
    const cantidad = parseInt(cantidadInput.value);
    if (isNaN(cantidad) || cantidad < 0) {
        cantidadInput.value = 0;
    }
    validateForm();
}

// === CÁLCULO DE MARGEN ===
function calculateMargin() {
    const costo = parseFloat(costoInput.value) || 0;
    const precio = parseFloat(precioInput.value) || 0;
    
    if (costo > 0 && precio > 0) {
        const margen = ((precio - costo) / precio) * 100;
        const ganancia = precio - costo;
        
        marginValue.textContent = margen.toFixed(1) + '%';
        marginAmount.textContent = `($${ganancia.toFixed(2)})`;
        marginFill.style.width = Math.min(margen, 100) + '%';
        
        // Colorear según el margen
        if (margen < 10) {
            marginFill.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else if (margen < 30) {
            marginFill.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        } else {
            marginFill.style.background = 'var(--orange-gradient)';
        }
        
        marginIndicator.style.display = 'block';
    } else {
        marginIndicator.style.display = 'none';
    }
    
    validateForm();
}

// === VALIDACIÓN DEL FORMULARIO ===
function validateForm() {
    const nombre = nombreProductoInput.value.trim();
    const categoria = categoriaSelect.value;
    const cantidad = parseInt(cantidadInput.value);
    const costo = parseFloat(costoInput.value);
    const precio = parseFloat(precioInput.value);
    
    let isValid = true;
    
    // Validar nombre
    if (!nombre || nombre.length < 2) {
        setFieldError(nombreProductoInput, 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    } else {
        setFieldSuccess(nombreProductoInput);
    }
    
    // Validar categoría
    if (!categoria) {
        setFieldError(categoriaSelect, 'Debes seleccionar una categoría');
        isValid = false;
    } else {
        setFieldSuccess(categoriaSelect);
    }
    
    // Validar cantidad
    if (isNaN(cantidad) || cantidad < 0) {
        setFieldError(cantidadInput, 'La cantidad debe ser un número válido');
        isValid = false;
    } else {
        setFieldSuccess(cantidadInput);
    }
    
    // Validar costo
    if (isNaN(costo) || costo <= 0) {
        setFieldError(costoInput, 'El costo debe ser mayor a 0');
        isValid = false;
    } else {
        setFieldSuccess(costoInput);
    }
    
    // Validar precio
    if (isNaN(precio) || precio <= 0) {
        setFieldError(precioInput, 'El precio debe ser mayor a 0');
        isValid = false;
    } else if (precio < costo) {
        setFieldError(precioInput, 'El precio no puede ser menor al costo');
        isValid = false;
    } else {
        setFieldSuccess(precioInput);
    }
    
    // Actualizar botón de guardar
    const saveButton = document.getElementById('guardarProducto');
    saveButton.disabled = !isValid;
    
    return isValid;
}

function setFieldError(field, message) {
    field.classList.remove('success');
    field.classList.add('error');
    
    // Remover mensaje anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
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
    
    // Remover mensaje de error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// === MANEJO DEL FORMULARIO ===
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showNotification('Por favor corrige los errores del formulario', 'warning');
        return;
    }
    
    // Mantener el id si existe (modo edición)
    const idAnterior = productoData.id;
    productoData = {
        imagen: imagenSeleccionada,
        codigoBarra: codigoBarraInput.value.trim(),
        nombre: nombreProductoInput.value.trim(),
        categoria: categoriaSelect.value,
        cantidad: parseInt(cantidadInput.value),
        costo: parseFloat(costoInput.value),
        precio: parseFloat(precioInput.value),
        fechaCreacion: new Date().toISOString()
    };
    if (idAnterior) {
        productoData.id = idAnterior;
    }
    
    // Mostrar modal de confirmación
    modalConfirmacion.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function saveProduct() {
    closeModal();
    const saveButton = document.getElementById('guardarProducto');
    saveButton.disabled = true;
    saveButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17,21 17,13 7,13 7,21"/>
            <polyline points="7,3 7,8 15,8"/>
        </svg>
        Guardando...`;

    // Crear FormData para enviar imagen y datos
    const formData = new FormData();
    formData.append('nombre', productoData.nombre);
    formData.append('categoria', productoData.categoria);
    formData.append('cantidad', productoData.cantidad);
    formData.append('costo', productoData.costo);
    formData.append('precio', productoData.precio);
    formData.append('codigoBarra', productoData.codigoBarra);
    if (productoData.id) {
        formData.append('id', productoData.id);
    }
    if (imageInput.files[0]) {
        formData.append('imagen', imageInput.files[0]);
    }

    // Si es edición, usar update_producto.php; si no, insert_producto.php
    const url = productoData.id ? 'php/update_producto.php' : 'php/insert_producto.php';

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(res => {
        if (res.success) {
            showNotification(productoData.id ? 'Producto actualizado correctamente' : 'Producto guardado correctamente', 'success');
            setTimeout(() => {
                window.location.href = 'MenuInicio.html?seccion=inventario';
            }, 1200);
        } else {
            showNotification(res.message || 'Error al guardar', 'error');
        }
    })
    .catch(() => showNotification('Error de red al guardar', 'error'))
    .finally(() => {
        saveButton.disabled = false;
        saveButton.innerHTML = productoData.id
            ? `<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"/><polyline points=\"17,21 17,13 7,13 7,21\"/><polyline points=\"7,3 7,8 15,8\"/></svg> Guardar Cambios`
            : `<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"/><polyline points=\"17,21 17,13 7,13 7,21\"/><polyline points=\"7,3 7,8 15,8\"/></svg> Crear Producto`;
    });
}


function closeModal() {
    modalConfirmacion.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// === NAVEGACIÓN ===
function handleGoBack() {
    // Verificar si hay cambios sin guardar
    const hasChanges = 
        imagenSeleccionada ||
        nombreProductoInput.value.trim() ||
        codigoBarraInput.value.trim() ||
        parseInt(cantidadInput.value) !== 1 ||
        costoInput.value ||
        precioInput.value ||
        categoriaSelect.value;
    
    if (hasChanges) {
        if (confirm('¿Estás seguro? Los cambios no guardados se perderán.')) {
            window.location.href = 'MenuInicio.html';
        }
    } else {
        window.location.href = 'MenuInicio.html';
    }
}

// === CATEGORÍAS ===
function loadCategorias() {
    // Cargar categorías desde el backend
    // Ahora retorna una promesa para poder esperar a que termine
    return fetch('php/listar_categorias.php')
        .then(response => response.json())
        .then(data => {
            // Limpiar select excepto la primera opción
            while (categoriaSelect.children.length > 1) {
                categoriaSelect.removeChild(categoriaSelect.lastChild);
            }
            if (data.success && Array.isArray(data.categorias)) {
                data.categorias.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.nombre;
                    categoriaSelect.appendChild(option);
                });
            } else {
                showNotification('No se pudieron cargar las categorías', 'warning');
            }
        })
        .catch(error => {
            console.error('Error al cargar categorías:', error);
            showNotification('Error al cargar categorías', 'error');
        });
}

function handleCreateCategory() {
    showNotification('La creación de categorías debe hacerse desde el panel de administración o base de datos.', 'warning');
}

// === TEMA ===
function initializeThemeToggle() {
    const toggleBtn = document.getElementById('toggleThemeProduct');
    const body = document.body;
    
    // Sincronizar con el tema guardado
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    body.classList.toggle('light-mode', savedTheme === 'light');
    
    toggleBtn.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        
        body.classList.toggle('dark-mode', !isDark);
        body.classList.toggle('light-mode', isDark);
        
        // Guardar preferencia
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// === NOTIFICACIONES ===
function showNotification(mensaje, tipo = 'info') {
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
// Fin del archivo
}