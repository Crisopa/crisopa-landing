/**
 * Tests del contraste entre destinos. Los números salen del volcado real: el
 * plazo de CABRIO WG contra repilo (28 días en verdeo, 105 en almazara) y los
 * 18 productos que el registro autoriza contra mildiu en vid de vinificación y
 * no en vid de mesa.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { contraste, camposQueCambian, familiaDe, sinDiferencias } from './destinos.ts'
import type { ParComparable, ProductoComparable } from './destinos.ts'

function producto(registro: string, extra: Partial<ProductoComparable> = {}): ProductoComparable {
  return {
    nombre: `PRODUCTO ${registro}`,
    registro,
    dosisMin: null,
    dosisMax: 1,
    dosisUnidad: 'l/ha',
    plazo: 14,
    maxAplicaciones: 2,
    intervalo: null,
    ...extra,
  }
}

function par(cultivo: string, productos: ProductoComparable[]): ParComparable {
  return {
    plagaSlug: 'repilo-del-olivo',
    cultivo,
    cultivoSlug: cultivo.toLowerCase().replace(/ /g, '-'),
    productos,
  }
}

test('un cultivo sin destino partido no tiene contraste', () => {
  const tomate = par('Tomate', [producto('1')])
  assert.equal(contraste(tomate, [tomate]), null)
})

test('sin gemelo publicado no se contrasta nada', () => {
  // A media tanda puede faltar la otra mitad; inventarla sería peor que callar.
  const verdeo = par('Olivo de verdeo', [producto('1')])
  assert.equal(contraste(verdeo, [verdeo]), null)
})

test('detecta el plazo distinto del mismo producto', () => {
  const verdeo = par('Olivo de verdeo', [producto('25.123', { nombre: 'CABRIO WG', plazo: 28 })])
  const almazara = par('Olivo de almazara', [producto('25.123', { nombre: 'CABRIO WG', plazo: 105 })])

  const c = contraste(verdeo, [verdeo, almazara])!
  assert.equal(c.otro.cultivo, 'Olivo de almazara')
  assert.equal(c.cambios.length, 1)
  assert.deepEqual(c.cambios[0].campos, ['plazo'])
  assert.equal(c.cambios[0].aqui.plazo, 28)
  assert.equal(c.cambios[0].alla.plazo, 105)
})

test('separa lo autorizado solo aquí de lo autorizado solo allá', () => {
  const mesa = par('Vid de mesa', [producto('1'), producto('2')])
  const vino = par('Vid de vinificación', [producto('2'), producto('3'), producto('4')])

  const c = contraste(mesa, [mesa, vino])!
  assert.deepEqual(c.soloAqui.map((p) => p.registro), ['1'])
  assert.deepEqual(c.soloAlla.map((p) => p.registro), ['3', '4'])
  assert.equal(c.cambios.length, 0)
})

test('el contraste es simétrico: lo que sobra aquí falta allá', () => {
  const mesa = par('Vid de mesa', [producto('1'), producto('2')])
  const vino = par('Vid de vinificación', [producto('2'), producto('3')])

  const a = contraste(mesa, [mesa, vino])!
  const b = contraste(vino, [mesa, vino])!
  assert.deepEqual(a.soloAqui.map((p) => p.registro), b.soloAlla.map((p) => p.registro))
  assert.deepEqual(a.soloAlla.map((p) => p.registro), b.soloAqui.map((p) => p.registro))
})

test('«no cambia nada» también es una respuesta', () => {
  // Glifodes, tuberculosis y algodón del olivo caen aquí: mismos productos y
  // mismos datos en los dos destinos. Decirlo responde a quien lo pregunta.
  const verdeo = par('Olivo de verdeo', [producto('1'), producto('2')])
  const almazara = par('Olivo de almazara', [producto('1'), producto('2')])

  const c = contraste(verdeo, [verdeo, almazara])!
  assert.ok(sinDiferencias(c))
})

test('la dosis cambia aunque solo se mueva el máximo', () => {
  // Caso real de araña roja en vid: dosis máxima 6 en vinificación, 7,2 en mesa.
  const a = producto('9', { dosisMax: 6 })
  const b = producto('9', { dosisMax: 7.2 })
  assert.deepEqual(camposQueCambian(a, b), ['dosis'])
})

test('un null y un valor cuentan como cambio', () => {
  // DISCUS y STROBY WG no tienen plazo en verdeo y sí 30 días en almazara.
  assert.deepEqual(camposQueCambian(producto('9', { plazo: null }), producto('9', { plazo: 30 })), [
    'plazo',
  ])
})

test('acumula varios campos del mismo producto', () => {
  // LIMOCIDE contra piojo rojo cambia aplicaciones e intervalo a la vez.
  const campos = camposQueCambian(
    producto('9', { maxAplicaciones: 4, intervalo: 7 }),
    producto('9', { maxAplicaciones: 1, intervalo: null })
  )
  assert.deepEqual(campos, ['aplicaciones', 'intervalo'])
})

test('limonero y naranjo no son la misma especie', () => {
  // Comparten casi todos los productos, pero contrastarlos sería mentir: son
  // dos cultivos, no dos destinos de uno.
  assert.equal(familiaDe('Limonero'), null)
  assert.equal(familiaDe('Naranjo'), null)
  assert.equal(familiaDe('Melocotonero'), null)
})

test('los dos destinos de una familia se reconocen igual', () => {
  assert.equal(familiaDe('Olivo de verdeo')?.especie, 'el olivo')
  assert.equal(familiaDe('Olivo de almazara')?.especie, 'el olivo')
  assert.equal(familiaDe('Vid de mesa')?.especie, 'la vid')
})
