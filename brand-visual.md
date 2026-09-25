# Guía visual — Crisopa

Fuente de verdad del estilo visual de Crisopa. La web se adapta a esta guía,
no al revés. Si algo de la web la contradice, el error está en la web.

Complementa a [`brand-voice.md`](brand-voice.md): la voz dice cómo hablamos,
esta guía dice cómo nos vemos. Las dos cuentan lo mismo.

**Alcance:** marca y web. Los fundamentos (color, tipografía, iconos, símbolo)
sirven también para la app; sus reglas de componentes llegarán en una segunda
fase.

---

## La idea: precisión en movimiento

Crisopa se ve como una herramienta rigurosa con la que se trabaja de otra
forma, más rápido.

- **Precisión**, porque el asesor responde de lo que firma. Todo lo que ve
  tiene que decirle «esto está hecho con rigor, los datos están bien».
- **Movimiento**, porque la novedad se demuestra, no se dice. En vez de
  adjetivos, se ve a Crisopa trabajando.

En los primeros cinco segundos, un asesor debe sentir dos cosas: **precisión
técnica** y **una forma nueva de trabajar**.

> Nuevo en el fondo, sobrio en la forma.

---

## Principios

1. **El producto es la imagen.** Lo que se ve es Crisopa funcionando: una
   conversación en ChatGPT o Claude que termina en un dato estructurado. Nada
   de ilustración decorativa, auroras, fondos abstractos ni fotos. Si un
   elemento visual no enseña el producto, tiene que justificar por qué está.
2. **Un solo color.** Verde esmeralda para la marca y la acción. Todo lo demás
   son neutros teñidos de ese verde. Sin acento secundario. Si algo es verde,
   importa o se puede pulsar.
3. **El dato se ve como dato.** Lo técnico va en mono: SIGPAC, dosis, UF,
   plazos, nº de registro, fechas, numeraciones y etiquetas. La etiqueta con
   caret es nuestra firma.
4. **Claro para trabajar, oscuro para demostrar.** Base blanca con matiz verde.
   Las secciones oscuras se reservan para los momentos en que el producto se
   luce. Máximo dos por página.
5. **Se mueve lo que explica.** Se anima un flujo, un dato que se verifica, un
   registro que aparece. Nada flota, brilla ni pulsa por decorar.

---

## Color

### El verde de marca

Esmeralda, tono 170 en OKLCH. Es el único color con personalidad del sistema.

| Token | Valor | Uso |
|-------|-------|-----|
| `green-50` | `oklch(0.975 0.018 172)` | Fondo de estado activo, resaltado de dato |
| `green-100` | `oklch(0.935 0.042 172)` | Fondo de pastillas y badges |
| `green-200` | `oklch(0.875 0.072 171)` | Bordes de elementos activos |
| `green-300` | `oklch(0.785 0.110 171)` | Hover de la acción **sobre fondo oscuro** |
| `green-400` | `oklch(0.700 0.142 170)` | Acción y acento **sobre fondo oscuro** |
| `green-500` | `oklch(0.610 0.158 170)` | Caret, indicadores, iconos activos |
| `green-600` | `oklch(0.530 0.152 170)` | **Acción principal** (botón, enlace) |
| `green-700` | `oklch(0.452 0.136 170)` | Hover de la acción, texto verde sobre claro |
| `green-800` | `oklch(0.372 0.110 171)` | Texto verde enfático |
| `green-900` | `oklch(0.298 0.080 172)` | — (reservado) |
| `green-950` | `oklch(0.208 0.055 172)` | Base de iconos y símbolo en oscuro |

**Reglas del verde:**

- El verde significa **marca o acción**. No se usa para decorar: ni fondos de
  sección, ni manchas, ni halos.
- En una pantalla, el verde sólido (600) aparece en muy pocos sitios: la acción
  principal, el caret y el dato destacado.
- Texto verde sobre fondo claro: 700 o superior (contraste AA).

### Neutros teñidos

Los grises llevan una pizca del verde de marca (tono 170, croma muy bajo). Nunca
se usa un gris puro ni los grises por defecto de Tailwind (`gray-*`, `slate-*`).

**Modo claro (base):**

| Token | Valor | Uso |
|-------|-------|-----|
| `background` | `oklch(0.992 0.004 170)` | Fondo de página: blanco con matiz verde |
| `surface` | `oklch(1 0 0)` | Tarjetas y ventanas de producto: despegan del fondo |
| `surface-secondary` | `oklch(0.975 0.006 170)` | Zonas hundidas, fondos de tabla |
| `line` | `oklch(0.920 0.010 170)` | Raíles, separadores, bordes de 1px |
| `line-strong` | `oklch(0.870 0.014 170)` | Bordes de tarjeta y de botón secundario |
| `foreground-muted` | `oklch(0.520 0.014 170)` | Texto secundario, segunda parte del titular |
| `foreground` | `oklch(0.205 0.012 170)` | Tinta: negro con matiz verde |

