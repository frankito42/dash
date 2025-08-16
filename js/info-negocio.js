/* ============================================
   BUSINESS INFO - JAVASCRIPT
   ============================================ */

let businessData = {};
let isEditMode = false;
let originalData = {};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initializeBusinessInfo();
});

function initializeBusinessInfo() {
  // Toggle tema
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Formulario de edición
  document.getElementById('businessForm').addEventListener('submit', saveBusinessInfo);
  
  // Cargar datos existentes
  loadBusinessData();
  
  // Recuperar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
  }
}

// ============================================
// CARGA DE DATOS
// ============================================
function loadBusinessData() {
  try {
    const savedData = localStorage.getItem('businessData');
    const setupCompleted = localStorage.getItem('businessSetupCompleted');
    
    if (setupCompleted === 'true' && savedData) {
      businessData = JSON.parse(savedData);
      displayBusinessData();
      updateHeaderSubtitle();
    } else {
      showEmptyState();
    }
  } catch (error) {
    console.error('Error al cargar datos del negocio:', error);
    showAlert('Error al cargar la información del negocio', 'error');
    showEmptyState();
  }
}

function displayBusinessData() {
  document.getElementById('viewMode').style.display = 'block';
  document.getElementById('emptyState').style.display = 'none';
  
  // Información básica
  document.getElementById('viewBusinessName').textContent = businessData.name || '-';
  document.getElementById('viewBusinessPhone').textContent = businessData.phone || '-';
  document.getElementById('viewBusinessDescription').textContent = businessData.description || '-';
  
  // Tipo de negocio
  const typeNames = {
    'retail': 'Comercio/Tienda',
    'restaurant': 'Restaurante/Comida',
    'services': 'Servicios',
    'health': 'Salud/Belleza',
    'automotive': 'Automotriz',
    'other': 'Otro'
  };
  document.getElementById('viewBusinessType').textContent = typeNames[businessData.businessType] || '-';
  
  // Ubicación
  updateLocationDisplay();
  
  // Horarios
  updateScheduleDisplay();
  
  // Redes sociales
  updateSocialLinksDisplay();
  
  // Información financiera
  document.getElementById('viewCurrency').textContent = businessData.currency || '-';
  document.getElementById('viewInvoiceType').textContent = businessData.invoiceType || '-';
}

function updateLocationDisplay() {
  // Dirección completa
  let fullAddress = '';
  if (businessData.address) {
    fullAddress = businessData.address;
    if (businessData.city) fullAddress += `, ${businessData.city}`;
    if (businessData.state) fullAddress += `, ${businessData.state}`;
    if (businessData.country) fullAddress += `, ${businessData.country}`;
    if (businessData.zip) fullAddress += ` ${businessData.zip}`;
  }
  document.getElementById('viewFullAddress').textContent = fullAddress || '-';
  
  // Ubicación detallada
  document.getElementById('viewCity').textContent = businessData.city || '-';
  document.getElementById('viewState').textContent = businessData.state || '-';
  document.getElementById('viewCountry').textContent = businessData.country || '-';
  document.getElementById('viewZip').textContent = businessData.zip || '-';
}

function updateScheduleDisplay() {
  // Horario de trabajo
  let schedule = '';
  if (businessData.openTime && businessData.closeTime) {
    schedule = `${formatTime(businessData.openTime)} - ${formatTime(businessData.closeTime)}`;
  }
  document.getElementById('viewSchedule').textContent = schedule || '-';
  
  // Días de trabajo
  document.getElementById('viewWorkDays').textContent = businessData.workDays || '-';
}

