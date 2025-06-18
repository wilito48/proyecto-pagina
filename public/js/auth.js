import { setProfileImage } from './user.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ auth.js cargado correctamente");

  // 🔹 Registro de usuario
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    console.log("📝 Formulario de registro encontrado");

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      console.log("📤 Enviando solicitud de registro...", { username, email });

       // Validación básica
       if (!username || !email || !password) {
        console.error("⚠️ Error: Todos los campos son obligatorios.");
        alert("⚠️ Todos los campos son obligatorios.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        console.log("📡 Respuesta HTTP:", response.status);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! Status: ${response.status}`);
        }

        console.log("📩 Respuesta del servidor:", data);
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        localStorage.setItem('username', data.username);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email); // Guardar el correo  
        console.log("🔄 Redirigiendo a la plataforma de cursos...");
        window.location.href = "./login.html"; // Redirigir al login tras registro exitoso

      } catch (error) {
        console.error("❌ Error en la solicitud de registro:", error);
        alert("Error al registrar. Revisa la consola.");
      }
    });
  } else {
    console.warn("⚠️ No se encontró el formulario de registro");
  }

  // 🔹 Inicio de sesión
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    console.log("🔑 Formulario de login encontrado");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      console.log("✅ Evento submit detectado correctamente");

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      console.log("🚀 Intentando enviar la solicitud de login...");
      console.log("📤 Enviando solicitud de login...", { email });

      try {
        const response = await fetch("http://localhost:5001/api/auth/login", {  // URL corregida
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        console.log("📡 Respuesta HTTP:", response.status);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! Status: ${response.status}`);
        }

        console.log("📩 Respuesta del servidor:", data);

        if (data.token) {
          console.log("✅ Guardando token en localStorage...");
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", data.email); // Guardar el correo
          // Si el backend no envía username, obténlo con /api/auth/me
          if (data.username) {
            localStorage.setItem("username", data.username);
          } else {
            // Fetch username from /api/auth/me
            try {
              const meRes = await fetch("http://localhost:5001/api/auth/me", {
                headers: { 'Authorization': `Bearer ${data.token}` }
              });
              if (meRes.ok) {
                const meData = await meRes.json();
                if (meData.username) {
                  localStorage.setItem("username", meData.username);
                }
              }
            } catch (e) { console.warn('No se pudo obtener username tras login'); }
          }
          console.log("🔄 Redirigiendo a la plataforma de cursos...");
          window.location.href = "cursos.html";
        }
        

        else {
          console.warn("⚠️ Error en login:", data.error);
          alert("Error en login: " + data.error);
        }
      } catch (error) {
        console.error("❌ Error en la solicitud de login:", error);
        alert("Correo o Contraseña incorrecta. Vuelve a intentarlo.");
      }
    });
  } else {
    console.warn("⚠️ No se encontró el formulario de login");
  }
});

// Funciones de autenticación reutilizables
class AuthManager {
    static async validateToken() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const response = await fetch('http://localhost:5001/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                return userData;
            } else {
                // Token inválido o expirado
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                return null;
            }
        } catch (error) {
            console.error('Error validando token:', error);
            return null;
        }
    }

    static async checkAuth() {
        const userData = await this.validateToken();
        if (!userData) {
            window.location.href = 'login.html';
            return null;
        }
        return userData;
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getUserName() {
        return localStorage.getItem('username');
    }

    static renderNavbar() {
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('username');
        const navLinks = document.getElementById('nav-links');
        const userMenu = document.getElementById('user-menu');
        
        if (!navLinks || !userMenu) return;

        if (token && userName) {
            // Usuario autenticado
            navLinks.innerHTML = `
                <a href="cursos.html" class="text-gray-300 hover:text-white transition-colors duration-300">Cursos</a>
                <a href="dashboard.html" class="text-gray-300 hover:text-white transition-colors duration-300">Dashboard</a>
                <a href="perfil.html" class="text-gray-300 hover:text-white transition-colors duration-300">Perfil</a>
                <a href="contacto.html" class="text-gray-300 hover:text-white transition-colors duration-300">Contacto</a>
            `;
            userMenu.innerHTML = `
                <div class="relative group">
                    <button class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                        <img src="/imagen/perfil.jpg" alt="Usuario" class="w-8 h-8 rounded-full">
                        <span>${userName}</span>
                        <i class="fas fa-chevron-down text-sm"></i>
                    </button>
                    <div class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <div class="py-2">
                            <a href="perfil.html" class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">Mi Perfil</a>
                            <a href="dashboard.html" class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">Dashboard</a>
                            <hr class="border-gray-600 my-1">
                            <button id="logout-btn" class="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Usuario no autenticado
            navLinks.innerHTML = `
                <a href="cursos.html" class="text-gray-300 hover:text-white transition-colors duration-300">Cursos</a>
                <a href="contacto.html" class="text-gray-300 hover:text-white transition-colors duration-300">Contacto</a>
            `;
            userMenu.innerHTML = `
                <a href="login.html" class="text-gray-300 hover:text-white transition-colors duration-300">Iniciar sesión</a>
                <a href="register.html" class="ml-4 text-blue-400 hover:text-cyan-400 transition-colors duration-300">Registrarse</a>
            `;
        }

        // Después de renderizar el navbar, poblar todos los elementos con id 'userName' si hay username
        if (userName && token) {
            document.querySelectorAll('#userName').forEach(el => el.textContent = userName);
        }
    }

    static setupLogoutHandler() {
        document.body.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'logout-btn') {
                AuthManager.logout();
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.renderNavbar();
    AuthManager.setupLogoutHandler();
});

export { AuthManager };

