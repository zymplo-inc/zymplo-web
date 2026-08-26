/**
 * LOS NÚMEROS DE WHATSAPP QUE NO SE PUBLICAN · una sola lista, dos vigilantes.
 *
 * ═══ LA REGLA ═════════════════════════════════════════════════════════════
 *
 * Sólo DOS números son publicables (Carlos 2026-07-22 · ratificado 2026-08-07):
 * el global de US y el de BR. Viven en `src/data/countries.ts` como `WA_NUMBER`
 * y `WA_NUMBER_BR`. Los cinco de acá abajo son el canal PY deprecado, el DESA
 * expirado, uno que estuvo tres meses como default sin ser de ningún canal, y
 * dos de prueba.
 *
 * ═══ POR QUÉ ESTA LISTA SE MUDÓ A SU PROPIO ARCHIVO ═══════════════════════
 *
 * Estaba escrita adentro de `scripts/check-seo.ts`, que valida el `dist` del
 * build. El 2026-08-26 una tester encontró **7 apariciones** de dos de estos
 * números sirviéndose en `zymplo.com.br`, la home oficial de Brasil, con el CI
 * en verde durante semanas.
 *
 * El candado no falló: **falló su alcance.** Miraba el artefacto que produce
 * este repo y `zymplo.com.br` es una publicación aparte, congelada en un build
 * anterior al arreglo. Ahora hay dos vigilantes —el del `dist` y el de los
 * dominios en vivo— y comparten esta lista. Copiarla en el segundo habría sido
 * repetir el defecto de fondo: una regla escrita en dos lugares que mañana dicen
 * cosas distintas.
 */

export const NUMEROS_PROHIBIDOS: readonly string[] = [
  '595981970735', // canal PY deprecado · el que la tester escaneó en el QR
  '595974239990',
  '595976636900',
  '15556447935',
  '14155238886', // estuvo 3 meses como WA_NUMBER default sin ser de ningún canal
] as const;

/**
 * TODO dominio donde se sirve el sitio · el vigilante de los vivos los recorre.
 *
 * ⚠️ LOS ccTLD SON EL PUNTO DE LA LISTA, NO UN EXTRA.
 *
 * Si esto apuntara sólo a `zymplo.com` seguiría en verde hoy, porque el apex
 * está limpio: lo que se sirve sucio es `zymplo.com.br`. Un chequeo de dominios
 * que no enumera los ccTLD reproduce exactamente el agujero que vino a tapar.
 *
 * `br.zymplo.com` y los otros `xx.zymplo.com` NO tienen build propio: son un
 * proxy (`X-Zymplo-Proxy: country-proxy-v3`) sobre el sitio principal, así que
 * no pueden desfasarse solos. Se recorren igual, porque cuesta nada y un proxy
 * mal apuntado se vería acá.
 *
 * Fuera de la lista a propósito: `zymplo.es` (dominio estacionado en Hostinger,
 * no es el sitio) y `zymplo.app` (sin DNS). Verificado 2026-08-26.
 */
export const DOMINIOS_PUBLICOS: readonly string[] = [
  'zymplo.com',
  // ccTLD · publicación SEPARADA, la que se congeló
  'zymplo.com.br',
  // proxies por país
  'ar.zymplo.com',
  'bo.zymplo.com',
  'br.zymplo.com',
  'cl.zymplo.com',
  'co.zymplo.com',
  'cr.zymplo.com',
  'ec.zymplo.com',
  'es.zymplo.com',
  'mx.zymplo.com',
  'pe.zymplo.com',
  'pt.zymplo.com',
  'py.zymplo.com',
  'us.zymplo.com',
  'uy.zymplo.com',
] as const;
