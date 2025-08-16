/* ============================================
   CREAR PROVEEDOR - JAVASCRIPT
   ============================================ */

let suppliers = [];
let currentSupplierId = 1;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initializeSupplierForm();
});

function initializeSupplierForm() {
  // Toggle tema
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Formulario de proveedor
  document.getElementById('supplierForm').addEventListener('submit', handleFormSubmit);
  
  // Validación en tiempo real
  addRealTimeValidation();
  
  // Formateo automático
  addAutoFormatting();
  
  // Cargar datos existentes
  loadExistingSuppliers();
  
  // Recuperar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
  }
  
  // Generar ID único para el proveedor
  generateSupplierId();
}

// ============================================
// MANEJO DEL FORMULARIO
// ============================================
function handleFormSubmit(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const formData = collectFormData();
  
  // Mostrar estado de carga
  showLoadingState();
  
  // Simular guardado con delay
  setTimeout(() => {
    try {
      saveSupplier(formData);
      // showSuccessScreen(formData); // Se elimina para evitar duplicidad y errores
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      showAlert('Error al crear el proveedor. Intenta nuevamente.', 'error');
      hideLoadingState();
    }
  }, 1500);
}

function collectFormData() {
  return {
    id: currentSupplierId,
    // Información básica
    name: document.getElementById('supplierName').value.trim(),
    type: document.getElementById('supplierType').value,
    phone: document.getElementById('supplierPhone').value.trim(),
    email: document.getElementById('supplierEmail').value.trim(),
    product: document.getElementById('supplierProduct').value.trim(),
    
    // Información de contacto
    contactPerson: document.getElementById('contactPerson').value.trim(),
    alternativePhone: document.getElementById('alternativePhone').value.trim(),
    whatsapp: document.getElementById('whatsappNumber').value.trim(),
    website: document.getElementById('website').value.trim(),
    
    // Dirección
    address: document.getElementById('supplierAddress').value.trim(),
    city: document.getElementById('supplierCity').value.trim(),
    state: document.getElementById('supplierState').value.trim(),
    country: document.getElementById('supplierCountry').value.trim(),
    zip: document.getElementById('supplierZip').value.trim(),
    
    // Información comercial
    category: document.getElementById('supplierCategory').value,
    paymentTerms: document.getElementById('paymentTerms').value,
    currency: document.getElementById('currency').value.trim(),
    deliveryTime: document.getElementById('deliveryTime').value.trim(),
    notes: document.getElementById('supplierNotes').value.trim(),
    
    // Metadatos
    createdAt: new Date().toISOString(),
    status: 'active'
  };
}

function saveSupplier(supplierData) {
  // business_id: obtén el id del negocio actual (ajusta según tu lógica)
  supplierData.business_id = getBusinessId();

  // Validar business_id antes de enviar al backend
  if (!supplierData.business_id) {
    showAlert('No se pudo obtener el id del negocio. Por favor, recarga la página o inicia sesión nuevamente.', 'error');
    hideLoadingState();
    return;
  }

  // Renombrar campos para el backend
  const payload = {
    business_id: supplierData.business_id,
    nombre: supplierData.name,
    tipo: supplierData.type,
    telefono: supplierData.phone,
    email: supplierData.email,
    producto_principal: supplierData.product,
    contacto: supplierData.contactPerson,
    telefono_alternativo: supplierData.alternativePhone,
    whatsapp: supplierData.whatsapp,
    sitio_web: supplierData.website,
    direccion: supplierData.address,
    ciudad: supplierData.city,
    provincia: supplierData.state,
    pais: supplierData.country,
    codigo_postal: supplierData.zip,
    categoria: supplierData.category,
    condiciones_pago: supplierData.paymentTerms,
    moneda: supplierData.currency,
    tiempo_entrega: supplierData.deliveryTime,
    notas: supplierData.notes
  };

  fetch('php/insert_proveedor.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(result => {
      console.log('Respuesta backend proveedor:', result);
      if (result.success) {
        showSuccessScreen(supplierData);
      } else {
        showAlert(result.error || 'Error al crear el proveedor', 'error');
      }
    })
    .catch((err) => {
      showAlert('Error de conexión con el servidor', 'error');
      console.error('Error de conexión proveedor:', err);
    })
    .finally(() => {
      hideLoadingState();
    });
}

