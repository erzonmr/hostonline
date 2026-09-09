# Cómo está organizada esta carpeta

Este documento explica **qué se sube a GitHub y qué no**, ahora que todo el
proyecto vive en un solo directorio.

## Una sola carpeta, dos tipos de contenido

Todo vive en `C:\Users\pasto\OneDrive\Documentos\GitHub\LetraCristiana`
(sincronizada con OneDrive). Dentro conviven:

| Contenido | Visibilidad | Cómo se filtra |
|---|---|---|
| Assets web del blog (raíz + `docs/`) | **Público** en GitHub (`erzonmr/LetraCristiana`) | Permitidos explícitamente en `.gitignore` |
| Resto del proyecto (canciones, respaldos, cuentas, plantillas, generador de letras...) | **Privado**, solo local/OneDrive | Todo lo demás — ignorado por defecto |

> **Por qué en un solo directorio:** hasta Sep 2026 el proyecto estaba
> repartido entre este repo (OneDrive) y una carpeta aparte en Google Drive
> (`G:\Mi unidad\LetraCristiana`), lo que generaba confusión sobre dónde
> vivía cada cosa. Se unificó todo aquí. El repo sigue siendo
> obligatoriamente público (jsDelivr no sirve repos privados), así que la
> separación público/privado ahora la hace el `.gitignore`, no la ubicación
> en disco.

## Cómo filtra el `.gitignore`

Usa **lista blanca**: ignora todo por defecto (`/*`) y permite
explícitamente solo:

- Archivos de raíz con prefijo `LC_`, `CSS_LC_` o `Script_LC_`
- `README.md` y `.gitignore`
- La carpeta `docs/` completa

Cualquier carpeta o archivo nuevo del proyecto (una canción, un backup, una
cuenta) queda **privado automáticamente**, sin tener que acordarse de
excluirlo a mano. Ver el `.gitignore` en la raíz para el detalle exacto.
Para comprobar en cualquier momento qué queda fuera de git:

```
git status --ignored
```

## Qué hay en la carpeta

```
LetraCristiana/                        ← raíz (OneDrive)
├── Script_LC_Artistas-Tabs.js         ← público — página "Artistas"
├── CSS_LC_Artistas-Tabs.css           ← público
├── Script_LC_Tematicas-Auto.js        ← público — página "Temáticas"
├── CSS_LC_Tematicas-Index.css         ← público
├── LC_config_etiquetas.json           ← público — temáticas y excluidas
├── LC_imagenes.json                   ← público — imágenes postimg
├── CSS_LC_Entrada.css                 ← público — cada entrada (108 posts)
├── Script_LC_Copy-Letra.js            ← público — botón Copiar
├── CSS_LC_List-Artist.css             ← público — páginas legacy
├── Script_LC_Lista-Artistas.js        ← público — ídem
├── LC_Pagina_Tematica.css             ← público — páginas legacy de temática
├── LC_Pagina_Tematica.js              ← público — ídem
├── README.md                          ← público
├── .gitignore                         ← público
├── docs/                              ← público (esta documentación)
│
├── Canciones por ingresar/            ← privado — .docx/.pdf por publicar
├── Copias de Seguridad/               ← privado — respaldos del blog (XML)
├── Correos & Redes/                   ← privado — cuentas, NUNCA subir
├── Generador de Letras/               ← privado — app + HTML del generador
├── Ideas/                             ← privado — referencia (himnarios, etc.)
├── Imágenes/                          ← privado — las del blog viven en postimg
├── Plantillas/                        ← privado — formatos de entrada/páginas
├── Publicaciones en Redes/            ← privado
├── Script Copy/                       ← privado
├── Template/                          ← privado — plantilla AirMag original
└── Automatizacion/                    ← privado
    ├── Blogger/                       ← HTML a pegar en páginas de Blogger
    └── Template/                      ← AirMag-LetraCristiana-FINAL.xml
```

## Flujo de trabajo

### Editar un asset web (CSS/JS/JSON)

1. Edita el archivo en la raíz de la carpeta.
2. `git commit` + `git push` a `main`.
3. El blog lo toma automáticamente (JSON ~5 min; CSS/JS: purgar caché de
   jsDelivr si necesitas verlo ya). Ver [Mantenimiento.md](Mantenimiento.md).

### Publicar una canción nueva

1. Redacta la entrada en Blogger usando las plantillas de `Plantillas/`.
2. Etiqueta con artista + temática (+ letra suelta si aún usas el A-Z).
3. Nada más: las páginas Artistas/Temáticas se actualizan solas.

### Restaurar la plantilla del blog

- Usar SOLO `Automatizacion/Template/AirMag-LetraCristiana-FINAL.xml`.
- NUNCA la plantilla pristina demo (borra menú y widgets). Ver
  [Despliegue.md](Despliegue.md).

## Reglas de oro

1. **Nunca fuerces con `git add -f`** un archivo dentro de las carpetas
   privadas — el `.gitignore` las excluye a propósito.
2. **Repo siempre público.** No subir nunca nada de `Correos & Redes/`,
   `Canciones por ingresar/`, respaldos ni plantillas completas.
3. Revisa `git status --ignored` si tienes dudas sobre qué queda fuera de git.
