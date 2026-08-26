/**
 * ¿QUÉ SE ESTÁ SIRVIENDO DE VERDAD, HOY, EN CADA DOMINIO?
 *
 * ═══ POR QUÉ EXISTE ══════════════════════════════════════════════════════════
 *
 * `check-seo.ts` valida el `dist`: el artefacto que produce ESTE repo. Es útil y
 * está bien, pero el 2026-08-26 una tester de Brasil encontró dos números de la
 * lista prohibida sirviéndose en `zymplo.com.br` —la home oficial de Brasil, con
 * el QR del #faq apuntando al número paraguayo— y el CI había estado en verde
 * durante semanas.
 *
 * El candado no falló: **falló su alcance.** `zymplo.com.br` es una publicación
 * SEPARADA, congelada en un build anterior al commit que sacó esos números. El
 * repo estaba impecable y el sitio no.
 *
 * La lección, dicha corta: *validar el artefacto no es validar lo que se sirve.*
 *
 * ═══ LO QUE HACE, Y LO QUE NO ════════════════════════════════════════════════
 *
 * Recorre `DOMINIOS_PUBLICOS` —los ccTLD incluidos, que es el punto— y busca los
 * números prohibidos en el HTML que devuelve cada uno. Nada más. No valida
 * canónicas ni hreflang ni links: de eso ya se ocupa `check-seo` sobre el dist,
 * donde es determinista y no depende de la red.
 *
 * NO va adentro de `npm run build`. Un chequeo que pega contra internet en cada
 * build convierte cualquier caída de red en un build roto, y a la semana alguien
 * lo saca. Corre por su cuenta: `npm run check:dominios`, y agendado.
 *
 * ═══ CÓMO LEER SU SALIDA ═════════════════════════════════════════════════════
 *
 * Un dominio que no responde NO es un fallo: puede ser la red de quien lo corre.
 * Se reporta aparte, como «no se pudo verificar». Confundir «no pude mirar» con
 * «está limpio» es la forma exacta del defecto que este archivo vino a tapar.
 */
import { DOMINIOS_PUBLICOS, NUMEROS_PROHIBIDOS } from '../src/data/numerosProhibidos';

const TIMEOUT_MS = 20_000;

interface Resultado {
  dominio: string;
  estado: 'limpio' | 'sucio' | 'sin-mirar';
  detalle?: string;
  hallados?: { numero: string; veces: number }[];
}

async function mirar(dominio: string): Promise<Resultado> {
  const url = `https://${dominio}/`;
  const ctrl = new AbortController();
  const reloj = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal });
    if (!r.ok) {
      return { dominio, estado: 'sin-mirar', detalle: `HTTP ${r.status}` };
    }
    const html = await r.text();
    const hallados = NUMEROS_PROHIBIDOS.map((numero) => ({
      numero,
      veces: html.split(numero).length - 1,
    })).filter((h) => h.veces > 0);

    return hallados.length
      ? { dominio, estado: 'sucio', hallados }
      : { dominio, estado: 'limpio' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { dominio, estado: 'sin-mirar', detalle: msg.slice(0, 80) };
  } finally {
    clearTimeout(reloj);
  }
}

const resultados = await Promise.all(DOMINIOS_PUBLICOS.map(mirar));

const sucios = resultados.filter((r) => r.estado === 'sucio');
const sinMirar = resultados.filter((r) => r.estado === 'sin-mirar');
const limpios = resultados.filter((r) => r.estado === 'limpio');

for (const r of resultados) {
  if (r.estado === 'sucio') {
    const lista = r.hallados!.map((h) => `${h.numero} ×${h.veces}`).join(', ');
    console.error(`❌ ${r.dominio} · ${lista}`);
  } else if (r.estado === 'sin-mirar') {
    console.warn(`⚠️  ${r.dominio} · no se pudo verificar (${r.detalle})`);
  } else {
    console.log(`✅ ${r.dominio}`);
  }
}

console.log(
  `\n${limpios.length} limpios · ${sucios.length} sirviendo números prohibidos · ` +
    `${sinMirar.length} sin verificar · de ${DOMINIOS_PUBLICOS.length} dominios`,
);

if (sucios.length) {
  console.error(
    '\nUn número de la lista prohibida se está SIRVIENDO. El repo puede estar\n' +
      'impecable y esto seguir rojo: significa que ese dominio es una publicación\n' +
      'aparte que quedó vieja. Se arregla republicándola, no con un commit.',
  );
  process.exit(1);
}

// Los «sin mirar» no tumban el chequeo —puede ser la red de quien lo corre— pero
// se dicen fuerte: un dominio que nunca se puede verificar es un punto ciego, y
// un punto ciego callado es de dónde salió todo esto.
if (sinMirar.length) {
  console.warn(`\n${sinMirar.length} dominio(s) sin verificar · revisar si es la red o el dominio.`);
}
