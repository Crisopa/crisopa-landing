/**
 * Identidad legal y contactos usados en las páginas legales.
 *
 * El responsable es una persona física, no una sociedad: de ahí `responsable` y
 * no «razón social». Estos datos son obligatorios en la información al
 * interesado (art. 13 RGPD) y en el aviso legal (art. 10 LSSI-CE).
 */
export const IDENTIDAD = {
  responsable: 'Pablo Reina Gálvez',
  nif: '32732929L',
  domicilio: 'Calle Huerta de Santa Isabel, 12, 1.º 1, 14011 Córdoba (España)',
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
