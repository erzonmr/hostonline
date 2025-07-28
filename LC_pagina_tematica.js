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
        // Codificar la etiqueta para URLs
        const etiquetaCodificada = encodeURIComponent(etiquetaActual);
        const urlFeed = urlBlog + `/feeds/posts/default/-/${etiquetaCodificada}?alt=json&max-results=999`;
        
        console.log('Cargando etiqueta:', etiquetaActual);
        console.log('URL del feed:', urlFeed);
        
        // Actualizar texto de carga
        if (loading) {
            loading.innerHTML = `Cargando ${etiquetaActual.toLowerCase()}...`;
        }
        
        fetch(urlFeed)
            .then(response => {
                console.log('Respuesta del servidor:', response.status);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data);
                const posts = data.feed.entry || [];
                console.log('Número de posts encontrados:', posts.length);
                
                if (posts.length === 0) {
                    loading.style.display = 'none';
                    error.innerHTML = `No se encontraron entradas con la etiqueta "${etiquetaActual}". Verifica que la etiqueta sea exacta (mayúsculas/minúsculas).`;
                    error.style.display = 'block';
                    return;
                }
                
                // Ordenar alfabéticamente
                todasLasEntradas = posts.sort((a, b) => {
                    const tituloA = a.title.$t.toLowerCase();
                    const tituloB = b.title.$t.toLowerCase();
                    return tituloA.localeCompare(tituloB, 'es');
                });
                
                console.log('Total de entradas ordenadas:', todasLasEntradas.length);
                loading.style.display = 'none';
                mostrarPagina(1);
            })
            .catch(err => {
                console.error('Error detallado:', err);
                loading.style.display = 'none';
                error.innerHTML = `Error al cargar "${etiquetaActual}". <br><small>Detalles: ${err.message}</small><br>Verifica que existan entradas con esa etiqueta exacta.`;
                error.style.display = 'block';
            });
    }

    function mostrarPagina(numeroPagina) {
        const lista = document.getElementById('canciones-lista');
        const infoPaginacion = document.getElementById('info-paginacion');
        const paginacionContainer = document.getElementById('paginacion');
        
        if (!todasLasEntradas || todasLasEntradas.length === 0) {
            console.error('No hay entradas para mostrar');
            return;
        }
        
        paginaActual = numeroPagina;
        
        // Calcular rango
        const inicio = (numeroPagina - 1) * cancionesPorPagina;
        const fin = inicio + cancionesPorPagina;
        const entradasPagina = todasLasEntradas.slice(inicio, fin);
        
        console.log(`Mostrando página ${numeroPagina}: entradas ${inicio + 1} a ${Math.min(fin, todasLasEntradas.length)}`);
        console.log('Entradas en esta página:', entradasPagina.length);
        
        // Generar HTML
        let html = '';
        entradasPagina.forEach((post, index) => {
            try {
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
            } catch (error) {
                console.error('Error procesando entrada:', post, error);
            }
        });
        
        if (html === '') {
            console.error('No se pudo generar HTML para las entradas');
            return;
        }
        
        lista.innerHTML = html;
        lista.style.display = 'block';
        
        // Ocultar información de paginación
        const totalPaginas = Math.ceil(todasLasEntradas.length / cancionesPorPagina);
        if (infoPaginacion) {
            infoPaginacion.style.display = 'none';
        }
        
        console.log('Total de páginas:', totalPaginas);
        
        // Solo mostrar paginación si hay más de una página
        if (totalPaginas > 1) {
            generarPaginacion(totalPaginas);
            paginacionContainer.style.display = 'flex';
        } else {
            paginacionContainer.style.display = 'none';
            console.log('Solo hay una página, ocultando paginación');
        }
        
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