function updateSocialLinksDisplay() {
  const socialContainer = document.getElementById('socialLinks');
  socialContainer.innerHTML = '';
  
  const socialNetworks = [
    { key: 'website', name: 'Sitio Web', icon: 'website', prefix: '' },
    { key: 'instagram', name: 'Instagram', icon: 'instagram', prefix: 'https://instagram.com/' },
    { key: 'facebook', name: 'Facebook', icon: 'facebook', prefix: '' },
    { key: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp', prefix: 'https://wa.me/' }
  ];
  
  let hasAnySocial = false;
  
  socialNetworks.forEach(network => {
    const value = businessData[network.key];
    if (value && value.trim()) {
      hasAnySocial = true;
      const socialLink = createSocialLinkElement(network, value);
      socialContainer.appendChild(socialLink);
    }
  });
  
  if (!hasAnySocial) {
    socialContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin: 2rem 0;">No se han configurado redes sociales</p>';
  }
}

function createSocialLinkElement(network, value) {
  const link = document.createElement('a');
  link.href = getFullSocialUrl(network.key, value);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'social-link';
  
  const iconColors = {
    website: '#3b82f6',
    instagram: '#e1306c',
    facebook: '#1877f2',
    whatsapp: '#25d366'
  };
  
  const icons = {
    website: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    whatsapp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'
  };
  
  link.innerHTML = `
    <div class="social-link-icon ${network.icon}" style="background: ${iconColors[network.icon]}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        ${icons[network.icon]}
      </svg>
    </div>
    <div class="social-link-info">
      <div class="social-link-name">${network.name}</div>
      <div class="social-link-url">${formatSocialDisplay(network.key, value)}</div>
    </div>
  `;
  
  return link;
}

function getFullSocialUrl(type, value) {
  switch(type) {
    case 'website':
      return value.startsWith('http') ? value : `https://${value}`;
    case 'instagram':
      const instaHandle = value.replace('@', '');
      return `https://instagram.com/${instaHandle}`;
    case 'facebook':
      return value.startsWith('http') ? value : `https://facebook.com/${value}`;
    case 'whatsapp':
      const cleanPhone = value.replace(/\D/g, '');
      return `https://wa.me/${cleanPhone}`;
    default:
      return value;
  }
}

function formatSocialDisplay(type, value) {
  switch(type) {
    case 'instagram':
      return value.startsWith('@') ? value : `@${value}`;
    case 'whatsapp':
      return value;
    default:
      return value;
  }
}

function showEmptyState() {
  document.getElementById('viewMode').style.display = 'none';
  document.getElementById('editMode').style.display = 'none';
  document.getElementById('emptyState').style.display = 'block';
}

function updateHeaderSubtitle() {
  const subtitle = document.getElementById('businessNameSubtitle');
  if (businessData.name) {
    subtitle.textContent = businessData.name;
  }
}

// ============================================
// MODO EDICIÓN
// ============================================
function toggleEditMode() {
  if (!businessData.name) {
    showAlert('No hay información para editar', 'warning');
    return;
  }
  
  if (isEditMode) {
    cancelEdit();
  } else {
    enterEditMode();
  }
}

function enterEditMode() {
  isEditMode = true;
  originalData = { ...businessData };
  
  // Cambiar interfaz
  document.getElementById('viewMode').style.display = 'none';
  document.getElementById('editMode').style.display = 'block';
  
  // Actualizar botón
  const editButton = document.getElementById('editToggle');
  editButton.classList.add('active');
  document.getElementById('editButtonText').textContent = 'Cancelar';
  
  // Poblar formulario
  populateEditForm();
  
  // Scroll al top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function populateEditForm() {
  // Información básica
  document.getElementById('editBusinessName').value = businessData.name || '';
  document.getElementById('editBusinessPhone').value = businessData.phone || '';
  document.getElementById('editBusinessDescription').value = businessData.description || '';
  
  // Ubicación
  document.getElementById('editBusinessAddress').value = businessData.address || '';
  document.getElementById('editBusinessCity').value = businessData.city || '';
  document.getElementById('editBusinessState').value = businessData.state || '';
  document.getElementById('editBusinessCountry').value = businessData.country || '';
  document.getElementById('editBusinessZip').value = businessData.zip || '';
  
  // Horarios
  document.getElementById('editOpenTime').value = businessData.openTime || '';
  document.getElementById('editCloseTime').value = businessData.closeTime || '';
  document.getElementById('editWorkDays').value = businessData.workDays || '';
  
  // Redes sociales
  document.getElementById('editWebsite').value = businessData.website || '';
  document.getElementById('editInstagram').value = businessData.instagram || '';
  document.getElementById('editFacebook').value = businessData.facebook || '';
  document.getElementById('editWhatsapp').value = businessData.whatsapp || '';
  
  // Información financiera
  document.getElementById('editCurrency').value = businessData.currency || '';
  document.getElementById('editInvoiceType').value = businessData.invoiceType || '';
}

function cancelEdit() {
  isEditMode = false;
  businessData = { ...originalData };
  
  // Cambiar interfaz
  document.getElementById('editMode').style.display = 'none';
  document.getElementById('viewMode').style.display = 'block';
  
  // Actualizar botón
  const editButton = document.getElementById('editToggle');
  editButton.classList.remove('active');
  document.getElementById('editButtonText').textContent = 'Editar';
  
  // Scroll al top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// GUARDAR CAMBIOS
// ============================================
function saveBusinessInfo(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  try {
    // Mostrar estado de carga
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<div class="loading"></div> Guardando...';
    submitButton.disabled = true;
    
    // Recopilar datos del formulario
    const formData = collectFormData();
    
    // Actualizar businessData
    Object.assign(businessData, formData);
    
    // Agregar timestamp de actualización
    businessData.updatedAt = new Date().toISOString();
    
    // Guardar en localStorage
    localStorage.setItem('businessData', JSON.stringify(businessData));
    
    // Simular delay para mejor UX
    setTimeout(() => {
      // Restaurar botón
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      
      // Salir del modo edición
      isEditMode = false;
      
      // Actualizar vista
      displayBusinessData();
      
      // Cambiar interfaz
      document.getElementById('editMode').style.display = 'none';
      document.getElementById('viewMode').style.display = 'block';
      
      // Actualizar botón
      const editButton = document.getElementById('editToggle');
      editButton.classList.remove('active');
      document.getElementById('editButtonText').textContent = 'Editar';
      
      // Mostrar éxito
      showAlert('Información actualizada correctamente', 'success');
      
      // Scroll al top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    }, 1000);
    
  } catch (error) {
    console.error('Error al guardar:', error);
    showAlert('Error al guardar la información', 'error');
  }
}

function collectFormData() {
  return {
    name: document.getElementById('editBusinessName').value.trim(),
    phone: document.getElementById('editBusinessPhone').value.trim(),
    description: document.getElementById('editBusinessDescription').value.trim(),
    address: document.getElementById('editBusinessAddress').value.trim(),
    city: document.getElementById('editBusinessCity').value.trim(),
    state: document.getElementById('editBusinessState').value.trim(),
    country: document.getElementById('editBusinessCountry').value.trim(),
    zip: document.getElementById('editBusinessZip').value.trim(),
    openTime: document.getElementById('editOpenTime').value,
    closeTime: document.getElementById('editCloseTime').value,
    workDays: document.getElementById('editWorkDays').value.trim(),
    website: document.getElementById('editWebsite').value.trim(),
    instagram: document.getElementById('editInstagram').value.trim(),
    facebook: document.getElementById('editFacebook').value.trim(),
    whatsapp: document.getElementById('editWhatsapp').value.trim(),
    currency: document.getElementById('editCurrency').value.trim(),
    invoiceType: document.getElementById('editInvoiceType').value.trim()
  };
}

// ============================================
// VALIDACIÓN
// ============================================
function validateForm() {
  const errors = [];
  
  // Campos obligatorios
  const name = document.getElementById('editBusinessName').value.trim();
  const phone = document.getElementById('editBusinessPhone').value.trim();
  const address = document.getElementById('editBusinessAddress').value.trim();
  const city = document.getElementById('editBusinessCity').value.trim();
  const state = document.getElementById('editBusinessState').value.trim();
  const country = document.getElementById('editBusinessCountry').value.trim();
  
  // Validar campos obligatorios
  if (!name) {
    errors.push('El nombre del negocio es obligatorio');
    markFieldError('editBusinessName');
  } else {
    clearFieldError('editBusinessName');
  }
  
  if (!phone) {
    errors.push('El teléfono es obligatorio');
    markFieldError('editBusinessPhone');
  } else if (phone.replace(/\D/g, '').length < 8) {
    errors.push('El teléfono debe tener al menos 8 dígitos');
    markFieldError('editBusinessPhone');
  } else {
    clearFieldError('editBusinessPhone');
  }
  
  if (!address) {
    errors.push('La dirección es obligatoria');
    markFieldError('editBusinessAddress');
  } else {
    clearFieldError('editBusinessAddress');
  }
  
  if (!city) {
    errors.push('La ciudad es obligatoria');
    markFieldError('editBusinessCity');
  } else {
    clearFieldError('editBusinessCity');
  }
  
  if (!state) {
    errors.push('El estado/provincia es obligatorio');
    markFieldError('editBusinessState');
  } else {
    clearFieldError('editBusinessState');
  }
  
  if (!country) {
    errors.push('El país es obligatorio');
    markFieldError('editBusinessCountry');
  } else {
    clearFieldError('editBusinessCountry');
  }
  
  // Validar URL del sitio web si se proporciona
  const website = document.getElementById('editWebsite').value.trim();
  if (website && !isValidUrl(website)) {
    errors.push('La URL del sitio web no es válida');
    markFieldError('editWebsite');
  } else {
    clearFieldError('editWebsite');
  }
  
  // Mostrar errores si los hay
  if (errors.length > 0) {
    showAlert(errors[0], 'warning');
    return false;
  }
  
  return true;
}

function markFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest('.form-group');
  formGroup.classList.add('error');
  
  // Remover mensaje de error previo
  const existingError = formGroup.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
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
}

function isValidUrl(string) {
  try {
    new URL(string.startsWith('http') ? string : `https://${string}`);
    return true;
  } catch (_) {
    return false;
  }
}

// ============================================
// UTILIDADES
// ============================================
function formatTime(timeString) {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = minutes || '00';
    
    if (hour === 0) return `12:${minute} AM`;
    if (hour < 12) return `${hour}:${minute} AM`;
    if (hour === 12) return `12:${minute} PM`;
    return `${hour - 12}:${minute} PM`;
  } catch (error) {
    return timeString;
  }
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  
  // Guardar preferencia
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
// NAVEGACIÓN
// ============================================
function goBack() {
  if (isEditMode) {
    if (confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
      cancelEdit();
      setTimeout(() => {
        window.location.href = 'MenuInicio.html';
      }, 100);
    }
  } else {
    window.location.href = 'MenuInicio.html';
  }
}

function goToSetup() {
  window.location.href = 'crear-negocio.html';
}

// ============================================
// EVENTOS ADICIONALES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Formateo automático de teléfonos
  const phoneInputs = ['editBusinessPhone', 'editWhatsapp'];
  phoneInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', function() {
        formatPhoneNumber(this);
      });
    }
  });
  
  // Validación en tiempo real
  const requiredFields = [
    'editBusinessName',
    'editBusinessPhone', 
    'editBusinessAddress',
    'editBusinessCity',
    'editBusinessState',
    'editBusinessCountry'
  ];
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', function() {
        if (isEditMode) {
          validateField(this);
        }
      });
      
      field.addEventListener('input', function() {
        if (this.closest('.form-group').classList.contains('error')) {
          clearFieldError(fieldId);
        }
      });
    }
  });
  
  // Prevenir cierre accidental en modo edición
  window.addEventListener('beforeunload', function(e) {
    if (isEditMode) {
      e.preventDefault();
      e.returnValue = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
      return e.returnValue;
    }
  });
  
  // Atajos de teclado
  document.addEventListener('keydown', function(e) {
    // Escape para cancelar edición
    if (e.key === 'Escape' && isEditMode) {
      cancelEdit();
    }
    
    // Ctrl/Cmd + S para guardar
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && isEditMode) {
      e.preventDefault();
      document.getElementById('businessForm').dispatchEvent(new Event('submit'));
    }
    
    // Ctrl/Cmd + E para editar
    if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !isEditMode && businessData.name) {
      e.preventDefault();
      toggleEditMode();
    }
  });
});

