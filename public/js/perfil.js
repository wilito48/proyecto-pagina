import { getToken, setProfileImage, showUserInfo, updateNavProfilePic, logout } from './user.js';
import { AuthManager } from './auth.js';

document.addEventListener("DOMContentLoaded", async () => {
  const profileForm = document.getElementById("profileForm");
  const perfilFile = document.getElementById("perfilFile");
  const profilePreview = document.getElementById("profilePreview");
  const passwordInput = document.getElementById("password");
  const resetBtn = document.getElementById("resetProfilePic");

  AuthManager.renderNavbar();
  AuthManager.setupLogoutHandler();

  showUserInfo();
  updateNavProfilePic();

  // Mostrar nombre de usuario en el menú y perfil si está autenticado
  const username = localStorage.getItem('username');
  if (username) {
    if (document.getElementById('userName')) document.getElementById('userName').textContent = username;
    if (document.getElementById('profileName')) document.getElementById('profileName').textContent = username;
  }

  // Cargar datos del usuario
  const cargarDatosUsuario = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await fetch("http://localhost:5001/api/usuarios/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.username) document.getElementById("username").value = data.username;
      if (data.email) document.getElementById("email").value = data.email;
      const imageUrl = data.imageUrl
        ? `http://localhost:5001${data.imageUrl}`
        : "/imagen/perfil.jpg";
      profilePreview.src = imageUrl;
      setProfileImage(imageUrl);
      updateNavProfilePic();
    } catch (error) {
      console.error("❌ Error al cargar perfil:", error);
    }
  };

  await cargarDatosUsuario();

  perfilFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  resetBtn.addEventListener("click", () => {
    perfilFile.value = "";
    profilePreview.src = "/imagen/perfil.jpg";
  });

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("email", document.getElementById("email").value);
    if (passwordInput.value.trim() !== "") {
      formData.append("password", passwordInput.value);
    }
    if (perfilFile.files[0]) {
      formData.append("imagen", perfilFile.files[0]);
    }
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5001/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      console.log("🔍 Respuesta del servidor:", data);
      if (data.success) {
        if (data.imageUrl) {
          const imageUrl = `http://localhost:5001${data.imageUrl}?t=${Date.now()}`;
          setProfileImage(imageUrl);
          updateNavProfilePic();
          profilePreview.src = imageUrl;
        }
        alert("✅ Perfil actualizado correctamente");
        setTimeout(() => {
          window.location.href = "cursos.html";
        }, 500);
      } else {
        alert("⚠️ No se pudo actualizar el perfil");
      }
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      alert("❌ Error inesperado: " + (error?.message || error));
    }
  });

  document.getElementById("logoutButton")?.addEventListener("click", logout);
});
