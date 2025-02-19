
// Datos de cursos con imágenes
const cursos = [
    {
        id: 1,
        titulo: "Ética Hacker y Pentesting",
        descripcion: "Aprende sobre seguridad informática y hacking ético.",
        imagen: "/imagen/ethical hacking.PNG"
    },
    {
        id: 2,
        titulo: "Análisis Forense Digital",
        descripcion: "Descubre cómo investigar incidentes de seguridad.",
        imagen: "/imagen/analisis.jpg"
    },
    {
        id: 3,
        titulo: "Seguridad en Redes",
        descripcion: "Protege redes empresariales y personales.",
        imagen: "/imagen/redes.jpg"
    }
];

// Insertar cursos en el HTML
const courseList = document.getElementById("courseList");
cursos.forEach(curso => {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("course", "course-card"); // Asegura que tenga los estilos correctos
    courseDiv.innerHTML = `
        <img src="${curso.imagen}" alt="${curso.titulo}">
        <h3>${curso.titulo}</h3>
        <p>${curso.descripcion}</p>
        <button onclick="verCurso(${curso.id})" class="btn">Ver Curso</button>
    `;
    courseList.appendChild(courseDiv);
});


// Redirección al curso
window.verCurso = function (cursoId) {
    window.location.href = `curso.html?id=${cursoId}`;
};

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (!token) {
        // Si no hay sesión, redirigir al login
        window.location.href = "http://127.0.0.1:5500/public/login.html";
    } else {
        // Mostrar el nombre del usuario en el botón
        document.getElementById("usernameDisplay").textContent = username;
        document.getElementById("userInfo").textContent = username;
        document.getElementById("userEmail").textContent = email;
    }

    // Manejador del menú desplegable
    const userMenuButton = document.getElementById("userMenuButton");
    const userDropdown = document.querySelector(".user-dropdown");

    userMenuButton.addEventListener("click", () => {
        userDropdown.classList.toggle("show"); // Muestra u oculta el menú
    });

    // Cerrar sesión
    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "http://127.0.0.1:5500/public/login.html"; // Redirigir al login
    });

    // Ocultar menú si se hace clic fuera
    document.addEventListener("click", (event) => {
        if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.remove("show");
        }
    });
});



