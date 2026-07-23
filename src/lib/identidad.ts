/**
 * Identidad legal y contactos usados en las páginas legales.
 *
 * PENDIENTE: los valores marcados con `⟨…⟩` son marcadores de posición. Hay que
 * sustituirlos por los datos reales ANTES de publicar: una política de privacidad
 * sin responsable identificado no cumple el artículo 13 del RGPD.
 *
 * Este archivo es el espejo de `src/app/(legal)/identidad.ts` en el repo de la
 * aplicación. Si cambian los datos, cámbialos en los dos sitios.
 */
export const IDENTIDAD = {
  razonSocial: '⟨razón social⟩',
  nif: '⟨NIF⟩',
  domicilio: '⟨domicilio social⟩',
  emailSeguridad: 'seguridad@crisopa.app',
} as const

/** Buzón para el ejercicio de derechos y consultas de privacidad. */
export const EMAIL_PRIVACIDAD = 'privacidad@crisopa.app'

/** Buzón de soporte al usuario. */
export const EMAIL_SOPORTE = 'soporte@crisopa.app'

/**
 * Fecha de última revisión de los documentos legales. Actualízala cuando cambie
 * el contenido de privacidad o términos, no en cada despliegue.
 */
export const ACTUALIZADO = '23 de julio de 2026'
