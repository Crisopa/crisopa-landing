/**
 * Datos estructurados (JSON-LD, schema.org) del sitio.
 *
 * Regla que conviene no romper: aquí solo va información que también está
 * visible en la página. Un marcado que promete algo que el usuario no encuentra
 * al llegar es exactamente lo que Google penaliza como spam de datos
 * estructurados, y se arriesga a perder los rich results de todo el dominio.
 */

import { IDENTIDAD } from './identidad'

const SITIO = 'https://crisopa.app'

/** `@id` estable de la organización, para que el resto del grafo la referencie. */
export const ORGANIZATION_ID = `${SITIO}/#organizacion`

/**
 * El responsable es una persona física (ver `identidad.ts`), pero de cara al
 * buscador Crisopa opera como marca: `Organization` describe al emisor del
 * sitio, que es lo que Google espera en el panel de conocimiento.
 */
export const organizationSchema = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Crisopa',
  url: SITIO,
  logo: `${SITIO}/og-image.png`,
  description:
    'Copiloto agronómico con IA para asesores y técnicos de campo: tratamientos, abonado, riego y cuaderno de campo digital.',
  founder: {
    '@type': 'Person',
    name: IDENTIDAD.responsable,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Córdoba',
    addressCountry: 'ES',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'soporte@crisopa.app',
    availableLanguage: 'Spanish',
  },
}

/** Grafo base, presente en todas las páginas. */
export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITIO}/#sitio`,
  url: SITIO,
  name: 'Crisopa',
  inLanguage: 'es-ES',
  publisher: { '@id': ORGANIZATION_ID },
}

/**
 * Los precios replican los de `Pricing.astro`. Si cambian allí, cambian aquí:
 * un precio desactualizado en el marcado es motivo de aviso en Search Console.
 */
export const softwareApplicationSchema = {
  '@type': 'SoftwareApplication',
  '@id': `${SITIO}/#app`,
  name: 'Crisopa',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Software agronómico',
  operatingSystem: 'Web',
  url: SITIO,
  publisher: { '@id': ORGANIZATION_ID },
  description:
    'Cuaderno de campo digital y motor agronómico que se maneja hablando con ChatGPT o Claude. Cumple el RD 1311/2012.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Plan mensual',
      price: '49',
      priceCurrency: 'EUR',
      category: 'subscription',
    },
    {
      '@type': 'Offer',
      name: 'Plan superior',
      price: '99',
      priceCurrency: 'EUR',
      category: 'subscription',
    },
  ],
}

/**
 * Migas de pan. Es el marcado que más rinde en estas páginas: Google sustituye
 * la URL del resultado por la ruta legible, y en una jerarquía profunda como
 * /plagas/repilo-del-olivo/olivo-de-almazara eso mejora el CTR.
 */
export function breadcrumbSchema(items: { nombre: string; ruta: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nombre,
      item: `${SITIO}${item.ruta}`,
    })),
  }
}

/**
 * Construye un `FAQPage` a partir del mismo array que pinta el acordeón, para
 * que el marcado y lo que se ve no puedan desincronizarse.
 */
export function faqSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITIO}/#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
