#!/usr/bin/env tsx
/**
 * CANDADO · el número de WhatsApp que publica la web
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * LA REGLA (Carlos, 2026-08-07 · ratificada 2026-08-26):
 *   Brasil  → +55 11 92569-7328   (exclusivo Brasil)
 *   El resto → +1 202 771 8788    (global · el default de cualquier página
 *                                  que no sepa de qué país es quien mira)
 *
 * POR QUÉ EXISTE ESTE ARCHIVO
 *   El 2026-08-26 se midió que `zymplo.com.br` servía SEIS veces el
 *   +595 981 970 735 y una vez el número de prueba de Meta. Ese +595 no es
 *   un canal dado de baja: es el TELÉFONO PERSONAL de Carlos. O sea que la
 *   home oficial de Brasil estuvo publicando un dato personal (OPS-R201),
 *   y una tester lo escaneó del QR y terminó en el WhatsApp equivocado.
 *
 *   El código de `main` ya estaba bien —`waNumberFor()` decide por país desde
 *   el 31-jul—. Lo que falló fue que NADIE MIRABA. `zymplo.com.br` es un
 *   proyecto de Cloudflare Pages aparte que quedó congelado en un build del
 *   10-ago, y no había ningún control que dijera «esto que estás por publicar
 *   tiene un número prohibido adentro». Este archivo es ese control.
 *
 * QUÉ COMPRUEBA (las cuatro, en orden)
 *   A · Los dos números vivos son EXACTAMENTE los del SSOT
 *       (`canales-whatsapp.json` del monorepo). No «parecidos»: iguales.
 *   B · `waNumberFor()` se COMPORTA bien. No alcanza con que el archivo
 *       contenga la palabra: se la importa y se la llama. Un candado que
 *       matchea el nombre de la prueba siempre dice que sí (25-ago).
 *   C · Ningún número prohibido aparece en `src/` ni en `public/`, en
 *       ninguna forma: con `+`, con espacios, con guiones o pelado.
 *   D · Ningún literal `wa.me/<dígitos>` vive fuera de `src/data/countries.ts`.
 *       UNA sola puerta. Cada superficie nueva que elige número a mano es
 *       otro `zymplo.com.br` esperando a pasar.
 *
 * CÓMO SE LEE EL RESULTADO · POR CÓDIGO DE SALIDA, NUNCA POR EL TEXTO
 *   0 → VERDE               todo medido y correcto
 *   1 → ROJO                medí y está mal
 *   2 → MEDICION-INVALIDA   no pude medir (no confundir con «está bien»)
 *
 *   Un `exit 2` JAMÁS se degrada a `exit 1`, y mucho menos a 0: «no pude
 *   mirar» y «miré y está sano» son cosas distintas.
 *
 * INTERRUPTOR
 *   SALTAR_CANDADO_NUMEROS=si-y-me-hago-cargo  → sale 0 pero grita en el log.
 *   Es a propósito incómodo de escribir: si hay que apagarlo, que se vea.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');
const UNICA_PUERTA = 'src/data/countries.ts';
const CARPETAS = ['src', 'public'];

/** Los dos únicos números que la web puede publicar. Espejo del SSOT. */
const VIVOS = {
  global: '12027718788', //  +1 202 771 8788  · TODOS los países salvo Brasil
  brasil: '5511925697328', // +55 11 92569-7328 · EXCLUSIVAMENTE Brasil
} as const;

/**
 * DÓNDE VIVE LA LISTA DE PROHIBIDOS
 *
 * El origen de verdad es `canales-whatsapp.json` → `numeros_prohibidos` del
 * monorepo `zymplo-inc/zymplo`, que este repo no puede leer.
 *
 * Si existe `src/data/numerosProhibidos.ts` (lo trae el PR #37, que además
 * agrega el vigía de dominios EN VIVO), esa es la lista y esta copia no se
 * usa. UNA lista, varios vigilantes: el de la fuente —este—, el del `dist`
 * (`check-seo`) y el de los dominios servidos. Copiar la lista en cada uno
 * es cómo se termina con tres listas que dicen cosas distintas.
 *
 * El respaldo de acá abajo existe para que el candado funcione IGUAL antes de
 * que ese archivo aterrice. Se borra cuando #37 esté en main.
 */
const LISTA_COMPARTIDA = 'src/data/numerosProhibidos.ts';

