# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Sitio público de Crisopa (`crisopa.app`): Astro 5 estático + Tailwind 4, desplegado en Vercel desde `main`. La aplicación está en otro repo (`crisopa-app`, servida en `panel.crisopa.app`). Todo el código, los comentarios, el copy y los mensajes de commit van en español.

## Comandos

- `npm run dev` — desarrollo en `localhost:4321`.
- `npm run build` — genera `dist/`. Es la única verificación que hay: no hay tests, linter ni `astro check` instalados. Después de cualquier cambio, compilar.
- `npm run preview` — sirve `dist/`.
- `node scripts/volcar-plagas.mjs` — regenera `src/data/plagas.json` desde la base de datos. Solo a mano, nunca en el build: usa el Prisma y el `.env` de `../crisopa-app` y la lista de pares de `~/dev/projects/Crisopa/seo/paginas-prioritarias.csv`. El JSON resultante se commitea.
- `node scripts/imagenes-marca.mjs` — regenera `og-image-v2.png`, `logo.png`, `apple-touch-icon.png` y `favicon.svg` en `public/` a partir de los tokens (Chrome headless + `sharp`). Esas imágenes no se editan a mano.

Commits en Conventional Commits con ámbito y descripción en español: `feat(hero): …`, `fix(estilos): …`, `docs(marca): …`, `copy(conectores): …`.

## Documentos que mandan

Léelos antes de tocar lo que cubren; el código los sigue y ellos siguen al código.

- `README.md` — arquitectura, SEO técnico y el corpus de plagas, con las decisiones que no hay que deshacer sin pensarlo.
- `DESIGN_SYSTEM.md` — sistema visual de la web (la app tiene el suyo en `crisopa-app/docs/DESIGN_SYSTEM.md`; los fundamentos compartidos están marcados al principio). Su sección **Implementación** mapea cada regla a su clase, token o componente, y exige mantener ambos sincronizados: si cambias una regla en el código, cambia la guía, y al revés. Tiene una checklist «Antes de publicar».
- `brand-voice.md` — voz y copy. Se le habla al asesor agronómico, nunca al agricultor.
- `.claude/product-marketing-context.md` — producto, audiencia, objeciones y precios, para trabajo de copy/CRO.
- `PENDIENTE-WEB.md` — lo que falta en la web y en qué orden.

## Arquitectura

**Dos tipos de página con objetivos distintos.** La home y `/precios` son de conversión (reservar demo) y no se optimizan para SEO a costa del copy. `/plagas/…` es un corpus SEO de captación: tres plantillas (`pages/plagas/index.astro`, `[plaga]/index.astro`, `[plaga]/[cultivo].astro`) que `getStaticPaths()` multiplica leyendo `lib/plagas.ts` sobre `data/plagas.json`. En producción no hay base de datos: solo HTML. `/hola` y `/demo` son `noindex` y están excluidas del sitemap en `astro.config.mjs`; si se añade otra página `noindex`, hay que añadirla a ese filtro también.

**`Layout.astro` es el esqueleto común**: meta, canonical y `og:url` desde `Astro.site`, un único grafo JSON-LD (`WebSite` + `Organization` + lo que la página pase en la prop `schema`, construido con `lib/schema.ts`), los raíles `.page > .frame` y el `IntersectionObserver` de `[data-animate]`.

**La home es una composición de secciones** (`src/components/`, una por bloque). La numeración de las etiquetas (`n="01"`…) la asigna `pages/index.astro` según el orden de montaje: si se reordena o se añade una sección, se renumera ahí. Hero, `Positioning` y `CTA` no llevan número.

**Estilos**: los tokens (verde de marca, neutros teñidos, oscuros, estado, radios, sombras, `ease-brand`) viven en `src/styles/global.css` y se exponen como utilidades de Tailwind (`bg-line`, `text-foreground-muted`, `bg-dark-background`…). Nunca grises por defecto de Tailwind (`gray-*`, `slate-*`…) ni radios/sombras fuera de la escala. Las estructuras de sección son clases propias (`.sec`, `.sec-dark`, `.sec-head`, `.cells`, `.font-data`…), no utilidades sueltas. Todo lo que se anime debe respetar `prefers-reduced-motion` (bloque al final de `global.css` y comprobación en el script de cada demo).

**React está integrado pero no se usa**: ningún componente lleva `client:*`. Todo es `.astro` con scripts en línea; las demos (`HeroDemo.astro`, `Showcase.astro`) son JS propio con Web Animations API.

## Acoplamientos que no se ven desde un solo archivo

- Precios: si cambias `Pricing.astro`, cambia también `softwareApplicationSchema` en `lib/schema.ts` (Search Console avisa de precios desactualizados).
- Fechas del MAPA: `REGISTRO_MAPA_SINCRONIZADO` y `FUENTE_MAPA` en `lib/mapa.ts` (de ahí deriva la fecha de la demo); `ACTUALIZADO_MAPA` en `lib/plagas.ts` para el corpus. La fecha del volcado se muestra en las tres plantillas de plagas a propósito.
- Imagen social: si cambia, cambia su nombre de archivo y `image` en `Layout.astro` (las apps la cachean por URL).
- Identidad legal (RGPD/LSSI): solo en `lib/identidad.ts`.
- La condición del apilado del hero está duplicada: CSS en `Hero.astro` y `STACK_QUERY` en `HeroDemo.astro`.

## Datos de las demos y del corpus

- Los productos que aparecen en las demos son reales y están comprobados contra la ficha del MAPA (p. ej. Karate Zeon nº 22398 y Score 25 EC nº 18767 en almendro en `HeroDemo.astro`). No se cambian ni se inventan sin comprobarlos; el MCP de Crisopa (`leer_ficha_registro`, `buscar_productos_autorizados`) sirve para verificarlos.
- Cultivos de ejemplo: naranjo y almendro. Nada de tomate ni hortícolas de invernadero.
- El corpus solo publica registros vigentes y no caducados, y no genera página para pares con menos de 5 productos. Ambos filtros están en `volcar-plagas.mjs` y no son cosméticos.
