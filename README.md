# crisopa-landing

Sitio público de [Crisopa](https://crisopa.app), en Astro 5 con Tailwind 4 y algún
componente React suelto. Se despliega en Vercel desde `main`.

La aplicación vive aparte, en `panel.crisopa.app` (repo `crisopa-app`).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio estático en `./dist/` |
| `npm run preview` | Sirve `./dist/` para revisarlo antes de desplegar |
| `node scripts/volcar-plagas.mjs` | Regenera los datos del corpus de plagas (ver abajo) |

## Estructura

```
src/
├── pages/
│   ├── index.astro          landing principal — página de conversión
│   ├── hola.astro           landing de campaña (noindex)
│   ├── demo.astro           vídeos del conector de ChatGPT (noindex)
│   ├── precios.astro
│   ├── {privacidad,terminos,cookies,soporte}.astro
│   └── plagas/              corpus SEO — ver más abajo
├── components/              secciones de la home, una por bloque
├── layouts/
│   ├── Layout.astro         <head> común: meta, canonical, JSON-LD
│   └── Legal.astro          plantilla de las páginas legales
├── lib/
│   ├── identidad.ts         datos del responsable (RGPD, LSSI)
│   ├── faqs.ts              preguntas de la home
│   ├── schema.ts            datos estructurados (schema.org)
│   └── plagas.ts            acceso al corpus
└── data/plagas.json         datos volcados del registro del MAPA
```

## Dos públicos, dos tipos de página

Conviene tener presente la separación, porque explica casi todas las decisiones
del sitio:

- **La home y `/precios` son páginas de conversión.** Reciben tráfico que ya
  conoce Crisopa (marca, anuncios, referidos) y su trabajo es que reserve una
  demo. No se optimizan para buscadores a costa del copy.
- **`/plagas/…` es un corpus de captación.** Recibe tráfico frío que no busca
  Crisopa, sino una tabla de productos autorizados. Le da lo que busca y, al
  final, le presenta el producto.

Por eso el CTA de las páginas de plaga va **después** de la tabla, y por eso la
home no se llenó de texto orientado a palabras clave.

## SEO técnico

Está en `Layout.astro` y aplica a todas las páginas:

- `canonical` y `og:url` calculados por página desde `Astro.site`
  (definido en `astro.config.mjs`; sin él no hay canonical ni sitemap).
- JSON-LD en un solo grafo por página: `WebSite` + `Organization` siempre, más
  lo que añada cada página vía la prop `schema`.
- Sitemap generado por `@astrojs/sitemap`, filtrando lo que lleva `noindex`.

`public/robots.txt` **no bloquea nada a propósito**. Las landings de campaña se
mantienen fuera del índice con `noindex` en la propia página, y para que Google
llegue a leer esa etiqueta necesita poder rastrearlas: un `Disallow` se lo
impediría y acabarían indexadas igualmente, solo que sin descripción.

Si se toca `Pricing.astro`, hay que tocar también los precios de
`softwareApplicationSchema` en `lib/schema.ts`. Un precio desactualizado en el
marcado es motivo de aviso en Search Console.

## El corpus de plagas

95 páginas en tres niveles, generadas por **tres plantillas**:

| Plantilla | Páginas | Qué es |
|---|---:|---|
| `pages/plagas/index.astro` | 1 | Hub. Enlazado desde el footer |
| `pages/plagas/[plaga]/index.astro` | 26 | Una plaga, reparte hacia sus cultivos |
| `pages/plagas/[plaga]/[cultivo].astro` | 68 | El listado de productos autorizados |

El multiplicador es `getStaticPaths()`: lee los pares de `lib/plagas.ts` y Astro
emite un HTML por cada uno durante el build.

### Cómo fluyen los datos

```
Base de datos (esquema mapa)
        │  scripts/volcar-plagas.mjs   ← a mano, no en cada build
        ▼
src/data/plagas.json                   ← commiteado en el repo
        │  npm run build
        ▼
95 ficheros .html estáticos
```

**En producción no hay base de datos ni script**, solo HTML en el CDN. El
volcado se ejecuta a mano a propósito: si el build dependiera de producción, un
día que la base de datos tarde en responder no se podría desplegar la landing.

### Actualizar el registro

Cuando cambien las autorizaciones del MAPA:

```bash
node scripts/volcar-plagas.mjs
npm run build                 # comprobar que sigue compilando
git commit -am "chore: actualiza el registro del MAPA"
```

El script lee las credenciales del `.env` de `crisopa-app` y la lista de pares
de `~/dev/projects/Crisopa/seo/paginas-prioritarias.csv`.

### Decisiones que conviene no deshacer sin pensarlo

- **Solo se publican registros vigentes y no caducados.** Presentar como
  «autorizado» un producto cancelado induce a un tratamiento ilegal. El filtro
  está en la consulta de `volcar-plagas.mjs` y no es cosmético.
- **La fecha del volcado se muestra en las tres plantillas.** Un vademécum sin
  fecha no vale nada: el asesor necesita saber a qué día corresponde lo que lee.
- **Los pares con menos de 5 productos vigentes no generan página.** Un listado
  casi vacío es el «contenido a escala sin valor» que Google penaliza, y el
  riesgo real en un dominio joven no es la sanción sino que deje las URLs en
  «Descubierta: actualmente sin indexar».
- **El hub se enlaza desde el footer.** Sin un enlace desde una página que
  Google ya rastrea, las 95 URLs quedan huérfanas.

### Crecer el corpus

Para pasar de 68 pares a más no hay que tocar ninguna plantilla: basta con
ampliar la lista que lee el script. La base de datos tiene **13.442 pares** con
tres o más productos autorizados; estos 68 son el primer tramo, elegido por
demanda de búsqueda medida. Conviene publicar por tramos y comprobar en Search
Console que se indexan antes de soltar el siguiente.

## De dónde salen las prioridades

La investigación de palabras clave está en `~/dev/projects/Crisopa/seo`
(`README.md`, `keywords.csv`, `paginas-prioritarias.csv`). El resumen:
el cluster aprovechable es `fito_plaga`, con 12.110 búsquedas/mes, frente a las
~700 comerciales de «cuaderno de campo». De ahí que el corpus vaya de plagas y
no de software.
