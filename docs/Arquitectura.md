# Arquitectura del sistema

## Visión general

```
 Blogger (www.letracristiana.com)
 ├── Entradas (letras) ── con etiquetas: artista + temática + letra suelta
 ├── Página /p/artistas.html ── contenedor #lcArtistas
 ├── Página /p/tematicas.html ─ contenedor #lcTematicas
 ├── Página /p/results.html ─── script inline propio (lee ?tag=... del feed)
 └── Plantilla XML ──────────── loader condicional antes de </body>
          │
          │ detecta #lcArtistas / #lcTematicas y carga desde jsDelivr:
          ▼
 Repo GitHub erzonmr/LetraCristiana (raíz plana)
 ├── Script_LC_Artistas-Tabs.js  + CSS_LC_Artistas-Tabs.css
 ├── Script_LC_Tematicas-Auto.js + CSS_LC_Tematicas-Index.css
 ├── LC_config_etiquetas.json  ← servido vía raw.githubusercontent (5 min)
 └── LC_imagenes.json          ← ídem
```

## Fuente única de verdad: el feed JSON

`/feeds/posts/summary?alt=json&max-results=0` devuelve en `feed.category[]`
**todas las etiquetas del blog**, actualizado en minutos tras publicar.
Ningún listado se mantiene a mano.

## Filtrado (Script_LC_Artistas-Tabs.js)

Una etiqueta es **artista** si:

1. No es una sola letra (`A`, `B`, `C`… usadas para navegación alfabética).
2. No está en `LC_config_etiquetas.json` → `tematicas`.
3. No está en `LC_config_etiquetas.json` → `excluidas`.

Agrupación por inicial normalizando acentos (Á→A, Ñ→N); inicial numérica
→ grupo **"0-9"** (al final, tras la Z). Respaldo de imagen en orden:
`artistas[nombre]` → `grupos[letra]` → círculo SVG con la inicial.

## Temáticas (Script_LC_Tematicas-Auto.js)

Muestra las etiquetas de `tematicas` que existan en el feed, en el orden del
JSON. El conteo por temática usa peticiones ligeras en paralelo
(`/feeds/posts/summary/-/ETIQUETA?max-results=0` → `openSearch$totalResults`).

## Enlaces a resultados

Ambos listados enlazan a `/p/results.html?tag=NOMBRE` (encodeURIComponent),
que ya existía y funciona de forma autónoma.

## Imágenes

Galería postimg: <https://postimg.cc/gallery/xLr5tVJ> → enlaces directos
`i.postimg.cc` registrados en `LC_imagenes.json` (secciones `artistas`,
`tematicas`, `grupos`).

## Redirección del repo (importante)

El repo se llamó `hostonline` hasta Sep 2026. Las 108+ entradas publicadas
cargan `CSS_LC_Entrada.css` y `Script_LC_Copy-Letra.js` desde la URL antigua
`cdn.jsdelivr.net/gh/erzonmr/hostonline@main/...`, que sigue funcionando por
la redirección 301 de GitHub. **Esa redirección es parte del sistema**:
no crear un repo nuevo con el nombre antiguo.
