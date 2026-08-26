# Pipeline editorial del corpus de plagas

Plan acordado para convertir las 95 páginas de tabla en contenido con criterio
agronómico. Estado: **decidido, sin implementar**.

## Punto de partida

El corpus existe y está en producción: 95 páginas generadas por tres plantillas
a partir de `src/data/plagas.json`. El problema es que son un volcado — tabla y
nada más, sin prosa, con hermanas que se solapan hasta el 100%.

Lo que falta es la capa editorial. Lo que **no** falta es nada de datos.

### De dónde sale `plagas.json`

`scripts/volcar-plagas.mjs`, a mano y nunca en el build: la landing se despliega
en Vercel sin credenciales de base de datos, y hacer que un deploy dependa de
producción es pedir que un día no despliegue. El JSON se commitea. Cruza dos
fuentes:

- **La base de datos de `crisopa-app`** (Prisma). De ahí salen productos, dosis y
  plazos, filtrando por registro vigente y no caducado.
- **`~/dev/projects/Crisopa/seo/paginas-prioritarias.csv`**, que decide qué 68
  pares tienen página y con qué volumen de búsqueda.

**Ese CSV no está en ningún repositorio.** Es el único sitio donde vive qué
páginas existen y por qué esas: con la base de datos intacta y el fichero
perdido, el corpus no se puede regenerar. Y bloquea el plan de la función
semanal, porque un script en la nube no puede leer un fichero del portátil.
Mudarlo a `src/data/` es de las primeras cosas que hacer.

## Arquitectura: tres capas por ciclo de vida

| Capa | Qué es | Ritmo | Quién |
|---|---|---|---|
| **Datos** | Registro del MAPA: productos, dosis, plazos | Semanal, automático | La base de datos. Nunca el LLM |
| **Editorial** | Prosa: biología, comparativa de familias, estrategia | Una vez, se regenera a demanda | LLM |
| **Composición** | La página que junta las dos | En cada build | Astro |

La propiedad que importa: **el LLM no toca nunca los datos**. Una alucinación
puede estropear la prosa, jamás una dosis ni un plazo de seguridad. Quien la
sostiene no es la separación de ficheros sino el validador; ver más abajo.

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

- **Un validador en código** que corre sobre cada ficha antes de guardarla. Es
  el sustituto de verdad, y tiene sección propia más abajo.
- **Radio de daño acotado**: una ficha mala afecta a sus páginas y a ninguna más.
- **Despliegue por tandas**, mirando Search Console entre una y otra.
- **Canal de corrección**: enlace visible en cada página, y arreglar debe ser
  editar la ficha y hacer push. Si la política es publicar y corregir, la mitad
  de corregir tiene que existir de verdad.

El validador no reabre la puerta que se acaba de cerrar. Lo que se rechazó es
leer 94 páginas; lo que esto pide es mirar la lista de las que no pasaron, que
serán unas pocas. Un revisor que lee cuatro fichas marcadas sí lee.

## El validador

Un módulo sin LLM que recibe el markdown recién generado y devuelve una lista de
hallazgos con severidad. Corre entre redactar y guardar, y su coste por página es
cero: es código.

### La regla dura: la prosa no habla de cifras

La propiedad que sostiene todo el diseño — «el LLM no toca nunca los datos» — hoy
descansa solo en que el editorial escribe en `src/content/` y el raíl automático
en `plagas.json`. Ficheros distintos, sí, pero nada impide que la prosa diga
«aplica 0,5 l/ha y respeta 14 días de plazo». El fichero es otro; el dato
inventado llega igual a la página, y encima con la autoridad de ir en el texto.

Separar ficheros no es la garantía. Esta sí:

> **Bloqueante.** La prosa no puede contener una cifra con unidad de dosis
> (`l/ha`, `kg/ha`, `cc/hl`…) ni un plazo en días. Eso lo pinta Astro desde la
> tabla.

Es un regex corto, no admite discusión y convierte una intención en una
propiedad verificada. Si el modelo quiere decir que hay margen entre tratamiento
y recolección, lo dice en palabras y enlaza a la tabla.

### Los nombres comerciales son aviso, no bloqueante

