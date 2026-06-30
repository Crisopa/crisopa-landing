
# Crisopa — Estrategia de pricing
 
Documento de trabajo. Recoge los precios, su justificación, los datos de la competencia y las
tácticas de presentación y negociación. Es la "fuente de verdad" del pricing; la web (`Pricing.astro`)
debe reflejarlo.
 
---
 
## 1. Principios
 
1. **El precio se ancla en el valor, no en el coste ni en "lo que cumpla la ley".** Crisopa no se
   vende como cuaderno normativo (un gasto que se sufre), sino como **copiloto agronómico que ahorra
   horas de oficina**. El ancla de valor son las horas que devuelve, no las casillas que rellena.
2. **El pricing imita a la venta.** La venta es *high-touch* (cierre a mano, onboarding trabajoso).
   Por eso: pocos planes, ancla fuerte, y se flexibiliza en la conversación. Nada de escaleras de 5
   tramos estilo ERP — eso proyecta software anticuado.
3. **Segmentación por persona, no por tamaño.** Cada plan es para un **comprador distinto**, con un
   **decisor distinto** y un **value prop distinto**. El error fatal sería venderle a uno con el
   discurso del otro.
4. **Plan generoso, anti-medidor.** En Asesor: "hasta 100 explotaciones, y punto" y **todos los
   técnicos incluidos**. Nada de "+X € por explotación/usuario adicional" dentro del plan: el cliente
   del campo odia sentirse contado finca a finca. La simplicidad es, además, señal de producto
   moderno. (Profesional es de **1 usuario**; el salto de capacidad es **cambiar de plan**, no sumar
   asientos.)
5. **Solo cobro anual.** El uso es estacional (por campaña), el onboarding es caro y el mensual
   invita al *churn*. La rampa de entrada es la **prueba gratis de 30 días sin tarjeta**, no el pago
   mensual.
---
 
## 2. Qué diferencia a los planes: capacidad, no persona
 
**Los planes se separan por la capacidad técnica que consume el cliente, no por quién es.** El error
antiguo era segmentar por persona ("Profesional = finca grande; Asesor = asesor a terceros"). Acierta
en el ~90 % de los casos, pero **no es la causa del valor** y genera sesgos (ver el final de la
sección). La causa real:

| | **Profesional** | **Asesor** |
|---|---|---|
| Capacidad | **1 usuario**, hasta 10 explotaciones | **Multiusuario con permisos por explotación**, hasta 100 |
| Para qué sirve | Un técnico que lleva su(s) finca(s) | Un equipo: cada técnico ve solo lo suyo y alguien tiene la visión de conjunto |
| Quién suele comprarlo | Técnico interno de una finca | Asesor con cartera — **pero también** una empresa con varias fincas y un técnico por finca |
| Ángulo de venta | Cumplimiento / tranquilidad / control | Horas recuperadas / copiloto IA / cartera unificada |
 
**El multiusuario + permisos es la palanca de precio.** El caso que lo prueba: una empresa con 3
fincas, 3 técnicos, y cada técnico solo puede tocar la suya. No es asesor a terceros (perfil
"Profesional" clásico), pero necesita exactamente la capacidad de Asesor: varios logins aislados con
permisos por explotación — la misma que necesita el asesor con 80 fincas repartidas entre su equipo.
La capacidad es idéntica; la persona, distinta. **Se cobra la capacidad.** (Un Profesional
multiusuario a 49 € plano sería regalar por 49 € lo que en Asesor se cobra a 99 €: rompe el pricing.
Descartado.)

**Profesional es de un asiento, a propósito.** Cuando aparece el segundo login, el plan es Asesor —
sin add-on por usuario, sin tramo intermedio que negociar. Esto elimina la zona gris del
"casi-2-técnicos" (98 € de 2×Pro vs 99 € de Asesor) y mantiene la tabla simple: 1 usuario →
Profesional; equipo → Asesor.

