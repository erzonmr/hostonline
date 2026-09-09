/* ============================================================
   LetraCristiana · Índice automático de Temáticas
   Repo: erzonmr/LetraCristiana
   Uso: página estática de Blogger con <div id="lcTematicas"></div>
   Lista las temáticas definidas en LC_config_etiquetas.json que
   existan en el blog, con conteo de canciones por etiqueta,
   y enlaza a la página de resultados /p/results.html?tag=...
   ============================================================ */
(function () {
  'use strict';

  if (window.LC_TEMATICAS_AUTO) return;
  window.LC_TEMATICAS_AUTO = true;

  var CONTENEDOR_ID = 'lcTematicas';
  var CONFIG_URL = 'https://raw.githubusercontent.com/erzonmr/LetraCristiana/main/LC_config_etiquetas.json';
  var IMAGENES_URL = 'https://raw.githubusercontent.com/erzonmr/LetraCristiana/main/LC_imagenes.json';
  var RESULTS_URL = '/p/results.html?tag=';

  /* ---------- utilidades ---------- */

  function normalizar(texto) {
    return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function clave(texto) {
    return normalizar(texto).toLowerCase();
  }

  function escapeHtml(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Imagen de respaldo: círculo con la inicial de la temática */
  function avatarInicial(nombre) {
    var inicial = normalizar(nombre).charAt(0).toUpperCase() || '?';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">' +
      '<rect width="160" height="160" rx="14" fill="#2e7d32"/>' +
      '<text x="80" y="80" dy=".35em" text-anchor="middle" ' +
      'font-family="Arial,Helvetica,sans-serif" font-size="64" font-weight="bold" fill="#ffffff">' +
      inicial + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function obtenerJson(url, respaldo) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).catch(function () { return respaldo; });
  }

  function mapaAKlaves(mapa) {
    var res = {};
    if (mapa && typeof mapa === 'object') {
      Object.keys(mapa).forEach(function (k) { res[clave(k)] = mapa[k]; });
    }
    return res;
  }

  /* Cuenta las entradas de una etiqueta (respuesta mínima del feed) */
  function contarEntradas(etiqueta) {
    var url = '/feeds/posts/summary/-/' + encodeURIComponent(etiqueta) +
      '?alt=json&max-results=0';
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d) {
      var total = d && d.feed && d.feed.openSearch$totalResults && d.feed.openSearch$totalResults.$t;
      return { nombre: etiqueta, total: total ? parseInt(total, 10) : 0 };
    }).catch(function () {
      return { nombre: etiqueta, total: null };
    });
  }

  /* ---------- lógica principal ---------- */

  function iniciar() {
    var cont = document.getElementById(CONTENEDOR_ID);
    if (!cont) return;

    cont.innerHTML = '<div class="lc-cargando">Cargando temáticas...</div>';

    Promise.all([
      fetch('/feeds/posts/summary?alt=json&max-results=0').then(function (r) {
        if (!r.ok) throw new Error('feed HTTP ' + r.status);
        return r.json();
      }),
      obtenerJson(CONFIG_URL, { tematicas: [], excluidas: [] }),
      obtenerJson(IMAGENES_URL, {})
    ]).then(function (res) {
      var feed = res[0] || {};
      var config = res[1] || {};
      var imagenes = res[2] || {};

      /* Etiquetas existentes en el blog (término exacto del feed) */
      var enBlog = {};
      ((feed.feed && feed.feed.category) || []).forEach(function (c) {
        enBlog[clave(c.term)] = c.term;
      });

      var imgTematicas = mapaAKlaves(imagenes.tematicas);

      /* Solo aparecen las temáticas del config que existen en el blog,
         en el orden definido en LC_config_etiquetas.json */
      var tematicas = (Array.isArray(config.tematicas) ? config.tematicas : [])
        .filter(function (t) { return enBlog.hasOwnProperty(clave(t)); })
        .map(function (t) { return enBlog[clave(t)]; });

      if (!tematicas.length) {
        cont.innerHTML = '<p class="lc-error">No se encontraron temáticas publicadas en el blog.</p>';
        return;
      }

      Promise.all(tematicas.map(contarEntradas)).then(function (lista) {
        renderizar(cont, lista, imgTematicas);
      });
    }).catch(function (err) {
      cont.innerHTML = '<p class="lc-error">No se pudo cargar el índice de temáticas (' +
        escapeHtml(err.message) + '). Actualiza la página o inténtalo más tarde.</p>';
    });
  }

  /* ---------- render ---------- */

  function renderizar(cont, tematicas, imgTematicas) {
    var html = '<div class="lc-tematicas-grid">';
    tematicas.forEach(function (t) {
      var img = imgTematicas[clave(t.nombre)] || avatarInicial(t.nombre);
      var conteo = t.total === null ? '' :
        '<span class="lc-tematica-count">' + t.total +
        (t.total === 1 ? ' canción</span>' : ' canciones</span>');
      html += '<a class="lc-tematica" href="' + RESULTS_URL + encodeURIComponent(t.nombre) +
        '" target="_blank" title="Ver canciones de ' + escapeHtml(t.nombre) + '">' +
        '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(t.nombre) + '" loading="lazy">' +
        '<span class="lc-tematica-nombre">' + escapeHtml(t.nombre) + '</span>' +
        conteo +
        '</a>';
    });
    html += '</div>';
    cont.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