Esto se midió antes de escribirlo, y por poco sale mal. El corpus tiene **743
nombres comerciales, 256 de ellos de una sola palabra**, y entre las marcas
registradas están `COBRE`, `CALDO BORDELES`, `CORAL`, `CORE`, `AZAR`, `BIO`,
`ULTRA` y `FLECHA`.

Dos colisiones bastan para ver el problema:

- **`COBRE`** es una marca y es una de las familias que el plan pide comparar.
- **`CYDIA` y `TUTA`** son marcas y son los géneros de *Cydia pomonella* y
  *Tuta absoluta*. Una ficha que escriba bien el nombre científico daría
  bloqueante.

Una regla que prohíbe escribir «cobre» en una comparativa de familias no protege
nada: se desactiva a la tercera ficha. Así que:

- Se comprueban **nombres de dos o más palabras** («DECIS PROTECH»), que son
  inequívocos, y los de una palabra a partir de siete letras.
- Con **lista de excepciones** para las que son vocabulario agronómico.
- Y como **aviso**, no bloqueante. Que la prosa nombre una marca es un problema
  editorial —el plan quiere familias, no marcas—, no un riesgo de dato falso.
  El riesgo de dato falso son las cifras, y esas ya están bloqueadas arriba.

### Qué comprueba el código y qué se le pide al prompt

La distinción importa por una razón práctica: cambiar una regla de la primera
columna exige tocar el repositorio, y cambiar una de la segunda es editar un
texto. Conviene saber de antemano cuál es cuál.

| Regla | Dónde vive | Severidad |
|---|---|---|
| Sin cifras de dosis ni plazos en días en la prosa | Código | Bloqueante |
| Toda URL emitida está en la lista de enlazables | Código | Bloqueante |
| La ficha de par enlaza a su ficha de plaga | Código | Bloqueante |
| Las preguntas del `FAQPage` son las del texto visible | Código | Bloqueante |
| Sin H4, jerarquía de encabezados sin saltos | Código | Bloqueante |
| Sin nombres comerciales, salvo excepciones | Código | Aviso |
| El primer párrafo de cada H2 tiene 40-55 palabras | Código | Aviso |
| Ninguna frase pasa de 30 palabras | Código | Aviso |
| La ficha de par no repite la sección de biología | Código | Aviso |
| Apertura distinta de las prohibidas | Código | Aviso |
| Longitud dentro del rango de su tipo de ficha | Código | Aviso |
| Nombre científico en cursiva, común en redonda | Código | Aviso |
| Familias por modo de acción, no por marca | Prompt | — |
| Registro de asesor, no de folleto | Prompt | — |
| Solo materias activas que estén en el briefing | Prompt | — |

Ante la duda entre bloqueante y aviso, es aviso. Una rúbrica que bloquea por
todo se ignora entera al tercer uso.

### Qué pasa con un bloqueante

Un reintento con los hallazgos añadidos al briefing. Si vuelve a fallar, la ficha
**no se guarda** y va al informe del lote. No se reintenta en bucle: cada vuelta
cuesta dinero y el tercer intento no suele arreglar lo que fallaron los dos
primeros.

### Auditoría de lote

Al terminar las 94, el informe agregado de hallazgos. Lo valioso no son los
fallos sueltos sino los repetidos: **lo que falla en más de un tercio de las
fichas no es un error de redacción, es una regla que falta en el prompt**. Ese es
el bucle para iterar el prompt sin leerse el corpus entero.

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

## Enlazado: lista cerrada

Las 95 URLs del corpus se conocen antes de generar nada, así que el briefing
lleva la lista de destinos válidos y el validador comprueba que toda URL emitida
esté en ella. Cero enlaces inventados, por construcción.

La regla que hay detrás: **inventarse una URL que parece correcta es peor que no
enlazar**, porque llega a producción con aspecto de estar bien y solo se descubre
cuando alguien la pincha.

Destinos, por prioridad:

1. **La ficha de plaga**, desde cada uno de sus pares. Obligatorio: es lo que
   sostiene la regla de no repetir la biología.
2. **Los pares hermanos** — la misma plaga en otros cultivos, cuando la
   comparación aporta.
