// Paginador Blogger - Reutilizable
// Uso: <script src="tu-repo.js" data-etiqueta="Alabanza" data-por-pagina="50"></script>

(function() {
    let todasLasEntradas = [];
    let paginaActual = 1;
    let cancionesPorPagina = 50;
    let etiquetaActual = 'Alabanza';

    function inicializar() {
        const scriptTag = document.querySelector('script[data-etiqueta]');
        if (scriptTag) {
            etiquetaActual = scriptTag.getAttribute('data-etiqueta') || 'Alabanza';
            cancionesPorPagina = parseInt(scriptTag.getAttribute('data-por-pagina')) || 50;
        }
        cargarEntradas();
    }

    function cargarEntradas() {
        const loading = document.getElementById('loading');
        const lista = document.getElementById('canciones-lista');
        const error = document.getElementById('error');

        const urlBlog = window.location.origin;
        const urlFeedBase = urlBlog + `/feeds/posts/default/-/${etiquetaActual}?alt=json&max-results=150`;
        let startIndex = 1;

        const todas = [];

        function fetchBatch() {
            fetch(urlFeedBase + `&start-index=${startIndex}`)
                .then(response => {
                    if (!response.ok) throw new Error('No se pudieron cargar las entradas');
                    return response.json();
                })
                .then(data => {
                    const posts = data.feed.entry || [];
                    todas.push(...posts);
                    const nextLink = data.feed.link.find(l => l.rel === 'next');
                    if (nextLink) {
                        startIndex += 150;
                        fetchBatch();
                    } else {
                        procesarEntradas(todas);
                    }
                })
                .catch(err => {
                    console.error('Error:', err);
                    loading.style.display = 'none';
                    error.innerHTML = `Error al cargar ${etiquetaActual.toLowerCase()}. Verifica que existan entradas con esa etiqueta.`;
                    error.style.display = 'block';
                });
        }

        loading.innerHTML = `Cargando ${etiquetaActual.toLowerCase()}...`;
        fetchBatch();
    }

    function procesarEntradas(posts) {
        const lista = document.getElementById('canciones-lista');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');

        if (posts.length === 0) {
            loading.style.display = 'none';
            error.innerHTML = `No se encontraron entradas con la etiqueta "${etiquetaActual}"`;
            error.style.display = 'block';
            return;
        }

        todasLasEntradas = posts.sort((a, b) => {
            const tituloA = a.title.$t.toLowerCase();
            const tituloB = b.title.$t.toLowerCase();
            return tituloA.localeCompare(tituloB, 'es');
        });

        loading.style.display = 'none';
        mostrarPagina(1);
    }

    function mostrarPagina(numeroPagina) {
        const lista = document.getElementById('canciones-lista');
        const infoPaginacion = document.getElementById('info-paginacion');
        const paginacionContainer = document.getElementById('paginacion');

        paginaActual = numeroPagina;
        const inicio = (numeroPagina - 1) * cancionesPorPagina;
        const fin = inicio + cancionesPorPagina;
        const entradasPagina = todasLasEntradas.slice(inicio, fin);

        let html = '';
        entradasPagina.forEach(post => {
            const titulo = post.title.$t;
            const enlace = post.link.find(link => link.rel === 'alternate');
            const url = enlace ? enlace.href : '#';

            html += \`
                <li class="cancion-item">
                    <a href="\${url}" class="cancion-link" target="_blank">
                        \${titulo}
                    </a>
                </li>
            \`;
        });

        lista.innerHTML = html;
        lista.style.display = 'block';

        const totalPaginas = Math.ceil(todasLasEntradas.length / cancionesPorPagina);
        const entradaInicio = inicio + 1;
        const entradaFin = Math.min(fin, todasLasEntradas.length);

        infoPaginacion.innerHTML = \`Mostrando \${entradaInicio} - \${entradaFin} de \${todasLasEntradas.length} \${etiquetaActual.toLowerCase()}\`;
        infoPaginacion.style.display = 'block';

        generarPaginacion(totalPaginas);
        paginacionContainer.style.display = 'flex';

        const container = document.querySelector('.canciones-container');
        if (container) container.scrollIntoView({ behavior: 'smooth' });
    }

    function generarPaginacion(totalPaginas) {
        const paginacionContainer = document.getElementById('paginacion');
        let html = '';

        html += \`<button class="btn-paginacion \${paginaActual === 1 ? 'deshabilitado' : ''}" onclick="BloggerPaginador.cambiarPagina(\${paginaActual - 1})">← Anterior</button>\`;

        let paginaInicio = Math.max(1, paginaActual - 2);
        let paginaFin = Math.min(totalPaginas, paginaActual + 2);

        if (paginaFin - paginaInicio < 4) {
            if (paginaInicio === 1) paginaFin = Math.min(totalPaginas, paginaInicio + 4);
            else paginaInicio = Math.max(1, paginaFin - 4);
        }

        if (paginaInicio > 1) {
            html += \`<button class="btn-paginacion" onclick="BloggerPaginador.cambiarPagina(1)">1</button>\`;
            if (paginaInicio > 2) html += \`<span class="btn-paginacion deshabilitado">...</span>\`;
        }

        for (let i = paginaInicio; i <= paginaFin; i++) {
            html += \`<button class="btn-paginacion \${i === paginaActual ? 'activo' : ''}" onclick="BloggerPaginador.cambiarPagina(\${i})">\${i}</button>\`;
        }

        if (paginaFin < totalPaginas) {
            if (paginaFin < totalPaginas - 1) html += \`<span class="btn-paginacion deshabilitado">...</span>\`;
            html += \`<button class="btn-paginacion" onclick="BloggerPaginador.cambiarPagina(\${totalPaginas})">\${totalPaginas}</button>\`;
        }

        html += \`<button class="btn-paginacion \${paginaActual === totalPaginas ? 'deshabilitado' : ''}" onclick="BloggerPaginador.cambiarPagina(\${paginaActual + 1})">Siguiente →</button>\`;

        paginacionContainer.innerHTML = html;
    }

    function cambiarPagina(numeroPagina) {
        const totalPaginas = Math.ceil(todasLasEntradas.length / cancionesPorPagina);
        if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
            mostrarPagina(numeroPagina);
        }
    }

    window.BloggerPaginador = { cambiarPagina };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
})();