**La persona sigue sirviendo, pero como ángulo de venta, no como filtro de entrada.** Sabido el plan
por capacidad, el discurso cambia según quién decide:
- **Decisor = dueño que no siente el papeleo** (técnico interno): vender **tranquilidad / cumplimiento
  / control**. El dueño le paga un sueldo fijo al técnico; ahorrarle horas **no le ahorra un euro al
  dueño** (coste hundido), así que "te devuelvo las horas" resbala. El ángulo correcto es el
  normativo, y por eso este comprador es naturalmente sensible al precio.
- **Decisor = beneficiario** (asesor, o responsable de la empresa con equipo): vender **horas
  recuperadas / copiloto IA / cartera unificada**. Incentivos alineados, mayor disposición a pagar.
 
**Conclusión + cuidado con el sesgo "cabe en el plan, luego paga el precio del plan".** La capacidad
de subir precio vive sobre todo en **Asesor** (multiusuario + IA); Profesional se mantiene **barato a
propósito** como plan de un asiento. Pero el **tamaño del negocio** puede disparar Enterprise por
encima de la capacidad: una finca única de 20.000 ha encaja en "perfil Profesional" por estructura,
y su valor no es un plan de 49 €/mes. Igual que la cooperativa de §6 (factura 30 M€ con explotaciones
minúsculas). **Hay un check de tamaño —hectáreas, facturación, socios— que manda a Enterprise a quien
se salga de rango, gane el plan que gane por features.** Ni usuarios ni nº de explotaciones sirven
para medir esto.
 
---
 
## 3. Planes y precios
 
Precio **anual** (única modalidad). El **titular es el mensual-equivalente** (anual ÷ 12); el total
anual va en letra pequeña con "se factura una vez al año".
 
| Plan | Para | Titular | Anual | Incluye |
|---|---|---|---|---|
| **Profesional** | Un técnico (1 usuario) | **49 €/mes** | 588 €/año | **1 usuario** · hasta 10 explotaciones · tratamientos, fertilización, SIGPAC, informes |
| **Asesor** | Equipo / cartera de fincas | **99 €/mes** | 1.188 €/año | **Multiusuario con permisos por explotación** · gestión multicliente · **agente IA (MCP)** · avisos de vencimientos · eco-regímenes PAC · hasta 100 explotaciones |
| **Enterprise** | Cooperativas / grandes organizaciones | A medida | Ver §6 | Todo + integración ERP + acompañamiento |
 
### Justificación
 
- **Profesional 49 €:** sin cambios respecto al mensual-equivalente actual. Es el plan de **1 asiento**
  (un técnico, su(s) finca(s)). Un número bajo y fácil de aprobar es lo correcto para este comprador,
  a menudo un dueño que no siente el dolor del papeleo. El tope de capacidad es el **usuario único**:
  cuando hace falta un segundo login, el plan es Asesor, no un Profesional con add-ons por asiento.
- **Asesor 99 €:** subida real del mensual-equivalente de **89 → 99 €** (+11 % sobre los 1.068 €/año
  de hoy). Justificación: el reposicionamiento a copiloto IA cambia el ancla, y **el único cliente
  actual de este tramo ha señalado que el precio es bajo** (señal de *pricing power*). Se sube **alta
  a alta**: cada nueva alta entra al precio nuevo y se observa la conversión de la prueba; si entran
  sin fricción, se vuelve a subir. **Al cliente actual se le respeta su tarifa** (es el validador, no
  la vaca a ordeñar).
- **"Hasta 100 explotaciones" plano = plan generoso, a propósito:**
  - Anti-medidor: aGROSlab cobra "explotación adicional 6,30 €/año"; Crisopa dice "hasta 100, y
    punto". Quita la ansiedad del contador.
  - *Land-and-expand*: el asesor entra con 24 fincas y crece dentro del plan sin miedo a que suba el
    precio. Cuando llega a 90 está "infrapagando" respecto al valor → feliz y con coste de cambio
    brutal.
  - Cierra más rápido en venta high-touch (un número, sin calculadora de tramos).
  - Paz mental (estilo Notion/Linear: "no vas a chocar con el límite").
