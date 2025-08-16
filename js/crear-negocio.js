/* ============================================
   BUSINESS SETUP - JAVASCRIPT
   ============================================ */

let currentStep = 1;
const totalSteps = 4;
let businessData = {};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initializeSetup();
});

function initializeSetup() {
  // Toggle tema
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Selección de tipo de negocio
  document.querySelectorAll('.business-type').forEach(type => {
    type.addEventListener('click', selectBusinessType);
  });
  
  // Auto-guardar datos mientras el usuario escribe
  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('change', autoSaveData);
    input.addEventListener('blur', autoSaveData);
  });
  
  // Inicializar progreso
  updateProgress();
}

// ============================================
// TOGGLE TEMA
// ============================================
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  
  // Guardar preferencia
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ============================================
// SELECCIÓN DE TIPO DE NEGOCIO
// ============================================
function selectBusinessType(event) {
  const clickedType = event.currentTarget;
  
  // Remover selección anterior
  document.querySelectorAll('.business-type').forEach(type => {
    type.classList.remove('selected');
  });
  
  // Agregar selección actual
  clickedType.classList.add('selected');
  
  // Guardar en businessData
  businessData.businessType = clickedType.dataset.type;
  
  console.log('Tipo de negocio seleccionado:', businessData.businessType);
}

// ============================================
// AUTO-GUARDAR DATOS
// ============================================
function autoSaveData() {
  // Solo actualizar si estamos en el paso correcto
  updateBusinessData();
}

function updateBusinessData() {
  // Datos básicos (Paso 1)
  const name = document.getElementById('businessName')?.value?.trim();
  const phone = document.getElementById('businessPhone')?.value?.trim();
  const address = document.getElementById('businessAddress')?.value?.trim();
  const city = document.getElementById('businessCity')?.value?.trim();
  const state = document.getElementById('businessState')?.value?.trim();
  const country = document.getElementById('businessCountry')?.value?.trim();
  const zip = document.getElementById('businessZip')?.value?.trim();
  
  if (name) businessData.name = name;
  if (phone) businessData.phone = phone;
  if (address) businessData.address = address;
  if (city) businessData.city = city;
  if (state) businessData.state = state;
  if (country) businessData.country = country;
  if (zip) businessData.zip = zip;
  
  // Descripción del negocio (Paso 2)
  const description = document.getElementById('businessDescription')?.value?.trim();
  if (description) businessData.description = description;
  
  // Información adicional (Paso 3)
  const openTime = document.getElementById('openTime')?.value;
  const closeTime = document.getElementById('closeTime')?.value;
  const workDays = document.getElementById('workDays')?.value?.trim();
  const website = document.getElementById('website')?.value?.trim();
  const instagram = document.getElementById('instagram')?.value?.trim();
  const facebook = document.getElementById('facebook')?.value?.trim();
  const whatsapp = document.getElementById('whatsapp')?.value?.trim();
  const currency = document.getElementById('currency')?.value?.trim();
  const invoiceType = document.getElementById('invoiceType')?.value?.trim();
  
  if (openTime) businessData.openTime = openTime;
  if (closeTime) businessData.closeTime = closeTime;
  if (workDays) businessData.workDays = workDays;
  if (website) businessData.website = website;
  if (instagram) businessData.instagram = instagram;
  if (facebook) businessData.facebook = facebook;
  if (whatsapp) businessData.whatsapp = whatsapp;
  if (currency) businessData.currency = currency;
  if (invoiceType) businessData.invoiceType = invoiceType;
}

// ============================================
// VALIDACIÓN POR PASOS
// ============================================
function validateStep(step) {
  switch(step) {
    case 1:
      return validateStep1();
    case 2:
      return validateStep2();
    case 3:
      return validateStep3();
    case 4:
      return validateStep4();
    default:
      return true;
  }
}

function validateStep1() {
  const name = document.getElementById('businessName').value.trim();
  const phone = document.getElementById('businessPhone').value.trim();
  const address = document.getElementById('businessAddress').value.trim();
  const city = document.getElementById('businessCity').value.trim();
  const state = document.getElementById('businessState').value.trim();
  const country = document.getElementById('businessCountry').value.trim();
  
  // Campos obligatorios
  const requiredFields = [
    { value: name, name: 'Nombre del Negocio' },
    { value: phone, name: 'Teléfono' },
    { value: address, name: 'Dirección' },
    { value: city, name: 'Ciudad' },
    { value: state, name: 'Estado/Provincia' },
    { value: country, name: 'País' }
  ];
  
  const missingFields = requiredFields.filter(field => !field.value);
  
  if (missingFields.length > 0) {
    const fieldNames = missingFields.map(field => field.name).join(', ');
    showAlert(`Por favor, completa los siguientes campos: ${fieldNames}`, 'warning');
    return false;
  }
  
  // Validación básica de teléfono
  if (phone.length < 8) {
    showAlert('El número de teléfono debe tener al menos 8 dígitos', 'warning');
    return false;
  }
  
  // Guardar datos si la validación es exitosa
  updateBusinessData();
  return true;
}

