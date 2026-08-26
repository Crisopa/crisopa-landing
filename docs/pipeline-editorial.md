# Pipeline editorial del corpus de plagas

Plan acordado para convertir las 95 páginas de tabla en contenido con criterio
agronómico. Estado: **decidido, sin implementar**.

## Punto de partida

El corpus existe y está en producción: 95 páginas generadas por tres plantillas
a partir de `src/data/plagas.json`. El problema es que son un volcado — tabla y
nada más, sin prosa, con hermanas que se solapan hasta el 100%.

Lo que falta es la capa editorial. Lo que **no** falta es nada de datos.

## Arquitectura: tres capas por ciclo de vida

| Capa | Qué es | Ritmo | Quién |
|---|---|---|---|
| **Datos** | Registro del MAPA: productos, dosis, plazos | Semanal, automático | La base de datos. Nunca el LLM |
| **Editorial** | Prosa: biología, comparativa de familias, estrategia | Una vez, se regenera a demanda | LLM |
| **Composición** | La página que junta las dos | En cada build | Astro |

La propiedad que importa: **el LLM no toca nunca los datos**. Una alucinación
puede estropear la prosa, jamás una dosis ni un plazo de seguridad.

Efecto lateral útil: el raíl automático escribe `plagas.json` y el editorial
escribe `src/content/`. Nunca tocan el mismo fichero, así que el bot semanal y
el trabajo manual no pueden chocar.

## Sin revisión humana

Decidido explícitamente: **no hay puerta de revisión**. El razonamiento es del
usuario y es bueno — un revisor en la página 87 de 90 firma sin leer, y una
revisión que no se va a hacer no es un control, es un tapón.

Esto no es contenido con repercusión legal: es información, no una orden de
tratamiento. Si alguien detecta un fallo, se corrige y ya.

Lo que sustituye a la revisión:

- **Radio de daño acotado**: una ficha mala afecta a sus páginas y a ninguna más.
- **Despliegue por tandas**, mirando Search Console entre una y otra.
- **Canal de corrección**: enlace visible en cada página, y arreglar debe ser
  editar la ficha y hacer push. Si la política es publicar y corregir, la mitad
  de corregir tiene que existir de verdad.

## El eje del contenido: familias y modos de acción

El núcleo de la prosa es la **comparativa entre tipos de producto** — piretroides,
organofosforados, cobres — no entre marcas comerciales.

El motivo agronómico: un asesor que mira 47 nombres comerciales no puede ver que
31 comparten modo de acción, y se rota entre modos de acción, no entre marcas.
Alternar tres piretroides no gestiona resistencia, selecciona resistencia.

Es además contenido que ningún competidor da y que sale de un `GROUP BY`.

### Cómo se obtiene la familia

**No está en la base de datos.** `mapa.sustancias` tiene `id`, `nombre`,
`nombre_ue`, `apto_eco` y `categoria_eco`. Ni familia ni grupo IRAC/FRAC.

Decisión: **no se toca la ETL ni la base de datos**. El pipeline hace un
`DISTINCT` de materias activas de la plaga y el LLM las etiqueta por familia en
la misma pasada en que escribe la comparativa. Sin fichero de mapeo intermedio.

Se acepta el coste: la misma sustancia podría clasificarse distinto en dos
plagas. Es clasificación de manual y la deriva sería rara.

Datos medidos por si hicieran falta más adelante:

- 149 materias activas individuales en el corpus (las 178 cadenas del campo
  `sustancias` son combinaciones unidas por `" + "`).
- `nombre_ue` normaliza las variantes sucias: 369 nombres → 334 nombres europeos.
  Ejemplo: las cuatro grafías de «aceite de parafina» colapsan a tres.
- `categoria_eco` no sirve como familia (5 valores, 298 nulos) pero agrupa 44
  microorganismos, 7 cobres y 2 de origen vegetal.

## Qué se genera

| Unidad | Cuántas | Dónde cae | Contenido |
|---|---:|---|---|
| Ficha de plaga | 26 | `/plagas/<plaga>/` | Qué es, síntomas, ciclo, biología |
| Ficha de par | 68 | `/plagas/<plaga>/<cultivo>/` | **Cómo tratarla en ese cultivo** |
| Composición | calculada | páginas de par | Cuántos productos y familias hay aquí |

