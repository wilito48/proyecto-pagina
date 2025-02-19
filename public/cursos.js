
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

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            console.log("Cerrando sesión...");

            // Borra cualquier dato de sesión en localStorage y sessionStorage
            localStorage.clear();
            sessionStorage.clear();

            // (Opcional) Si usas cookies para la sesión, bórralas
            document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Redirige a la página de login
            window.location.href = "login.html"; // Ajusta según tu estructura
        });
    } else {
        console.error("El botón de cerrar sesión no fue encontrado en el DOM.");
    }
});

