/**
 * Colecciones de la capa editorial del corpus de plagas.
 *
 * La prosa vive aquí y los datos en `src/data/plagas.json`: son dos raíles que
 * nunca escriben en el mismo sitio, así que el volcado semanal del registro y
 * el trabajo editorial no pueden pisarse. Ver `docs/pipeline-editorial.md`.
 *
 * Las FAQ van en el frontmatter y no en el cuerpo a propósito: de ese array
 * salen a la vez el acordeón visible y el `FAQPage` de datos estructurados. Un
 * marcado que no reproduce lo que se ve es spam de datos estructurados, y la
 * única forma segura de que no diverjan es que no haya dos fuentes.
 */

import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const faq = z.object({
  pregunta: z.string(),
  respuesta: z.string(),
})

/** Campos comunes: el H1 y las migas los sigue poniendo la plantilla. */
const comun = {
  /** Entradilla de dos o tres frases, antes del primer H2. */
  entradilla: z.string(),
  faqs: z.array(faq).min(3).max(6),
  /** Fecha de generación, para saber qué tanda es cada ficha. */
  generada: z.coerce.date().optional(),
}

const plagas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/plagas' }),
  schema: z.object(comun),
})

/**
 * Un fichero por par, en `<plaga>/<cultivo>.md`, de forma que el id de la
 * entrada sea `repilo-del-olivo/olivo` y case con la ruta de la página.
 */
const pares = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pares' }),
  schema: z.object(comun),
})

export const collections = { plagas, pares }
