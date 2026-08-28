/**
 * Genera la capa editorial del corpus de plagas: briefing → esquema → prosa →
 * validador → `src/content/`. El plan completo, con el porqué de cada decisión,
 * está en `docs/pipeline-editorial.md`.
 *
 * Vive aquí y no en `crisopa-functions` porque los dos extremos ya están en este
 * repositorio, porque iterar el prompt exige ver la página renderizada, y porque
 * se ejecuta a demanda y no en horario. Generar prosa no se automatiza: nadie
 * quiere republicar 94 textos reescritos cada domingo.
 *
 *   node scripts/generar-fichas.mjs --briefing repilo-del-olivo
 *   node scripts/generar-fichas.mjs --plaga repilo-del-olivo
 *   node scripts/generar-fichas.mjs --par repilo-del-olivo/olivo-de-almazara
 *   node scripts/generar-fichas.mjs --todo [--limite 5]
 *
 * `--briefing` no llama al modelo: imprime lo que se le mandaría. Es la forma
 * barata de iterar el prompt.
 */

import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { validar, partirFrontmatter, bloquea } from '../src/lib/validador.ts'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENIDO = join(RAIZ, 'src/content')
const ROLES = join(RAIZ, 'scripts/roles')

const { pares: PARES } = JSON.parse(readFileSync(join(RAIZ, 'src/data/plagas.json'), 'utf8'))

/** Cuántas llamadas a la vez. Con 94 secuenciales esto tarda una tarde. */
const PARALELAS = 3

/** Reintentos tras un bloqueante. Uno: el tercer intento no arregla lo que fallaron dos. */
const REINTENTOS = 1

// ── El corpus, agrupado ─────────────────────────────────────────────────────

/** Las 26 plagas, cada una con sus pares. */
function plagas() {
  const porSlug = new Map()
  for (const par of PARES) {
    let g = porSlug.get(par.plagaSlug)
    if (!g) {
      g = { slug: par.plagaSlug, plaga: par.plaga, cientifico: par.cientifico, pares: [] }
      porSlug.set(par.plagaSlug, g)
    }
    g.pares.push(par)
  }
  return [...porSlug.values()]
}

/** Todas las rutas del sitio que una ficha puede enlazar. Lista cerrada. */
function urlsValidas() {
  const urls = new Set(['/plagas'])
  for (const par of PARES) {
    urls.add(`/plagas/${par.plagaSlug}`)
    urls.add(`/plagas/${par.plagaSlug}/${par.cultivoSlug}`)
  }
  return urls
}

const NOMBRES_COMERCIALES = [...new Set(PARES.flatMap((p) => p.productos.map((q) => q.nombre)))]

/**
 * Materias activas de un conjunto de productos, con lo que hace falta para
 * compararlas: cuántos productos la llevan y si alguno vale en ecológico.
 *
 * El campo `sustancias` viene del registro con las combinaciones unidas por
 * ` + `, así que se parten: lo que interesa es la materia activa individual.
 */
function materiasActivas(productos) {
  const porNombre = new Map()
  for (const p of productos) {
    for (const s of (p.sustancias ?? '').split(' + ').filter(Boolean)) {
      const clave = s.toLowerCase()
      const previo = porNombre.get(clave) ?? { nombre: clave, productos: 0, eco: false }
      previo.productos++
      previo.eco = previo.eco || p.eco
      porNombre.set(clave, previo)
    }
  }
  return [...porNombre.values()].sort((a, b) => b.productos - a.productos)
}

// ── Briefings ───────────────────────────────────────────────────────────────

function listaMaterias(materias) {
  return materias
    .map((m) => `- ${m.nombre} — ${m.productos} producto${m.productos === 1 ? '' : 's'}${m.eco ? ', apta en ecológico' : ''}`)
    .join('\n')
}

