// Redirigir a MenuInicio si ya hay sesión iniciada
if (localStorage.getItem('user')) {
    window.location.href = 'MenuInicio.html';
}
// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector('.login-btn');
const googleBtn = document.querySelector('.google-btn');
const forgotLink = document.querySelector('.forgot-link');

// Form validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addInputAnimations();
}); 

// Event Listeners
function initializeEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Google login
    googleBtn.addEventListener('click', handleGoogleLogin);
    
    // Forgot password
    forgotLink.addEventListener('click', handleForgotPassword);
    
    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Clear errors on input
    emailInput.addEventListener('input', () => clearError(emailInput));
    passwordInput.addEventListener('input', () => clearError(passwordInput));
    
    // Enter key handling
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.activeElement.classList.contains('form-input')) {
            e.preventDefault();
            if (validateForm()) {
                handleFormSubmit(e);
            }
        }
    });
}

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Usar FormData para enviar al backend
    const formData = new FormData();
    formData.append('email', emailInput.value.trim());
    formData.append('password', passwordInput.value);
    
    // Show loading state
    setLoadingState(true);
    
    try {
        const response = await fetch('php/login.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            showSuccess('¡Inicio de sesión exitoso!');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'MenuInicio.html';
            }, 1500);
            
        } else {
            showError(result.message || 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
            setLoadingState(false);
        }
    } catch (error) {
        showError('Error de red o servidor.');
        setLoadingState(false);
    }
}

// Google login handler
function handleGoogleLogin() {
    // Add loading effect
    googleBtn.style.transform = 'scale(0.98)';
    googleBtn.innerHTML = `
        <div class="loading-spinner"></div>
        Conectando con Google...
    `;
    
    // Simulate Google OAuth process
    setTimeout(() => {
        // Reset button
        googleBtn.innerHTML = `
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE1VjE0LjI2SCAxMi4xQzExLjc2IDEzLjcgMTEuMjMgMTMuMjYgMTAuNjUgMTMuMDNWMTUuMjlIMTMuMjdDMTYuMDUgMTIuODIgMjAuOTIgOC43NSAyMi41NiAxMi4yNVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTEyIDIwQzE0LjczIDIwIDE2Ljk2IDE5LjEzIDE4LjUzIDE3LjY3TDE1LjkxIDE1LjQxQzE1LjA4IDE2LjA0IDEzLjk2IDE2LjQzIDEyIDE2LjQzQzkuMzIgMTYuNDMgNy4xMiAxNC41MyA2LjMxIDExLjk1SDQuODVWMTQuMjVDNi40MiAxNy4zOCA4Ljk3IDIwIDEyIDIwWiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNNi4zMSAxMS45NUM2LjA1IDExLjMxIDUuOTEgMTAuNjcgNS45MSAxMEM1LjkxIDkuMzMgNi4wNSA4LjY5IDYuMzEgOC4wNVY1LjcxSDQuODVDNC4xNyA3LjExIDMuNzUgOC43IDMuNzUgMTBDNC4xNyAxMS4zIDQuMTcgMTIuODkgNC44NSAxNC4yOUw2LjMxIDExLjk1WiIgZmlsbD0iI0ZCQkMwNCIvPgo8cGF0aCBkPSJNMTIgMy41N0MxNC4wMyAzLjU3IDE1Ljc5IDQuMzUgMTYuOTggNS41TDE5LjM2IDMuMTJDMTYuOTYgMC45MiAxNC43MyAwIDEyIDBDOC45NyAwIDYuNDIgMi42MiA0Ljg1IDUuNzFMNi4zMSA4LjA1QzcuMTIgNS40NyA5LjMyIDMuNTcgMTIgMy41N1oiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+" alt="Google" />
            Continuar con Google
        `;
        googleBtn.style.transform = '';
        
        // Here you would integrate with Google OAuth
        // For demo purposes, we'll show a success message
        showSuccess('¡Conectado con Google exitosamente!');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    }, 2000);
}

// Forgot password handler
function handleForgotPassword(e) {
    e.preventDefault();
    
    // Simple prompt for email
    const email = prompt('Ingresa tu correo electrónico para recuperar tu contraseña:');
    
    if (email && emailPattern.test(email)) {
        showSuccess(`Se ha enviado un enlace de recuperación a ${email}`);
    } else if (email) {
        showError('Por favor ingresa un correo electrónico válido');
    }
}

// Validation functions
function validateForm() {
    let isValid = true;
    
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    
    return isValid;
}

function validateEmail() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showFieldError(emailInput, 'Por favor ingresa tu correo electrónico');
        return false;
    }
    
    if (!emailPattern.test(email)) {
        showFieldError(emailInput, 'Por favor ingresa un correo electrónico válido');
        return false;
    }
    
    clearError(emailInput);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        showFieldError(passwordInput, 'Por favor ingresa tu contraseña');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(passwordInput, 'La contraseña debe tener al menos 6 caracteres');
        return false;
    }
    
    clearError(passwordInput);
    return true;
}

// Error handling
function showFieldError(input, message) {
    const wrapper = input.closest('.input-wrapper');
    const errorMsg = wrapper.querySelector('.error-message');
    
    input.classList.add('input-error');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // Add shake animation
    input.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

function clearError(input) {
    const wrapper = input.closest('.input-wrapper');
    const errorMsg = wrapper.querySelector('.error-message');
    
    input.classList.remove('input-error');
    errorMsg.style.display = 'none';
}

// Loading state
function setLoadingState(loading) {
    if (loading) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = `
            <div class="loading-spinner"></div>
            INICIANDO SESIÓN...
        `;
        loginBtn.style.opacity = '0.8';
    } else {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '➤ INICIAR SESIÓN';
        loginBtn.style.opacity = '1';
    }
}

// Success/Error messages
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(52, 168, 83, 0.95)' : 'rgba(255, 107, 107, 0.95)'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid ${type === 'success' ? 'rgba(52, 168, 83, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: 600;
        font-size: 0.9rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Input animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
}

// Simulate login API call
function simulateLogin(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Demo credentials for testing
            if (formData.email === 'demo@dash.com' && formData.password === 'demo123') {
                resolve({ success: true, user: { email: formData.email } });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 2000);
    });
}

// Add CSS for loading spinner and shake animation
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 8px;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-icon {
        font-weight: bold;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

// Console info for developers
console.log('🚀 DASH Login System Initialized');
console.log('📧 Demo credentials: demo@dash.com / demo123');

//Funcion para cambiar el modo Oscuro y claro 
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', 
    document.body.classList.contains('dark-mode') ? 'dark' : 'light'
  );
}