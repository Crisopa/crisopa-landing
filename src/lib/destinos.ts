/**
 * Contraste entre los dos destinos comerciales de un mismo cultivo.
 *
 * El registro del MAPA no autoriza «olivo»: autoriza «olivo de verdeo» y
 * «olivo de almazara» por separado, y lo mismo con la vid. Tratarlos como dos
 * cultivos ajenos deja 22 páginas casi calcadas y, peor, esconde el dato que de
 * verdad se consulta: qué cambia al pasar de uno a otro. Un plazo de seguridad
 * de 28 días en verdeo y 105 en almazara para el mismo producto no es un
 * detalle, decide si se puede recolectar.
 *
 * Vive aparte de `plagas.ts` porque es lógica pura y así se prueba con el
 * runner de Node, que no sabe resolver el import del JSON de datos.
 */

/** Lo mínimo que este módulo necesita saber de un producto. */
export interface ProductoComparable {
  nombre: string
  registro: string
  dosisMin: number | null
  dosisMax: number | null
  dosisUnidad: string | null
  plazo: number | null
  maxAplicaciones: number | null
  intervalo: number | null
}

/** Lo mínimo que necesita saber de un par cultivo × plaga. */
export interface ParComparable {
  plagaSlug: string
  cultivo: string
  cultivoSlug: string
  productos: ProductoComparable[]
}

export type Campo = 'dosis' | 'plazo' | 'aplicaciones' | 'intervalo'

export interface Cambio<P extends ProductoComparable = ProductoComparable> {
  /** El producto tal y como está autorizado en el cultivo de esta página. */
  aqui: P
  /** El mismo número de registro en el otro destino. */
  alla: P
  campos: Campo[]
}

export interface Contraste<P extends ProductoComparable = ProductoComparable> {
  /** El otro destino del mismo cultivo. */
  otro: { cultivo: string; cultivoSlug: string }
  /** Cómo llamar a la pareja en el cuerpo del texto: «el olivo», «la vid». */
  especie: string
  /** Por qué el registro los separa. Dato de norma, no redacción generada. */
  motivo: string
  /** Autorizados aquí y no allá. */
  soloAqui: P[]
  /** Autorizados allá y no aquí: lo que esta página no puede ofrecer. */
  soloAlla: P[]
  /** Mismo producto en ambos, con algún dato distinto. */
  cambios: Cambio<P>[]
}

interface Familia {
  destinos: readonly [string, string]
  especie: string
  motivo: string
}

/**
 * Las especies que el registro parte en dos destinos.
 *
 * Lista cerrada y escrita a mano a propósito: emparejar por nombre parecido
 * juntaría limonero con naranjo, que comparten casi todos los productos pero
 * son especies distintas. Ahí el duplicado no se resuelve contrastando, sino
 * con la prosa editorial, que sí difiere porque la fenología difiere.
 */
export const FAMILIAS: readonly Familia[] = [
  {
    destinos: ['Olivo de verdeo', 'Olivo de almazara'],
    especie: 'el olivo',
    motivo:
      'La aceituna de mesa se consume entera y la de almazara se transforma en aceite, así que la norma europea de residuos las trata como productos distintos y les fija límites y plazos por separado.',
  },
  {
    destinos: ['Vid de vinificación', 'Vid de mesa'],
    especie: 'la vid',
    motivo:
      'La uva de mesa llega al consumidor sin transformar y la de vinificación pasa por la bodega, de modo que el registro fija para cada destino sus propios límites de residuo y, con ellos, sus dosis y plazos.',
  },
]

/** El otro destino de este cultivo, si el registro lo parte en dos. */
export function familiaDe(cultivo: string): Familia | null {
  return FAMILIAS.find((f) => f.destinos.includes(cultivo)) ?? null
}

function distinto(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null)
}

/** Qué datos del registro cambian para un mismo producto entre destinos. */
export function camposQueCambian(a: ProductoComparable, b: ProductoComparable): Campo[] {
  const campos: Campo[] = []
  if (
    distinto(a.dosisMin, b.dosisMin) ||
    distinto(a.dosisMax, b.dosisMax) ||
    distinto(a.dosisUnidad, b.dosisUnidad)
  )
    campos.push('dosis')
  if (distinto(a.plazo, b.plazo)) campos.push('plazo')
  if (distinto(a.maxAplicaciones, b.maxAplicaciones)) campos.push('aplicaciones')
  if (distinto(a.intervalo, b.intervalo)) campos.push('intervalo')
  return campos
}

/**
 * Compara este par con el mismo par en el otro destino del cultivo.
 *
 * Devuelve `null` cuando el cultivo no se parte en destinos o cuando el gemelo
 * no tiene página: sin las dos mitades no hay nada honesto que contrastar.
 */
export function contraste<P extends ProductoComparable>(
  par: ParComparable & { productos: P[] },
  pares: readonly (ParComparable & { productos: P[] })[]
): Contraste<P> | null {
  const familia = familiaDe(par.cultivo)
  if (!familia) return null

  const otroCultivo = familia.destinos.find((d) => d !== par.cultivo)
  if (!otroCultivo) return null

  const gemelo = pares.find((p) => p.plagaSlug === par.plagaSlug && p.cultivo === otroCultivo)
  if (!gemelo) return null

  const alla = new Map(gemelo.productos.map((p) => [p.registro, p]))
  const aqui = new Map(par.productos.map((p) => [p.registro, p]))

  const soloAqui = par.productos.filter((p) => !alla.has(p.registro))
  const soloAlla = gemelo.productos.filter((p) => !aqui.has(p.registro))

  const cambios: Cambio<P>[] = []
  for (const p of par.productos) {
    const q = alla.get(p.registro)
    if (!q) continue
    const campos = camposQueCambian(p, q)
    if (campos.length) cambios.push({ aqui: p, alla: q, campos })
  }

  return {
    otro: { cultivo: gemelo.cultivo, cultivoSlug: gemelo.cultivoSlug },
    especie: familia.especie,
    motivo: familia.motivo,
    soloAqui,
    soloAlla,
    cambios,
  }
}

/** Si no hay ninguna diferencia, la respuesta —«no cambia nada»— también vale. */
export function sinDiferencias(c: Contraste): boolean {
  return c.soloAqui.length === 0 && c.soloAlla.length === 0 && c.cambios.length === 0
}
