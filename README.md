# LetraCristiana · Assets del blog

Repositorio oficial de CSS, JS, JSON e imágenes de configuración para
**[www.letracristiana.com](https://www.letracristiana.com)** (Blogger).

Los archivos se sirven en el blog mediante dos CDNs:

| CDN | Uso | Propagación de cambios |
|---|---|---|
| `cdn.jsdelivr.net/gh/erzonmr/LetraCristiana@main/...` | CSS y JS | Horas (purgar en [jsdelivr.com/tools/purge](https://www.jsdelivr.com/tools/purge)) |
| `raw.githubusercontent.com/erzonmr/LetraCristiana/main/...` | JSON de configuración | ~5 minutos |

> **Historial:** este repositorio se llamaba `hostonline` hasta Sep 2026.
> GitHub mantiene una redirección del nombre antiguo, por lo que las URLs
> antiguas siguen funcionando. Ver reglas críticas abajo.

## Mapa de archivos

### Automatización de listados (Sep 2026)

| Archivo | Qué hace |
|---|---|
| `Script_LC_Artistas-Tabs.js` | Página **Artistas**: listado automático con tabs A-Z (0-9 incluido), buscador y enlaces a resultados |
| `CSS_LC_Artistas-Tabs.css` | Estilos de la página Artistas |
| `Script_LC_Tematicas-Auto.js` | Página **Temáticas**: índice automático con imagen y conteo de canciones |
| `CSS_LC_Tematicas-Index.css` | Estilos de la página Temáticas |
| `LC_config_etiquetas.json` | Etiquetas temáticas y excluidas del listado de artistas |
| `LC_imagenes.json` | Mapa de imágenes postimg: artistas, temáticas y grupo "0-9" |

### Entradas y páginas existentes

| Archivo | Dónde se usa |
|---|---|
| `CSS_LC_Entrada.css` | Cada entrada (letra de canción) |
| `Script_LC_Copy-Letra.js` | Cada entrada (botón Copiar Letra) |
| `CSS_LC_List-Artist.css` | Páginas antiguas "Lista Artistas por letra" |
| `Script_LC_Lista-Artistas.js` | Páginas antiguas "Lista Artistas por letra" |
| `LC_Pagina_Tematica.css` | Páginas antiguas de temática (Adoración, Alabanza) |
| `LC_Pagina_Tematica.js` | Páginas antiguas de temática (Adoración, Alabanza) |

> Los 4 archivos legacy de arriba podrán borrarse cuando se eliminen las
> páginas que los usan: las ~27 "Lista Artistas X" y las 2 de temática
> (`adoracion.html` y `tematica-alabanza.html`). Mientras esas páginas sigan
> publicadas, no borrar estos archivos.

## Documentación

- [docs/Despliegue.md](docs/Despliegue.md) — instalación de la automatización en Blogger
- [docs/Mantenimiento.md](docs/Mantenimiento.md) — rutinas diarias y reglas críticas
- [docs/Arquitectura.md](docs/Arquitectura.md) — cómo funciona todo el sistema

## Reglas críticas

1. **No mover, renombrar ni borrar archivos de la raíz.** Las URLs están
   incrustadas en las 108+ entradas publicadas del blog.
2. **No crear nunca un repositorio nuevo llamado `hostonline`** ni transferir
   este repo: se perdería la redirección de la que dependen las entradas.
3. **El repositorio debe permanecer público** (jsDelivr no sirve repos privados).
4. Nuevos archivos siempre en la raíz, con prefijo `LC_` o `CSS_LC_`/`Script_LC_`.
