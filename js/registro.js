// Form validation and interactions
document.addEventListener('DOMContentLoaded', function () {
  redirigirSiUsuarioExiste()
  const form = document.getElementById('registrationForm');
  const inputs = form.querySelectorAll('.form-input');
  const submitBtn = form.querySelector('.register-btn');

  // Add focus effects
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
      validateField(this);
    });
  });

 form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    // Validar coincidencia de contraseñas
    const passwordInput = form.querySelector('input[placeholder*="Mínimo"]');
    const confirmInput = form.querySelector('input[placeholder*="Repite"]');

    if (passwordInput.value !== confirmInput.value) {
      showError(confirmInput, confirmInput.parentElement.querySelector('.error-message'));
      isValid = false;
    }

    if (!isValid) return;

    // Bloquear botón y mostrar mensaje
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'CREANDO CUENTA...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    formData.set('pass', passwordInput.value); // Aseguramos nombre correcto para PHP

    try {
      const response = await fetch('php/insert_user.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        alert(result.message);
        form.reset();
        window.location.href = 'crear-negocio.html';
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error de red o servidor.');
      console.error(error);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function validateField(input) {
    const errorMsg = input.parentElement.querySelector('.error-message');
    let isValid = true;

    // Remove previous error state
    input.classList.remove('input-error');
    errorMsg.style.display = 'none';

    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        showError(input, errorMsg);
        isValid = false;
      }
    } else if (input.type === 'password') {
      if (input.value.length < 8) {
        showError(input, errorMsg);
        isValid = false;
      }
    } else if (input.placeholder.includes('Repite')) {
      const passwordInput = form.querySelector('input[placeholder*="Mínimo"]');
      if (input.value !== passwordInput.value) {
        showError(input, errorMsg);
        isValid = false;
      }
    } else if (input.value.trim() === '') {
      showError(input, errorMsg);
      isValid = false;
    }

    return isValid;
  }

  function showError(input, errorMsg) {
    input.classList.add('input-error');
    errorMsg.style.display = 'block';
  }

  // Google button animation
  document.querySelector('.google-btn').addEventListener('click', function () {
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = '';
      alert('Funcionalidad de Google en desarrollo');
    }, 150);
  });
});


//Funcion para cambiar el modo Oscuro y claro 
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme',
    document.body.classList.contains('dark-mode') ? 'dark' : 'light'
  );
}

function redirigirSiUsuarioExiste() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    window.location.href = 'crear-negocio.html';
  }
}