/**
 * Tests del reparto del nombre de plaga. Los cuatro casos son reales: son las
 * únicas cuatro plagas del corpus cuyo nombre del MAPA lleva coma.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nombrePlaga, conSinonimos } from './nombres.ts'

test('el nombre sin coma se queda como está', () => {
  const n = nombrePlaga('Repilo del olivo', 'Venturia oleaginea')
  assert.equal(n.principal, 'Repilo del olivo')
  assert.deepEqual(n.sinonimos, [])
  assert.equal(n.cientifico, 'Venturia oleaginea')
})

test('el segundo nombre común sale del título', () => {
  // «Algodón del olivo, tramilla en otros cultivos» no lo dice nadie.
  const n = nombrePlaga('Algodón del olivo, tramilla', 'Euphyllura olivina')
  assert.equal(n.principal, 'Algodón del olivo')
  assert.deepEqual(n.sinonimos, ['tramilla'])
})

test('un taxón suelto es nombre científico, no un sinónimo', () => {
  // El volcado exige binomio de dos palabras, así que «Pseudococcidae» —una
  // familia— se quedaba dentro del nombre común y salía en el H1.
  const n = nombrePlaga('Cochinillas harinosas, Pseudococcidae', null)
  assert.equal(n.principal, 'Cochinillas harinosas')
  assert.deepEqual(n.sinonimos, [])
  assert.equal(n.cientifico, 'Pseudococcidae')
})

test('los otros dos casos del corpus', () => {
  assert.equal(nombrePlaga('Prays, polilla del olivo', 'Prays oleae').principal, 'Prays')
  assert.equal(nombrePlaga('Aceituna jabonosa, antracnosis', 'Glomerella cingulata').principal, 'Aceituna jabonosa')
})

test('un científico ya separado no se toca', () => {
  const n = nombrePlaga('Mosca del olivo', 'Bactrocera oleae')
  assert.equal(n.cientifico, 'Bactrocera oleae')
})

test('los sinónimos se muestran aparte, no en el título', () => {
  assert.equal(
    conSinonimos(nombrePlaga('Algodón del olivo, tramilla', 'Euphyllura olivina')),
    'Algodón del olivo (también tramilla)'
  )
  assert.equal(conSinonimos(nombrePlaga('Repilo del olivo', 'Venturia oleaginea')), 'Repilo del olivo')
})