3. **Otras plagas del mismo cultivo**, que es como piensa quien tiene la finca
   delante.

Anclas de dos a cinco palabras que describen el destino, nunca «aquí» ni «más
información». Y repartidas por el texto: cuatro enlaces en la entradilla y
ninguno después no es enlazado interno, es una salida temprana.

## Que te puedan citar

Un buscador enseña un enlace; un modelo resume y cita. Lo segundo solo pasa si el
texto tiene trozos autocontenidos, y este corpus es exactamente el tipo de
contenido que se consulta preguntando.

- **El primer párrafo de cada H2 responde a lo que pregunta ese H2**, en 40-55
  palabras, sin pronombres que apunten fuera («esto», «como decíamos») y con
  sujeto explícito. La prueba: copiar solo ese párrafo y leerlo en frío.
- **Bloque de FAQ** al cierre, de tres a seis preguntas reales — las que alguien
  escribiría en un buscador — con respuestas de dos a cuatro frases. No variantes
  de la keyword para rellenar, y sin repetir literalmente un H2.
- **`FAQPage` en JSON-LD** generado del mismo array que pinta el acordeón visible.
  Si divergen, el marcado miente.

Efecto lateral que interesa aquí más que el GEO: obligar a que cada H2 se sostenga
solo es la mejor defensa contra las 68 fichas de par casi idénticas.

`src/lib/schema.ts` ya tiene `faqSchema()` y la home lo usa con `src/lib/faqs.ts`.
Reutilizarlo pide un cambio pequeño: **el `@id` está fijado a `${SITIO}/#faq`**,
que en 68 páginas serían 68 nodos con el mismo identificador. Hay que
parametrizarlo con la ruta de la página.

## El flujo

```
plagas.json ──► briefing ──► esquema ──► prosa ──► validador ──► src/content/ ──► build
   (ya está)     (código)    (sonnet)   (opus)      (código)      (markdown)     (Astro)
                                 │                      │
                            solapamiento           informe del lote
```

1. **Extraer** — `DISTINCT` de materias activas, cuántos productos de cada una,
   cuáles son eco, rango de plazos de seguridad.
2. **Briefing** — ese listado + nombre común y científico + cultivos con página +
   la lista cerrada de URLs enlazables.
3. **Esquema** — solo los 68 pares. Devuelve H2 y ángulo, nada de prosa.
4. **Redactar** — una llamada por unidad, con el esquema ya fijado.
5. **Validar** — sin LLM. Bloqueante: un reintento y fuera. Aviso: se anota.
6. **Guardar** — `src/content/plagas/<slug>.md`.
7. **Build** — Astro compone prosa + tabla.

### Por qué el esquema es un paso aparte

Porque **un esquema malo cuesta dos minutos de corregir y una ficha de 900
palabras mal enfocada hay que tirarla**. Los 68 esquemas salen baratos, caben
todos juntos en una pantalla y ahí se ve de un vistazo qué hermanas se estaban
solapando — antes de pagar la prosa, no después de leerla.

Es además lo que resuelve el reparto de modelos: **sonnet para los esquemas, opus
para la prosa**. La pregunta no era opus o sonnet, era en qué paso cada uno.

Los pasos 3 y 5 son los dos añadidos. El 5 no cuesta llamadas y el 3 cuesta 68
baratas; a cambio, entre los dos cubren los dos riesgos reales de generar 94
fichas sin que nadie las lea: que digan algo falso y que digan todas lo mismo.

## El contrato con Astro

Cuatro cosas que el plan daba por supuestas y la implementación necesita fijadas.
Ninguna es una decisión abierta: se resuelven solas en cuanto se miran.

**La colección no existe todavía.** No hay `src/content/` ni content config; hay
que crearlos. Dos colecciones, `plagas` y `pares`, con el slug como identidad.

**Las FAQ van en el frontmatter, no en el cuerpo.** Estructuradas, como array de
`{ pregunta, respuesta }`. Es la misma razón por la que la home tiene
`src/lib/faqs.ts` en vez de las preguntas escritas en el componente: el acordeón
visible y el `FAQPage` salen del mismo array, y así no pueden desincronizarse.
Si las FAQ fueran markdown suelto habría que parsearlas para emitir el JSON-LD, y
un parser es justo el sitio donde se desincronizan.

