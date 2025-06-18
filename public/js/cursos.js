import { getToken, getProfileImage, showUserInfo, updateNavProfilePic, logout } from './user.js';
import { AuthManager } from './auth.js';

// Datos de cursos con imágenes
const cursos = [
    {
        id: '1',
        titulo: "Ética Hacker y Pentesting",
        descripcion: "Aprende sobre seguridad informática y hacking ético.",
        imagen: "/imagen/ethical hacking.PNG"
    },
    {
        id: '2',
        titulo: "Análisis Forense Digital",
        descripcion: "Descubre cómo investigar incidentes de seguridad.",
        imagen: "/imagen/analisis.jpg"
    },
    {
        id: '3',
        titulo: "Seguridad en Redes",
        descripcion: "Protege redes empresariales y personales.",
        imagen: "/imagen/redes.jpg"
    }
];

// Insertar cursos en el HTML
const courseList = document.getElementById("courseList");
cursos.forEach(curso => {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("course", "course-card");
    courseDiv.innerHTML = `
        <img src="${curso.imagen || curso.image || ("/imagen/" + (curso.title || curso.titulo).toLowerCase().replace(/ /g, '-') + ".jpg")}" alt="${curso.titulo || curso.title}">
        <h3>${curso.titulo || curso.title}</h3>
        <p>${curso.descripcion || curso.description}</p>
        <button class="btn ver-curso-btn" data-id="${curso.id || curso._id}">Ver Curso</button>
    `;
    courseList.appendChild(courseDiv);
});

// Modal para login/registro
function showAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50';
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-blue-500/30 shadow-2xl">
                <h2 class="text-2xl font-bold mb-4 text-blue-400">Acceso restringido</h2>
                <p class="text-gray-300 mb-6">Debes iniciar sesión o registrarte para ver los detalles del curso.</p>
                <div class="flex justify-center gap-4 mb-4">
                    <a href="login.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Iniciar sesión</a>
                    <a href="register.html" class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition">Registrarse</a>
                </div>
                <button id="close-auth-modal" class="text-gray-400 hover:text-white mt-2">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-auth-modal').onclick = () => modal.remove();
    }
}

// Delegación de eventos para los botones Ver Curso
courseList.addEventListener('click', function(e) {
    if (e.target.classList.contains('ver-curso-btn')) {
        const id = e.target.getAttribute('data-id');
        const token = localStorage.getItem('token');
        if (!token) {
            showAuthModal();
        } else {
            window.location.href = `curso.html?id=${id}`;
        }
    }
});

// Refuerza la protección para los cursos cargados dinámicamente
function protectDynamicCourseButtons() {
    document.querySelectorAll('.ver-curso-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const id = this.dataset.id;
            const token = localStorage.getItem('token');
            if (!token) {
                showAuthModal();
            } else {
                window.location.href = `curso.html?id=${id}`;
            }
        };
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
    } else {
        showUserInfo();
        updateNavProfilePic();
    }

    // Manejador del menú desplegable
    const userMenuButton = document.getElementById("userMenuButton");
    const userDropdown = document.getElementById("userDropdown");
    
    // Mostrar/Ocultar menú
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            userDropdown.classList.toggle("show");
        });
        // Cerrar menú si se hace clic fuera
        document.addEventListener("click", (event) => {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove("show");
            }
        });
    }

    // Cerrar sesión
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    const username = localStorage.getItem('username');
    if (username && document.getElementById('userName')) {
      document.getElementById('userName').textContent = username;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        const navProfilePic = document.getElementById("navProfilePic");
        if (navProfilePic) {
            navProfilePic.src = savedImage; // Cambia la imagen en la barra
        }
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    AuthManager.renderNavbar();
    AuthManager.setupLogoutHandler();
    const courseList = document.getElementById("courseList");
    courseList.innerHTML = '<div class="text-gray-400">Cargando cursos...</div>';
    try {
        const res = await fetch('http://localhost:5001/api/cursos/catalogo');
        const cursos = await res.json();
        courseList.innerHTML = '';
        cursos.forEach(curso => {
            const imageUrl = `http://localhost:5001/imagen/${curso.image || curso.imagen}`;
            const title = curso.title || curso.titulo;
            const category = curso.category || 'General';
            const duration = curso.duration || '---';
            const students = curso.students || 0;
            const price = curso.price ? `$${curso.price}` : 'Gratis';
            const rating = curso.rating || 5;
            courseList.innerHTML += `
            <div class="course-card bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg flex flex-col hover:border-blue-500/30 transition-all duration-300 transform hover:scale-105">
                <img src="${imageUrl}" alt="${title}" class="w-full h-48 object-cover rounded-xl mb-4">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-white mb-2">${title}</h3>
                        <div class="flex items-center text-sm text-blue-400 mb-2">
                            <i class="fas fa-tag mr-1"></i> ${category}
                        </div>
                        <div class="flex items-center text-sm text-gray-400 mb-2">
                            <i class="fas fa-clock mr-1"></i> ${duration}
                        </div>
                        <div class="flex items-center text-sm text-gray-400 mb-2">
                            <i class="fas fa-users mr-1"></i> ${students} estudiantes
                        </div>
                        <div class="flex items-center text-sm text-yellow-400 mb-2">
                            <i class="fas fa-star mr-1"></i> ${rating.toFixed(1)}
                        </div>
                        <div class="flex items-center text-lg font-semibold text-green-400 mb-4">
                            <i class="fas fa-dollar-sign mr-1"></i> ${price}
                        </div>
                    </div>
                    <button class="btn ver-curso-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition mt-2" data-id="${curso._id || curso.id}">Ver Curso</button>
                </div>
            </div>
            `;
        });
        // Protección reforzada
        protectDynamicCourseButtons();
    } catch (err) {
        courseList.innerHTML = '<div class="text-red-400">Error al cargar cursos</div>';
    }
});