**Modo oscuro (secciones de demostración):**

| Token | Valor | Uso |
|-------|-------|-----|
| `dark-background` | `oklch(0.185 0.026 172)` | Fondo: verde casi negro |
| `dark-surface` | `oklch(0.225 0.030 172)` | Ventanas y tarjetas sobre oscuro |
| `dark-line` | `oklch(0.310 0.030 172)` | Líneas de 1px, retícula de puntos |
| `dark-foreground-muted` | `oklch(0.720 0.020 170)` | Texto secundario |
| `dark-foreground` | `oklch(0.965 0.008 170)` | Texto principal |

### Colores de estado

Solo **dentro de la interfaz del producto** (en demos y en la app), nunca como
decoración de la web:

- **Correcto / verificado:** el verde de marca.
- **Error / no autorizado:** rojo, `oklch(0.577 0.215 27)`.
- **Aviso / revisar:** ámbar, `oklch(0.700 0.160 70)`. Es un color de estado,
  no de marca: aparece solo cuando la UI avisa de algo.

---

## Tipografía

Tres voces con papeles fijos. No se mezclan los papeles.

| Familia | Papel | Pesos |
|---------|-------|-------|
| **Sora** | Titulares y logo | 500–600 (logo: su propio peso) |
| **Geist** | Cuerpo, interfaz, botones | 400–500 |
| **Geist Mono** | Datos y etiquetas técnicas | 400–500 |

### Escala

| Nivel | Familia | Tamaño (móvil → escritorio) | Peso | Tracking | Interlineado |
|-------|---------|------------------------------|------|----------|--------------|
| Display (H1) | Sora | 44 → 72px | 600 | −0,04em | 1,02 |
| H2 | Sora | 32 → 48px | 600 | −0,03em | 1,08 |
| H3 | Sora | 20 → 24px | 600 | −0,02em | 1,25 |
| Entradilla | Geist | 18 → 20px | 400 | 0 | 1,55 |
| Cuerpo | Geist | 16px | 400 | 0 | 1,6 |
| Pequeño | Geist | 14px | 400–500 | 0 | 1,5 |
| Etiqueta | Geist Mono | 12px | 500 | +0,12em, mayúsculas | 1 |
| Dato | Geist Mono | 13–14px | 400 | 0 | 1,4 |

**Reglas:**

- **Titulares apretados.** Tracking negativo que crece con el tamaño, peso
  intermedio. Nunca 800 ni tracking normal en un titular grande: es la
  diferencia más visible entre una web correcta y una web hecha.
- **Titular en dos tonos.** Recurso de marca para H1 y H2 principales: la
  primera frase en `foreground`, la continuación en `foreground-muted`, mismo
  tamaño y peso.
  > **Empieza en minutos.** <span style="color:gray">Trabaja conversando.</span>

  El H1 del hero puede ir en un solo tono cuando es una frase única y rotunda
  («Tu copiloto agronómico»).
- **Nunca degradados en el texto.** La jerarquía sale del tamaño, el peso y el
  tono.
- **Cifras tabulares** (`font-variant-numeric: tabular-nums`) en toda cifra que
  cambie o se compare: contadores, tablas, dosis.
- Ancho de línea del cuerpo: 60–70 caracteres como máximo.

### Qué va en mono

Siempre y solo lo técnico:

- Etiquetas de sección (eyebrows) y numeración `01`, `02`, `03`.
- Referencias SIGPAC, nº de registro del MAPA, dosis, UF de NPK, plazos.
- Fechas en formato ISO (`2026-09-22`) y horas.

Nunca en mono: titulares, párrafos, botones.

---

## La etiqueta con caret

Nuestra firma. Encabeza cada sección: dice «esto es técnico y está vivo» en un
solo gesto.

```
01 · CÓMO FUNCIONA_
```

- Geist Mono, 12px, 500, mayúsculas, tracking +0,12em, color `green-700`.
- Numeración opcional delante (`01 ·`), en `foreground-muted`. Si una página
  numera sus secciones, las numera todas.
- El caret es una barra horizontal de 2px de alto y 0,62em de ancho, en
  `green-600`, separada 0,4em del texto, que parpadea (1,15s, paso seco).
- Con `prefers-reduced-motion`, el caret se queda fijo y visible.
- Una etiqueta por sección. No se usa como adorno dentro de tarjetas.

---

## Estructura: raíles y separadores

La página se ordena con líneas de 1px, como un plano, no con bloques de color.

```
   │                                  │
   │   01 · CÓMO FUNCIONA_            │
   │   Empieza en minutos             │
   │                                  │
───┼──────────────────────────────────┼───
   │                                  │
   │   02 · VERIFICACIÓN_             │
   │ ┌────────┬────────┬────────┐     │
   │ │ Coop A │ ATRIA  │ Coop B │     │
   │ └────────┴────────┴────────┘     │
───┼──────────────────────────────────┼───
```

