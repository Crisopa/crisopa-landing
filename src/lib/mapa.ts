/**
 * Datos del Registro Oficial de Productos Fitosanitarios (MAPA) que la web
 * muestra como prueba visible (brand-visual.md › El dato vivo del MAPA).
 *
 * Fecha de la última sincronización del registro que se enseña en la barra de
 * la ventana de producto y en el sello de fuente de la demo. Única fuente: si
 * cambia, se cambia aquí. Formato ISO (YYYY-MM-DD).
 *
 * El corpus de /plagas no la usa: sus tablas salen de un volcado con fecha
 * propia (`ACTUALIZADO_MAPA` en lib/plagas.ts), y el sello de esas páginas
 * dice la fecha real de sus datos.
 */
export const REGISTRO_MAPA_SINCRONIZADO = '2026-09-24'

/** Día siguiente a una fecha ISO, en ISO. Sin zona horaria: día natural. */
export function diaSiguiente(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Fecha de la orden de tratamiento de la demo. El asesor la pide «para
 * mañana», así que es el día siguiente a la sincronización: la demo cuadra
 * sola cuando cambia la fecha de arriba.
 */
export const FECHA_ORDEN_DEMO = diaSiguiente(REGISTRO_MAPA_SINCRONIZADO)

/** Texto del sello de fuente (brand-visual.md › El dato vivo del MAPA). */
export const FUENTE_MAPA = 'Fuente: Registro Oficial de Productos Fitosanitarios · MAPA'
