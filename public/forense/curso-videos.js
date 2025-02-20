document.addEventListener("DOMContentLoaded", function() {
    const videoPlayer = document.getElementById("video-player");
    const videoDescription = document.getElementById("video-description");
    const buttons = document.querySelectorAll(".lesson-button");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const videoSrc = this.dataset.video;
            const description = this.dataset.description;

            videoPlayer.src = videoSrc;
            videoDescription.textContent = description;

            videoPlayer.play(); // Reproduce automáticamente el nuevo video
        });
    });
});

document.getElementById("volverCurso").addEventListener("click", function() {
    if (document.referrer.includes("/public/curso.html")) {
        window.history.back();
    } else {
        window.location.href = "/public/curso.html"; 
    }
});

