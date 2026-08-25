/**
 * Preguntas frecuentes de la home.
 *
 * Viven fuera del componente porque las consumen dos sitios: el acordeón de
 * `FAQ.astro` y el `FAQPage` de datos estructurados que emite `index.astro`.
 * Google exige que el marcado reproduzca contenido visible, así que una sola
 * fuente evita que se separen con el tiempo.
 */
export const faqs = [
  {
    question: '¿Necesito ChatGPT o Claude de pago?',
    answer:
      'Para empezar te vale la versión gratuita. Para sacarle todo el partido (notas de voz, conversaciones largas, planificar campañas) te recomendamos un plan de pago de ChatGPT o Claude, que contratas directamente con ellos. La IA no te la facturamos nosotros: el coste lo cubre tu propia suscripción.',
  },
  {
    question: '¿Funciona también sin IA?',
    answer:
      'Sí. Crisopa es una aplicación completa: puedes trabajar a mano desde el panel cuando quieras. La IA es la forma más rápida de hacer las cosas, no la única.',
  },
  {
    question: '¿Mis datos están seguros usando la IA?',
    answer:
      'Sí. La IA accede a tu cuaderno a través de una conexión segura que tú autorizas, y solo a lo que le pides. Puedes revocar el acceso en cualquier momento.',
  },
  {
    question: '¿Esto vale para la inspección?',
    answer:
      'Sí. El cuaderno cumple con el RD 1311/2012 y la normativa vigente. Si tienes una inspección, exportas el cuaderno en PDF y te quedas tranquilo.',
  },
  {
    question: '¿Qué pasa cuando acaban los 15 días?',
    answer:
      'Si no eliges un plan, tu cuenta pasa a solo lectura. No pierdes nada. Cuando quieras, activas un plan y sigues.',
  },
  {
    question: '¿Y si luego quiero exportar mis datos?',
    answer:
      'Tus datos son tuyos. Puedes exportarlos en cualquier momento en PDF o Excel. Sin permanencia: cancelas cuando quieras.',
  },
] as const