- **Raíles:** dos líneas verticales de 1px en `line` que enmarcan la columna de
  contenido (ancho máximo 1200px) de arriba abajo. En móvil desaparecen.
- **Separadores:** las secciones claras se separan con una línea horizontal de
  1px que cruza de raíl a raíl, no con cambios de fondo.
- **Celdas:** logos de clientes y listas de ventajas van en celdas con bordes
  de 1px compartidos.
- **Sin cruces «+»** ni marcas de registro en las intersecciones. Los raíles y
  los separadores ya dan la sensación de plano; las cruces solo decoran y son
  un recurso de plantilla.
- Las líneas son siempre del neutro teñido, nunca gris puro ni verde.

### Medidas

| Medida | Escritorio | Tablet (≤ 860px) | Móvil (≤ 560px) |
|--------|-----------|------------------|-----------------|
| Ancho máximo de la columna | 1200px | 1200px | Toda la pantalla |
| Margen lateral dentro de los raíles | 56px | 24px | 16px |
| Relleno vertical de sección | 88px | 64px | 56px |
| Raíles | Sí | Sí | No |

---

## Composición

### Cabecera de sección

La cabecera por defecto de una sección es **partida**: etiqueta y titular a la
izquierda, entradilla a la derecha, todo alineado a la izquierda. Nada de
cabeceras centradas.

```
01 · CÓMO FUNCIONA_
Empieza en minutos        Conéctala una vez y, a partir de ahí,
                          trabajas conversando: por voz o por escrito.
```

- **La etiqueta va sola en su fila**, encima del titular.
- **Titular y entradilla alineados por arriba:** el borde superior de las
  mayúsculas del titular coincide con el de la primera línea de la entradilla.
  No se alinean por abajo ni por la línea base: si la entradilla es más alta
  que el titular, quedaría descolgada.
- Dos columnas iguales, separadas 56px. En tablet y móvil, una columna: etiqueta,
  titular y entradilla apilados.
- Si la sección no tiene entradilla, etiqueta y titular solos, sin columna
  derecha vacía.

### Titulares

- **Hero:** una frase rotunda, un solo tono, sin punto final
  («Tu copiloto agronómico»).
- **H2 de dos partes:** dos tonos (ver Tipografía), con punto en cada parte.
- **H2 de una parte:** un solo tono, sin punto final
  («El único conectado a ChatGPT y Claude»).

### Numeración de secciones

- En la home, las secciones se numeran `01`, `02`… en el orden real en que
  aparecen. Si se añade, quita o reordena una sección, se renumera.
- El hero y los cierres (CTA) no llevan número.
- Una sección que continúa a la anterior no lleva etiqueta ni número propios.
- En páginas que no son una secuencia (legales, corpus de plagas), etiquetas
  sin número.

---

## Superficies

Una escala cerrada. No se inventan radios ni sombras a ojo.

### Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 6px | Badges, `kbd`, campos pequeños |
| `radius-md` | 10px | Botones, campos |
| `radius-lg` | 14px | Tarjetas, ventanas de producto |
| `radius-xl` | 24px | Bloques de sección oscura |
| `radius-full` | 9999px | Pastillas y avatares |

### Elevación

| Nivel | Uso | Sombra |
|-------|-----|--------|
| 0 | Elementos planos | Solo borde 1px `line` |
| 1 | Tarjetas | Borde 1px `line-strong` + `0 1px 2px` tinta al 5% |
| 2 | Ventanas de producto | Borde 1px + `0 8px 24px -8px` tinta al 12% |
| 3 | Menús, popovers | Borde 1px + `0 16px 40px -12px` tinta al 18% |

- Las sombras usan el color de la tinta (verde casi negro), nunca negro puro ni
  verde de marca.
- Sin resplandores (`glow`), sin halos de color detrás de nada.
- Una ventana de producto recortada se funde con el fondo por su borde inferior
  en vez de terminar en caja.

---

## El producto como imagen

La pieza visual principal de Crisopa es **la demo de producto**: una
conversación en el móvil que termina en un dato estructurado dentro del panel.

```
 ┌──────────┐  ┌───────────────────────────────────────────┐
 │ ChatGPT  │  │ ● ● ●   panel.crisopa.app                  │
 │          │  ├────────┬──────────────────────────────────┤
 │ Orden de │  │crisopa │ Tratamientos · Órdenes            │
 │ Karate…  │  │        │ 14 KARATE ZEON  200 ml/ha Pendiente│
 │ ✓ ✓      │  │ Tratam.│ 13 SCORE 25 EC  0,45 l/ha Ejecutada│
 │┌────────┐│ ╭┼────────┼──▶                                │
 ││Orden 14├┼─╯│        │                                   │
 │└────────┘│  │        │                                   │
 └──────────┘  └────────┴──────────────────────────────────┘
```

