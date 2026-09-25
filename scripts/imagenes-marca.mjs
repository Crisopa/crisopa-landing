// Genera las imágenes de marca de public/ con los tokens de la guía
// (brand-visual.md › Color, El símbolo, Secciones oscuras):
//
// - og-image-v2.png (1200×630): imagen social. Fondo `dark-background` con
//   retícula de puntos, símbolo y acentos en green-400, titular en dos tonos.
// - logo.png (512×512): símbolo en green-600 sobre blanco. Es el `logo` del
//   esquema Organization (Google lo quiere cuadrado).
// - apple-touch-icon.png (180×180): símbolo blanco sobre green-600, a sangre
//   (iOS redondea las esquinas).
// - favicon.svg: símbolo blanco sobre un círculo green-600.
//
// Uso: node scripts/imagenes-marca.mjs
// Requiere Google Chrome (o CHROME=/ruta/al/binario) y conexión para cargar
// las fuentes de Google Fonts.
//
// Si cambia la imagen social, cambia también su nombre (y `image` en
// Layout.astro): WhatsApp, LinkedIn y compañía cachean la miniatura por URL.

import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url))
const CHROME = process.env.CHROME ?? 'google-chrome'

// Tokens de global.css. green-600 también en hex para el favicon: los
// lectores de iconos no garantizan oklch dentro del SVG.
const GREEN_400 = 'oklch(0.700 0.142 170)'
const GREEN_600 = 'oklch(0.530 0.152 170)'
const GREEN_600_HEX = '#00865e'
const DARK_BACKGROUND = 'oklch(0.185 0.026 172)'
const DARK_LINE = 'oklch(0.310 0.030 172)'
const DARK_FOREGROUND_MUTED = 'oklch(0.720 0.020 170)'
const DARK_FOREGROUND = 'oklch(0.965 0.008 170)'

// El símbolo (viewBox 24×24, trazo). Mismo dibujo que CTA.astro.
const SIMBOLO = `
  <path d="M11.264 2.205A4 4 0 0 0 6.42 4.211l-4 8a4 4 0 0 0 1.359 5.117l6 4a4 4 0 0 0 4.438 0l6-4a4 4 0 0 0 1.576-4.592l-2-6a4 4 0 0 0-2.53-2.53z"/>
  <path d="M11.99 22 14 12l7.822 3.184"/>
  <path d="M14 12 8.47 2.302"/>`

const simbolo = (color, grosor = 1.5) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round">${SIMBOLO}</svg>`

const pagina = (ancho, alto, estilos, cuerpo) => /* html */ `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@500&family=Sora:wght@600&display=block" rel="stylesheet" />
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${ancho}px; height: ${alto}px; overflow: hidden; }
  ${estilos}
</style>
</head>
<body>${cuerpo}</body>
</html>`

const imagenSocial = pagina(1200, 630, /* css */ `
  body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 80px;
    background-color: ${DARK_BACKGROUND};
    background-image: radial-gradient(circle at 1px 1px, ${DARK_LINE} 1px, transparent 0);
    background-size: 28px 28px;
    color: ${DARK_FOREGROUND};
    font-family: 'Geist', sans-serif;
  }
  .marca { display: flex; align-items: center; gap: 16px; }
  .marca svg { width: 52px; height: 52px; }
  .marca span { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 40px; letter-spacing: -0.03em; }
  .eyebrow {
    display: inline-flex; align-items: center;
    font-family: 'Geist Mono', monospace; font-weight: 500; font-size: 20px;
    letter-spacing: 0.12em; text-transform: uppercase; color: ${GREEN_400};
  }
  .eyebrow::after {
    content: ''; width: 0.62em; height: 3px; margin-left: 0.4em; background: ${GREEN_400};
  }
  h1 {
    margin-top: 28px;
    font-family: 'Sora', sans-serif; font-weight: 600; font-size: 84px;
    line-height: 1.02; letter-spacing: -0.04em;
  }
  h1 span { color: ${DARK_FOREGROUND_MUTED}; }
  .pie {
    font-family: 'Geist Mono', monospace; font-weight: 500; font-size: 22px;
    color: ${DARK_FOREGROUND_MUTED};
  }`, /* html */ `
  <div class="marca">${simbolo(GREEN_400)}<span>Crisopa</span></div>
  <div>
    <p class="eyebrow">Para asesores agronómicos</p>
    <h1>Tu copiloto agronómico.<br /><span>Con ChatGPT y Claude.</span></h1>
  </div>
  <p class="pie">crisopa.app</p>`)

// Símbolo centrado sobre un fondo liso; `lado` es el tamaño del símbolo en
// fracción del lienzo (el resto, espacio de respeto).
const icono = (tam, fondo, color, lado) => pagina(tam, tam, /* css */ `
  body { display: grid; place-items: center; background: ${fondo}; }
  svg { width: ${Math.round(tam * lado)}px; height: ${Math.round(tam * lado)}px; }`,
  simbolo(color))

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="16" fill="${GREEN_600_HEX}"/>
  <g transform="translate(6 6) scale(0.83)" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SIMBOLO}
  </g>
</svg>
`

const dir = mkdtempSync(join(tmpdir(), 'marca-'))

async function capturar(html, ancho, alto, salida) {
  const plantilla = join(dir, `${salida}.html`)
  const captura = join(dir, salida)
  writeFileSync(plantilla, html)
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${ancho},${alto}`,
    // Da tiempo a que carguen las fuentes antes de capturar.
    '--virtual-time-budget=10000',
    `--screenshot=${captura}`,
    `file://${plantilla}`
  ], { stdio: 'ignore' })
  await sharp(captura).resize(ancho, alto).png({ compressionLevel: 9, palette: true }).toFile(join(PUBLIC, salida))
  console.log(`public/${salida}`)
}

try {
  await capturar(imagenSocial, 1200, 630, 'og-image-v2.png')
  await capturar(icono(512, 'white', GREEN_600, 0.6), 512, 512, 'logo.png')
  await capturar(icono(180, GREEN_600, 'white', 0.62), 180, 180, 'apple-touch-icon.png')
  writeFileSync(join(PUBLIC, 'favicon.svg'), favicon)
  console.log('public/favicon.svg')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
