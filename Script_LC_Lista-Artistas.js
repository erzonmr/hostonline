    document.querySelectorAll('#myArtistListContainer .tag-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir la redirección inmediata
            const tag = link.textContent.trim(); // Obtener el texto directamente del enlace
            const newHref = `/p/results.html?tag=${encodeURIComponent(tag)}`; // Construir la nueva URL con el tag
            window.open(newHref, '_blank'); // Abrir la nueva URL en una nueva pestaña o ventana
        });
    });