// ============================================
// VALIDACIÓN
// ============================================
function validateForm() {
  const errors = [];
  
  // Campos obligatorios
  const requiredFields = [
    { id: 'supplierName', name: 'Nombre/Razón Social' },
    { id: 'supplierType', name: 'Tipo de Proveedor' },
    { id: 'supplierPhone', name: 'Teléfono Principal' },
    { id: 'supplierEmail', name: 'Email' },
    { id: 'supplierProduct', name: 'Producto/Servicio Principal' },
    { id: 'supplierAddress', name: 'Dirección' },
    { id: 'supplierCity', name: 'Ciudad' },
    { id: 'supplierState', name: 'Estado/Provincia' },
    { id: 'supplierCountry', name: 'País' }
  ];
  
  // Validar campos obligatorios
  requiredFields.forEach(field => {
    const element = document.getElementById(field.id);
    const value = element.value.trim();
    
    if (!value) {
      errors.push(`${field.name} es obligatorio`);
      markFieldError(field.id, `${field.name} es obligatorio`);
    } else {
      clearFieldError(field.id);
    }
  });
  
  // Validaciones específicas
  const email = document.getElementById('supplierEmail').value.trim();
  if (email && !isValidEmail(email)) {
    errors.push('El email no tiene un formato válido');
    markFieldError('supplierEmail', 'Email no válido');
  }
  
  const phone = document.getElementById('supplierPhone').value.trim();
  if (phone && !isValidPhone(phone)) {
    errors.push('El teléfono debe tener al menos 8 dígitos');
    markFieldError('supplierPhone', 'Teléfono no válido');
  }
  
  const website = document.getElementById('website').value.trim();
  if (website && !isValidUrl(website)) {
    errors.push('La URL del sitio web no es válida');
    markFieldError('website', 'URL no válida');
  }
  
  // Verificar si el proveedor ya existe
  const supplierName = document.getElementById('supplierName').value.trim();
  if (supplierName && supplierExists(supplierName)) {
    errors.push('Ya existe un proveedor con este nombre');
    markFieldError('supplierName', 'Proveedor ya existe');
  }
  
  if (errors.length > 0) {
    showAlert(errors[0], 'warning');
    // Scroll al primer error
    const firstErrorField = document.querySelector('.form-group.error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return false;
  }
  
  return true;
}

function addRealTimeValidation() {
  // Validación en tiempo real para campos obligatorios
  const requiredFields = [
    'supplierName', 'supplierType', 'supplierPhone', 'supplierEmail',
    'supplierProduct', 'supplierAddress', 'supplierCity', 'supplierState', 'supplierCountry'
  ];
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', () => validateField(fieldId));
      field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('error')) {
          clearFieldError(fieldId);
        }
      });
    }
  });
  
  // Validación específica para email
  document.getElementById('supplierEmail').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && !isValidEmail(value)) {
      markFieldError('supplierEmail', 'Email no válido');
    }
  });
  
  // Validación para website
  document.getElementById('website').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && !isValidUrl(value)) {
      markFieldError('website', 'URL no válida');
    }
  });
}

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const value = field.value.trim();
  
  if (!value) {
    const label = field.closest('.form-group').querySelector('.form-label').textContent.replace(' *', '');
    markFieldError(fieldId, `${label} es obligatorio`);
    return false;
  }
  
  clearFieldError(fieldId);
  return true;
}

function markFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest('.form-group');
  
  formGroup.classList.remove('success');
  formGroup.classList.add('error');
  
  // Remover mensaje de error previo
  const existingError = formGroup.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Agregar nuevo mensaje de error
  if (message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      ${message}
    `;
    field.parentNode.appendChild(errorElement);
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest('.form-group');
  
  formGroup.classList.remove('error');
  
  // Remover mensaje de error
  const existingError = formGroup.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Agregar estado de éxito si tiene valor
  if (field.value.trim()) {
    formGroup.classList.add('success');
  }
}

// ============================================
// VALIDADORES
// ============================================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 8;
}

function isValidUrl(url) {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

function supplierExists(name) {
  const existingSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
  return existingSuppliers.some(supplier => 
    supplier.name.toLowerCase() === name.toLowerCase()
  );
}

// ============================================
// FORMATEO AUTOMÁTICO
// ============================================
function addAutoFormatting() {
  // Formateo de teléfonos
  const phoneFields = ['supplierPhone', 'alternativePhone', 'whatsappNumber'];
  phoneFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', function() {
        formatPhoneNumber(this);
      });
    }
  });
  
  // Formateo de email (lowercase)
  document.getElementById('supplierEmail').addEventListener('blur', function() {
    this.value = this.value.toLowerCase().trim();
  });
  
  // Formateo de website
  document.getElementById('website').addEventListener('blur', function() {
    let value = this.value.trim();
    if (value && !value.startsWith('http')) {
      this.value = `https://${value}`;
    }
  });
  
  // Capitalización de nombres
  const nameFields = ['supplierName', 'contactPerson', 'supplierCity', 'supplierState', 'supplierCountry'];
  nameFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', function() {
        this.value = capitalizeWords(this.value);
      });
    }
  });
}

function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 0) {
    if (value.length <= 3) {
      value = `+${value}`;
    } else if (value.length <= 6) {
      value = `+${value.slice(0, 3)} ${value.slice(3)}`;
    } else if (value.length <= 10) {
      value = `+${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    } else {
      value = `+${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)} ${value.slice(10, 14)}`;
    }
  }
  
  input.value = value;
}

function capitalizeWords(str) {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// ============================================
// ESTADO DE CARGA
// ============================================
function showLoadingState() {
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Creando Proveedor...</span>';
}

function hideLoadingState() {
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;
  submitBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
    Crear Proveedor
  `;
}

// ============================================
// PANTALLA DE ÉXITO
// ============================================
function showSuccessScreen(supplierData) {
  // Ocultar formulario
  const formEl = document.querySelector('.supplier-form');
  if (formEl) formEl.style.display = 'none';

  // Mostrar pantalla de éxito
  const successScreen = document.getElementById('successScreen');
  const message = document.getElementById('successMessage');
  if (successScreen && message) {
    successScreen.style.display = 'block';
    message.textContent = `${supplierData.name} ha sido registrado exitosamente en tu sistema.`;
    // Scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showAlert('¡Proveedor creado exitosamente!', 'success');
    // Limpiar formulario
    if (document.getElementById('supplierForm')) {
      document.getElementById('supplierForm').reset();
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
      });
      document.querySelectorAll('.form-error').forEach(error => {
        error.remove();
      });
    }
    // Redirigir tras 2 segundos
    setTimeout(() => {
      window.location.href = 'lista-proveedores.html';
    }, 2000);
  } else {
    showAlert('Proveedor creado, pero no se encontró la pantalla de éxito en el HTML.', 'warning');
    console.warn('No se encontró successScreen o successMessage en el DOM');
  }
}

// ============================================
// UTILIDADES
// ============================================
function clearForm() {
  if (confirm('¿Estás seguro de que quieres limpiar todos los campos?')) {
    document.getElementById('supplierForm').reset();
    
    // Limpiar estados de validación
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error', 'success');
    });
    
    // Limpiar mensajes de error
    document.querySelectorAll('.form-error').forEach(error => {
      error.remove();
    });
    
    showAlert('Formulario limpiado', 'info');
    
    // Focus al primer campo
    document.getElementById('supplierName').focus();
  }
}

