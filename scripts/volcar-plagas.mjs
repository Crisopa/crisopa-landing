/**
 * Vuelca de la base de datos los pares cultivo × plaga que tienen página, a
 * `src/data/plagas.json`.
 *
 * Se ejecuta a mano (`node scripts/volcar-plagas.mjs`), NO en cada build: la
 * landing se despliega en Vercel sin credenciales de la base de datos, y hacer
 * que un deploy dependa de producción es pedir que un día no despliegue.
 * El JSON generado se commitea.
 *
 * La lista de pares sale de `src/data/paginas-prioritarias.csv`, que cruza
 * demanda de búsqueda medida contra el registro del MAPA. Vivía fuera de todo
 * repositorio y se trajo aquí: era el único sitio donde constaba qué páginas
 * existen y por qué esas, así que perder esa carpeta era perder el corpus
 * aunque la base de datos siguiera intacta. Además, la función semanal que ha
 * de refrescar este JSON no puede leer un fichero de un portátil.
 */

import { createRequire } from 'node:module'
import { writeFileSync, mkdirSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const APP = '/home/pablo/dev/projects/Crisopa/crisopa-app'
const { PrismaClient } = require(`${APP}/node_modules/@prisma/client`)
require(`${APP}/node_modules/dotenv`).config({ path: `${APP}/.env` })

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CSV = resolve(RAIZ, 'src/data/paginas-prioritarias.csv')

const prisma = new PrismaClient()

/** Quita acentos, signos y espacios para construir URLs legibles. */
function slug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * El MAPA nombra los agentes como «común, común, Científico binomial»:
 * «Repilo del olivo, Venturia oleaginea», «Prays, polilla del olivo, Prays oleae».
 * Separamos la parte común (la que busca la gente, y de la que sale el slug) del
 * binomial latino final, que va como subtítulo.
 */
function partirNombre(nombreMapa) {
  const trozos = nombreMapa.split(',').map((t) => t.trim())
  const ultimo = trozos[trozos.length - 1]
  const esBinomial = /^[A-Z][a-z]+\s+(spp\.|[a-z]+)/.test(ultimo) && trozos.length > 1
  return {
    comun: (esBinomial ? trozos.slice(0, -1) : trozos).join(', '),
    cientifico: esBinomial ? ultimo : null,
  }
}

function leerPares() {
  const lineas = readFileSync(CSV, 'utf8').trim().split('\n').slice(1)
  return lineas.map((linea) => {
    // Campos entrecomillados con comas dentro: parseo mínimo pero suficiente.
    const campos = linea.match(/("([^"]*)"|[^,]+)/g).map((c) => c.replace(/^"|"$/g, ''))
    return {
      plagaMapa: campos[0],
      cultivo: campos[1],
      volumenKw: Number(campos[3]),
    }
  })
}

/** Productos autorizados y vigentes para un par, con su uso concreto. */
async function productosDe(plagaMapa, cultivo) {
  return prisma.$queryRawUnsafe(
    `SELECT p.nombre, p.num_registro, p.titular, p.formulado, p.apto_ecologico,
            p.fecha_caducidad,
            u.dosis_min, u.dosis_max, u.dosis_unidad,
            u.plazo_seguridad_dias, u.num_max_aplicaciones,
            u.intervalo_aplicaciones_dias, u.metodo_aplicacion,
            string_agg(DISTINCT s.nombre, ' + ') AS sustancias
     FROM mapa.usos_autorizados u
     JOIN public.productos p ON p.id_producto = u.producto_id
     LEFT JOIN mapa.producto_sustancias ps ON ps.producto_id = p.id_producto
     LEFT JOIN mapa.sustancias s ON s.id = ps.sustancia_id
     WHERE u.agente = $1
       AND u.cultivo = $2
       -- Solo registros vigentes. Publicar como «autorizado» algo cancelado o
       -- caducado induce a un tratamiento ilegal: el filtro no es cosmético.
       AND p.estado = 'Vigente'
       AND (p.fecha_cancelacion IS NULL OR p.fecha_cancelacion > now())
       AND (p.fecha_caducidad   IS NULL OR p.fecha_caducidad   > now())
     GROUP BY p.id_producto, p.nombre, p.num_registro, p.titular, p.formulado,
              p.apto_ecologico, p.fecha_caducidad, u.id, u.dosis_min, u.dosis_max,
              u.dosis_unidad, u.plazo_seguridad_dias, u.num_max_aplicaciones,
              u.intervalo_aplicaciones_dias, u.metodo_aplicacion
     ORDER BY p.nombre`,
    plagaMapa,
    cultivo
  )
}

const num = (v) => (v === null || v === undefined ? null : Number(v))

/**
 * El registro trae una fila por método de aplicación, así que el mismo producto
 * aparece hasta tres veces con idéntica dosis y plazo. Se agrupa por lo que de
 * verdad distingue un uso —producto, dosis y plazo— y los métodos se juntan en
 * una lista. Si un producto sí tiene dos dosis distintas, siguen saliendo dos
 * filas, que es lo correcto: son usos diferentes.
 */
function agruparUsos(filas) {
  const porClave = new Map()
  for (const f of filas) {
    const clave = [f.num_registro, f.dosis_min, f.dosis_max, f.dosis_unidad, f.plazo_seguridad_dias].join('|')
    const previo = porClave.get(clave)
    if (previo) {
      if (f.metodo_aplicacion && !previo.metodos.includes(f.metodo_aplicacion)) {
        previo.metodos.push(f.metodo_aplicacion)
      }
      continue
    }
    porClave.set(clave, {
      nombre: f.nombre,
      registro: f.num_registro,
      titular: f.titular,
      formulado: f.formulado,
      sustancias: f.sustancias,
      eco: f.apto_ecologico === true,
      dosisMin: num(f.dosis_min),
      dosisMax: num(f.dosis_max),
      dosisUnidad: f.dosis_unidad,
      plazo: f.plazo_seguridad_dias,
      maxAplicaciones: f.num_max_aplicaciones,
      intervalo: f.intervalo_aplicaciones_dias,
      metodos: f.metodo_aplicacion ? [f.metodo_aplicacion] : [],
    })
  }
  return [...porClave.values()]
}

async function main() {
  const pares = leerPares()
  const salida = []
  let descartados = 0

  for (const par of pares) {
    const usos = agruparUsos(await productosDe(par.plagaMapa, par.cultivo))

    // Un par sin productos vigentes no tiene página: sería un listado vacío,
    // justo el contenido sin valor que penaliza el rastreo de un dominio joven.
    if (usos.length < 5) {
      descartados++
      console.log(`  descartado (${usos.length} vigentes): ${par.plagaMapa} × ${par.cultivo}`)
      continue
    }

    const { comun, cientifico } = partirNombre(par.plagaMapa)
    salida.push({
      plagaMapa: par.plagaMapa,
      plaga: comun,
      cientifico,
      plagaSlug: slug(comun),
      cultivo: par.cultivo,
      cultivoSlug: slug(par.cultivo),
      volumenKw: par.volumenKw,
      productos: usos,
    })
  }

  // Fecha del volcado: la página la muestra para que el lector sepa a qué día
  // corresponde el registro. Un vademécum sin fecha no vale nada.
  const datos = { actualizado: new Date().toISOString().slice(0, 10), pares: salida }

  mkdirSync(`${RAIZ}/src/data`, { recursive: true })
  writeFileSync(`${RAIZ}/src/data/plagas.json`, JSON.stringify(datos, null, 1))

  const productos = salida.reduce((n, p) => n + p.productos.length, 0)
  console.log(`\npares con página: ${salida.length} (descartados ${descartados})`)
  console.log(`filas de producto: ${productos}`)
  console.log(`plagas distintas: ${new Set(salida.map((p) => p.plagaSlug)).size}`)
}

main().finally(() => prisma.$disconnect())
