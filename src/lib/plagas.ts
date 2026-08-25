/**
 * Acceso a los datos de plagas volcados del registro del MAPA.
 *
 * El JSON lo genera `scripts/volcar-plagas.mjs` y está commiteado: el build no
 * habla con la base de datos. Ver la cabecera de ese script.
 */

import datos from '../data/plagas.json'

export interface Producto {
  nombre: string
  registro: string
  titular: string | null
  formulado: string | null
  sustancias: string | null
  eco: boolean
  dosisMin: number | null
  dosisMax: number | null
  dosisUnidad: string | null
  plazo: number | null
  maxAplicaciones: number | null
  intervalo: number | null
  metodos: string[]
}

export interface Par {
  plagaMapa: string
  plaga: string
  cientifico: string | null
  plagaSlug: string
  cultivo: string
  cultivoSlug: string
  volumenKw: number
  productos: Producto[]
}

export const ACTUALIZADO_MAPA: string = datos.actualizado
export const PARES = datos.pares as Par[]

/** La fecha del volcado en castellano; el ISO no se lee bien en el cuerpo. */
export const ACTUALIZADO_TEXTO: string = new Date(`${datos.actualizado}T00:00:00Z`).toLocaleDateString(
  'es-ES',
  { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
)

/** Todas las plagas, con los cultivos que tienen página, más buscadas primero. */
export function plagas() {
  const porSlug = new Map<string, { plaga: string; cientifico: string | null; slug: string; volumenKw: number; pares: Par[] }>()
  for (const par of PARES) {
    let entrada = porSlug.get(par.plagaSlug)
    if (!entrada) {
      entrada = { plaga: par.plaga, cientifico: par.cientifico, slug: par.plagaSlug, volumenKw: par.volumenKw, pares: [] }
      porSlug.set(par.plagaSlug, entrada)
    }
    entrada.pares.push(par)
  }
  for (const entrada of porSlug.values()) {
    entrada.pares.sort((a, b) => b.productos.length - a.productos.length)
  }
  return [...porSlug.values()].sort((a, b) => b.volumenKw - a.volumenKw)
}

export function plagaPorSlug(slug: string) {
  return plagas().find((p) => p.slug === slug)
}

/**
 * Separador de millar con punto. No se usa `toLocaleString('es-ES')` porque
 * depende de que el Node que construye tenga ICU completo, y sin él devuelve
 * el número sin separar.
 */
export function millar(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Formatea la dosis de un uso tal y como conviene leerla en la tabla. */
export function dosisTexto(p: Producto): string {
  const { dosisMin: min, dosisMax: max, dosisUnidad: unidad } = p
  if (min === null && max === null) return '—'
  const u = unidad ?? ''
  if (min !== null && max !== null && min !== max) return `${min}–${max} ${u}`.trim()
  return `${max ?? min} ${u}`.trim()
}

/** Plazo de seguridad en días, o el guion si el registro no lo fija. */
export function plazoTexto(p: Producto): string {
  if (p.plazo === null) return '—'
  return p.plazo === 0 ? 'Sin plazo' : `${p.plazo} días`
}
