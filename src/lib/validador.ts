/**
 * Validador de las fichas editoriales del corpus de plagas.
 *
 * Sustituye a la revisión humana, que se descartó a propósito: ver
 * `docs/pipeline-editorial.md`. Corre entre redactar y guardar, no gasta una
 * sola llamada al modelo y decide qué ficha entra en el sitio.
 *
 * La regla que sostiene todo el diseño es una sola: la prosa no emite cifras.
 * Dosis y plazos los pinta Astro desde `plagas.json`, que viene del registro del
 * MAPA. Una alucinación puede estropear un párrafo; jamás un dato de aplicación.
 */

export type Severidad = 'bloqueante' | 'aviso'

export interface Hallazgo {
  regla: string
  severidad: Severidad
  detalle: string
}

export interface Contexto {
  tipo: 'plaga' | 'par'
  /** Rutas que existen en el sitio. Enlazar fuera de aquí es inventarse una URL. */
  urlsValidas: ReadonlySet<string>
  /** Solo en fichas de par: la ficha de plaga a la que está obligada a enlazar. */
  urlPlaga?: string
  /** Nombres comerciales del corpus, tal cual vienen del registro. */
  nombresComerciales?: readonly string[]
  /**
   * Materias activas del briefing. Se pasan para NO confundirlas con marcas:
   * varias dan nombre a un producto —«AZUFRE MICRONIZADO 80», «BORDELÉS
   * LUQSA»— y son justo lo que la ficha tiene el encargo de nombrar.
   */
  materiasActivas?: readonly string[]
  /** Nombre común y científico de la plaga, para no confundirlos con marcas. */
  nombrePlaga?: string
  cientifico?: string | null
  /** El cultivo del par: distingue el ciclo del cultivo del ciclo del patógeno. */
  nombreCultivo?: string
}

export interface Ficha {
  frontmatter: Record<string, unknown>
  cuerpo: string
}

/** Rangos de partida del plan. Se ajustan cuando se vea la primera tanda. */
const LONGITUD = {
  plaga: { min: 600, max: 900 },
  par: { min: 350, max: 600 },
} as const

const FAQ_MIN = 3
const FAQ_MAX = 6

/**
 * Aperturas que delatan texto de relleno. Con 94 fichas generadas de una
 * tacada, sin esto empiezan todas igual y el corpus se lee como lo que es.
 */
const APERTURAS_PROHIBIDAS = [
  /^en el mundo de/i,
  /^a la hora de/i,
  /^es importante (destacar|señalar|recordar)/i,
  /^cuando se trata de/i,
  /^en este art[íi]culo/i,
]

/**
 * Unidades de dosis y plazos: lo único que la prosa no puede decir nunca.
 *
 * Se aceptan coma y punto decimal porque el registro usa las dos, y se exige
 * que la unidad vaya pegada a un número: «se aplica en primavera» pasa, «0,5
 * l/ha» no. El caso de `%` se limita a concentraciones con decimales o dos
 * cifras, para no marcar un «el 70 % de los productos son de contacto», que es
 * una frase legítima sobre la composición del listado.
 */
const CIFRAS_PROHIBIDAS: { patron: RegExp; que: string }[] = [
  {
    patron: /\d+(?:[.,]\d+)?\s*(?:l|kg|g|ml|cc|gr)\s*\/\s*(?:ha|hl|l|m2|m²|planta|árbol|arbol)/gi,
    que: 'dosis por superficie o volumen',
  },
  {
    // También con la unidad escrita entera: «3 litros por hectárea» es tan
    // dosis como «3 l/ha», y es como lo escribe un modelo al que le has pedido
    // que no ponga abreviaturas.
    patron:
      /\d+(?:[.,]\d+)?\s*(?:g|kg|l|ml|cc|gramos?|kilos?|kilogramos?|litros?|mililitros?)\s+por\s+(?:hect[áa]rea|litro|planta|[áa]rbol)/gi,
    que: 'dosis escrita en palabras',
  },
  {
    patron: /(?:plazo\s+de\s+seguridad\s+(?:de\s+)?|esperar\s+)\d+\s*d[íi]as?/gi,
    que: 'plazo de seguridad',
  },
  {
    patron: /\d+\s*d[íi]as?\s+(?:de\s+)?(?:plazo|antes\s+de\s+(?:la\s+)?(?:recolecci[óo]n|cosecha))/gi,
    que: 'plazo antes de recolección',
  },
]

/**
 * Términos con los que arrancan los preparados tradicionales. El registro los
 * admite como nombre comercial —«CALDO BORDELES», «AZUFRE MICRONIZADO 80»,
 * «OXICLORURO DE COBRE 50% P.M.»— pero son exactamente el vocabulario que una
 * comparativa de familias necesita. Prohibirlos sería prohibir el contenido.
 */
