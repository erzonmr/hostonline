# Despliegue de la automatización (Artistas / Temáticas)

Estado: **Despliegue completo (Sep 2026)** — GitHub y Blogger terminados y
verificados. El sistema de Artistas/Temáticas está en producción.

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

## Paso 2 · Plantilla XML (una vez) — COMPLETADO

> ⚠️ Usa SOLO `AirMag-LetraCristiana-FINAL.xml` (proyecto local
> `Automatizacion/Template/`). Está construido sobre el respaldo real del
> blog (Jul-2025): menú, widgets y colores propios + loader de automatización
> + menú nuevo de 3 items (Home / Artistas / Temática). Nunca restaurar la
> plantilla pristina de Templateiki: borra la configuración del blog.

1. En Blogger → **Tema → ⋮ → Restaurar**, subir
   `Automatizacion/Template/AirMag-LetraCristiana-FINAL.xml`.
2. El loader solo actúa en páginas estáticas que contengan los contenedores
   `#lcArtistas` / `#lcTematicas`. No afecta entradas ni portada.
3. Alternativa manual: Editar HTML y pegar el bloque marcado como
   *"LetraCristiana · Automatizacion de paginas estaticas"* antes de `</body>`.

### Menú resultante (LinkList "Main Menu")

| Item | Enlace |
|---|---|
| Home | `/` |
| Artistas | `/p/artistas.html` |
| Temática | `/p/tematicas.html` |

El dropdown A-Z fue retirado (las letras viven ahora como tabs dentro de la
página Artistas). Las ~27 páginas `lista-artistas-X` y las 2 de temática
individual ya fueron retiradas (Sep 2026).

## Paso 3 · Páginas estáticas (una vez) — COMPLETADO

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

## Paso 4 · Menú — COMPLETADO

Enlaces del menú apuntando a las 2 páginas nuevas; las ~27 páginas
"Lista Artistas X" y las de temática individual ya fueron retiradas.

> Con las páginas legacy retiradas, los 4 archivos CSS/JS que solo ellas
> cargaban (`CSS_LC_List-Artist.css`, `Script_LC_Lista-Artistas.js`,
> `LC_Pagina_Tematica.css`, `LC_Pagina_Tematica.js`) ya pueden borrarse del
> repo — ver nota en [README.md](../README.md).

## Verificación rápida — confirmada (Sep 2026)

1. Abrir `/p/artistas.html` → artistas listados con su letra. ✅
2. Buscar "Alvarado" en el buscador → aparece Juan Carlos Alvarado. ✅
3. Abrir `/p/tematicas.html` → 10 temáticas con conteo. ✅
4. Clic en un artista → `/p/results.html?tag=...` con su lista de canciones. ✅
