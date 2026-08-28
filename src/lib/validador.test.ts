/**
 * Tests del validador. Se ejecutan con `npm test` (runner nativo de Node, sin
 * dependencias: la landing no tiene framework de test y no merece uno por esto).
 *
 * El grupo que más importa es el último: los falsos positivos. Un validador que
 * marca en rojo la prosa correcta se desactiva a la tercera ficha, y entonces no
 * queda nada entre el modelo y el sitio.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validar, partirFrontmatter, marcasBuscables, bloquea, type Contexto } from './validador.ts'

const URLS = new Set(['/plagas/repilo-del-olivo', '/plagas/repilo-del-olivo/olivo', '/plagas/mildiu/vid'])

const CTX: Contexto = {
  tipo: 'par',
  urlsValidas: URLS,
  urlPlaga: '/plagas/repilo-del-olivo',
  nombrePlaga: 'Repilo del olivo',
  cientifico: 'Venturia oleaginea',
}

const FAQS = [
  { pregunta: '¿Cuándo tratar?', respuesta: 'En otoño.' },
  { pregunta: '¿Sirve el cobre?', respuesta: 'Sí.' },
  { pregunta: '¿Y en ecológico?', respuesta: 'También.' },
]

function ficha(cuerpo: string, extra: Partial<Contexto> = {}) {
  return {
    ficha: { frontmatter: { faqs: FAQS }, cuerpo },
    ctx: { ...CTX, ...extra },
  }
}

function reglas(cuerpo: string, extra: Partial<Contexto> = {}) {
  const { ficha: f, ctx } = ficha(cuerpo, extra)
  return validar(f, ctx).map((h) => h.regla)
}

// ── La regla que sostiene el diseño ─────────────────────────────────────────

test('bloquea una dosis por hectárea', () => {
  assert.ok(reglas('Se aplica a 0,5 l/ha en primavera.').includes('sin-cifras'))
  assert.ok(reglas('Usa 2 kg/ha del producto.').includes('sin-cifras'))
  assert.ok(reglas('La dosis es de 150 cc/hl.').includes('sin-cifras'))
})

test('bloquea una dosis escrita en palabras', () => {
  assert.ok(reglas('Aplicar 3 litros por hectárea.').includes('sin-cifras'))
  assert.ok(reglas('Aplicar 3 l por hectárea.').includes('sin-cifras'))
  assert.ok(reglas('Aplicar 250 gramos por planta.').includes('sin-cifras'))
})

test('bloquea un plazo de seguridad', () => {
  assert.ok(reglas('Tiene un plazo de seguridad de 14 días.').includes('sin-cifras'))
  assert.ok(reglas('Hay que esperar 21 días.').includes('sin-cifras'))
  assert.ok(reglas('Deja 7 días antes de la recolección.').includes('sin-cifras'))
})

test('deja pasar la prosa que habla de plazos sin dar cifras', () => {
  const r = reglas('El plazo de seguridad condiciona el momento de aplicación cerca de la recolección.')
  assert.ok(!r.includes('sin-cifras'))
})

// ── Enlaces: lista cerrada ──────────────────────────────────────────────────

test('bloquea una URL que no existe en el sitio', () => {
  const r = reglas('Ver la [ficha del repilo](/plagas/repilo-del-olivo) y el [mildiu en tomate](/plagas/mildiu/tomate).')
  assert.ok(r.includes('enlace-inventado'))
})

test('bloquea un enlace externo', () => {
  const r = reglas('Según [el MAPA](https://mapa.gob.es) y la [ficha](/plagas/repilo-del-olivo).')
  assert.ok(r.includes('enlace-externo'))
})

test('la ficha de par tiene que enlazar a su ficha de plaga', () => {
  assert.ok(reglas('Sin enlaces.').includes('sin-enlace-a-plaga'))
  assert.ok(!reglas('Ver la [ficha del repilo](/plagas/repilo-del-olivo).').includes('sin-enlace-a-plaga'))
})

test('marca las anclas que no describen el destino', () => {
  const r = reglas('Puedes verlo [aquí](/plagas/repilo-del-olivo).')
  assert.ok(r.includes('ancla-vacía'))
})

// ── Jerarquía y FAQ ─────────────────────────────────────────────────────────

test('bloquea H1 y H4', () => {
  assert.ok(reglas('# Título\n\nTexto.').includes('jerarquía'))
  assert.ok(reglas('## Uno\n\nTexto.\n\n#### Cuatro\n\nMás.').includes('jerarquía'))
})

test('bloquea un salto de jerarquía', () => {
  assert.ok(reglas('## Dos\n\nTexto.\n\n## Otro\n\nTexto.').filter((r) => r === 'jerarquía').length === 0)
})

test('bloquea si faltan FAQ o están vacías', () => {
  const sinFaqs = validar({ frontmatter: {}, cuerpo: 'Texto.' }, CTX)
  assert.ok(sinFaqs.some((h) => h.regla === 'faqs' && h.severidad === 'bloqueante'))

  const vacia = validar(
    { frontmatter: { faqs: [{ pregunta: '¿Y?', respuesta: '' }, ...FAQS] }, cuerpo: 'Texto.' },
    CTX
  )
  assert.ok(vacia.some((h) => h.regla === 'faqs' && h.severidad === 'bloqueante'))
})

// ── Frontmatter ─────────────────────────────────────────────────────────────

test('parte el frontmatter y lee las FAQ', () => {
  const { frontmatter, cuerpo } = partirFrontmatter(
    ['---', 'titulo: "Repilo del olivo"', 'faqs:', '  - pregunta: "¿Cuándo?"', '    respuesta: "En otoño."', '---', '', 'El cuerpo.'].join('\n')
  )
  assert.equal(frontmatter.titulo, 'Repilo del olivo')
  assert.deepEqual(frontmatter.faqs, [{ pregunta: '¿Cuándo?', respuesta: 'En otoño.' }])
  assert.equal(cuerpo, 'El cuerpo.')
})

// ── Falsos positivos: el grupo que decide si el validador sobrevive ─────────

test('«cobre» y «caldo bordelés» no son marcas: son la comparativa', () => {
  const nombres = ['COBRE NORDOX 75 WG', 'CALDO BORDELES IQV', 'AZUFRE MICRONIZADO 80', 'OXICLORURO DE COBRE 50% P.M.']
  assert.deepEqual(marcasBuscables(nombres, CTX), [])
})

test('el género de la plaga no se confunde con la marca homónima', () => {
  const ctx = { ...CTX, nombrePlaga: 'Polilla del tomate, Tuta absoluta', cientifico: 'Tuta absoluta' }
  assert.ok(!marcasBuscables(['TUTA PRIME', 'CYDIA TRAP'], ctx).includes('tuta'))

  const ctxCydia = { ...CTX, nombrePlaga: 'Carpocapsa', cientifico: 'Cydia pomonella' }
  assert.ok(!marcasBuscables(['CYDIA TRAP'], ctxCydia).includes('cydia'))
})

test('las marcas que son palabras corrientes no se marcan', () => {
  assert.deepEqual(marcasBuscables(['ATRAPA', 'PERFIL', 'FLECHA', 'CORAL'], CTX), [])
})

test('una materia activa no es una marca, aunque dé nombre a un producto', () => {
  // Caso real del corpus: la ficha del repilo tiene que poder escribir «caldo
  // bordelés» y el registro tiene un producto llamado «BORDELÉS LUQSA».
  const ctx = { ...CTX, materiasActivas: ['caldo bordelés', 'azufre', 'proteinas hidrolizadas'] }
  const nombres = ['BORDELÉS LUQSA', 'AZUFRE FAMOLINS', 'PROTEINAS HIDROLIZADAS BIO']
  assert.deepEqual(marcasBuscables(nombres, ctx), [])

  const r = reglas('El caldo bordelés y el azufre son de contacto. Ver la [ficha](/plagas/repilo-del-olivo).', {
    nombresComerciales: nombres,
    materiasActivas: ['caldo bordelés', 'azufre'],
  })
  assert.ok(!r.includes('marca-comercial'))
})

test('una marca de verdad sí se avisa', () => {
  const nombres = ['DECIS PROTECH', 'MOVENTO GOLD']
  assert.ok(marcasBuscables(nombres, CTX).includes('movento'))

  const r = reglas('El movento se usa mucho. Ver la [ficha](/plagas/repilo-del-olivo).', {
    nombresComerciales: nombres,
  })
  assert.ok(r.includes('marca-comercial'))
})

test('el aviso de marca nunca bloquea', () => {
  const { ficha: f, ctx } = ficha('Usa movento. Ver la [ficha](/plagas/repilo-del-olivo).', {
    nombresComerciales: ['MOVENTO GOLD'],
  })
  const h = validar(f, ctx).filter((x) => x.regla === 'marca-comercial')
  assert.ok(h.length > 0)
  assert.ok(!bloquea(h))
})

// ── Reglas de redacción ─────────────────────────────────────────────────────

test('el primer párrafo de cada H2 se tiene que poder citar suelto', () => {
  const corto = '## ¿Cuándo tratar?\n\nEn otoño.\n'
  assert.ok(reglas(corto).includes('respuesta-directa'))

  const apuntaFuera = `## ¿Cuándo tratar?\n\nEsto ${'depende del momento fenológico y de la lluvia acumulada '.repeat(3)}en la comarca durante el otoño temprano.\n`
  assert.ok(reglas(apuntaFuera).includes('respuesta-directa'))
})

test('marca las frases de más de treinta palabras', () => {
  assert.ok(reglas(`El repilo ${'avanza y avanza '.repeat(20)}sin parar.`).includes('frase-larga'))
})

test('marca las aperturas de relleno', () => {
  assert.ok(reglas('En el mundo de la olivicultura, el repilo manda.').includes('apertura'))
  assert.ok(!reglas('El repilo defolia el olivo en otoño.').includes('apertura'))
})

test('la ficha de par no repite la biología', () => {
  assert.ok(reglas('## Ciclo del hongo\n\nTexto.').includes('biología-duplicada'))
  assert.ok(reglas('## Qué es el repilo\n\nTexto.').includes('biología-duplicada'))
  assert.ok(reglas('## Síntomas y daño\n\nTexto.').includes('biología-duplicada'))
  assert.ok(!reglas('## Ciclo del hongo\n\nTexto.', { tipo: 'plaga' }).includes('biología-duplicada'))
})

test('el ciclo del CULTIVO sí es de la ficha de par', () => {
  // Caso real del piloto: «¿Cuándo se interviene en el ciclo del olivo de
  // almazara?» es fenología del cultivo, que es justo lo que toca contar aquí.
  const r = reglas('## ¿Cuándo se interviene en el ciclo del olivo de almazara?\n\nTexto.', {
    nombreCultivo: 'Olivo de almazara',
  })
  assert.ok(!r.includes('biología-duplicada'))
})

test('avisa si el nombre científico va sin cursiva', () => {
  assert.ok(reglas('La Venturia oleaginea inverna en la hoja.').includes('cursiva'))
  assert.ok(!reglas('La *Venturia oleaginea* inverna en la hoja.').includes('cursiva'))
})
