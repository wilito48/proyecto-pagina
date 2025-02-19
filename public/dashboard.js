console.log("dashboard.js cargado correctamente");
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No tienes permiso para acceder. Inicia sesión.");
      window.location.href = "/login.html";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/auth/protected", { // URL corregida
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error("Token inválido o expirado");
      }
  
      const data = await response.json();
      console.log("✅ Datos recibidos:", data);
  
      // Verificar si el backend devuelve 'username'
      if (data.username) {
        document.getElementById("welcome-message").textContent = `Bienvenido, ${data.username}`;
      } else {
        console.warn("⚠ No se recibió el username en la respuesta del servidor.");
      }
    } catch (error) {
      console.error("🚨 Error al obtener datos protegidos:", error);
      localStorage.removeItem("token");
      window.location.href = "http://127.0.0.1:5500/public/login.html"; // Redirige correctamente
    }
  
    // Cerrar sesión
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/login.html"; // Redirige correctamente
    });
  });
  
  