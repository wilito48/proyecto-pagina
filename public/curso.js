document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ curso.js se ha cargado correctamente.");

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    if (!courseId) {
        alert("No se encontró el curso.");
        window.location.href = "cursos.html";
        return;
    }

    // Lista de cursos con imágenes y temario
    const cursos = {
        "1": { 
            titulo: "Ética Hacker y Pentesting", 
            descripcion: "Aprende sobre seguridad informática y hacking ético.",
            imagen: "/imagen/ethical hacking.PNG",
            temario: [
                "Introducción al Hacking Ético",
                "Principios de Pentesting",
                "Ataques y Defensas Comunes",
                "Explotación de Vulnerabilidades",
                "Herramientas de Pentesting"
            ],
            videoUrl: "/public/hacking/curso-videos.html" // Ruta específica
        },
        "2": { 
            titulo: "Análisis Forense Digital", 
            descripcion: "Descubre cómo investigar incidentes de seguridad.",
            imagen: "/imagen/analisis.jpg",
            temario: [
                "Fundamentos del Análisis Forense",
                "Recolección de Evidencia",
                "Análisis de Discos Duros",
                "Investigación de Malware",
                "Elaboración de Informes Forenses"
            ],
            videoUrl: "/public/forense/curso-videos.html"
        },
        "3": { 
            titulo: "Seguridad en Redes", 
            descripcion: "Protege redes empresariales y personales.",
            imagen: "/imagen/redes.jpg",
            temario: [
                "Conceptos Básicos de Redes",
                "Protocolos de Seguridad",
                "Firewall y VPNs",
                "Análisis de Tráfico de Red",
                "Defensa ante Ataques en Redes"
            ],
            videoUrl: ""
        }
    };

    // Obtener los datos del curso seleccionado
    const curso = cursos[courseId];

    if (!curso) {
        alert("Curso no encontrado.");
        window.location.href = "cursos.html";
        return;
    }

    // Mostrar la información del curso
    document.getElementById("courseTitle").textContent = curso.titulo;
    document.getElementById("courseTitle2").textContent = curso.titulo;
    document.getElementById("courseDescription").textContent = curso.descripcion;
    document.getElementById("courseImage").src = curso.imagen;

    // Cargar el temario
    const temarioLista = document.getElementById("temarioLista");
    curso.temario.forEach(tema => {
        const li = document.createElement("li");
        li.textContent = tema;
        temarioLista.appendChild(li);
    });

    // Botón para volver a cursos
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "cursos.html";
        });
    }

    // ✅ Ahora sí, actualizamos el enlace del botón "Empezar Curso"
    const startCourseButton = document.getElementById("startCourseButton");
    if (startCourseButton) {
        startCourseButton.href = curso.videoUrl;
        console.log("✅ URL asignada al botón:", startCourseButton.href);
    }
});