---
 
## 4. La competencia (precios públicos, junio 2026)
 
| Herramienta | Modelo | Precio | Segmento |
|---|---|---|---|
| **aGROSlab** | Por tramos de explotaciones (asesor) | **50 → 810 €/año · 100 → 1.135 €/año · 250 → 1.700 €/año** (adicional 6,30–6,80 €/año) | Asesores y cooperativas — **el comparable directo** |
| **oSIGris** | Por explotación/tamaño | 25–40 €/mes (1 explot.) · ~75 €/mes (10 explot.) · cuaderno + VademecumIA gratis de gancho | Agricultor individual |
| **Agroptima** | Por consulta (hectáreas + usuarios) | ~300–400 €/año (individual, filtrado en reseñas) | Agricultor individual |
| **Farmable** | Por granja | 399 $/año (Pro) · gratis hasta 5 trabajos | Agricultor individual (origen noruego) |
| **xFarm** | Por módulos + hectáreas | Módulos desde 30 €/año; paquetes a presupuesto | Mixto |
| **VisualNACert** | Por consulta | No público | Enterprise / cooperativas |
| **Isagri / Geofolia** | Licencia (compra) + mantenimiento anual | Implantaciones **6.200–10.500 €**; ~1.500 €/año solo cuaderno (foro) | Enterprise / cooperativas |
| **FieldPad** | Por contacto | No público | Startup española reciente |
 
**Lectura:** el **único comparable real** de Crisopa es **aGROSlab** (mismo segmento asesor, precio
público, referente con +25.000 explotaciones). El resto es agricultor individual (oSIGris,
Agroptima, Farmable), enterprise por licencia (Isagri, VisualNACert) u opaco. **Nadie cubre el hueco
"asesor de 10–100 explotaciones con precio transparente y producto moderno"** — que es exactamente
donde está Crisopa.
 
---
 
## 5. Crisopa vs aGROSlab (plan Asesor)
 
Comparativa a distintos volúmenes reales de fincas (aGROSlab sube por tramos; Crisopa es plano):
 
| Nº fincas | aGROSlab | Crisopa Asesor (99 €/1.188 €) | Diferencia |
|---|---|---|---|
| **24** (cliente actual) | 810 € (tramo 50) | 1.188 € | **+47 %** |
| **50** | 810 € | 1.188 € | +47 % |
| **100** | 1.135 € | 1.188 € | +5 % |
 
**Interpretación y posicionamiento elegido:**
- Crisopa es **premium a propósito**. aGROSlab es el incumbente "pesado y sin IA" al que se supera en
  producto, no en precio. El asesor que solo busca lo más barato **no es el cliente** (se queda en
  aGROSlab u oSIGris).
- El argumento que neutraliza la comparación en frío: **"añade todos los clientes que quieras, sin
  coste por finca; aGROSlab te cobra cada explotación adicional".** Se convierte la supuesta
  desventaja (precio plano más alto en volúmenes bajos) en ventaja (generosidad, sin medidor).
- **Validación real:** el cliente actual (24 fincas) ya paga ~+30 % sobre lo que le cobraría aGROSlab
  y **lo ve barato**. Compra por valor, no por comparación.
**Decisión tomada:** **99 € plano**, sin partir en tramos por ahora. Cuando haya más clientes y
datos, se podrá introducir un **segundo punto** (p. ej. "hasta 40" / "hasta 120") para capturar mejor
al *power user* sin agraviar al pequeño — **dos puntos, no cinco** (eso no es escalera de ERP).
 
---
 
## 6. Enterprise (cooperativas y grandes organizaciones)
 
### La lección central
 