Se escribe por par porque **la demanda está en el par**: la gente busca cómo
tratar una plaga en un cultivo concreto, y son las 68 páginas que se llevan el
tráfico. La objeción inicial a escribir 68 fichas era el coste de revisarlas;
sin revisión, 94 llamadas cuestan lo mismo que 26.

### La regla que evita 68 textos casi idénticos

**La ficha de par no repite la biología.** Eso vive en la de plaga y se enlaza.
Dos líneas de contexto al principio sí, la sección entera no.

Motivos: duplicado interno que canibaliza a la página de plaga; el usuario que
busca «tratamiento repilo olivo» quiere la tabla, no el ciclo del hongo; y una
biología en un sitio no se desincroniza de sus 68 copias.

Lo que sí es propio del par y da texto genuinamente distinto: momento fenológico
del cultivo, familias autorizadas en ese cultivo concreto, y el plazo de
seguridad frente al momento de recolección.

### Secciones de la ficha de plaga

1. **Qué es** — común, científico, tipo de organismo, cultivos que afecta.
2. **Síntomas y daño** — cómo se reconoce en campo, qué órgano ataca, qué pérdida.
3. **Ciclo y condiciones** — qué la dispara, en qué momento del año.
4. **Cuándo tratar** — umbral y momento de aplicación.
5. **Comparativa de familias** — modos de acción disponibles, cómo actúa cada
   uno, persistencia, efecto sobre fauna auxiliar.
6. **Estrategia** — rotación entre modos de acción, qué queda para ecológico,
   medidas culturales.

Las secciones 1-4 salen del conocimiento del modelo. Las 5 y 6 van ancladas al
briefing, para que hablen de lo que de verdad hay en la tabla.

## El flujo

```
plagas.json ──► briefing ──► claude -p ──► src/content/ ──► build
   (ya está)     (código)      (LLM)         (markdown)      (Astro)
```

1. **Extraer** — `DISTINCT` de materias activas, cuántos productos de cada una,
   cuáles son eco, rango de plazos de seguridad.
2. **Briefing** — ese listado + nombre común y científico + cultivos con página.
3. **Redactar** — una llamada por unidad.
4. **Guardar** — `src/content/plagas/<slug>.md`.
5. **Build** — Astro compone prosa + tabla.

## Dónde vive: en la landing, en `scripts/`

Junto a `volcar-plagas.mjs`. Razones:

1. Los dos extremos ya están aquí — lee `plagas.json`, escribe `src/content/`.
   Desde `crisopa-functions` habría que escribir en este repo por la API de
   GitHub para acabar en el mismo sitio.
2. Iterar el prompt exige ver la página renderizada: `npm run dev` y recargar.
3. Se ejecuta a demanda, no en horario. Sin scheduler ni Secret Manager.
4. El prompt es contenido, y el contenido va con el sitio.

**Repo nuevo, no**: son ~200 líneas cuyo único consumidor es la landing.

En `crisopa-functions` se queda solo lo que necesita calendario: refrescar
`plagas.json` los domingos y avisar de qué plagas tienen materias activas nuevas.
**Generar prosa no se automatiza** — republicar textos reescritos cada semana no
interesa.

### Invocación

```bash
claude -p --system-prompt "$ROL" --disallowedTools "Read Write Edit Bash" \
        --model opus < briefing.md > src/content/plagas/repilo-del-olivo.md
```

- `--system-prompt` (no `--append-`) sustituye el prompt de Claude Code entero:
  deja de comportarse como agente de código y actúa como redactor.
- Herramientas denegadas: el briefing debe ser su única entrada.
- **`--bare` no**, aunque lo parezca: fuerza `ANTHROPIC_API_KEY`, justo lo que se
  quiere evitar usando la suscripción.
- Con 94 llamadas secuenciales tarda; lanzar 3 o 4 en paralelo.

## Abierto

- ¿Opus para las 94 unidades, o sonnet y opus solo donde haya más volumen?
- Los 17 pares con tablas idénticas siguen siendo duplicados: la ficha no lo
  arregla porque tendrán también composiciones idénticas. Fusión pendiente
  aparte, con coste de 17 redirecciones 301.
- La función semanal (`feat/corpus-plagas-semanal` en `crisopa-functions`) sigue
  sin mergear ni desplegar; le falta el secreto `LANDING_GITHUB_TOKEN`.
- Dar de alta `https://crisopa.app/sitemap-index.xml` en Search Console.