- **Contenido real del oficio.** Cultivos, plagas, productos, dosis y plazos
  verosímiles y comprobados contra el registro del MAPA. Un asesor tiene que
  poder leerlo y no encontrar un error. Nada de «Lorem ipsum» ni datos
  inventados que no se sostengan.
- **La interfaz de chat se recrea con nuestros tokens**, de forma neutra. No se
  copia la interfaz de ChatGPT ni de Claude: su logo identifica el conector, y
  nada más.
- **Producto real, no ilustración.** Lo que sale de Crisopa es el panel de
  verdad, recreado a partir de `crisopa-app`: sus menús, sus columnas, sus
  estados («Pendiente», «Ejecutada») y sus textos. No se inventan pantallas que
  la app no tiene.
- **Se comporta como un vídeo:** sin selección de texto ni elementos
  clicables, salvo el botón de repetir o de pausa.
- **El hero cuenta el ciclo; la demo oscura, el rigor.** El hero enseña el
  viaje completo, rápido y en bucle: la orden pedida desde el móvil en ChatGPT,
  su llegada al panel, la ejecución con un clic y el coste. La demo oscura
  («Del chat a la orden de tratamiento») va despacio, al ritmo de lectura, y
  se detiene en las comprobaciones contra el registro: enseña el error más
  común (repetir un producto que solo admite una aplicación por campaña) y
  cómo Crisopa lo para y propone una alternativa. Sin dispositivos ni
  cursor; termina en la firma, no en el coste.
- **Casos con cultivos de los clientes:** naranjo y almendro. Nada de
  hortícolas de invernadero.
- **El producto va sobre el fondo, sin nada detrás:** ni degradado, ni halo,
  ni foto, ni objeto 3D. Si hace falta separarlo, un borde de 1px y la sombra
  de nivel 2.
- **Vídeo o animación, no captura estática**, cuando se trata del flujo
  principal. Las capturas estáticas valen para detalles.
- **Sin pies de figura** tipo `FIG. 01`: debajo de una ventana de producto
  parecen un artículo científico y no aportan. La ventana se explica sola.
  Tampoco notas de «datos de ejemplo»: en una landing se da por hecho.
- **Repetir la animación:** botón de icono discreto (28px, borde de 1px, icono
  de flecha circular) en una esquina de la ventana o de la demo, con
  `aria-label`. Con ratón aparece solo al pasar por encima (y al llegar con
  teclado); en táctil queda visible. Nunca un enlace de texto en un pie.

---

## El dato vivo del MAPA

«Verificado contra el MAPA» se demuestra con una prueba visible, no con un
adjetivo.

- **Estado en la barra de la ventana de producto**, como lo mostraría una
  herramienta real: `● Registro MAPA · sincronizado 2026-09-22`.
- **Sello de fuente** junto a los datos de producto en demos y páginas del
  corpus: `Fuente: Registro Oficial de Productos Fitosanitarios · MAPA`.
- **Cada dato con su fecha.** La demo usa la fecha de sincronización de la web;
  el corpus de `/plagas`, la fecha real del volcado del que salen sus tablas.
  Si no coinciden, cada una dice la suya: nunca se pone a un dato una fecha
  que no es la suya.
- Todo en Geist Mono, cifras tabulares.
- **Sin pastillas-anuncio sobre el titular.** Son el recurso más repetido de
  las landings hechas con plantilla. El dato vive dentro del producto, donde
  demuestra algo; encima del titular va, como mucho, la etiqueta con caret.
- **Solo con datos reales**, obtenidos del backend o en la compilación. Si el
  dato no está disponible, el elemento no se muestra. Nunca una cifra
  inventada ni redondeada al alza.

---

## Secciones oscuras

- Máximo dos por página: **la demo** del producto y, si hace falta, **el cierre**
  (CTA final).
- Fondo `dark-background` con una retícula de puntos muy sutil (`dark-line`,
  paso de 24–32px).
- Dentro, la acción y los acentos pasan a `green-400`.
- Pueden ir a sangre o como bloque con `radius-xl` dentro de los raíles.
- Nada de auroras, orbes ni degradados de color.

---

## Botones y enlaces

| Tipo | Aspecto |
|------|---------|
| **Principal** | Fondo `green-600`, texto blanco, `radius-md`, sin sombra de color. Hover: `green-700`. Uno por vista. |
| **Secundario** | Fondo `surface`, borde 1px `line-strong`, texto `foreground`. Hover: fondo `surface-secondary`. |
| **Enlace** | Texto `green-700`, subrayado fino con separación. Hover: `green-800`. |
| **Principal sobre oscuro** | Fondo `green-400`, texto `dark-background`. Hover: `green-300` (sube el contraste; `green-500` no llega a AA). |
| **Secundario sobre oscuro** | Fondo `dark-surface`, borde 1px `dark-line`, texto `dark-foreground`. Hover: fondo `dark-line`. |