function createAnother() {
  // Resetear formulario
  document.getElementById('supplierForm').reset();
  
  // Limpiar estados
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error', 'success');
  });
  
  document.querySelectorAll('.form-error').forEach(error => {
    error.remove();
  });
  
  // Mostrar formulario
  document.querySelector('.supplier-form').style.display = 'block';
  document.getElementById('successScreen').style.display = 'none';
  
  // Generar nuevo ID
  generateSupplierId();
  
  // Scroll al top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Focus al primer campo
  setTimeout(() => {
    document.getElementById('supplierName').focus();
  }, 100);
}

function goBack() {
  if (hasUnsavedChanges()) {
    if (confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
      window.location.href = 'MenuInicio.html';
    }
  } else {
    window.location.href = 'MenuInicio.html';
  }
}

function goToSuppliers() {
  // Redirigir a la página de lista de proveedores
  window.location.href = 'lista-proveedores.html';
}

function hasUnsavedChanges() {
  const form = document.getElementById('supplierForm');
  const formData = new FormData(form);
  
  for (let [key, value] of formData.entries()) {
    if (value.trim() !== '') {
      return true;
    }
  }
  
  return false;
}

function generateSupplierId() {
  const lastId = localStorage.getItem('lastSupplierId');
  currentSupplierId = lastId ? parseInt(lastId) + 1 : 1;
}

