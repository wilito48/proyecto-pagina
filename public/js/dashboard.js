import { getToken, showUserInfo, updateNavProfilePic, logout } from './user.js';
import { AuthManager } from './auth.js';

console.log("dashboard.js cargado correctamente");
document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
    } else {
        showUserInfo();
        updateNavProfilePic();
    }
    AuthManager.renderNavbar();
    AuthManager.setupLogoutHandler();
    const username = localStorage.getItem('username');
    if (username) {
      if (document.getElementById('userName')) document.getElementById('userName').textContent = username;
      if (document.getElementById('profileName')) document.getElementById('profileName').textContent = username;
    }
});
  
  