function briefingPlaga(grupo) {
  const productos = grupo.pares.flatMap((p) => p.productos)
  const materias = materiasActivas(productos)
  const enlaces = grupo.pares.map((p) => `- /plagas/${p.plagaSlug}/${p.cultivoSlug} — ${p.plaga} en ${p.cultivo}`)

  return `# Ficha de plaga: ${grupo.plaga}

Nombre común: ${grupo.plaga}
Nombre científico: ${grupo.cientifico ?? 'no consta en el registro'}
Cultivos con página: ${grupo.pares.map((p) => p.cultivo).join(', ')}

## Materias activas autorizadas contra esta plaga (${materias.length})

Son TODAS las que puedes mencionar. Agrúpalas por familia química y modo de
acción tú mismo; el registro no trae esa clasificación.

${listaMaterias(materias)}

## Rutas que puedes enlazar

Estas y ninguna más. Enlaza al menos dos.

${enlaces.join('\n')}
`
}

function briefingPar(par, esquema) {
  const materias = materiasActivas(par.productos)
  const hermanos = PARES.filter((p) => p.plagaSlug === par.plagaSlug && p.cultivoSlug !== par.cultivoSlug)
  const enlaces = [
    `- /plagas/${par.plagaSlug} — la ficha de ${par.plaga}: OBLIGATORIO enlazarla, ahí vive la biología`,
    ...hermanos.map((p) => `- /plagas/${p.plagaSlug}/${p.cultivoSlug} — la misma plaga en ${p.cultivo}`),
  ]

  const eco = materias.filter((m) => m.eco).length

  return `# Ficha de par: ${par.plaga} en ${par.cultivo}

Plaga: ${par.plaga}
Nombre científico: ${par.cientifico ?? 'no consta en el registro'}
Cultivo: ${par.cultivo}
Productos autorizados para este par: ${par.productos.length}
Materias activas distintas: ${materias.length} (${eco} con algún producto apto en ecológico)
${esquema ? `\n## Esquema aprobado\n\nÁngulo: ${esquema.angulo}\n\nEncabezados (usa estos, en este orden):\n${esquema.h2.map((h) => `- ${h}`).join('\n')}\n` : ''}
## Materias activas autorizadas en ESTE cultivo (${materias.length})

Son TODAS las que puedes mencionar para este par. Si una familia no aparece
aquí, es que no está autorizada en este cultivo, y eso suele ser lo más
interesante que contar.

${listaMaterias(materias)}

## Rutas que puedes enlazar

Estas y ninguna más.

${enlaces.join('\n')}
`
}

// ── Llamada al modelo ───────────────────────────────────────────────────────

/**
 * `--system-prompt` (no `--append-`) sustituye entero el prompt de Claude Code:
 * deja de comportarse como agente de código y actúa como redactor. Las
 * herramientas se deniegan para que el briefing sea su única entrada.
 *
 * `--bare` parece lo que se quiere y no lo es: fuerza `ANTHROPIC_API_KEY`, justo
 * lo que se evita usando la suscripción.
 */
function llamar(rol, briefing, modelo) {
  return new Promise((cumplir, fallar) => {
    const hijo = spawn(
      'claude',
      ['-p', '--system-prompt', rol, '--disallowedTools', 'Read Write Edit Bash', '--model', modelo],
      { stdio: ['pipe', 'pipe', 'pipe'] }
    )

    let salida = ''
    let error = ''
    hijo.stdout.on('data', (d) => (salida += d))
    hijo.stderr.on('data', (d) => (error += d))
    hijo.on('error', fallar)
    hijo.on('close', (codigo) => {
      if (codigo !== 0) return fallar(new Error(`claude salió con ${codigo}: ${error.slice(0, 500)}`))
      cumplir(salida.trim())
    })

    hijo.stdin.write(briefing)
    hijo.stdin.end()
  })
}

const rol = (nombre) => readFileSync(join(ROLES, `${nombre}.md`), 'utf8')

/** El modelo a veces envuelve el markdown en vallas pese a pedirle que no. */
function limpiar(texto) {
  return texto.replace(/^```(?:markdown|md|yaml)?\s*\n/, '').replace(/\n```\s*$/, '').trim()
}

// ── Una unidad, de punta a punta ────────────────────────────────────────────

async function esquemaDe(par) {
  const crudo = await llamar(rol('esquema-par'), briefingPar(par, null), 'sonnet')
  const json = limpiar(crudo).replace(/^```json\s*\n?/, '').replace(/\n?```$/, '')
  try {
    return JSON.parse(json)
  } catch {
    throw new Error(`el esquema no es JSON válido: ${json.slice(0, 200)}`)
  }
}

/**
 * Redacta, valida y guarda. Devuelve el parte de lo ocurrido, que es lo que
 * alimenta el informe del lote: sin revisión humana, los patrones repetidos del
 * informe son el único mecanismo para saber que falta una regla en el prompt.
 */
async function generar(unidad, opciones = {}) {
  const { tipo, slug, ruta, ctxExtra, brief, rolNombre } = unidad
  let briefing = brief
  let hallazgos = []
  let markdown = ''

  for (let intento = 0; intento <= REINTENTOS; intento++) {
    markdown = limpiar(await llamar(rol(rolNombre), briefing, opciones.modelo ?? 'opus'))
    const ficha = partirFrontmatter(markdown)
    hallazgos = validar(ficha, {
      tipo,
      urlsValidas: urlsValidas(),
      nombresComerciales: NOMBRES_COMERCIALES,
      ...ctxExtra,
    })

    if (!bloquea(hallazgos)) break

    if (intento < REINTENTOS) {
      const lista = hallazgos
        .filter((h) => h.severidad === 'bloqueante')
        .map((h) => `- [${h.regla}] ${h.detalle}`)
        .join('\n')
      briefing = `${brief}\n\n## Correcciones obligatorias\n\nTu versión anterior fue rechazada por estos motivos. Corrígelos todos:\n\n${lista}\n`
    }
  }

  if (bloquea(hallazgos)) {
    return { slug, tipo, estado: 'rechazada', hallazgos, markdown }
  }

  const destino = join(CONTENIDO, ruta)
  mkdirSync(dirname(destino), { recursive: true })
  writeFileSync(destino, `${markdown}\n`)
  return { slug, tipo, estado: 'guardada', hallazgos, destino }
}