function loadExistingSuppliers() {
  suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
  console.log(`📦 ${suppliers.length} proveedores cargados`);
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    animation: slideInRight 0.3s ease;
  `;
  
  switch(type) {
    case 'warning':
      alert.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      break;
    case 'error':
      alert.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      break;
    case 'success':
      alert.style.background = 'linear-gradient(135deg, #4caf50, #388e3c)';
      break;
    default:
      alert.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
  }
  
  alert.textContent = message;
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 300);
  }, 4000);
}

// ============================================
// EVENTOS ADICIONALES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Prevenir envío accidental con Enter
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
      e.preventDefault();
    }
  });
  
  // Atajos de teclado
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S para enviar formulario
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.getElementById('supplierForm').dispatchEvent(new Event('submit'));
    }
    
    // Escape para limpiar formulario
    if (e.key === 'Escape') {
      clearForm();
    }
  });
  
  // Prevenir cierre accidental
  window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
      return e.returnValue;
    }
  });
});

// ============================================
// ESTILOS DINÁMICOS
// ============================================
const alertStyles = document.createElement('style');
alertStyles.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(alertStyles);

// ============================================
// FUNCIONES GLOBALES PARA HTML
// ============================================
window.clearForm = clearForm;
window.createAnother = createAnother;
window.goBack = goBack;
window.goToSuppliers = goToSuppliers;

// ============================================
// MANEJO DE ERRORES
// ============================================
window.addEventListener('error', function(e) {
  console.error('Error en CreateSupplier:', e.error);
  showAlert('Ha ocurrido un error inesperado. Por favor, recarga la página.', 'error');
});

// ============================================
// DEBUG MODE (solo en desarrollo)
// ============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.supplierDebug = {
    getSuppliers: () => JSON.parse(localStorage.getItem('suppliers') || '[]'),
    getCurrentId: () => currentSupplierId,
    clearAllSuppliers: () => {
      localStorage.removeItem('suppliers');
      localStorage.removeItem('lastSupplierId');
      suppliers = [];
      currentSupplierId = 1;
      console.log('✅ Todos los proveedores eliminados');
    },
    fillTestData: () => {
      document.getElementById('supplierName').value = 'Distribuidora Central S.A.';
      document.getElementById('supplierType').value = 'empresa';
      document.getElementById('supplierPhone').value = '+54 9 11 1234-5678';
      document.getElementById('supplierEmail').value = 'contacto@distribuidora.com';
      document.getElementById('supplierProduct').value = 'Materias primas para manufactura';
      document.getElementById('contactPerson').value = 'María González';
      document.getElementById('alternativePhone').value = '+54 9 11 8765-4321';
      document.getElementById('whatsappNumber').value = '+54 9 11 1234-5678';
      document.getElementById('website').value = 'https://distribuidora.com';
      document.getElementById('supplierAddress').value = 'Av. Industrial 1234, Zona Norte';
      document.getElementById('supplierCity').value = 'Buenos Aires';
      document.getElementById('supplierState').value = 'Buenos Aires';
      document.getElementById('supplierCountry').value = 'Argentina';
      document.getElementById('supplierZip').value = '1605';
      document.getElementById('supplierCategory').value = 'materias_primas';
      document.getElementById('paymentTerms').value = '30_dias';
      document.getElementById('currency').value = 'ARS';
      document.getElementById('deliveryTime').value = '7-10 días hábiles';
      document.getElementById('supplierNotes').value = 'Proveedor confiable con más de 10 años de experiencia. Excelente calidad y puntualidad en entregas.';
      
      console.log('✅ Datos de prueba cargados');
    },
    createTestSuppliers: () => {
      const testSuppliers = [
        {
          id: 1,
          name: 'Tecnología Avanzada SRL',
          type: 'empresa',
          phone: '+54 9 11 2222-3333',
          email: 'ventas@tecnoavanzada.com',
          product: 'Equipos de computación y software',
          contactPerson: 'Carlos Rodríguez',
          address: 'Av. Córdoba 2500',
          city: 'Buenos Aires',
          state: 'CABA',
          country: 'Argentina',
          category: 'tecnologia',
          paymentTerms: '30_dias',
          currency: 'USD',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Suministros de Oficina López',
          type: 'persona_fisica',
          phone: '+54 9 11 4444-5555',
          email: 'lopez.suministros@gmail.com',
          product: 'Papelería y suministros de oficina',
          contactPerson: 'Roberto López',
          address: 'San Martín 789',
          city: 'La Plata',
          state: 'Buenos Aires',
          country: 'Argentina',
          category: 'oficina',
          paymentTerms: 'contado',
          currency: 'ARS',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Transportes del Sur',
          type: 'empresa',
          phone: '+54 9 11 6666-7777',
          email: 'operaciones@transportesdelsur.com.ar',
          product: 'Servicios de logística y transporte',
          contactPerson: 'Ana Martínez',
          address: 'Ruta 2 Km 45',
          city: 'Quilmes',
          state: 'Buenos Aires',
          country: 'Argentina',
          category: 'transporte',
          paymentTerms: '15_dias',
          currency: 'ARS',
          deliveryTime: 'Inmediato',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      
      // Guardar proveedores de prueba
      localStorage.setItem('suppliers', JSON.stringify(testSuppliers));
      localStorage.setItem('lastSupplierId', '3');
      suppliers = testSuppliers;
      currentSupplierId = 4;
      
      console.log('✅ Proveedores de prueba creados:', testSuppliers.length);
    },
    validateForm: () => validateForm(),
    simulateError: () => {
      throw new Error('Error simulado para testing');
    }
  };
  
  console.log('🔧 Modo debug activado para Crear Proveedor. Usa supplierDebug en la consola.');
  console.log('Comandos disponibles:');
  console.log('- supplierDebug.fillTestData() - Llenar formulario con datos de prueba');
  console.log('- supplierDebug.createTestSuppliers() - Crear proveedores de ejemplo');
  console.log('- supplierDebug.getSuppliers() - Ver proveedores guardados');
  console.log('- supplierDebug.clearAllSuppliers() - Eliminar todos los proveedores');
}

// Ejemplo de función para obtener el business_id
function getBusinessId() {
  // El id del negocio se guarda en localStorage como objeto bajo la clave 'negocio'
  const negocio = localStorage.getItem('negocio');
  if (!negocio) return null;
  try {
    const obj = JSON.parse(negocio);
    return obj.id ? parseInt(obj.id) : null;
  } catch {
    return null;
  }
}