import { getToken, showUserInfo, updateNavProfilePic, logout } from './user.js';
import { AuthManager } from './auth.js';

document.addEventListener("DOMContentLoaded", async () => {
    AuthManager.renderNavbar();
    AuthManager.setupLogoutHandler();
    const token = getToken();
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");
    if (!courseId) {
        window.location.href = 'cursos.html';
        return;
    }
    // Obtener detalles del curso del backend
    let curso;
    try {
        const res = await fetch(`http://localhost:5001/api/cursos/${courseId}`);
        if (!res.ok) throw new Error('Curso no encontrado');
        curso = await res.json();
    } catch (err) {
        window.location.href = 'cursos.html';
        return;
    }
    // Renderizar detalles
    document.getElementById("courseTitle").textContent = curso.title;
    document.getElementById("courseTitle2").textContent = curso.title;
    document.getElementById("courseDescription").textContent = curso.description;
    document.getElementById("courseImage").src = `/imagen/${curso.title.toLowerCase().replace(/ /g, '-')}.jpg`;
    const temarioLista = document.getElementById("temarioLista");
    temarioLista.innerHTML = '';
    (curso.temario || []).forEach(tema => {
        const li = document.createElement("li");
        li.textContent = tema;
        temarioLista.appendChild(li);
    });
    // Botón de videos protegido
    const startCourseButton = document.getElementById("startCourseButton");
    if (startCourseButton) {
        if (token) {
            startCourseButton.href = `/public/${curso.title.toLowerCase().replace(/ /g, '-')}/curso-videos.html`;
            startCourseButton.onclick = null;
        } else {
            startCourseButton.href = '#';
            startCourseButton.onclick = function(e) {
                e.preventDefault();
                let modal = document.getElementById('auth-modal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'auth-modal';
                    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50';
                    modal.innerHTML = `
                        <div class=\"bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-blue-500/30 shadow-2xl\">
                            <h2 class=\"text-2xl font-bold mb-4 text-blue-400\">Acceso restringido</h2>
                            <p class=\"text-gray-300 mb-6\">Debes iniciar sesión o registrarte para ver los videos de este curso.</p>
                            <div class=\"flex justify-center gap-4 mb-4\">
                                <a href=\"login.html\" class=\"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition\">Iniciar sesión</a>
                                <a href=\"register.html\" class=\"bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition\">Registrarse</a>
                            </div>
                            <button id=\"close-auth-modal\" class=\"text-gray-400 hover:text-white mt-2\">Cerrar</button>
                        </div>
                    `;
                    document.body.appendChild(modal);
                    document.getElementById('close-auth-modal').onclick = () => modal.remove();
                }
            };
        }
    }
    // Botón volver
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "cursos.html";
        });
    }

    console.log("✅ curso.js se ha cargado correctamente.");

    console.log("[DEBUG] Object.keys(cursos):", Object.keys(cursos));
    console.log("[DEBUG] courseId:", courseId, typeof courseId);
});
