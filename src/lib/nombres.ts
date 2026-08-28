/**
 * Reparto del nombre de plaga que da el registro del MAPA.
 *
 * Vive aparte de `plagas.ts` porque es lógica pura: así se puede probar con el
 * runner de Node, que no sabe resolver el import del JSON de datos.
 */

/**
 * Nombres científicos de una sola palabra: familias, subfamilias y tribus.
 *
 * El volcado separa el binomial latino final («Venturia oleaginea») pero exige
 * dos palabras, así que un taxón como «Pseudococcidae» se queda pegado al
 * nombre común y acaba dentro de un título: «Productos autorizados para
 * cochinillas harinosas, pseudococcidae en naranjo».
 */
const TAXON_SUELTO = /^[A-Z][a-z]+(idae|inae|aceae|ales|ini)$/

export interface NombrePlaga {
  /** El nombre con el que se titula: el primero, que es el que busca la gente. */
  principal: string
  /** Los demás nombres comunes que da el registro. Van como apoyo, no en el H1. */
  sinonimos: string[]
  cientifico: string | null
}

/**
 * Reparte el nombre que da el MAPA en lo que cada sitio necesita.
 *
 * El registro nombra los agentes acumulando sinónimos: «Algodón del olivo,
 * tramilla», «Aceituna jabonosa, antracnosis». Encadenarlos en un título da
 * frases que no dice nadie —«algodón del olivo, tramilla en otros cultivos»—,
 * así que el título se queda con el primero y el resto se muestra aparte.
 *
 * No toca los slugs: las URLs ya están indexadas y siguen saliendo del nombre
 * completo.
 */
export function nombrePlaga(plaga: string, cientifico: string | null): NombrePlaga {
  const trozos = plaga.split(',').map((t) => t.trim()).filter(Boolean)

  // Un taxón suelto al final es nombre científico, no otro nombre común.
  let latino = cientifico
  if (!latino && trozos.length > 1 && TAXON_SUELTO.test(trozos[trozos.length - 1])) {
    latino = trozos.pop()!
  }

  return { principal: trozos[0] ?? plaga, sinonimos: trozos.slice(1), cientifico: latino }
}

/** «Algodón del olivo (también tramilla)», para el cuerpo de la página. */
export function conSinonimos(n: NombrePlaga): string {
  if (!n.sinonimos.length) return n.principal
  return `${n.principal} (también ${n.sinonimos.join(', ').toLowerCase()})`
}