**Enterprise no es "muchas explotaciones", es "mucho negocio".** El número de cuadernos es un **mal
proxy del valor** cuando las explotaciones varían de tamaño. Ejemplo real: una cooperativa con 500
explotaciones de **media hectárea** (2.000 kg de aceituna cada una) suma ~250 ha — económicamente
*más pequeña* que una sola finca de >600 ha. Aplicarle una tarifa por explotación (p. ej. 10 €/explot
→ 5.000 €) sería absurdo.
 
**→ Se cobra por el tamaño del negocio (hectáreas, volumen, facturación), no por el recuento de
cuadernos.**
 
### Fórmula orientativa
 
```
Precio/año = base + (EJE_DE_TAMAÑO × tarifa)   [+ implantación, aparte]
 
EJE_DE_TAMAÑO =
   hectáreas / volumen / facturación  → cooperativas con explotaciones micro
   nº de explotaciones                → asesor clásico con fincas de tamaño normal
```
 
- **Implantación:** siempre **aparte y una sola vez**. Migrar cientos de cuadernos es trabajo real.
  En este tramo, un fee de arranque es lo esperado (Isagri factura implantaciones de 6.200–10.500 €).
- **Anclar arriba, cerrar negociando.** El que pone el primer número manda el ancla. En enterprise,
  un precio *demasiado bajo* resta credibilidad ("¿por qué tan barato? ¿será serio?").
- **Reencuadre indoloro:** presentar el coste **por socio/año** o como **% de facturación**, no el
  total que asusta.
### Caso real: cooperativa olivarera (en cierre)
 
**Contexto:** 300–500 explotaciones micro (0,5 ha), pero la cooperativa **factura 30 M €**. Estaban
implantando Microsoft Dynamics 365; el implantador iba a hacerles una vertical de cuaderno de campo,
se salió de presupuesto/plazo, y apareció Crisopa. Muy buena relación con el gerente; el equipo
felicitó la herramienta; quieren **integración con el ERP** y arrancar ambas implantaciones a la vez.
Venta **caliente, casi cerrada**.
 
**Lo que revela el dato de 30 M:** la "pequeñez" era un espejismo (los socios son minifundistas, pero
la organización es una empresa seria). Su **capacidad de pago no es la restricción** — 2.900 € es el
0,01 % de su facturación. Pero el precio **no escala con su facturación** (una coop de 30 M y otra de
60 M no pagan el doble por el mismo software): se fija por valor + comparables, no por % de ingresos.
 
**Estrategia elegida — "cliente colaborador" (design partner):**
 
- **Ancla 3.900 €/año**, con **rebaja de colaborador de 1.000 € → neto 2.900 €/año.**
- A cambio de la rebaja, la cooperativa entra en el **programa de colaboración**: feedback periódico
  del flujo de trabajo de cooperativas, que se prioriza en el roadmap. Es el **mismo modelo** ya
  firmado con el primer cliente asesor.
**Por qué así y no un "7.000 con descuento a 2.900":**
- Un descuento que se **gana** (a cambio de colaboración) protege el ancla; uno regalado la destruye
  ("entonces nunca valía 7.000"). El salto 3.900 → 2.900 (−26 %) es **creíble**; 7.000 → 2.900 no.
- La rebaja de 1.000 € no es un coste: es **la investigación de mercado más barata** para entrar en
  el vertical cooperativa (un segmento entero que luego se vende en repetición).
