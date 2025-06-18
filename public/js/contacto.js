import { logout } from './user.js';
import { AuthManager } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
    AuthManager.renderNavbar();
    AuthManager.setupLogoutHandler();
    document.getElementById("logoutButton")?.addEventListener("click", logout);
});

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".menu-icon");
    const navLinks = document.querySelector(".nav-links");

    menuIcon.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});
