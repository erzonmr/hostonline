/* ============================================================
   LetraCristiana · Listado automático de Artistas (tabs A-Z)
   Repo: erzonmr/LetraCristiana
   Uso: página estática de Blogger con <div id="lcArtistas"></div>
   Fuente de datos: feed JSON del blog (etiquetas automáticas)
   ============================================================ */
(function () {
  'use strict';

  if (window.LC_ARTISTAS_TABS) return;
  window.LC_ARTISTAS_TABS = true;

  var CONTENEDOR_ID = 'lcArtistas';
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

  function letraDe(nombre) {
    var c = normalizar(nombre).charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : '0-9';
  }

  /* Avatar de respaldo: círculo con la inicial del artista (SVG embebido) */
  function avatarInicial(nombre) {
    var inicial = normalizar(nombre).charAt(0).toUpperCase() || '?';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">' +
      '<circle cx="60" cy="60" r="60" fill="#2e7d32"/>' +
      '<text x="60" y="60" dy=".35em" text-anchor="middle" ' +
      'font-family="Arial,Helvetica,sans-serif" font-size="52" font-weight="bold" fill="#ffffff">' +
      inicial + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function obtenerJson(url, respaldo) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).catch(function () { return respaldo; });
  }

  function listaAClaves(lista) {
    return (Array.isArray(lista) ? lista : []).map(clave);
  }

  function mapaAKlaves(mapa) {
    var res = {};
    if (mapa && typeof mapa === 'object') {
      Object.keys(mapa).forEach(function (k) { res[clave(k)] = mapa[k]; });
    }
    return res;
  }

  /* ---------- lógica principal ---------- */

  function iniciar() {
    var cont = document.getElementById(CONTENEDOR_ID);
    if (!cont) return;

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

      var categorias = (feed.feed && feed.feed.category) || [];
      var etiquetas = categorias.map(function (c) { return c.term; });

      var tematicas = listaAClaves(config.tematicas);
      var excluidas = listaAClaves(config.excluidas);
      var imgArtistas = mapaAKlaves(imagenes.artistas);
      var imgGrupos = mapaAKlaves(imagenes.grupos);

      /* Artista = etiqueta que NO es temática, NO está excluida y NO es
         una letra suelta (A, B, C... usadas para navegación alfabética). */
      var artistas = etiquetas.filter(function (e) {
        var n = normalizar(e);
        if (!n || /^[a-z0-9]$/i.test(n)) return false;
        var k = clave(e);
        if (tematicas.indexOf(k) !== -1) return false;
        if (excluidas.indexOf(k) !== -1) return false;
        return true;
      }).sort(function (a, b) {
        return a.localeCompare(b, 'es', { sensitivity: 'base' });
      });

      renderizar(cont, artistas, imgArtistas, imgGrupos);
    }).catch(function (err) {
      cont.innerHTML = '<p class="lc-error">No se pudo cargar la lista de artistas (' +
        escapeHtml(err.message) + '). Actualiza la página o inténtalo más tarde.</p>';
    });
  }

  /* ---------- render ---------- */

  function renderizar(cont, artistas, imgArtistas, imgGrupos) {
    var grupos = {};
    artistas.forEach(function (a) {
      var l = letraDe(a);
      (grupos[l] = grupos[l] || []).push(a);
    });

    var letras = Object.keys(grupos).sort(function (a, b) {
      if (a === '0-9') return 1;
      if (b === '0-9') return -1;
      return a.localeCompare(b, 'es');
    });

    if (!letras.length) {
      cont.innerHTML = '<p class="lc-error">No se encontraron etiquetas de artistas en el blog.</p>';
      return;
    }

    var html = '';
    html += '<div class="lc-buscador"><input type="search" id="lcBuscarArtista" ' +
      'placeholder="Buscar artista..." autocomplete="off" aria-label="Buscar artista"></div>';
    html += '<nav class="lc-tabs" id="lcTabsArtistas" role="tablist" aria-label="Letras">';
    letras.forEach(function (l) {
      html += '<button type="button" class="lc-tab" data-letra="' + l + '" role="tab">' +
        l + '<span class="lc-tab-num">' + grupos[l].length + '</span></button>';
    });
    html += '</nav>';
    html += '<p class="lc-resultado" id="lcResultado"></p>';
    html += '<div id="myArtistListContainer" class="artist-list"></div>';
    html += '<p class="lc-vacio" id="lcVacio" hidden>No se encontraron artistas con ese nombre.</p>';
    cont.innerHTML = html;

    var grid = cont.querySelector('#myArtistListContainer');
    var input = cont.querySelector('#lcBuscarArtista');
    var resultado = cont.querySelector('#lcResultado');
    var vacio = cont.querySelector('#lcVacio');

    function tarjeta(nombre) {
      var img = imgArtistas[clave(nombre)] || imgGrupos[letraDe(nombre)] || avatarInicial(nombre);
      return '<div class="artist">' +
        '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(nombre) + '" loading="lazy" width="60" height="60">' +
        '<a href="' + RESULTS_URL + encodeURIComponent(nombre) + '" class="tag-link" target="_blank" ' +
        'title="Ver canciones de ' + escapeHtml(nombre) + '">' + escapeHtml(nombre) + '</a>' +
        '</div>';
    }

    function pintar(lista, titulo) {
      grid.innerHTML = lista.map(tarjeta).join('');
      resultado.textContent = titulo || '';
      vacio.hidden = lista.length > 0;
    }

    function mostrarLetra(letra) {
      cont.querySelectorAll('.lc-tab').forEach(function (t) {
        var activo = t.getAttribute('data-letra') === letra;
        t.classList.toggle('activo', activo);
        if (activo) t.setAttribute('aria-selected', 'true'); else t.removeAttribute('aria-selected');
      });
      var lista = grupos[letra] || [];
      pintar(lista, lista.length + (lista.length === 1 ? ' artista' : ' artistas'));
    }

    cont.querySelector('#lcTabsArtistas').addEventListener('click', function (ev) {
      var btn = ev.target.closest('.lc-tab');
      if (!btn) return;
      var l = btn.getAttribute('data-letra');
      input.value = '';
      try { history.replaceState(null, '', '#' + l); } catch (e) { location.hash = l; }
      mostrarLetra(l);
    });

    input.addEventListener('input', function () {
      var q = clave(input.value);
      if (!q) {
        var activa = cont.querySelector('.lc-tab.activo');
        mostrarLetra(activa ? activa.getAttribute('data-letra') : letras[0]);
        return;
      }
      var res = artistas.filter(function (a) { return clave(a).indexOf(q) !== -1; });
      cont.querySelectorAll('.lc-tab').forEach(function (t) { t.classList.remove('activo'); });
      pintar(res, res.length + (res.length === 1 ? ' resultado' : ' resultados'));
    });

    var pedida = decodeURIComponent((location.hash || '').replace('#', '')).toUpperCase();
    var inicial = letras.indexOf(pedida) !== -1 ? pedida : letras[0];
    mostrarLetra(inicial);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