- Al pulsar, `scale(0.97)`.
- La flecha del botón principal («Reservar demo →») se desplaza 2px a la
  derecha al pasar el ratón. Es el único adorno de un botón.
- Sin brillos que recorren el botón ni sombras verdes.
- Opcional, para reforzar la sensación de herramienta: atajo de teclado en
  `kbd` junto a la acción (`Reservar demo  D`).
- Nada de microcopia bajo los botones que repita lo que ya dicen el
  subtítulo o el producto. Si no añade un dato nuevo, sobra.

---

## Movimiento

Se anima lo que explica el producto. Todo lo demás, quieto o casi.

### Qué se anima

- **La demo:** el chat se escribe, Crisopa consulta, el dato aparece y se
  verifica. Es la animación principal y la que más cuidado merece.
- **Entrada de secciones:** mínima. Una vez, sin repetir.
- **Microinteracciones:** hover, pulsación, indicador de navegación.
- **El caret** de las etiquetas.

### Qué no se anima

- Nada flota, oscila, brilla, pulsa, rebota ni gira por decorar (tampoco
  diagramas de órbitas ni logos en carrusel). La única oscilación permitida
  significa algo: el temblor horizontal de un aviso de error, una sola vez.
- Nada de brillos que recorren textos o botones.
- Nada de fondos animados (auroras, mallas, partículas).
- Nada de efectos que siguen al cursor (resplandores, chispas al hacer clic,
  tarjetas que se inclinan).

### El gesto de entrada

Todo lo que aparece usa el mismo gesto, con pequeñas variaciones de duración:

```
desde:  opacity 0 · filter: blur(6px) · translateY(8px)
hasta:  opacity 1 · filter: blur(0)   · translateY(0)
curva:  cubic-bezier(0.22, 1, 0.36, 1)   (ease-brand)
```

Nunca `scale(0)`, nunca rebotes, nunca desplazamientos largos (máximo 8px).

Una excepción en la demo oscura, porque explica algo: la orden correcta sube
32px (sin desenfoque, con sombra) y se monta encima del aviso de error, que
queda tapado y luego se retira. Se lee como «la buena sustituye a la mala».

Y dos en el hero, que no se copian en otras secciones:

- **El apilado del hero** (ver catálogo): la demo sube sobre la presentación
  ligada al scroll.
- **La demo del hero** (ver catálogo): rápida, exagerada y en bucle. Aquí sí
  hay desplazamientos largos, curvas bézier, cortes y estelas de movimiento,
  siempre que expliquen el flujo: la orden viaja del móvil al panel por una
  curva, con una estela corta detrás que solo existe mientras se mueve (nunca
  se dibuja la ruta entera), y el anillo marca un clic o una llegada. Nada de
  formas sueltas de adorno ni de trazos de diagrama sobre la interfaz. Los datos siguen siendo reales y el estado final se lee entero.

### Catálogo

