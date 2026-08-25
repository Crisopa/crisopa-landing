// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// `site` es obligatorio para que Astro genere URLs absolutas: de ahí salen el
// sitemap y la etiqueta canonical del Layout. Sin él no hay ni una cosa ni otra.
export default defineConfig({
  site: 'https://crisopa.app',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      // Las páginas con `noindex` no entran en el sitemap: pedirle a Google que
      // rastree lo que luego le decimos que no indexe son señales contradictorias.
      filter: (page) => !['/demo/', '/hola/'].includes(new URL(page).pathname)
    })
  ]
});