function unidadPlaga(grupo) {
  const materias = materiasActivas(grupo.pares.flatMap((p) => p.productos)).map((m) => m.nombre)
  return {
    tipo: 'plaga',
    slug: grupo.slug,
    ruta: `plagas/${grupo.slug}.md`,
    rolNombre: 'redactor-plaga',
    brief: briefingPlaga(grupo),
    ctxExtra: { nombrePlaga: grupo.plaga, cientifico: grupo.cientifico, materiasActivas: materias },
  }
}

function unidadPar(par, esquema) {
  return {
    tipo: 'par',
    slug: `${par.plagaSlug}/${par.cultivoSlug}`,
    ruta: `pares/${par.plagaSlug}/${par.cultivoSlug}.md`,
    rolNombre: 'redactor-par',
    brief: briefingPar(par, esquema),
    ctxExtra: {
      urlPlaga: `/plagas/${par.plagaSlug}`,
      nombrePlaga: par.plaga,
      cientifico: par.cientifico,
      nombreCultivo: par.cultivo,
      materiasActivas: materiasActivas(par.productos).map((m) => m.nombre),
    },
  }
}

// ── Concurrencia ────────────────────────────────────────────────────────────

async function enTandas(items, n, fn) {
  const salida = []
  for (let i = 0; i < items.length; i += n) {
    const tanda = items.slice(i, i + n)
    salida.push(...(await Promise.all(tanda.map(fn))))
  }
  return salida
}

// ── Informe del lote ────────────────────────────────────────────────────────

/**
 * Lo valioso no son los fallos sueltos sino los repetidos: lo que falla en más
 * de un tercio de las fichas no es un error de redacción, es una regla que falta
 * en el prompt. Ese es el bucle para iterar sin leerse el corpus entero.
 */
