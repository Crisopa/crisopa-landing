# Qué le falta a la web para ser una web empresarial

Revisión hecha el 21 de septiembre de 2026 sobre el estado del sitio en ese
momento. La conclusión corta: lo que más falta no es un apartado de empleo,
es una cara detrás del producto y señales de que va en serio a largo plazo.

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
5. **Novedades o registro de cambios.** Es la señal más barata de que el
   producto está vivo. Un blog exige disciplina; un changelog público se
   alimenta solo con lo que ya se hace.
6. **Presencia social enlazada.** Cero enlaces a LinkedIn, Instagram o YouTube.
   Los vídeos de demo ya existen (`/demo`) pero la página es `noindex`.
7. **Página de integraciones.** El conector de ChatGPT y el de Claude son un
   diferencial claro y hoy no tienen página indexable.
8. **Centro de ayuda o documentación pública.** `/soporte` dice a dónde
   escribir, pero no hay guías. Para un asesor que evalúa el producto, ver la
   documentación pesa casi tanto como probarlo.
9. **Página 404 propia.** No hay `src/pages/404.astro`.
10. **Logos y cifras de clientes.** Va ligado a los testimonios que aún no hay,
    pero un «usado en X explotaciones y Y hectáreas» va antes que las citas.

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

«Sobre Crisopa», «Contacto» y el aviso legal. Son las tres que cierran más
dudas con menos trabajo.
