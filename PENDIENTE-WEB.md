# Qué le falta a la web

Dos revisiones sobre el estado del sitio: la del 21 de septiembre de 2026
(qué le falta para ser una web empresarial) y la del 29 de septiembre de 2026
(qué hacen Agro4Data y RawData para captar tráfico y qué nos conviene coger).
La conclusión corta: lo que más falta no es un apartado de empleo, es una cara
detrás del producto y señales de que va en serio a largo plazo; y para el
tráfico, construir sobre el dato del MAPA que ya tenemos, no imitar blogs.

## Lo que echa en falta alguien que va a pagar

Ordenado por lo que más dudas cierra con menos trabajo.

1. **Página «Sobre Crisopa».** No existe. Quién lo hace, por qué, desde dónde,
   desde cuándo. Hoy la única pista de que hay una persona detrás está
   enterrada en la política de privacidad. Para un cuaderno con obligación
   legal, el comprador quiere saber que esto seguirá existiendo dentro de tres
   campañas.
2. **Página de contacto real.** Ahora hay un `mailto:` en el pie, un modal y
   Calendly. Falta teléfono o WhatsApp, horario y dirección. En el sector
   agrícola el teléfono es la señal de confianza número uno.
3. **Página de seguridad y datos.** Dónde se alojan los datos, copias de
   seguridad, cifrado, cómo exporto mi cuaderno si me voy, qué pasa si dejo de
   pagar. `/soporte` tiene un apartado para reportar vulnerabilidades, pero eso
   es otra cosa.
4. **Aviso legal como página propia.** Hay términos, privacidad y cookies, pero
   la identidad del prestador que exige la LSSI (art. 10) solo aparece dentro
   de privacidad. Falta además en el pie: nombre, NIF y domicilio.
5. **Menú y pie de empresa.** Estructura Producto · Soluciones · Recursos ·
   Empresa · Legal, aunque al principio algunas columnas tengan dos enlaces.
   Es lo que más rápido quita la sensación de landing de una sola página.
6. **Novedades o registro de cambios.** Es la señal más barata de que el
   producto está vivo. Un blog exige disciplina; un changelog público se
   alimenta solo con lo que ya se hace. RawData lo tiene en `/novedades`:
   fecha y 2–6 viñetas por entrada, nada más.
7. **Páginas por perfil de cliente.** `/para-asesores` primero (la de RawData
   para asesores y distribuidores es su mejor página de venta), luego
   `/para-cooperativas` y `/para-empresas-de-servicios`. Cada una con sus
   objeciones, sus cifras y su CTA.
8. **Páginas por funcionalidad.** Una por cada cosa que se vende: validación
   normativa del tratamiento, órdenes de tratamiento, almacén, informes y
   exportación a SIEX, conector de IA. Alimentan el menú «Producto» y
   posicionan por búsquedas de función. Agro4Data tiene nueve.
9. **Página de integraciones.** El conector de ChatGPT y el de Claude son un
   diferencial claro y hoy no tienen página indexable.
10. **Presencia social enlazada.** Cero enlaces a LinkedIn, Instagram o YouTube.
    Los vídeos de demo ya existen (`/demo`) pero la página es `noindex`.
11. **Centro de ayuda o documentación pública.** `/soporte` dice a dónde
    escribir, pero no hay guías. Para un asesor que evalúa el producto, ver la
    documentación pesa casi tanto como probarlo.
12. **Página 404 propia.** No hay `src/pages/404.astro`.
13. **Logos, cifras y casos de clientes.** Va ligado a los testimonios que aún
    no hay, pero un «usado en X explotaciones y Y hectáreas» va antes que las
    citas. En cuanto haya un cliente dispuesto, un caso con cifras de antes y
    después (RawData los tiene con vídeo y filtro por sector).
14. **Garantía explícita.** RawData ofrece devolución en 2 meses sin
    preguntas. Una garantía clara en `/precios` cierra la objeción de «¿y si
    no me sirve?» sin tocar el precio.
15. **Eventos y ferias.** Una página cuando se vaya a una feria o jornada
    (Fruit Attraction, jornadas de cooperativa). Barato y demuestra actividad.
16. **Programa de socios.** Para distribuidores de fitosanitarios o asesores
    que recomienden Crisopa. Solo cuando haya al menos un socio real.
17. **Sellos.** Si se consiguen (agente digitalizador del Kit Digital, ENISA,
    ayudas públicas), van en el pie y en «Sobre». No inventar ninguno.

## Captación de tráfico

Ni Agro4Data ni RawData publican datos del registro del MAPA: su contenido de
plagas es divulgación genérica sin un solo producto autorizado ni número de
registro. El corpus `/plagas` ya da lo que ellos no pueden copiar, así que lo
más rentable es construir más plantillas sobre el mismo volcado. Todo lo de
este bloque respeta los filtros de `volcar-plagas.mjs` (solo registros
vigentes, nada de pares con menos de 5 productos).

Ordenado por rentabilidad.

1. **Más plantillas sobre el corpus.**
   - **Por materia activa** (`/materias-activas/lambda-cihalotrin`): en qué
     cultivos y contra qué está autorizada, qué productos la llevan, plazos de
     seguridad.
   - **Por cultivo** (`/cultivos/naranjo`): todas sus plagas con el número de
     productos autorizados. Es el nodo que enlaza las páginas ya existentes.
   - **Cambios del registro** (`/registro-mapa/cambios`): altas, retiradas y
     caducidades de cada mes. Nadie compite aquí, genera contenido nuevo solo
     y es lo que más le importa al asesor. Es también la razón de ser de un
     boletín mensual.
