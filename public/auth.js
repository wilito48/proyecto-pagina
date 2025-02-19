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
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", data.email); // Guardar el correo  
          console.log("🔄 Redirigiendo a la plataforma de cursos...");
          window.location.href = "http://127.0.0.1:5500/public/cursos.html"; // 🔹 Redirige a cursos.html
      }
      

        else {
          console.warn("⚠️ Error en login:", data.error);
          alert("Error en login: " + data.error);
        }
      } catch (error) {
        console.error("❌ Error en la solicitud de login:", error);
        alert("Error al iniciar sesión. Revisa la consola.");
      }
    });
  } else {
    console.warn("⚠️ No se encontró el formulario de login");
  }
});

