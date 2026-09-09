# Despliegue de la automatización (Artistas / Temáticas)

Estado: **GitHub completado en Sep 2026**. Solo quedan los pasos de Blogger.

## Qué se automatiza

- **Página Artistas**: se llena sola con los artistas (etiquetas) del blog,
  agrupados por letra A-Z con pestañas + buscador. Deep-link por letra:
  `/p/artistas.html#J` (números: `#0-9`).
- **Página Temáticas**: índice automático con imagen y conteo de canciones
  por temática, enlazando a la página de resultados.
- Fuente de datos: el feed JSON del blog
  `https://www.letracristiana.com/feeds/posts/summary?alt=json&max-results=0`

## Paso 1 · GitHub — COMPLETADO

Los 6 archivos de automatización ya están en la raíz de este repo
(`Script_LC_Artistas-Tabs.js`, `CSS_LC_Artistas-Tabs.css`,
`Script_LC_Tematicas-Auto.js`, `CSS_LC_Tematicas-Index.css`,
`LC_config_etiquetas.json`, `LC_imagenes.json`).

## Paso 2 · Plantilla XML (una vez)

1. Descargar la copia local del proyecto:
   `Automatizacion/Template/Air_Mag_Premium_Version.xml`
2. En Blogger → **Tema → (flecha) → Restaurar**, subir ese XML.
   - Alternativa manual: **Editar HTML** y pegar antes de `</body>` el bloque
     marcado como *"LetraCristiana · Automatizacion de paginas estaticas"*.
3. El loader solo actúa en páginas estáticas que contengan los contenedores
   `#lcArtistas` / `#lcTematicas`. No afecta entradas ni portada.

## Paso 3 · Páginas estáticas (una vez)

**Página Artistas** — Páginas → Página nueva → título "Artistas" → vista
HTML → pegar solo:

```html
<div id="lcArtistas">
  <div class="lc-cargando">Cargando artistas...</div>
</div>
```

**Página Temáticas** — ídem, título "Temáticas":

```html
<div id="lcTematicas">
  <div class="lc-cargando">Cargando temáticas...</div>
</div>
```

> Si prefieres no tocar el XML, existe la versión independiente con CSS+JS
> incluidos en `Automatizacion/Blogger/Pagina *.txt` del proyecto local.

## Paso 4 · Menú

Apuntar los enlaces del menú a las 2 páginas nuevas y retirar
progresivamente las ~27 páginas "Lista Artistas X" y las de temática
individual (no borrar hasta comprobar que todo funciona).

## Verificación rápida

1. Abrir `/p/artistas.html` → deben listararse los artistas con su letra.
2. Buscar "Alvarado" en el buscador → aparece Juan Carlos Alvarado.
3. Abrir `/p/tematicas.html` → 10 temáticas con conteo.
4. Clic en un artista → `/p/results.html?tag=...` con su lista de canciones.
