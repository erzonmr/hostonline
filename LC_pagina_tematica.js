// Paginador Blogger - Reutilizable
// Uso: <script src="tu-repo.js" data-etiqueta="Alabanza" data-por-pagina="50"></script>

(function() {
    let todasLasEntradas = [];
    let paginaActual = 1;
    let cancionesPorPagina = 50;
    let etiquetaActual = 'Alabanza';

    function inicializar() {
        // Obtener parámetros del script
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
        const urlFeed = urlBlog + `/feeds/posts/default/-/${etiquetaActual}?alt=json&max-results=999`;
        
        // Actualizar texto de carga
        if (loading) {
            loading.innerHTML = `Cargando ${etiquetaActual.toLowerCase()}...`;
        }
        
        fetch(urlFeed)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las entradas');
                }
                return response.json();
            })
            .then(data => {
                const posts = data.feed.entry || [];
                
                if (posts.length === 0) {
                    loading.style.display = 'none';
                    error.innerHTML = `No se encontraron entradas con la etiqueta "${etiquetaActual}"`;
                    error.style.display = 'block';
                    return;
                }
                
                // Ordenar alfabéticamente
                todasLasEntradas = posts.sort((a, b) => {
                    const tituloA = a.title.$t.toLowerCase();
                    const tituloB = b.title.$t.toLowerCase();
                    return tituloA.localeCompare(tituloB, 'es');
                });
                
                loading.style.display = 'none';
                mostrarPagina(1);
            })
            .catch(err => {
                console.error('Error:', err);
                loading.style.display = 'none';
                error.innerHTML = `Error al cargar ${etiquetaActual.toLowerCase()}. Verifica que existan entradas con esa etiqueta.`;
                error.style.display = 'block';
            });
    }

    function mostrarPagina(numeroPagina) {
        const lista = document.getElementById('canciones-lista');
        const infoPaginacion = document.getElementById('info-paginacion');
        const paginacionContainer = document.getElementById('paginacion');
        
        paginaActual = numeroPagina;
        
        // Calcular rango
        const inicio = (numeroPagina - 1) * cancionesPorPagina;
        const fin = inicio + cancionesPorPagina;
        const entradasPagina = todasLasEntradas.slice(inicio, fin);
        
        // Generar HTML
        let html = '';
        entradasPagina.forEach(post => {
            const titulo = post.title.$t;
            const enlace = post.link.find(link => link.rel === 'alternate');
            const url = enlace ? enlace.href : '#';
            
            html += `
                <li class="cancion-item">
                    <a href="${url}" class="cancion-link" target="_blank">
                        ${titulo}
                    </a>
                </li>
            `;
        });
        
        lista.innerHTML = html;
        lista.style.display = 'block';
        
        // Información de paginación
        const totalPaginas = Math.ceil(todasLasEntradas.length / cancionesPorPagina);
        const entradaInicio = inicio + 1;
        const entradaFin = Math.min(fin, todasLasEntradas.length);
        
        infoPaginacion.innerHTML = `Mostrando ${entradaInicio} - ${entradaFin} de ${todasLasEntradas.length} ${etiquetaActual.toLowerCase()}`;
        infoPaginacion.style.display = 'block';
        
        generarPaginacion(totalPaginas);
        paginacionContainer.style.display = 'flex';
        
        // Scroll suave
        const container = document.querySelector('.canciones-container');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function generarPaginacion(totalPaginas) {
        const paginacionContainer = document.getElementById('paginacion');
        let html = '';
        
        // Botón Anterior
        const anteriorDeshabilitado = paginaActual === 1 ? 'deshabilitado' : '';
        html += `<button class="btn-paginacion ${anteriorDeshabilitado}" onclick="BloggerPaginador.cambiarPagina(${paginaActual - 1})">← Anterior</button>`;
        
        // Números de página
        let paginaInicio = Math.max(1, paginaActual - 2);
        let paginaFin = Math.min(totalPaginas, paginaActual + 2);
        
        if (paginaFin - paginaInicio < 4) {
            if (paginaInicio === 1) {
                paginaFin = Math.min(totalPaginas, paginaInicio + 4);
            } else {
                paginaInicio = Math.max(1, paginaFin - 4);
            }
        }
        
        // Primera página
        if (paginaInicio > 1) {
            html += `<button class="btn-paginacion" onclick="BloggerPaginador.cambiarPagina(1)">1</button>`;
            if (paginaInicio > 2) {
                html += `<span class="btn-paginacion deshabilitado">...</span>`;
            }
        }
        
        // Rango de páginas
        for (let i = paginaInicio; i <= paginaFin; i++) {
            const activo = i === paginaActual ? 'activo' : '';
            html += `<button class="btn-paginacion ${activo}" onclick="BloggerPaginador.cambiarPagina(${i})">${i}</button>`;
        }
        
        // Última página
        if (paginaFin < totalPaginas) {
            if (paginaFin < totalPaginas - 1) {
                html += `<span class="btn-paginacion deshabilitado">...</span>`;
            }
            html += `<button class="btn-paginacion" onclick="BloggerPaginador.cambiarPagina(${totalPaginas})">${totalPaginas}</button>`;
        }
        
        // Botón Siguiente
        const siguienteDeshabilitado = paginaActual === totalPaginas ? 'deshabilitado' : '';
        html += `<button class="btn-paginacion ${siguienteDeshabilitado}" onclick="BloggerPaginador.cambiarPagina(${paginaActual + 1})">Siguiente →</button>`;
        
        paginacionContainer.innerHTML = html;
    }

    function cambiarPagina(numeroPagina) {
        const totalPaginas = Math.ceil(todasLasEntradas.length / cancionesPorPagina);
        
        if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
            mostrarPagina(numeroPagina);
        }
    }

    // Exponer funciones globalmente
    window.BloggerPaginador = {
        cambiarPagina: cambiarPagina
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

})();