const GENERICOS =
  /^(caldo|cobre|azufre|aceite|sulfato|oxicloruro|hidr[óo]xido|[óo]xido|jab[óo]n|bacillus|polisulfuro|sales)\b/i

/**
 * Marcas que son además palabras corrientes del castellano. Salen del propio
 * registro (`ATRAPA`, `PERFIL`, `FLECHA`…) y marcarlas llenaría el informe de
 * ruido sobre frases perfectamente sanas.
 */
const MARCAS_QUE_SON_PALABRAS = new Set([
  'atrapa', 'perfil', 'flecha', 'diablo', 'delfin', 'zafiro', 'costar',
  'coral', 'core', 'azar', 'ultra', 'bio', 'grano', 'cera', 'apis',
  'dardo', 'crack', 'flash', 'sonar', 'tenor', 'boxer', 'alfil',
])

/** Longitud mínima de una marca para buscarla: por debajo, todo son falsos positivos. */
const MARCA_MIN_LETRAS = 6

function sinAcentos(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/**
 * Separa el frontmatter YAML del cuerpo. Parseo mínimo y deliberado: solo hay
 * que leer escalares y la lista de FAQ, y añadir una dependencia de YAML a una
 * landing por esto no sale a cuenta.
 */
export function partirFrontmatter(md: string): Ficha {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { frontmatter: {}, cuerpo: md.trim() }

  const frontmatter: Record<string, unknown> = {}
  const faqs: { pregunta: string; respuesta: string }[] = []
  let actual: { pregunta: string; respuesta: string } | null = null
  let enFaqs = false

  for (const linea of m[1].split(/\r?\n/)) {
    if (/^faqs:\s*$/.test(linea)) {
      enFaqs = true
      continue
    }
    if (enFaqs && /^\s+-\s+pregunta:/.test(linea)) {
      if (actual) faqs.push(actual)
      actual = { pregunta: desentrecomillar(linea.replace(/^\s+-\s+pregunta:\s*/, '')), respuesta: '' }
      continue
    }
    if (enFaqs && actual && /^\s+respuesta:/.test(linea)) {
      actual.respuesta = desentrecomillar(linea.replace(/^\s+respuesta:\s*/, ''))
      continue
    }
    if (/^\w[\w-]*:/.test(linea)) {
      enFaqs = false
      if (actual) {
        faqs.push(actual)
        actual = null
      }
      const [, clave, valor] = linea.match(/^([\w-]+):\s*(.*)$/)!
      if (valor !== '') frontmatter[clave] = desentrecomillar(valor)
    }
  }
  if (actual) faqs.push(actual)
  if (faqs.length) frontmatter.faqs = faqs

  return { frontmatter, cuerpo: m[2].trim() }
}

function desentrecomillar(v: string): string {
  return v.replace(/^["']|["']$/g, '').trim()
}

/** Palabras del cuerpo, ignorando marcado, enlaces y encabezados. */
function contarPalabras(cuerpo: string): number {
  return cuerpo
    .replace(/^#{1,6}\s+.*$/gm, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

/** Los párrafos de texto corrido, sin encabezados ni listas ni tablas. */
function parrafos(cuerpo: string): string[] {
  return cuerpo
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && !/^[#>|]/.test(p) && !/^[-*]\s/.test(p))
}

/**
 * Bloques de la ficha: cada H2 con el primer párrafo que lo sigue. Es la unidad
 * que revisa la regla de respuesta directa (que el fragmento se pueda citar
 * suelto), así que interesa el primer párrafo y no el resto.
 */
function bloquesH2(cuerpo: string): { titulo: string; primerParrafo: string }[] {
  const bloques: { titulo: string; primerParrafo: string }[] = []
  const trozos = cuerpo.split(/^##\s+(.+)$/gm)
  for (let i = 1; i < trozos.length; i += 2) {
    const cuerpoBloque = (trozos[i + 1] ?? '').trim()
    bloques.push({ titulo: trozos[i].trim(), primerParrafo: parrafos(cuerpoBloque)[0] ?? '' })
  }
  return bloques
}

/** Marcas buscables: fuera las genéricas, las cortas y las que son palabras. */
export function marcasBuscables(nombres: readonly string[], ctx: Contexto): string[] {
  const palabras = (s: string) => sinAcentos(s).toLowerCase().split(/[^a-z]+/).filter(Boolean)

  const dePlaga = new Set(palabras(`${ctx.nombrePlaga ?? ''} ${ctx.cientifico ?? ''}`))
  // Toda palabra de una materia activa queda fuera del chequeo: la ficha existe
  // para nombrarlas, y el registro admite varias como nombre comercial.
  const deMateria = new Set((ctx.materiasActivas ?? []).flatMap(palabras))
  const marcas = new Set<string>()
  for (const nombre of nombres) {
    if (GENERICOS.test(nombre)) continue
    const primera = sinAcentos(nombre.split(/[\s-]/)[0]).toLowerCase()
    if (primera.length < MARCA_MIN_LETRAS) continue
    if (MARCAS_QUE_SON_PALABRAS.has(primera)) continue
    // `CYDIA`, `TUTA`: son marcas y son el género de la plaga que toca describir.
    if (dePlaga.has(primera)) continue
    if (deMateria.has(primera)) continue
    marcas.add(primera)
  }
  return [...marcas]
}

export function validar(ficha: Ficha, ctx: Contexto): Hallazgo[] {
  const hallazgos: Hallazgo[] = []
  const { cuerpo, frontmatter } = ficha
  const add = (regla: string, severidad: Severidad, detalle: string) =>
    hallazgos.push({ regla, severidad, detalle })

  // ── Bloqueante: la prosa no emite cifras ──────────────────────────────────
  for (const { patron, que } of CIFRAS_PROHIBIDAS) {
    for (const m of cuerpo.matchAll(patron)) {
      add('sin-cifras', 'bloqueante', `${que}: «${m[0].trim()}». Eso lo pinta la tabla.`)
    }
  }

  // ── Bloqueante: enlaces dentro de la lista cerrada ────────────────────────
  const enlaces = [...cuerpo.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)]
  for (const [, ancla, destino] of enlaces) {
    const ruta = destino.split('#')[0].replace(/\/$/, '') || '/'
    if (destino.startsWith('http')) {
      add('enlace-externo', 'bloqueante', `enlace fuera del sitio: ${destino}`)
    } else if (!ctx.urlsValidas.has(ruta)) {
      add('enlace-inventado', 'bloqueante', `la ruta ${ruta} no existe en el sitio`)
    }
    const palabras = ancla.trim().split(/\s+/).length
    if (/^(aquí|aqui|clic|aquí mismo|más información|mas informacion|leer más|leer mas)$/i.test(ancla.trim())) {
      add('ancla-vacía', 'aviso', `el ancla «${ancla}» no describe el destino`)
    } else if (palabras > 6) {
      add('ancla-larga', 'aviso', `ancla de ${palabras} palabras: «${ancla}»`)
    }
  }

  // ── Bloqueante: la ficha de par enlaza a su ficha de plaga ────────────────
  if (ctx.tipo === 'par' && ctx.urlPlaga) {
    const enlazaPlaga = enlaces.some(([, , d]) => d.replace(/\/$/, '') === ctx.urlPlaga!.replace(/\/$/, ''))
    if (!enlazaPlaga) {
      add('sin-enlace-a-plaga', 'bloqueante', `falta el enlace a ${ctx.urlPlaga}, que es donde vive la biología`)
    }
  }

  // ── Bloqueante: jerarquía de encabezados ──────────────────────────────────
  const niveles = [...cuerpo.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => ({
    nivel: m[1].length,
    texto: m[2].trim(),
  }))
  if (niveles.some((h) => h.nivel >= 4)) {
    add('jerarquía', 'bloqueante', 'hay encabezados de nivel 4 o más: la ficha no baja de H3')
  }
  if (niveles.some((h) => h.nivel === 1)) {
    add('jerarquía', 'bloqueante', 'el H1 lo pone la plantilla, no la ficha')
  }
  for (let i = 1; i < niveles.length; i++) {
    if (niveles[i].nivel > niveles[i - 1].nivel + 1) {
      add('jerarquía', 'bloqueante', `salto de H${niveles[i - 1].nivel} a H${niveles[i].nivel} en «${niveles[i].texto}»`)
    }
  }

  // ── Bloqueante: las FAQ, que alimentan acordeón y JSON-LD a la vez ────────
  const faqs = (frontmatter.faqs ?? []) as { pregunta?: string; respuesta?: string }[]
  if (!Array.isArray(faqs) || faqs.length < FAQ_MIN || faqs.length > FAQ_MAX) {
    add('faqs', 'bloqueante', `${Array.isArray(faqs) ? faqs.length : 0} preguntas; se piden entre ${FAQ_MIN} y ${FAQ_MAX}`)
  }
  for (const faq of Array.isArray(faqs) ? faqs : []) {
    if (!faq.pregunta?.trim() || !faq.respuesta?.trim()) {
      add('faqs', 'bloqueante', `pregunta o respuesta vacía: «${faq.pregunta ?? ''}»`)
    } else if (!faq.pregunta.includes('?')) {
      add('faqs', 'aviso', `«${faq.pregunta}» no es una pregunta`)
    }
  }

  // ── Aviso: nombres comerciales ────────────────────────────────────────────
  if (ctx.nombresComerciales?.length) {
    const texto = sinAcentos(cuerpo).toLowerCase()
    for (const marca of marcasBuscables(ctx.nombresComerciales, ctx)) {
      if (new RegExp(`\\b${marca}\\b`).test(texto)) {
        add('marca-comercial', 'aviso', `nombra la marca «${marca}»; la ficha compara familias, no marcas`)
      }
    }
  }

  // ── Aviso: respuesta directa por H2 ───────────────────────────────────────
  for (const { titulo, primerParrafo } of bloquesH2(cuerpo)) {
    const palabras = primerParrafo.split(/\s+/).filter(Boolean).length
    if (palabras === 0) {
      add('respuesta-directa', 'aviso', `«${titulo}» no arranca con un párrafo`)
      continue
    }
    if (palabras < 40 || palabras > 55) {
      add('respuesta-directa', 'aviso', `«${titulo}»: ${palabras} palabras en el primer párrafo (40-55)`)
    }
    if (/^(esto|eso|lo anterior|como dec[íi]amos|adem[áa]s|por eso|tambi[ée]n)\b/i.test(primerParrafo)) {
      add('respuesta-directa', 'aviso', `«${titulo}» empieza apuntando fuera de sí mismo: no se puede citar suelto`)
    }
  }

  // ── Aviso: frases largas ──────────────────────────────────────────────────
  for (const parrafo of parrafos(cuerpo)) {
    for (const frase of parrafo.split(/(?<=[.;:!?])\s+/)) {
      const palabras = frase.split(/\s+/).filter(Boolean).length
      if (palabras > 30) {
        add('frase-larga', 'aviso', `frase de ${palabras} palabras: «${frase.slice(0, 60)}…»`)
      }
    }
  }

  // ── Aviso: la apertura ────────────────────────────────────────────────────
  const primero = parrafos(cuerpo)[0] ?? ''
  for (const patron of APERTURAS_PROHIBIDAS) {
    if (patron.test(primero)) {
      add('apertura', 'aviso', `apertura de relleno: «${primero.slice(0, 50)}…»`)
    }
  }

  // ── Aviso: la ficha de par no repite la biología ──────────────────────────
  if (ctx.tipo === 'par') {
    /**
     * «Ciclo» solo delata duplicado cuando es el ciclo del patógeno. El ciclo
     * del CULTIVO —la fenología— es justo lo que esta ficha tiene que contar:
     * «¿Cuándo se interviene en el ciclo del olivo?» es un encabezado correcto.
     */
     const delCultivo = ctx.nombreCultivo
      ? new RegExp(sinAcentos(ctx.nombreCultivo).split(/\s+/)[0], 'i')
      : null
    for (const h of niveles) {
      const texto = sinAcentos(h.texto)
      if (delCultivo?.test(texto)) continue
      const esBiologia =
        /\bqu[e] es\b|s[i]ntomas|descripci[o]n|biolog[i]a/i.test(texto) ||
        (/\bciclo\b/i.test(texto) && /hongo|patogen|insecto|in[o]culo|larva|adulto|plaga/i.test(texto))
      if (esBiologia) {
        add('biología-duplicada', 'aviso', `«${h.texto}» repite lo que vive en la ficha de plaga; enlázala`)
      }
    }
  }

  // ── Aviso: longitud ───────────────────────────────────────────────────────
  const palabras = contarPalabras(cuerpo)
  const { min, max } = LONGITUD[ctx.tipo]
  if (palabras < min || palabras > max) {
    add('longitud', 'aviso', `${palabras} palabras; el rango de la ficha de ${ctx.tipo} es ${min}-${max}`)
  }

  // ── Aviso: el nombre científico va en cursiva ─────────────────────────────
  if (ctx.cientifico) {
    const suelto = new RegExp(`(?<![*\\w])${ctx.cientifico.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![*\\w])`, 'i')
    if (suelto.test(cuerpo)) {
      add('cursiva', 'aviso', `«${ctx.cientifico}» aparece sin cursiva`)
    }
  }

  return hallazgos
}

/** Atajo para el pipeline: ¿esta ficha entra en el sitio? */
export function bloquea(hallazgos: readonly Hallazgo[]): boolean {
  return hallazgos.some((h) => h.severidad === 'bloqueante')
}