const RESPALDO: ReadonlyArray<{ numero: string; que_era: string }> = [
  { numero: '595974239990', que_era: 'canal PY · 360dialog · sin efecto desde el 2026-08-07' },
  { numero: '595976636900', que_era: 'canal Meta Cloud DESA · verificación EXPIRADA' },
  { numero: '595981970735', que_era: 'TELÉFONO PERSONAL de Carlos · nunca fue un canal' },
  { numero: '14155238886', que_era: 'sandbox de Twilio · canal de pruebas de un tercero' },
  { numero: '15556447935', que_era: 'número de prueba de Meta' },
];

/**
 * Los archivos que TIENEN que nombrar los números prohibidos para poder
 * bloquearlos. Sin esta excepción el candado se muerde la cola: encontraría
 * la lista negra y la denunciaría como si fuera una publicación.
 *
 * Es la excepción más peligrosa del archivo, así que es explícita y corta:
 * sólo la lista compartida. Cualquier otro archivo de `src/` que escriba uno
 * de esos números sigue siendo rojo.
 */
const PUEDEN_NOMBRARLOS = new Set([LISTA_COMPARTIDA]);

function cargarProhibidos(): ReadonlyArray<{ numero: string; que_era: string }> {
  const ruta = join(RAIZ, LISTA_COMPARTIDA);
  if (!existsSync(ruta)) return RESPALDO;
  // Se lee como texto y no se importa: la lista es un dato, y un `import`
  // ejecutaría lo que haya en ese archivo sólo para leer cinco números.
  const texto = readFileSync(ruta, 'utf8');
  const hallados = [...texto.matchAll(/['"](\d{10,15})['"]/g)].map((m) => m[1]);
  const unicos = [...new Set(hallados)].filter((n) => n !== VIVOS.global && n !== VIVOS.brasil);
  if (unicos.length === 0) {
    morir(`${LISTA_COMPARTIDA} existe pero no pude sacarle ni un número · no voy a seguir con una lista vacía`);
  }
  return unicos.map((numero) => ({
    numero,
    que_era: RESPALDO.find((r) => r.numero === numero)?.que_era ?? `prohibido según ${LISTA_COMPARTIDA}`,
  }));
}

/** Extensiones de texto que vale la pena mirar. El resto es binario. */
const MIRABLES = /\.(astro|ts|tsx|js|jsx|mjs|cjs|json|html|htm|md|mdx|svg|txt|xml|yml|yaml|css)$/i;
const SALTAR = /(^|\/)(node_modules|dist|\.git|\.astro|\.vercel|\.wrangler)(\/|$)/;

const fallas: string[] = [];
const notas: string[] = [];

function morir(motivo: string): never {
  console.error(`MEDICION-INVALIDA · ${motivo}`);
  console.error('  (no pude medir · esto NO quiere decir que esté bien)');
  process.exit(2);
}

/** Todos los archivos de texto bajo las carpetas vigiladas. */
function archivos(dir: string, acc: string[] = []): string[] {
  let entradas: string[];
  try {
    entradas = readdirSync(dir);
  } catch {
    return acc; // carpeta que no existe: la reporta el que la pidió
  }
  for (const e of entradas) {
    const p = join(dir, e);
    if (SALTAR.test(p)) continue;
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) archivos(p, acc);
    else if (MIRABLES.test(e)) acc.push(p);
  }
  return acc;
}

/**
 * Un número, tolerando cómo lo escribiría un humano: `+55 11 92569-7328`,
 * `(11) 92569.7328`, o pelado. Sin esto el candado sólo caza la forma exacta
 * y cualquiera lo esquiva sin querer, con sólo poner un espacio.
 */
function comoLoEscribiriaUnHumano(numero: string): RegExp {
  return new RegExp(numero.split('').join('[\\s\\-.()]{0,2}'), 'g');
}

const PROHIBIDOS = cargarProhibidos();

// ── El interruptor, antes que nada ──────────────────────────────────────────
if (process.env.SALTAR_CANDADO_NUMEROS === 'si-y-me-hago-cargo') {
  console.warn('⚠️  CANDADO DE NÚMEROS SALTEADO A MANO · SALTAR_CANDADO_NUMEROS');
  console.warn('   Nadie está mirando qué número publica esta build.');
  process.exit(0);
}

// ── Control positivo · si esto falla, el candado está ciego ─────────────────
{
  const prueba = 'llamar al +55 11 92569-7328 hoy';
  if (!comoLoEscribiriaUnHumano(VIVOS.brasil).test(prueba)) {
    morir('el detector no encuentra un número que SÍ está en el texto de prueba');
  }
  const limpio = 'acá no hay ningún teléfono, sólo el año 2026 y 1500 pesos';
  if (comoLoEscribiriaUnHumano(PROHIBIDOS[0].numero).test(limpio)) {
    morir('el detector encuentra un número que NO está · daría rojos falsos');
  }
}

// ── A · los dos vivos son los del SSOT ──────────────────────────────────────
let fuente: string;
try {
  fuente = readFileSync(join(RAIZ, UNICA_PUERTA), 'utf8');
} catch (e) {
  morir(`no pude leer ${UNICA_PUERTA} · ${(e as Error).message}`);
}
for (const [rol, numero] of Object.entries(VIVOS)) {
  if (!fuente.includes(`'${numero}'`) && !fuente.includes(`"${numero}"`)) {
    fallas.push(`A · ${UNICA_PUERTA} no declara el número ${rol} esperado (…${numero.slice(-4)})`);
  }
}

// ── B · waNumberFor() se COMPORTA · se la llama, no se la lee ───────────────
async function comprobarComportamiento(): Promise<void> {
  let waNumberFor: (slug?: string) => string;
  try {
    ({ waNumberFor } = await import(join(RAIZ, UNICA_PUERTA)));
  } catch (e) {
    morir(`no pude importar waNumberFor · ${(e as Error).message}`);
  }
  if (typeof waNumberFor !== 'function') {
    morir(`${UNICA_PUERTA} no exporta waNumberFor como función`);
  }

  const brasil = waNumberFor('br');
  if (brasil !== VIVOS.brasil) {
    fallas.push(`B · waNumberFor('br') devolvió …${brasil.slice(-4)} · esperaba el de Brasil (…${VIVOS.brasil.slice(-4)})`);
  }
  // El resto del mundo, incluido «no sé de qué país es», va al global.
  for (const slug of ['us', 'mx', 'ar', 'py', 'es', 'pt', 'co', 'cl', 'pe', 'uy', 'bo', 'cr', 'ec', undefined]) {
    const dio = waNumberFor(slug);
    if (dio !== VIVOS.global) {
      fallas.push(`B · waNumberFor(${slug ?? 'sin país'}) devolvió …${dio.slice(-4)} · esperaba el global (…${VIVOS.global.slice(-4)})`);
    }
  }
}

async function main(): Promise<void> {
  await comprobarComportamiento();

  // ── C y D · el barrido ──────────────────────────────────────────────────────
  const todos = CARPETAS.flatMap((c) => archivos(join(RAIZ, c)));
  if (todos.length === 0) {
    morir(`no encontré ni un archivo que mirar en ${CARPETAS.join('/, ')}/ · ¿mal directorio?`);
  }

  for (const ruta of todos) {
    const rel = relative(RAIZ, ruta);
    let texto: string;
    try {
      texto = readFileSync(ruta, 'utf8');
    } catch (e) {
      morir(`no pude leer ${rel} · ${(e as Error).message}`);
    }
    const lineas = texto.split('\n');

    // C · ningún prohibido, en ninguna forma
    for (const { numero, que_era } of PUEDEN_NOMBRARLOS.has(rel) ? [] : PROHIBIDOS) {
      lineas.forEach((linea, i) => {
        if (comoLoEscribiriaUnHumano(numero).test(linea)) {
          fallas.push(`C · ${rel}:${i + 1} publica un número PROHIBIDO (…${numero.slice(-4)}) · ${que_era}`);
        }
      });
    }

    // D · una sola puerta
    if (rel === UNICA_PUERTA) continue;
    lineas.forEach((linea, i) => {
      const m = linea.match(/wa\.me\/(\d{8,15})/g);
      if (m) {
        fallas.push(
          `D · ${rel}:${i + 1} elige el número a mano (${m.join(', ').replace(/\d(?=\d{4})/g, '·')}) · ` +
            `tiene que salir de waNumberFor() en ${UNICA_PUERTA}`,
        );
      }
    });
  }

  notas.push(`${todos.length} archivos mirados · ${PROHIBIDOS.length} números prohibidos vigilados`);

  // ── Veredicto ───────────────────────────────────────────────────────────────
  if (fallas.length > 0) {
    console.error('ROJO · la web publicaría un número que no corresponde\n');
    for (const f of fallas) console.error(`  ✗ ${f}`);
    console.error(`\n  ${notas.join(' · ')}`);
    console.error('\n  La regla: Brasil → el número de Brasil · todos los demás → el global de USA.');
    process.exit(1);
  }

  console.log(`VERDE · número por país correcto · ${notas.join(' · ')}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(`MEDICION-INVALIDA · el candado se cayó · ${(e as Error).message}`);
  process.exit(2);
});