function validateStep2() {
  if (!businessData.businessType) {
    showAlert('Por favor, selecciona un tipo de negocio', 'warning');
    return false;
  }
  
  updateBusinessData();
  return true;
}

function validateStep3() {
  // Paso opcional, siempre válido
  updateBusinessData();
  
  // Validar formato de website si se proporciona
  const website = document.getElementById('website').value.trim();
  if (website && !isValidUrl(website)) {
    showAlert('Por favor, ingresa una URL válida para el sitio web (debe comenzar con http:// o https://)', 'warning');
    return false;
  }
  
  return true;
}

function validateStep4() {
  updateSummary();
  return true;
}

// ============================================
// UTILIDADES DE VALIDACIÓN
// ============================================
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function showAlert(message, type = 'info') {
  // Crear elemento de alerta
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
  
  // Color según tipo
  switch(type) {
    case 'warning':
      alert.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      break;
    case 'error':
      alert.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      break;
    case 'success':
      alert.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      break;
    default:
      alert.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
  }
  
  alert.textContent = message;
  document.body.appendChild(alert);
  
  // Remover después de 4 segundos
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
// ACTUALIZAR RESUMEN
// ============================================
function updateSummary() {
  // Nombre
  document.getElementById('summaryName').textContent = businessData.name || '-';
  // Teléfono
  document.getElementById('summaryPhone').textContent = businessData.phone || '-';
  // Ubicación
  let location = '';
  if (businessData.address && businessData.city) {
    location = `${businessData.address}, ${businessData.city}`;
    if (businessData.state) {
      location += `, ${businessData.state}`;
    }
    if (businessData.country) {
      location += `, ${businessData.country}`;
    }
  }
  document.getElementById('summaryLocation').textContent = location || '-';
  // Tipo de negocio
  const typeNames = {
    'retail': 'Comercio/Tienda',
    'restaurant': 'Restaurante/Comida',
    'services': 'Servicios',
    'health': 'Salud/Belleza',
    'automotive': 'Automotriz',
    'other': 'Otro'
  };
  document.getElementById('summaryType').textContent = typeNames[businessData.businessType] || '-';
  // Descripción
  document.getElementById('summaryDescription').textContent = businessData.description || '-';
  // Horarios y días
  document.getElementById('summaryOpenTime').textContent = businessData.openTime || '-';
  document.getElementById('summaryCloseTime').textContent = businessData.closeTime || '-';
  document.getElementById('summaryWorkDays').textContent = businessData.workDays || '-';
  // Redes y web
  document.getElementById('summaryWebsite').textContent = businessData.website || '-';
  document.getElementById('summaryInstagram').textContent = businessData.instagram || '-';
  document.getElementById('summaryFacebook').textContent = businessData.facebook || '-';
  document.getElementById('summaryWhatsapp').textContent = businessData.whatsapp || '-';
  // Moneda y facturación
  document.getElementById('summaryCurrency').textContent = businessData.currency || '-';
  document.getElementById('summaryInvoiceType').textContent = businessData.invoiceType || '-';
}

// ============================================
// NAVEGACIÓN
// ============================================
function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById('progressFill').style.width = `${progress}%`;
  
  // Títulos dinámicos
  const titles = [
    'Información Básica',
    'Tipo de Negocio', 
    'Información Adicional',
    'Resumen'
  ];
  
  const subtitles = [
    'Cuéntanos sobre tu negocio',
    'Selecciona tu categoría',
    'Datos opcionales para personalizar',
    'Revisa y confirma la información'
  ];
  
  document.getElementById('progressTitle').textContent = titles[currentStep - 1];
  document.getElementById('progressSubtitle').textContent = subtitles[currentStep - 1];
  
  // Actualizar pasos visuales
  document.querySelectorAll('.step').forEach((step, index) => {
    const stepNum = index + 1;
    step.classList.remove('active', 'completed');
    
    if (stepNum < currentStep) {
      step.classList.add('completed');
      step.querySelector('.step-circle').innerHTML = '✓';
    } else if (stepNum === currentStep) {
      step.classList.add('active');
      step.querySelector('.step-circle').textContent = stepNum;
    } else {
      step.querySelector('.step-circle').textContent = stepNum;
    }
  });
  
  // Mostrar/ocultar contenido
  document.querySelectorAll('.step-content').forEach((content, index) => {
    content.classList.remove('active');
    if (index === currentStep - 1) {
      content.classList.add('active');
    }
  });
  
  // Llamar a updateSummary si estamos en el paso 4
  if (currentStep === 4) {
    updateBusinessData(); // Asegura que los datos estén actualizados
    updateSummary();
  }
  
  // Actualizar botones
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
  
  if (currentStep === totalSteps) {
    nextBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4"/>
      </svg>
      Finalizar Configuración
    `;
  } else {
    nextBtn.innerHTML = `
      Siguiente
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9,18 15,12 9,6"/>
      </svg>
    `;
  }
}

function nextStep() {
  if (!validateStep(currentStep)) {
    return;
  }
  
  if (currentStep < totalSteps) {
    currentStep++;
    updateProgress();
    
    // Scroll al top suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Finalizar configuración
    finishSetup();
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    updateProgress();
    
    // Scroll al top suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ============================================
// FINALIZAR CONFIGURACIÓN
// ============================================
function finishSetup() {
  try {
    // Validar que tenemos los datos mínimos
    if (!businessData.name || !businessData.businessType) {
      showAlert('Faltan datos importantes. Por favor, revisa la información.', 'error');
      return;
    }
    // Agregar timestamp
    businessData.createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    businessData.setupVersion = '1.0';
    // Guardar en localStorage
    localStorage.setItem('businessData', JSON.stringify(businessData));
    localStorage.setItem('businessSetupCompleted', 'true');
    // Obtener admin_id desde localStorage
    let admin_id = 22;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        admin_id = user.id;
      }
    } catch (e) {}
    // Enviar a PHP
    const data = {
      admin_id: admin_id,
      name: businessData.name,
      telefono: businessData.phone,
      dreccion: businessData.address,
      ciudad: businessData.city,
      provincia: businessData.state,
      pais: businessData.country,
      codigo_postal: businessData.zip,
      descripcion: businessData.description,
      horario_apertura: businessData.openTime,
      horario_cierre: businessData.closeTime,
      dias_trabajo: businessData.workDays,
      website: businessData.website,
      instagram: businessData.instagram,
      facebook: businessData.facebook,
      whatsapp: businessData.whatsapp,
      moneda: businessData.currency,
      tipo_facturacion: businessData.invoiceType,
      created_at: businessData.createdAt
    };
    fetch('php/insert_business.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: Object.entries(data).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? '')}`).join('&')
    })
    .then(r => r.json())
    .then(res => {
      if(res.success) {
        document.getElementById('step4').style.display = 'none';
        document.getElementById('successScreen').style.display = 'block';
        document.getElementById('navigationButtons').style.display = 'none';
        showAlert('¡Negocio guardado correctamente!', 'success');
      } else {
        showAlert('Error: ' + res.message, 'error');
      }
    })
    .catch(error => {
      showAlert('Error al guardar el negocio. Intenta nuevamente.', 'error');
    });
    // Log para debugging
    console.log('✅ Configuración de negocio completada:', businessData);
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    showAlert('Error al guardar la configuración. Por favor, intenta nuevamente.', 'error');
  }
}