| Animación | Qué hace | Cuándo arranca | Tiempos |
|-----------|----------|----------------|---------|
| **Entrada del hero** | Etiqueta, titular y entradilla entran con el gesto de entrada, escalonados | Al cargar la página | 450ms cada uno; retrasos 100 / 150 / 200ms |
| **Entrada de sección** | El bloque entra con el gesto de entrada | Al entrar en pantalla (10% visible, 100px antes del borde inferior); una sola vez | 450ms |
| **Apilado del hero** | Al cargar, solo la presentación, a pantalla completa y centrada en vertical. Al bajar, la presentación se queda fija y se desvanece (a opacidad 0, escala 0,97) mientras la ventana de producto sube por encima de escala 0,94 a 1 hasta quedar centrada. Ligado al scroll: avanza y retrocede con él, no lo secuestra | Al hacer scroll, desde que la ventana asoma hasta que queda centrada | Sin duración: la marca el scroll. Solo en escritorio (≥ 861px de ancho y ≥ 640px de alto), con animaciones por scroll en CSS y sin movimiento reducido; si no, flujo normal y entrada de sección |
| **Demo del hero** | 1) Campo: entra el móvil desde abajo, la petición se escribe en el compositor de ChatGPT y se envía; las dos llamadas a Crisopa pasan con indicador de carga; llega la respuesta y la tarjeta de la orden. 2) Viaje: la tarjeta sale del móvil por una curva bézier con una estela corta detrás (de donde estaba hace 100ms a donde está; se alarga con la velocidad y se recoge al frenar), el móvil sale girando y el panel se despeja. 3) Panel: la fila entra resaltada en Órdenes de tratamiento, «Pendiente». 4) Ejecutar: el cursor abre el menú ⋮ y pulsa «Ejecutar tratamiento»; la fila pasa a «Ejecutada». 5) Control: la tabla se retira y sale el coste, con los importes contando hasta la cifra exacta, y el acumulado de la campaña | Al verse el 30% (con el apilado, cuando su borde superior cruza la mitad de la pantalla). En bucle mientras se ve. Se para solo al salir del todo de la pantalla o con la pestaña oculta, y se queda en el principio del bucle (móvil fuera, chat vacío), el mismo estado desde el que arranca: así nunca cambia de golpe a la vista. Con el botón de pausa, sin JS o con movimiento reducido, el cartel quieto (móvil con la conversación y orden pendiente) | Unos 13s por vuelta. Tecleo de 12–30ms por carácter; entradas de 220–420ms y salidas de 560ms con curvas rápidas (`0.16, 1, 0.3, 1` y `0.7, 0, 0.2, 1`); viaje de la orden 780ms; contadores de 600–900ms; 2,6s quieto al final |
| **Demo oscura** | El asesor pide Juvinal; las dos llamadas (ficha y historial); salta a la derecha un aviso rojo pequeño («No se puede repetir») que tiembla una vez; Crisopa se niega y propone Ovispray; el asesor acepta; validación; la orden entra encima del aviso y lo tapa, campo a campo; Crisopa da la dosis; «Verificado contra el MAPA» y la firma («Pendiente de firma» → «Firmada») | Cuando se ve el 30% de la demo; una sola vez. Sin JS o con movimiento reducido, el estado final: orden firmada, sin aviso | Guion `T` en `Showcase.astro`: aviso a 4,2s y temblor a 4,7s (420ms, ±6px); orden a 11,4s, campos cada 280ms; firma a 16,6s; pasos de 450ms. Unos 17s en total |
| **Repetir** | Relanza la demo oscura desde el principio | Botón de icono en la esquina | Igual que la demo |
| **Pausa** | Detiene el bucle de la demo del hero y deja el cartel; vuelve a pulsarse para reanudar | Botón de icono bajo la demo, a la derecha | Inmediato |
| **Caret** | Parpadeo seco (encendido/apagado, sin fundido) | Siempre | Ciclo de 1,15s |
| **Hover de botón y enlace** | Cambio de color de fondo o de texto; la flecha avanza 2px | Al pasar el ratón | 150ms `ease-out` |
| **Pulsación** | El botón se reduce a 0,97 | Al pulsar | 150ms `ease-out` |
| **Botón de repetir** | Aparece con un fundido | Al pasar el ratón por la ventana | 200ms `ease-brand` |
| **Indicador de navegación** | Fondo `green-50` que se desliza bajo el enlace del menú | Al pasar el ratón por el menú | 250ms `ease-brand` |
| **Header** | Al dejar arriba la página, pasa de translúcido con sombra 1 a sólido con sombra 2; se oculta al bajar y reaparece al subir, con margen: se oculta tras 16px seguidos hacia abajo y reaparece tras 48px seguidos hacia arriba (un rebote del trackpad no la hace bajar) | Al hacer scroll | 200ms (fondo) y 300ms (ocultar) `ease-brand` |

### Reglas

- **Una sola vez.** Las entradas y las demos no se repiten al volver a pasar
  por ellas. Solo el botón de repetir las relanza.
- **El HTML trae el estado final.** La demo se escribe en el HTML completa y
  el script la reinicia para animarla. Sin JavaScript o con movimiento
  reducido, se ve entera y quieta.
- **Al ritmo de lectura.** Cada paso de una demo dura lo que se tarda en leer
  el anterior. Si hay que esperar para entender algo, va demasiado lento; si
  no da tiempo a leerlo, demasiado rápido.
- **Interrumpible.** Nada bloquea el scroll ni la interacción; al salir de la
  página, las demos cortan sus temporizadores.
- **`prefers-reduced-motion`:** sin desplazamientos ni desenfoques; las
  entradas se muestran directamente; las demos, en su estado final; el caret
  queda fijo.

### Parámetros

| Uso | Duración | Curva |
|-----|----------|-------|
| Hover, pulsación | 150ms | `ease-out` |
| Microinteracciones de UI | 200–250ms | `ease-brand` |
| Entradas de sección y pasos de demo | 400–450ms | `ease-brand` |
| Ritmo entre pasos de demo | 250–1.200ms según lo que haya que leer | — |

---

## Iconografía

- **Iconos de trazo**, 1,5px, extremos redondeados, en rejilla de 24px. Una
  sola familia para toda la web.
- Color: `foreground-muted` en reposo, `green-600` o `green-700` cuando están
  activos o acompañan a una acción.
- Sin baldosas de color detrás por defecto. Cuando haga falta contenedor:
  `surface-secondary` con borde de 1px.
- **Logos de terceros** (ChatGPT, Claude, conectores): de Simple Icons, con su
  color oficial, solo en contextos de integración. Son la única excepción a la
  regla del color único.

---

## Imagen y fotografía

- La imagen de Crisopa es el producto. No usamos fotografía como recurso
  general.
