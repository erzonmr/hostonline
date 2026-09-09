# Mantenimiento

## Rutina diaria (publicar una canción)

1. Publica la entrada con sus etiquetas (artista + temática).
2. **Nada más.** Artistas y temáticas se actualizan solos en minutos.

## Agregar imagen de un artista nuevo

1. Sube la imagen a la galería de postimg:
   <https://postimg.cc/gallery/xLr5tVJ>
2. Copia el enlace directo (`https://i.postimg.cc/....webp`).
3. En `LC_imagenes.json`, sección `artistas`, agrega:
   ```json
   "Nombre Del Artista": "https://i.postimg.cc/xxxxx/Nombre.webp",
   ```
   El nombre debe coincidir con la etiqueta del blog (ignora
   mayúsculas/acentos al comparar).
4. Guarda el commit. Visible en ~5 minutos (sin purga: los JSON se sirven
   desde raw.githubusercontent.com).

Sin imagen: el artista se muestra con un círculo verde con su inicial.
Artistas que empiezan con número: pestaña **0-9**, con la imagen por defecto
del grupo (`grupos` → `0-9`, archivo `33-d-C.webp`).

## Crear una temática nueva

1. Publica al menos una entrada con esa etiqueta.
2. Agrega el nombre a `LC_config_etiquetas.json` → `tematicas`
   (el orden del JSON = orden de muestra en la página).
3. Opcional: agrega su imagen en `LC_imagenes.json` → `tematicas`.

## Temáticas sin imagen (pendiente Sep 2026)

- Adoración
- Necesidad de Dios
- Victoria

Muestran un cuadro verde con la inicial hasta agregar su imagen
(ver procedimiento arriba).

## Clasificar una etiqueta mal categorizada

- Todo lo que no está en `tematicas`/`excluidas` y no es letra suelta
  (A, B, C… navegación) **se considera artista**.
- "Palabra En Acción" está confirmado como **artista** (ministerio musical).
- Para mover algo: edita `LC_config_etiquetas.json` (y su imagen de sección
  en `LC_imagenes.json` si aplica).

## Cachés

| Archivo | CDN | Ver cambios |
|---|---|---|
| `*.json` | raw.githubusercontent | ~5 min |
| `*.css`, `*.js` | cdn.jsdelivr.net | horas → purgar |

Purga manual tras cambiar un CSS/JS:
<https://www.jsdelivr.com/tools/purge>
Ejemplo:
`https://www.jsdelivr.net/tools/purge/gh/erzonmr/LetraCristiana@main/Script_LC_Artistas-Tabs.js`

## Reglas críticas (no romper el blog)

1. **No mover/renombrar/borrar archivos de la raíz del repo**: sus URLs están
   incrustadas en las 108+ entradas del blog.
2. **No crear un repo llamado `hostonline`** ni transferir/renombrar este repo:
   las entradas antiguas dependen de la redirección `hostonline → LetraCristiana`.
3. **Repo siempre público** (jsDelivr no sirve repos privados).
4. Si jsDelivr devuelve 404 tras un cambio: verifica que `main` sigue siendo
   la rama por defecto y purga la caché.