function informe(resultados) {
  const guardadas = resultados.filter((r) => r.estado === 'guardada')
  const rechazadas = resultados.filter((r) => r.estado === 'rechazada')

  console.log(`\n${'─'.repeat(64)}`)
  console.log(`${guardadas.length} guardadas · ${rechazadas.length} rechazadas`)

  if (rechazadas.length) {
    console.log('\nRechazadas (no se han escrito):')
    for (const r of rechazadas) {
      console.log(`  ${r.slug}`)
      for (const h of r.hallazgos.filter((h) => h.severidad === 'bloqueante')) {
        console.log(`    ✗ [${h.regla}] ${h.detalle}`)
      }
    }
  }

  const porRegla = new Map()
  for (const r of resultados) {
    for (const h of new Set(r.hallazgos.map((x) => x.regla))) {
      porRegla.set(h, (porRegla.get(h) ?? 0) + 1)
    }
  }

  if (porRegla.size) {
    console.log(`\nAvisos (fichas afectadas de ${resultados.length}):`)
    // El patrón solo significa algo con un lote de cierto tamaño: en una tirada
    // de dos fichas, «más de un tercio» es una de ellas y no dice nada.
    const hayLote = resultados.length >= 6
    const umbral = resultados.length / 3
    for (const [regla, n] of [...porRegla].sort((a, b) => b[1] - a[1])) {
      const marca = hayLote && n > umbral ? ' ← más de un tercio: falta una regla en el prompt' : ''
      console.log(`  ${String(n).padStart(3)}  ${regla}${marca}`)
    }
  }
  console.log('')
}

// ── CLI ─────────────────────────────────────────────────────────────────────

function arg(nombre) {
  const i = process.argv.indexOf(`--${nombre}`)
  return i === -1 ? null : (process.argv[i + 1] ?? true)
}

async function main() {
  const grupos = plagas()

  if (arg('briefing')) {
    const clave = arg('briefing')
    const grupo = grupos.find((g) => g.slug === clave)
    if (grupo) return console.log(briefingPlaga(grupo))
    const par = PARES.find((p) => `${p.plagaSlug}/${p.cultivoSlug}` === clave)
    if (par) return console.log(briefingPar(par, null))
    throw new Error(`no encuentro «${clave}»`)
  }

  if (arg('plaga')) {
    const grupo = grupos.find((g) => g.slug === arg('plaga'))
    if (!grupo) throw new Error(`no encuentro la plaga «${arg('plaga')}»`)
    console.log(`· ${grupo.slug}`)
    const r = await generar(unidadPlaga(grupo))
    return informe([r])
  }

  if (arg('par')) {
    const par = PARES.find((p) => `${p.plagaSlug}/${p.cultivoSlug}` === arg('par'))
    if (!par) throw new Error(`no encuentro el par «${arg('par')}»`)
    console.log(`· esquema de ${par.plagaSlug}/${par.cultivoSlug}`)
    const esquema = await esquemaDe(par)
    console.log(`  ángulo: ${esquema.angulo}`)
    const r = await generar(unidadPar(par, esquema))
    return informe([r])
  }

  if (arg('todo')) {
    const limite = Number(arg('limite')) || Infinity

    console.log(`Fase 1: fichas de plaga (${Math.min(grupos.length, limite)})`)
    const dePlaga = await enTandas(grupos.slice(0, limite), PARALELAS, async (g) => {
      console.log(`· ${g.slug}`)
      return generar(unidadPlaga(g))
    })

    const pares = PARES.slice(0, limite)
    console.log(`\nFase 2: esquemas (${pares.length})`)
    const esquemas = await enTandas(pares, PARALELAS, async (p) => {
      try {
        return { par: p, esquema: await esquemaDe(p) }
      } catch (e) {
        console.log(`  ✗ ${p.plagaSlug}/${p.cultivoSlug}: ${e.message}`)
        return { par: p, esquema: null }
      }
    })

    // Los esquemas juntos: es donde se ve el solapamiento entre hermanas antes
    // de pagar la prosa. Se imprimen para poder parar aquí si algo canta.
    console.log('\nÁngulos:')
    for (const { par, esquema } of esquemas) {
      console.log(`  ${par.plagaSlug}/${par.cultivoSlug}: ${esquema?.angulo ?? '—'}`)
    }

    console.log(`\nFase 3: prosa de los pares (${esquemas.length})`)
    const dePar = await enTandas(esquemas, PARALELAS, async ({ par, esquema }) => {
      console.log(`· ${par.plagaSlug}/${par.cultivoSlug}`)
      return generar(unidadPar(par, esquema))
    })

    return informe([...dePlaga, ...dePar])
  }

  console.log(readFileSync(new URL(import.meta.url)).toString().split('*/')[0].split('\n').slice(1, -1).map((l) => l.replace(/^ \* ?/, '')).join('\n'))
}

main().catch((e) => {
  console.error(`\n✗ ${e.message}\n`)
  process.exit(1)
})
