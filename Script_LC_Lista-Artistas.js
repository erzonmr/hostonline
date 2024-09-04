    document.querySelectorAll('.tag-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir la redirección inmediata
            const tag = link.querySelector('b').textContent.trim(); // Obtener el texto dentro de <b>
            const newHref = `/p/results.html?tag=${encodeURIComponent(tag)}`; // Construir la nueva URL con el tag
            window.open(newHref, '_blank'); // Abrir la nueva URL en una nueva pestaña o ventana
        });
    });
