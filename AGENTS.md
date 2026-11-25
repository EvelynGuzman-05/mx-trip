# AGENTS.md — Guía técnica y convenciones de MX TRIP

Este documento sirve como referencia técnica y de convenciones para el equipo de desarrollo y los asistentes de IA que trabajen en **MX TRIP**.

---

## 1. Resumen del proyecto y stack tecnológico

**MX TRIP** es un catálogo turístico estático de destinos (México, Centroamérica y Sudamérica) con búsqueda, filtrado, paginación y gestión de favoritos en el cliente.

- **Framework:** Astro (`^7.4.13`) con generación estática (`dist/`) y `trailingSlash: "always"` configurado en `astro.config.mjs`.
- **Interactividad (Islands Architecture):** Vue 3 (`^3.5.46`) mediante `@astrojs/vue`.
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`) e `Inter` (Google Fonts).
- **Iconografía:** FontAwesome 6.4.0 (cargado por CDN en `src/layouts/Layout.astro`).
- **Lenguaje:** TypeScript.
- **Entorno y despliegue:** Node.js `>=22.23.4`, desplegado como sitio estático en **Cloudflare Pages** (directorio de salida `dist/`).

---

## 2. Comandos principales

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local de Astro. |
| `npm run build` | Genera el sitio estático de producción en `dist/`. |
| `npm run preview` | Previsualiza localmente el build generado en `dist/`. |
| `npx astro check` | Ejecuta la verificación de tipos de TypeScript y plantillas `.astro`. |

> **Nota para asistentes de IA (servidor en segundo plano):** Cuando inicies el servidor de desarrollo desde terminal, usa `astro dev --background` y gestiónalo con `astro dev stop`, `astro dev status` y `astro dev logs`.

---

## 3. Arquitectura y estructura de carpetas

```text
src/
├── assets/        # Recursos gráficos estáticos (SVG, imágenes locales)
├── components/    # Componentes UI estáticos (.astro) e islas interactivas (.vue)
├── data/          # Datos estáticos del catálogo (data.ts: destinationsData, ITEMS_PER_PAGE)
├── layouts/       # Plantillas base HTML (Layout.astro: head, meta tags, fuentes, estilos)
├── pages/         # Rutas de Astro (index.astro, destino/[slug].astro con getStaticPaths)
├── sections/      # Secciones de página de alto nivel (ej. Hero.astro)
├── stores/        # Estado reactivo compartido en cliente (catalogStore.ts)
├── styles/        # Estilos globales e importación de Tailwind (global.css)
└── types/         # Definiciones e interfaces TypeScript (Destination.ts)
```

- **`src/pages/`**: Define las rutas del sitio. Las rutas dinámicas como `destino/[slug].astro` deben exportar `getStaticPaths` para pre-renderizarse en build time.
- **`src/layouts/`**: Contiene `Layout.astro`, encargado del shell HTML (`lang="es-MX"`), metadatos SEO/OpenGraph y carga de `global.css`, fuentes y FontAwesome.
- **`src/sections/`**: Bloques estructurales compuestos que se insertan en las páginas (por ejemplo, `Hero.astro`).
- **`src/components/`**: Agrupa componentes de interfaz reutilizables:
  - `.astro`: `Nav.astro`, `Footer.astro`.
  - `.vue`: `Catalog.vue`, `SearchBox.vue`, `FavoritesNavButton.vue`, `PaginationControls.vue`.
- **`src/stores/`**: Módulos de estado reactivo con Vue Reactivity API (`catalogStore.ts`).
- **`src/data/`**: Fuente de datos tipada del catálogo (`destinationsData`, `ITEMS_PER_PAGE`).
- **`src/types/`**: Tipos e interfaces compartidas (`Region`, `Category`, `Destination`).

---

## 4. Reglas de Islands Architecture

1. **Componentes `.astro` por defecto (cero JS):** Usa `.astro` para estructura, layouts, navegación estática, footers, secciones informativas y páginas de detalle que no requieran estado interactivo en el navegador.
2. **Islas `.vue` con `client:load`:** Usa componentes `.vue` hidratados con `client:load` desde archivos `.astro` únicamente cuando se necesite interactividad en el cliente (por ejemplo: `SearchBox.vue` en `Hero.astro`, `FavoritesNavButton.vue` en `Nav.astro`, o `Catalog.vue`).
3. **Sin `client:*` en componentes hijos:** Los componentes `.vue` importados y renderizados **dentro** de otra isla `.vue` (como `PaginationControls.vue` dentro de `Catalog.vue`) **no** deben llevar directivas `client:*`. Ya forman parte del mismo árbol hidratado de Vue.

---

## 5. Gestión de estado (`src/stores/catalogStore.ts`)

El estado global compartido entre islas se centraliza en `src/stores/catalogStore.ts`:

- **Referencias reactivas exportadas:**
  - `searchQuery`: texto actual de búsqueda (`ref("")`).
  - `favorites`: lista de IDs de destinos guardados (`ref<string[]>([])`).
  - `showingFavoritesOnly`: bandera para filtrar solo favoritos (`ref<boolean>(false)`).
- **Inicialización segura en SSR/cliente:**
  - Nunca accedas a `window` o `localStorage` en el nivel superior del módulo o durante el renderizado inicial en servidor.
  - Llama a `initStore()` dentro de `onMounted()` en los componentes `.vue` que consuman favoritos; `initStore()` verifica `typeof window !== "undefined"` y lee de forma segura la clave `"destinos_favs_hi"` en `localStorage`.
- **Persistencia y sincronización entre islas:**
  - `toggleFavorite(id)` actualiza `favorites`, guarda el arreglo en `localStorage` (`"destinos_favs_hi"`) y despacha el evento `favorites-updated` en `window`.
  - `toggleFavoritesView()` alterna `showingFavoritesOnly` y despacha `toggle-favorites-view` en `window`.
  - Las islas independientes escuchan `favorites-updated`, `toggle-favorites-view` y `storage` (en `onMounted`, limpiando los listeners en `onUnmounted`) para mantenerse sincronizadas.

---

## 6. Convenciones de código, estilos y Git

### Código y TypeScript
- Usar `<script setup lang="ts">` en todos los componentes `.vue`.
- Tipar props y eventos de forma estricta con `defineProps<{ ... }>()` y `defineEmits<{ ... }>()`, reutilizando las interfaces de `src/types/`.
- Mantener el código limpio y legible, evitando comentarios redundantes que solo repitan lo que el código ya expresa.

### Estilos y eventos (Tailwind CSS)
- Utilizar clases utilitarias de Tailwind CSS directamente en el marcado.
- Usar `max-w-7xl mx-auto px-4` (con variantes responsivas como `sm:px-6 lg:px-8` cuando aplique) para los contenedores principales de página y barra de navegación.
- En botones o controles interactivos ubicados dentro de tarjetas o enlaces (`<a>`), usar `@click.stop.prevent` para evitar que el clic dispare la navegación de la tarjeta padre.

### Flujo de Git y CI
- Trabajar siempre en ramas `feature/*` a partir de `main`.
- Integrar los cambios mediante **Pull Requests hacia `main`**.
- El flujo de CI (`.github/workflows/ci.yml`) valida cada push y PR hacia `main` ejecutando `npm ci` y `npm run build` sobre Node.js 22. Asegúrate de que `npm run build` y `npx astro check` pasen sin errores antes de abrir un PR.

---

## 7. Documentación de referencia (Astro)

Documentación oficial: https://docs.astro.build

- [Páginas, rutas dinámicas y middleware](https://docs.astro.build/en/guides/routing/)
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Componentes de frameworks (Vue)](https://docs.astro.build/en/guides/framework-components/)
- [Estilos y Tailwind CSS](https://docs.astro.build/en/guides/styling/)