- **Nunca fotos de stock:** tractores, manos con tierra, atardeceres sobre
  campos, gente sonriendo a una tablet.
- Si algún día hace falta fotografía (testimonios, equipo), será **propia y
  real**: asesores reales, fincas reales, luz natural, sin retoque de catálogo.
- Nada de ilustraciones de personajes, objetos 3D ni fondos generativos.

---

## El símbolo

El logo tiene varias lecturas, todas intencionadas:

| Forma | Significado |
|-------|-------------|
| Crisálida | Transformación. Cambia cómo trabaja el asesor. |
| Roca | Solidez. Los datos están verificados y a salvo. |
| Gema | Valor en el detalle. Cuidamos cada dato. |

- Símbolo en `green-600` sobre claro; en `green-400` o blanco sobre oscuro.
- Logotipo «Crisopa» en Sora, en `foreground` sobre claro y `dark-foreground`
  sobre oscuro.
- Espacio de respeto: la altura del símbolo alrededor de todo el conjunto.
- Tamaño mínimo del símbolo: 16px en pantalla.
- No se deforma, no se rota, no se le aplican sombras, degradados ni contornos.

---

## Lo que nunca hacemos

- Degradados en el texto.
- Fotos de stock.
- Emojis.
- Un segundo color de marca (ni ámbar, ni ningún otro).
- Grises por defecto de Tailwind en lugar de los neutros teñidos.
- Halos, auroras, orbes, resplandores o degradados detrás del producto.
- Elementos que flotan, brillan o pulsan por decorar.
- Datos inventados en demos o contadores.
- Más de dos secciones oscuras por página.

---

## Antes de publicar

- [ ] ¿Cada elemento visual enseña el producto o tiene un motivo claro?
- [ ] ¿El verde aparece solo en marca, acción y dato destacado?
- [ ] ¿Todos los grises son neutros teñidos (ningún `gray-*`)?
- [ ] ¿Lo técnico va en mono y solo lo técnico?
- [ ] ¿Los titulares tienen tracking negativo y peso 600?
- [ ] ¿Radios y sombras salen de la escala?
- [ ] ¿Lo que se mueve explica algo? ¿Respeta `prefers-reduced-motion`?
- [ ] ¿Los datos de producto de las demos son reales y comprobados?
- [ ] ¿Se ve bien en móvil, sin raíles y sin scroll horizontal?

---

## Implementación

Dónde vive cada regla en el código de la web. Si cambias una regla aquí,
cambia también su sitio en el código, y al revés.

### Tokens y estilos base — `src/styles/global.css`

| Qué | Dónde |
|-----|-------|
| Verde de marca, neutros teñidos, oscuros y colores de estado | Variables en `:root` y expuestas en `@theme` como utilidades (`bg-line`, `text-foreground-muted`, `bg-dark-background`, `text-state-warning`…) |
| Radios, sombras y curva | `@theme static`: `rounded-sm/md/lg/xl`, `shadow-1/2/3`, `ease-brand` |
| Titulares (h1, h2, h3) | Estilos base en `@layer base`; la escala de H2 vive ahí, no en cada componente |
| Display del hero | Clase `.display` |
| Entradilla | Clase `.lead` |
| Dato técnico en mono | Clase `.font-data` (mono + cifras tabulares) |
| Foco visible | `*:focus-visible` (green-600) y `.sec-dark` / `.on-dark` (green-400) |

### Estructura — `src/layouts/Layout.astro` y `global.css`

| Qué | Dónde |
|-----|-------|
| Raíles | `Layout.astro` envuelve cada página en `.page > .frame` |
| Margen lateral | Variable `--gutter`; clases `.sec` y `.gutter` |
| Header alineado con la columna | Clase `.frame-align` |
| Sección y separador | Clase `.sec` (el separador lo pone `.sec ~ .sec`) |
| Continuación de sección | `.sec.sec-cont` (sin separador ni etiqueta) |
| Sección oscura | `.sec.sec-dark` (fondo, retícula de puntos, sin separador) |
| Cabecera partida | `.sec-head`: un `<div>` con etiqueta + `h2`, seguido de la entradilla |
| Celdas | `.cells` + `grid-cols-*`; las filas deben quedar completas |

### Componentes

| Qué | Componente |
|-----|------------|
| Etiqueta con caret | `src/components/Eyebrow.astro` (`n`, `caret`, `dark`, `as`) |
| Demo del hero | `src/components/HeroDemo.astro`: escenario de tamaño fijo (`--w` × `--h`) escalado al ancho con `tan(atan2())`; otro encuadre por debajo de 861px |
| Apilado del hero | `src/components/Hero.astro`: `position: sticky` y `animation-timeline` con la línea de tiempo `--hero-stage` (rango `cover 0%` → `cover 50%`). La condición de activación se repite en `STACK_QUERY` de `HeroDemo.astro` |
| Demo oscura | `src/components/Showcase.astro` (`#demo`) |
| Sello de fuente del MAPA | `src/components/SelloMAPA.astro` |
| Conectores en celdas | `src/components/Conectores.astro` |
| Lista comparada (sin / con Crisopa) | `src/components/ListaComparada.astro` |
| Tabla de productos del corpus | `src/components/TablaProductos.astro` |

