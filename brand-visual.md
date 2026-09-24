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
| `green-300` | `oklch(0.785 0.110 171)` | — (reservado) |
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
- Pies de figura (`FIG. 01 — Orden de tratamiento`).
- Microcopia técnica bajo un CTA (`Conector MCP · ChatGPT y Claude`).

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

La pieza visual principal de Crisopa es **la ventana de producto**: una
conversación que termina en un dato estructurado.

```
┌───────────────────────────────────────────────┐
│ ● ● ●                                         │
├───────────────────────────────────────────────┤
│  ¿Qué puedo usar contra mosca blanca en       │
│  el tomate de la finca Los Llanos?            │
│                                               │
│  ↳ Crisopa · buscar_productos_autorizados     │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ PRODUCTO        Nº REGISTRO   DOSIS     │  │
│  │ ...             ES-00000      0,75 l/ha │  │
│  │ Plazo de seguridad: 3 días  ✓ MAPA      │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

- **Contenido real del oficio.** Cultivos, plagas, productos, dosis y plazos
  verosímiles y comprobados contra el registro del MAPA. Un asesor tiene que
  poder leerlo y no encontrar un error. Nada de «Lorem ipsum» ni datos
  inventados que no se sostengan.
- **La interfaz de chat se recrea con nuestros tokens**, de forma neutra. No se
  copia la interfaz de ChatGPT ni de Claude: su logo identifica el conector, y
  nada más.
- **El producto va sobre el fondo, sin nada detrás:** ni degradado, ni halo,
  ni foto, ni objeto 3D. Si hace falta separarlo, un borde de 1px y la sombra
  de nivel 2.
- **Vídeo o animación, no captura estática**, cuando se trata del flujo
  principal. Las capturas estáticas valen para detalles.
- Pie de figura en mono debajo cuando ayuda (`FIG. 01 — Del chat a la orden
  de tratamiento`).

---

## El dato vivo del MAPA

«Verificado contra el MAPA» se demuestra con una prueba visible, no con un
adjetivo.

- **Estado en la barra de la ventana de producto**, como lo mostraría una
  herramienta real: `● Registro MAPA · sincronizado 2026-09-22`.
- **Sello de fuente** junto a los datos de producto en demos y páginas del
  corpus: `Fuente: Registro Oficial de Productos Fitosanitarios · MAPA`.
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

- Al pulsar, `scale(0.97)`.
- Sin brillos que recorren el botón ni sombras verdes.
- Opcional, para reforzar la sensación de herramienta: atajo de teclado en
  `kbd` junto a la acción (`Reservar demo  D`).
- Microcopia técnica en mono bajo el CTA principal cuando aporte
  (`Conector MCP · ChatGPT y Claude`).

---

## Movimiento

Se anima lo que explica el producto. Todo lo demás, quieto o casi.

### Qué se anima

- **La demo:** el chat se escribe, Crisopa consulta, el dato aparece y se
  verifica. Es la animación principal y la que más cuidado merece.
- **Demo guiada por scroll:** la ventana de producto queda fija mientras el
  texto avanza, y cada bloque de texto dispara un estado.
- **Entrada de secciones:** mínima. Opacidad + desenfoque (6px → 0) +
  desplazamiento corto (8px). Una vez, sin repetir.
- **Microinteracciones:** hover, pulsación, cambio de pestaña.
- **El caret** de las etiquetas.

### Qué no se anima

- Nada flota, oscila, brilla, pulsa ni gira por decorar.
- Nada de brillos que recorren textos o botones.
- Nada de fondos animados (auroras, mallas, partículas).

### Parámetros

| Uso | Duración | Curva |
|-----|----------|-------|
| Hover, pulsación | 150ms | `ease-out` |
| Microinteracciones de UI | 200–250ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Entradas de sección | 400–500ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Pasos de la demo | Al ritmo de lectura | `cubic-bezier(0.22, 1, 0.36, 1)` |

- Nunca se anima desde `scale(0)`: como mínimo desde 0,95.
- Las animaciones pueden interrumpirse; nada bloquea el scroll.
- **`prefers-reduced-motion`:** sin desplazamientos ni desenfoques; la demo
  muestra su estado final; el caret queda fijo.

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

## Referencias

Webs analizadas para construir esta guía (septiembre de 2026). Se toman
recursos concretos, no la estética completa.

| Web | Qué tomamos |
|-----|-------------|
| [Linear](https://linear.app) | Conversación → dato estructurado lado a lado, pies de figura en mono, separadores de 1px, entrada con desenfoque |
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