function goToApp() {
  // Redirigir a la aplicación principal
  try {
    window.location.href = 'MenuInicio.html';
  } catch (error) {
    console.error('Error al redirigir:', error);
    showAlert('Error al acceder a la aplicación. Por favor, recarga la página.', 'error');
  }
}

// ============================================
// ESTILOS DINÁMICOS PARA ALERTAS
// ============================================
const alertStyles = document.createElement('style');
alertStyles.textContent = `
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
document.head.appendChild(alertStyles);

// ============================================
// RECUPERAR TEMA GUARDADO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Recuperar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
  }
  
  // Verificar si ya existe configuración
  checkExistingSetup();
});

// ============================================
// VERIFICAR CONFIGURACIÓN EXISTENTE
// ============================================
function checkExistingSetup() {
  const existingData = localStorage.getItem('businessData');
  const setupCompleted = localStorage.getItem('businessSetupCompleted');
  
  if (setupCompleted === 'true' && existingData) {
    // Preguntar si quiere reconfigurar
    if (confirm('Ya tienes un negocio configurado. ¿Deseas crear una nueva configuración?')) {
      // Limpiar datos existentes
      localStorage.removeItem('businessData');
      localStorage.removeItem('businessSetupCompleted');
    } else {
      // Redirigir a la app principal
      window.location.href = 'MenuInicio.html';
      return;
    }
  }
  
  // Si hay datos parciales, cargarlos
  if (existingData) {
    try {
      const parsedData = JSON.parse(existingData);
      businessData = { ...parsedData };
      populateFormWithExistingData();
    } catch (error) {
      console.error('Error al cargar datos existentes:', error);
    }
  }
}

// ============================================
// POBLAR FORMULARIO CON DATOS EXISTENTES
// ============================================
function populateFormWithExistingData() {
  // Datos básicos
  if (businessData.name) document.getElementById('businessName').value = businessData.name;
  if (businessData.phone) document.getElementById('businessPhone').value = businessData.phone;
  if (businessData.address) document.getElementById('businessAddress').value = businessData.address;
  if (businessData.city) document.getElementById('businessCity').value = businessData.city;
  if (businessData.state) document.getElementById('businessState').value = businessData.state;
  if (businessData.country) document.getElementById('businessCountry').value = businessData.country;
  if (businessData.zip) document.getElementById('businessZip').value = businessData.zip;
  
  // Tipo de negocio
  if (businessData.businessType) {
    const typeElement = document.querySelector(`[data-type="${businessData.businessType}"]`);
    if (typeElement) {
      typeElement.classList.add('selected');
    }
  }
  
  // Descripción
  if (businessData.description) document.getElementById('businessDescription').value = businessData.description;
  
  // Información adicional
  if (businessData.openTime) document.getElementById('openTime').value = businessData.openTime;
  if (businessData.closeTime) document.getElementById('closeTime').value = businessData.closeTime;
  if (businessData.workDays) document.getElementById('workDays').value = businessData.workDays;
  if (businessData.website) document.getElementById('website').value = businessData.website;
  if (businessData.instagram) document.getElementById('instagram').value = businessData.instagram;
  if (businessData.facebook) document.getElementById('facebook').value = businessData.facebook;
  if (businessData.whatsapp) document.getElementById('whatsapp').value = businessData.whatsapp;
  if (businessData.currency) document.getElementById('currency').value = businessData.currency;
  if (businessData.invoiceType) document.getElementById('invoiceType').value = businessData.invoiceType;
}

// ============================================
// FUNCIONES DE AYUDA PARA FORMATO
// ============================================
function formatPhoneNumber(input) {
  // Función para formatear número de teléfono automáticamente
  let value = input.value.replace(/\D/g, '');
  
  // Formato básico internacional
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

// ============================================
// VALIDACIONES ADICIONALES
// ============================================
function validateBusinessName(name) {
  if (name.length < 2) {
    return { valid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }
  if (name.length > 50) {
    return { valid: false, message: 'El nombre no puede tener más de 50 caracteres' };
  }
  return { valid: true };
}

function validatePhoneNumber(phone) {
  // Remover espacios y caracteres especiales para validación
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 8) {
    return { valid: false, message: 'El teléfono debe tener al menos 8 dígitos' };
  }
  if (cleanPhone.length > 15) {
    return { valid: false, message: 'El teléfono no puede tener más de 15 dígitos' };
  }
  return { valid: true };
}

// ============================================
// EVENTOS ADICIONALES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Formateo automático de teléfono
  const phoneInput = document.getElementById('businessPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      formatPhoneNumber(this);
    });
  }
  
  const whatsappInput = document.getElementById('whatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', function() {
      formatPhoneNumber(this);
    });
  }
  
  // Validación en tiempo real
  const businessNameInput = document.getElementById('businessName');
  if (businessNameInput) {
    businessNameInput.addEventListener('blur', function() {
      const validation = validateBusinessName(this.value.trim());
      if (!validation.valid) {
        showAlert(validation.message, 'warning');
      }
    });
  }
  
  // Prevenir envío del formulario con Enter
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      nextStep();
    }
  });
});

// ============================================
// FUNCIONES GLOBALES PARA HTML
// ============================================
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToApp = goToApp;

// ============================================
// MANEJO DE ERRORES GLOBALES
// ============================================
window.addEventListener('error', function(e) {
  console.error('Error en BusinessSetup:', e.error);
  showAlert('Ha ocurrido un error inesperado. Por favor, recarga la página.', 'error');
});

// ============================================
// DEBUG MODE (solo en desarrollo)
// ============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.businessSetupDebug = {
    getCurrentData: () => businessData,
    getCurrentStep: () => currentStep,
    goToStep: (step) => {
      if (step >= 1 && step <= totalSteps) {
        currentStep = step;
        updateProgress();
      }
    },
    clearData: () => {
      businessData = {};
      localStorage.removeItem('businessData');
      localStorage.removeItem('businessSetupCompleted');
      console.log('✅ Datos de configuración limpiados');
    },
    fillTestData: () => {
      document.getElementById('businessName').value = 'Tienda de Prueba';
      document.getElementById('businessPhone').value = '+54 9 11 1234-5678';
      document.getElementById('businessAddress').value = 'Av. Corrientes 1234';
      document.getElementById('businessCity').value = 'Buenos Aires';
      document.getElementById('businessState').value = 'CABA';
      document.getElementById('businessCountry').value = 'Argentina';
      document.getElementById('businessZip').value = '1043';
      
      // Seleccionar tipo de negocio
      document.querySelector('[data-type="retail"]').click();
      
      console.log('✅ Datos de prueba cargados');
    }
  };
  
  console.log('🔧 Modo debug activado. Usa businessSetupDebug en la consola para herramientas de desarrollo.');
}