### Imágenes de marca — `scripts/imagenes-marca.mjs`

Se generan con `node scripts/imagenes-marca.mjs` (Chrome headless) a partir de
los tokens; no se editan a mano.

| Qué | Archivo |
|-----|---------|
| Imagen social (`og:image`, 1200×630) | `public/og-image-v2.png`. Si cambia, cambia el nombre (las apps cachean por URL) y `image` en `Layout.astro` |
| Logo de la organización (JSON-LD) | `public/logo.png` (512×512, símbolo green-600 sobre blanco) |
| Icono de iOS | `public/apple-touch-icon.png` (180×180, símbolo blanco sobre green-600) |
| Favicon | `public/favicon.svg` (círculo green-600 en hex, símbolo blanco) |

### Datos

| Qué | Dónde |
|-----|-------|
| Fecha de sincronización del MAPA de la web | `REGISTRO_MAPA_SINCRONIZADO` en `src/lib/mapa.ts` |
| Fecha de la orden de la demo («mañana») | `FECHA_ORDEN_DEMO`, derivada de la anterior |
| Texto del sello de fuente | `FUENTE_MAPA` en `src/lib/mapa.ts` |
| Fecha de los datos del corpus `/plagas` | `ACTUALIZADO_MAPA` en `src/lib/plagas.ts` |
| Datos de la demo del hero | `nueva`, `anteriores` y `coste` en `HeroDemo.astro`. Karate Zeon (nº 22398) y Score 25 EC (nº 18767) en almendro, comprobados contra la ficha del MAPA; finca, precios y tarifas de ejemplo, con importes que cuadran. No se cambian sin comprobarlos |

### Movimiento

| Qué | Dónde |
|-----|-------|
| Gesto de entrada | `@keyframes enter` y `[data-animate]` en `global.css` |
| Entrada al cargar | Clase `.animate-enter` + `animation-delay` en línea |
| Entrada al hacer scroll | Atributo `data-animate`; el `IntersectionObserver` de `Layout.astro` añade `.animated` y deja de observar. Solo se oculta si `<html>` tiene la clase `js` (la pone un script en línea de `Layout.astro`): sin JS, se ve directamente |
| Pulsación de botones | Atributo `data-press` (escala 0,97 y transición de color de 150ms) |
| Caret | `.eyebrow-caret` y `@keyframes caret-blink` |
| Demos | Script propio en `HeroDemo.astro` y `Showcase.astro`: clases `.playing` en el contenedor e `.in` en cada `.step`. La del hero mueve la tarjeta y el cursor con la Web Animations API por béziers muestreadas |
| Movimiento reducido | Bloque `@media (prefers-reduced-motion: reduce)` al final de `global.css`, y comprobación en el script de cada demo |

---

## Referencias

Webs analizadas para construir esta guía (septiembre de 2026). Se toman
recursos concretos, no la estética completa.

| Web | Qué tomamos |
|-----|-------------|
| [Linear](https://linear.app) | Conversación → dato estructurado lado a lado, separadores de 1px, entrada con desenfoque |
| [Attio](https://attio.com) | Producto con agente en un SaaS claro, índice lateral fijo en la sección de flujo |
| [Rillet](https://rillet.com) | Etiquetas numeradas en mono, paso a oscuro en la sección de IA con retícula de puntos |
| [Mintlify](https://www.mintlify.com) | Un solo verde con neutros teñidos, pastilla con dato real en mono sobre el H1 |
| [Granola](https://www.granola.ai) | Demo fija mientras el texto avanza, separadores que se desvanecen |
| [Cursor](https://cursor.com) | Petición → agente trabajando → resumen estructurado, logos en celdas |
| [Stripe](https://stripe.com) | Raíles verticales, titular en dos tonos, dato vivo sobre el H1 |
| [OpenEvidence](https://www.openevidence.com) | La fuente oficial como elemento visual de confianza |
| [Radiant](https://radiant.tailwindui.com) | Tarjetas con fragmentos de UI real que se funden con el fondo |
| [Geist](https://vercel.com/geist/introduction) | Escala cerrada de superficies y radios |
| [Emil Kowalski](https://emilkowal.ski/ui/7-practical-animation-tips) · [Rauno Freiberg](https://rauno.me/craft) | Oficio de la animación: duraciones, curvas, pulsación |

**Lo que no tomamos de ellas:** bases enteramente oscuras (Linear), halos y
degradados detrás del producto (Radiant, Mintlify, Stripe), fondos pictóricos
(Cursor, Harvey), objetos 3D (Raycast, Resend).