2. **Herramientas gratuitas.** Páginas estáticas con JS propio, como las demos.
   - **Buscador público de productos autorizados** por cultivo y plaga: la
     versión abierta de lo que ya hace el MCP, sobre el JSON del corpus.
   - **Calculadora de plazo de seguridad**: fecha de tratamiento + plazo del
     producto = fecha mínima de recolección.
   - **Calculadora de caldo y dosis**: L/ha, concentración, número de cubas.
   - **Calculadora de horas ahorradas** para `/precios`. Agro4Data tiene una
     en la home (técnicos, cuadernos al mes, coste por hora → ahorro).
3. **Guía pilar del CUE y el SIEX.** «Cuaderno digital obligatorio: qué cambia
   y cuándo», con calendario de plazos y preguntas frecuentes. Y las páginas
   del asesor que nadie cubre: asesoramiento en GIP, ROPO y carné, orden de
   tratamiento, qué firma el asesor. Páginas por comunidad autónoma **solo**
   si cada una aporta dato propio (organismo, enlace oficial, plazo, entidad
   habilitada); las 43 de Agro4Data son ~300 palabras casi iguales y Google
   las trata como relleno.
4. **`/cuaderno-de-campo-gratis`.** Plantilla descargable sin pedir el correo
   que lleve al producto: «esto sirve para empezar; esto es lo que te ahorra
   Crisopa». Búsqueda con volumen e intención.
5. **Comparativas.** «Crisopa vs Agro4Data», «vs RawData», «vs Visualnacert»,
   «alternativas a X». Tono honesto, con un «cuándo encaja cada una» y
   preguntas frecuentes, como las de Agro4Data (tienen seis y Crisopa todavía
   no sale en ninguna).
6. **Listas de comprobación de visita en HTML.** Naranjo y almendro: trampeo,
   umbrales, qué anotar. Sin pedir correo, enlazadas al corpus. Agro4Data
   tiene doce, todas páginas HTML abiertas.
7. **Visibilidad en asistentes de IA.** Abrir `robots.txt` a sus bots
   (GPTBot, ClaudeBot, PerplexityBot…) y publicar un `llms.txt`. Agro4Data
   sirve además una versión en texto plano de cada artículo (`/blog/*/raw`).
   Encaja con los conectores de ChatGPT y Claude.
8. **Blog, si llega, acotado.** Solo lo que busca el asesor y con una cadencia
   que se pueda sostener. El patrón que funciona en Agro4Data es cultivo ×
   tema, con autor, fecha y ~2.000 palabras.

## Lo que no conviene copiar

- El blog generalista de RawData («permacultura», «cultivo de lavanda»): trae
  visitas que no compran y obliga a mantenerlo.
- Páginas por comunidad autónoma sin dato propio.
- Pedir el correo en cada recurso: con nuestro tamaño frena más de lo que
  capta.
- Las decenas de landings de demo duplicadas de RawData.
- Páginas de hortícolas o tomate: nuestros cultivos de ejemplo son naranjo y
  almendro.

## Sobre un apartado de empleo (careers)

Desaconsejado por ahora. Una página de empleo sin vacantes en una empresa de
una persona es relleno, y relleno visible. Todo el que la abra y no vea ofertas
lee «no crecen». Lo que sí tiene sentido es una línea en «Sobre Crisopa» del
tipo «si quieres trabajar con nosotros, escríbenos», y crear la página el día
que haya una vacante real.

## El hueco que no es de web

La identidad legal es una persona física. Una cooperativa o una empresa de
servicios que mire el pie de página lo ve al instante. Cuando se constituya la
sociedad, el cambio en la web es un archivo: `src/lib/identidad.ts`. Hasta
entonces, la página «Sobre» con nombre y cara convierte esa debilidad en
cercanía, que además es lo que pide `brand-voice.md`.

## Por dónde empezar

1. **Confianza**: «Sobre Crisopa», «Contacto» y el aviso legal, con el menú y
   el pie de empresa. Son las que cierran más dudas con menos trabajo.
2. **Venta**: `/para-asesores`, tres o cuatro páginas de funcionalidad y dos
   comparativas.
3. **Foso de datos**: plantillas por cultivo y por materia activa, la
   calculadora de plazo de seguridad y la página de cambios del registro con
   boletín mensual.

## Referencia: la competencia a 29 de septiembre de 2026

- **Agro4Data** (agro4data.com, Next.js, ~250 URLs). Sitemap por secciones:
  36 páginas por cultivo, 9 de funcionalidades, 24 casos de uso, 43 de
  CUE/SIEX por comunidad, 6 comparativas, 12 recursos, 122 artículos, centro
  de ayuda pequeño. Calculadora de ahorro y logos de clientes en la home.
- **RawData** (agrawdata.com, WordPress, ~700 URLs, 444 artículos, tres
  idiomas). Landings por sector y por perfil, casos de éxito con cifras y
  vídeo, 12 webinars grabados, recursos que piden correo (plantilla Excel de
  cuaderno, guía de subvenciones), `/novedades`, `/quienes-somos` con equipo,
  `/partner`, `/precios`, `/prensa`, podcast, páginas de ferias, sellos ENISA y
  FEDER, garantía de 2 meses, WhatsApp y teléfono visibles.