- **Cláusula clave:** la tarifa de colaborador debe ser **temporal/condicional por escrito** ("vigente
  mientras dure el programa / primeros 12–24 meses"), para que la vuelta al precio estándar sea
  **automática y pactada**, no una negociación futura incómoda.
**Validación vs competencia:** aGROSlab cobraría a esta coop ~2.040 € (300) / ~2.720 € (400) /
~3.400 € (500). El **ancla 3.900** queda justo por encima del competidor barato; el **neto 2.900**
cae *dentro* de su rango — competitivo de cara a la coop, con mejor producto, IA e integración.
 
> **Nota:** este 2.900 neto es una jugada estratégica de **primer logo + aprendizaje + relación**, no
> el precio de lista de una cooperativa de este tamaño. El logo de una coop de 30 M abre las puertas
> de todas las coops de la zona (se conocen entre ellas). Vale más como referencia que como ingreso.
 
### La integración con el ERP: aparte y como producto
 
- **Se cobra como proyecto**, separada de la suscripción. Varios miles de euros (referencia: Isagri,
  6.000–10.500 € de implantación).
- **Se construye siendo de Crisopa**, no work-for-hire: un **conector Crisopa–Dynamics 365** que se
  licencia (proyecto + licencia/mantenimiento anual) y se **revende** a otras coops/empresas con
  Dynamics. Convierte un encargo en producto.
- **Alcance acotado por escrito** (qué datos, qué dirección, qué eventos); todo lo demás es cambio
  facturable. Las integraciones ERP son el reino del *scope creep*.
- **El implantador es un canal**, no un coste: entregar la integración *con* él lo gana como partner
  de distribución para sus otros clientes.
---
 
## 7. Tácticas de presentación
 
- **Titular = mensual-equivalente** (49 €/mes, 99 €/mes); anual en pequeño con "se factura una vez al
  año". El público del campo ancla en el número grande que ve primero; baja el *sticker shock*. **Pero
  el total anual siempre visible y honesto** — el rata que se siente emboscado en el checkout no
  vuelve y lo cuenta en un sector pequeño.
- **Charm pricing** (49, 99): el cerebro lee el primer dígito. "99 €" se siente "noventa y pico", no
  "cien".
- **Nada de "por explotación".** Dividir el precio entre el tope (100) para enseñar "1,24 €/finca" es
  engañoso (nadie tiene 100) y se nota. El reencuadre honesto es por **horas** ("menos que una tarde
  de papeleo al mes"), no por finca.
- **No ancles el valor en "hasta 100 explotaciones".** Es la objeción nº 1 ("no tengo 100, no pago
  99 €"). El valor de Asesor es **multiusuario + permisos / IA / multicliente**, no la cifra de
  capacidad: esos van **primero** en la lista de features; "hasta 100" baja a cláusula anti-medidor
  ("no chocas con el límite"). El rebuttal es **condicional al perfil**: a quien tiene equipo, "no
  pagas por 100 fincas, pagas por que cada técnico tenga su acceso aislado"; al asesor solo, "pagas
  por el copiloto IA, la cartera unificada y los avisos de vencimientos".
- **En enterprise: por socio o % de facturación.** "Menos de 5 €/socio al año" cierra; "2.900 €"
  asusta.
- **Anclar arriba, conceder hacia el objetivo.** Quien pone el primer número manda. Abrir en el
  objetivo deja dinero sobre la mesa.
---
 
## 8. Estado y próximos pasos
 
| Decisión | Estado |
|---|---|
| Profesional 49 € (**1 usuario**) · Asesor 99 € (**multiusuario + permisos**) · anual-only | **Cerrado** — aplicado en `Pricing.astro` |
| Segmentación por **capacidad** (no persona) + check de tamaño → Enterprise | **Cerrado** (jun 2026) |
| Reordenar features de Asesor: multiusuario/IA/multicliente arriba, "hasta 100" como anti-medidor | **Cerrado** — aplicado en `Pricing.astro` |
| Quitar el toggle mensual y el "+10 €/usuario" | **Cerrado** — pendiente aplicar |
| Subir Asesor alta a alta según conversión de la prueba | En curso |
| Cliente actual asesor: respetar tarifa (colaborador) | Hecho |
| Cooperativa: 3.900 ancla / 2.900 neto colaborador + integración aparte | **En cierre** |
| Segundo punto en plan Asesor ("hasta 40" / "hasta 120") | Futuro (cuando haya datos) |
| Formalizar programa "cliente colaborador" (design partners) | Pendiente |
