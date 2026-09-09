# Cómo está organizado el proyecto LetraCristiana

Este documento explica **dónde vive cada cosa** y por qué el proyecto está
repartido en dos ubicaciones distintas.

## Las dos ubicaciones

| Ubicación | Qué es | Visibilidad |
|---|---|---|
| `C:\Users\pasto\OneDrive\Documentos\GitHub\LetraCristiana` | **Este repositorio** (GitHub). Solo assets web que el blog carga vía jsDelivr. | **Público** (obligatorio para jsDelivr) |
| `G:\Mi unidad\LetraCristiana` | **Proyecto completo** (Google Drive). Todo el material de trabajo. | **Privado** |

> **Por qué separados:** el repo debe ser público porque jsDelivr solo sirve
> repos públicos. El proyecto contiene material que no debe publicarse
> (cuentas de correo/redes, canciones en borrador, respaldos). Mezclarlos
> en un repo público arriesgaría subir ese material por accidente.

## Qué hay en cada lugar

### Repo (OneDrive / GitHub) — assets web

Solo lo que `www.letracristiana.com` carga desde internet:

```
LetraCristiana/
├── Script_LC_Artistas-Tabs.js     ← página "Artistas" (automatización)
├── CSS_LC_Artistas-Tabs.css
├── Script_LC_Tematicas-Auto.js    ← página "Temáticas" (automatización)
├── CSS_LC_Tematicas-Index.css
├── LC_config_etiquetas.json       ← temáticas y excluidas
├── LC_imagenes.json               ← imágenes postimg (artistas/temáticas/0-9)
├── CSS_LC_Entrada.css             ← cada entrada (108 posts)
├── Script_LC_Copy-Letra.js        ← cada entrada (botón Copiar)
├── CSS_LC_List-Artist.css         ← páginas legacy "Lista Artistas X"
├── Script_LC_Lista-Artistas.js    ← ídem
├── LC_Pagina_Tematica.css         ← páginas legacy de temática
├── LC_Pagina_Tematica.js          ← ídem
├── README.md
├── .gitignore
└── docs/  (esta documentación)
```

### Proyecto (Google Drive) — material de trabajo

```
G:\Mi unidad\LetraCristiana\
├── Canciones por ingresar\   ← .docx con letras por publicar
├── Copias de Seguridad\      ← respaldos del blog (XML)
├── Correos & Redes\          ← cuentas (NO subir nunca)
├── Generador de Letras\      ← HTML del generador
├── Ideas\
├── Imágenes\
├── Plantillas\               ← formatos de entrada y páginas (.txt)
├── Publicaciones en Redes\
├── Script Copy\
├── Template\                 ← plantilla AirMag original
└── Automatizacion\
    ├── Blogger\              ← HTML a pegar en las páginas de Blogger
    ├── Template\             ← AirMag-LetraCristiana-FINAL.xml (a restaurar)
    └── Instrucciones - Despliegue.md
```

## Flujo de trabajo

### Editar un asset web (CSS/JS/JSON)

1. Edita el archivo dentro del repo (OneDrive).
2. `git commit` + `git push` a `main`.
3. El blog lo toma automáticamente (JSON ~5 min; CSS/JS: purgar caché de
   jsDelivr si necesitas verlo ya). Ver [Mantenimiento.md](Mantenimiento.md).

### Publicar una canción nueva

1. Redacta la entrada en Blogger usando las plantillas de
   `G:\...\Plantillas\`.
2. Etiqueta con artista + temática (+ letra suelta si aún usas el A-Z).
3. Nada más: las páginas Artistas/Temáticas se actualizan solas.

### Restaurar la plantilla del blog

- Usar SOLO `G:\...\Automatizacion\Template\AirMag-LetraCristiana-FINAL.xml`.
- NUNCA la plantilla pristina demo (borra menú y widgets). Ver
  [Despliegue.md](Despliegue.md).

## Reglas de oro

1. **Repo = solo assets web.** Si un archivo no lo carga el blog, no va aquí.
2. **Google Drive = todo lo demás.** Nunca se sube al repo.
3. **No duplicar.** Cada archivo vive en un solo lugar (el repo o Google Drive,
   nunca en ambos) para evitar desincronización.