**Sin ficha, la página se renderiza igual.** La prosa es opcional en la
plantilla: si no hay entrada en la colección, sale la página que ya está en
producción hoy. Sin esto no hay despliegue por tandas, que es una de las tres
cosas que sustituyen a la revisión.

**Los números que faltaban**, ajustables cuando se vea la primera tanda:

| Qué | Valor de partida |
|---|---|
| Ficha de plaga | 600-900 palabras |
| Ficha de par | 350-600 palabras |
| FAQ por ficha | 3-6 preguntas |
| Aperturas prohibidas | «En el mundo de», «A la hora de», «Es importante destacar», «Cuando se trata de», y empezar repitiendo el H1 |

## Dónde vive: en la landing, en `scripts/`

Junto a `volcar-plagas.mjs`. Razones:

1. Los dos extremos ya están aquí — lee `plagas.json`, escribe `src/content/`.
   Desde `crisopa-functions` habría que escribir en este repo por la API de
   GitHub para acabar en el mismo sitio.
2. Iterar el prompt exige ver la página renderizada: `npm run dev` y recargar.
3. Se ejecuta a demanda, no en horario. Sin scheduler ni Secret Manager.
4. El prompt es contenido, y el contenido va con el sitio.

**Repo nuevo, no**: son unos cientos de líneas cuyo único consumidor es la
landing. El validador es la mitad de ellas, y va en `src/lib/` en vez de en
`scripts/`, porque comprobar el markdown es algo que la propia página querrá
hacer en el build.

En `crisopa-functions` se queda solo lo que necesita calendario: refrescar
`plagas.json` los domingos y avisar de qué plagas tienen materias activas nuevas.
**Generar prosa no se automatiza** — republicar textos reescritos cada semana no
interesa.

### Invocación

```bash
claude -p --system-prompt "$ROL" --disallowedTools "Read Write Edit Bash" \
        --model opus < briefing.md > borrador.md
```

La salida va a un temporal, no directamente a `src/content/`: quien decide si esa
ficha se guarda es el validador.

- `--system-prompt` (no `--append-`) sustituye el prompt de Claude Code entero:
  deja de comportarse como agente de código y actúa como redactor.
- Herramientas denegadas: el briefing debe ser su única entrada.
- **`--bare` no**, aunque lo parezca: fuerza `ANTHROPIC_API_KEY`, justo lo que se
  quiere evitar usando la suscripción.
- Con 94 llamadas secuenciales tarda; lanzar 3 o 4 en paralelo.
- La pasada de esquemas es la misma invocación con `--model sonnet` y otro rol.

## Abierto

- Los 17 pares con tablas idénticas siguen siendo duplicados: la ficha no lo
  arregla porque tendrán también composiciones idénticas. Fusión pendiente
  aparte, con coste de 17 redirecciones 301.
- `paginas-prioritarias.csv` sigue fuera de git y fuera del repo. Es una pérdida
  irrecuperable esperando a pasar, y bloquea la función semanal.
- La función semanal (`feat/corpus-plagas-semanal` en `crisopa-functions`) sigue
  sin mergear ni desplegar; le falta el secreto `LANDING_GITHUB_TOKEN` y, antes
  que eso, que la lista de pares esté en un sitio que ella pueda leer.
- Dar de alta `https://crisopa.app/sitemap-index.xml` en Search Console.

## Procedencia

El validador, el reparto entre reglas de código y reglas de prompt, el enlazado
con lista cerrada, el bloque de GEO/AEO, el esquema previo a la prosa y la
auditoría de lote vienen de **Content Hub**, el hub editorial de Genially
(`lab/content_hub`). Allí resuelven el mismo problema a otra escala: pipeline de
agentes, RAG y seis idiomas, con revisión humana obligatoria.

Lo que se ha traído es solo lo que funciona sin esa maquinaria. Nada de colas,
base de conocimiento, roles ni puerta de aprobación: aquí son 95 páginas de un
proyecto de una persona, y la decisión de publicar sin revisar sigue en pie.