function validateField(field) {
  const value = field.value.trim();
  const fieldId = field.id;
  
  switch(fieldId) {
    case 'editBusinessName':
      if (!value) {
        markFieldError(fieldId);
        return false;
      }
      break;
      
    case 'editBusinessPhone':
    case 'editWhatsapp':
      if (fieldId === 'editBusinessPhone' && !value) {
        markFieldError(fieldId);
        return false;
      }
      if (value && value.replace(/\D/g, '').length < 8) {
        markFieldError(fieldId);
        return false;
      }
      break;
      
    case 'editWebsite':
      if (value && !isValidUrl(value)) {
        markFieldError(fieldId);
        return false;
      }
      break;
      
    default:
      if (field.hasAttribute('required') && !value) {
        markFieldError(fieldId);
        return false;
      }
  }
  
  clearFieldError(fieldId);
  return true;
}

function formatPhoneNumber(input) {
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
// FUNCIONES GLOBALES PARA HTML
// ============================================
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;
window.goBack = goBack;
window.goToSetup = goToSetup;

// ============================================
// MANEJO DE ERRORES GLOBALES
// ============================================
window.addEventListener('error', function(e) {
  console.error('Error en BusinessInfo:', e.error);
  showAlert('Ha ocurrido un error inesperado. Por favor, recarga la página.', 'error');
});

// ============================================
// DEBUG MODE (solo en desarrollo)
// ============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.businessInfoDebug = {
    getCurrentData: () => businessData,
    getOriginalData: () => originalData,
    isInEditMode: () => isEditMode,
    forceEditMode: () => {
      if (businessData.name) {
        enterEditMode();
      } else {
        console.log('No hay datos para editar');
      }
    },
    clearData: () => {
      localStorage.removeItem('businessData');
      localStorage.removeItem('businessSetupCompleted');
      businessData = {};
      showEmptyState();
      console.log('✅ Datos limpiados');
    },
    loadTestData: () => {
      const testData = {
        name: 'Tienda de Prueba',
        phone: '+54 9 11 1234-5678',
        businessType: 'retail',
        description: 'Una tienda de prueba para testing',
        address: 'Av. Corrientes 1234',
        city: 'Buenos Aires',
        state: 'CABA',
        country: 'Argentina',
        zip: '1043',
        openTime: '09:00',
        closeTime: '18:00',
        workDays: 'Lunes a Viernes',
        website: 'https://tiendaprueba.com',
        instagram: '@tiendaprueba',
        facebook: 'tiendaprueba',
        whatsapp: '+54 9 11 1234-5678',
        currency: 'ARS',
        invoiceType: 'Monotributo',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('businessData', JSON.stringify(testData));
      localStorage.setItem('businessSetupCompleted', 'true');
      loadBusinessData();
      console.log('✅ Datos de prueba cargados');
    }
  };
  
  console.log('🔧 Modo debug activado. Usa businessInfoDebug en la consola para herramientas de desarrollo.');
}