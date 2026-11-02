#!/usr/bin/env tsx
/**
 * CANDADO · la web no afirma cumplimientos ni certificaciones que no tiene
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * LA REGLA
 *   Ningún texto público de la web dice que Zymplo «cumple» una ley, «es
 *   compliant», «está certificado», «fue auditado», tiene «seguridad de grado
 *   bancario» o es «100 % seguro». Ninguna auditoría ni certificación lo
 *   respalda. Lo que sí se puede decir —y se dice— es lo verificable: «tus
 *   datos son tuyos: podés pedir verlos o borrarlos cuando quieras».
 *
 * POR QUÉ EXISTE ESTE ARCHIVO
 *   Se midió que las home de EE. UU. y México publicaban «CCPA compliant» /
 *   «100 % seguro y compliant», las de siete países «100 % DGT compliant», y
 *   la FAQ de los 14 locales «Cumple con LGPD/RGPD, encriptación punta a
 *   punta» / «We follow CCPA/GDPR». Corregirlo una vez no alcanza: el texto
 *   vuelve cuando alguien copia una home vieja. Este archivo es el control.
 *
 * QUÉ MIRA
 *   Todo texto de `src/` y `public/` (JSON de los 14 locales, componentes,
 *   layouts, páginas, `llms.txt`, `AGENTS.md`…), por frases de AFIRMACIÓN, no
 *   por palabras sueltas: «LGPD», «GDPR» o «Cumplimiento» como rótulo, o la
 *   ley nombrada como derecho del usuario («Tus derechos (LGPD · GDPR)»), NO
 *   son un rojo. «Cumple con la LGPD», «CCPA compliant» o «SOC 2» sí.
 *
 * QUÉ NO MIRA (dicho a propósito)
 *   · Los documentos legales (`src/components/Legal/**` y `src/pages/**\/legal/**`):
 *     los reescribe la rama `fix/la-politica-publicada-dice-lo-que-hacemos`.
 *     Hasta que esa rama esté en `main`, esos archivos de `main` todavía dicen
 *     «PCI-DSS», «SOC 2 Type II», «cumplen con SCCs», y un candado que los mire
 *     pondría roja la build de cualquiera que merge antes. Se miran igual con
 *     `--con-legales` (medido: el árbol con esa rama integrada da 0). Cuando
 *     esa rama esté en `main`, se borra la constante DOCUMENTOS_LEGALES de
 *     abajo y el candado los mira siempre.
 *   · Los comentarios de código que ocupan TODA la línea (`// …` o `/* … *\/`
 *     al comienzo de línea) en .astro/.ts/.tsx/.js/.mjs: no viajan al navegador
 *     (medido en el árbol integrado: una nota de ingeniería sobre cómo se
 *     guarda un token decía «AES-256-GCM» y no es texto público). Los comentarios
 *     HTML `<!-- -->` SÍ viajan a la página, y esos sí se miran. Un comentario
 *     al final de una línea de código tampoco se saltea.
 *   · Paráfrasis que ninguna regla prevé. Es un detector de frases, no un
 *     lector: lo que escape se agrega como regla NUEVA con su caso que canta.
 *
 * CÓMO SE LEE EL RESULTADO · POR CÓDIGO DE SALIDA, NUNCA POR EL TEXTO
 *   0 → VERDE               todo medido y limpio
 *   1 → ROJO                medí y hay una afirmación sin respaldo
 *   2 → MEDICION-INVALIDA   no pude medir (no confundir con «está bien»):
 *                           una regla ciega, o no encontré archivos
 *
 * CONTROL DE LOS PROPIOS DETECTORES
 *   Cada regla trae frases que TIENEN que cantar (las que estuvieron en la web)
 *   y frases que NO pueden cantar (rótulos y derechos). Se prueban ANTES de
 *   mirar nada: una regla ciega o histérica es `exit 2`, jamás un verde.
 *
 * INTERRUPTOR
 *   SALTAR_CANDADO_CERTIFICACIONES=si-y-me-hago-cargo  → sale 0 pero grita.
 *   Es a propósito incómodo de escribir: si hay que apagarlo, que se vea.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');
const CARPETAS = ['src', 'public'];
const MIRABLES = /\.(astro|ts|tsx|js|jsx|mjs|json|html|htm|md|mdx|txt|xml)$/i;
const SALTAR = /(^|\/)(node_modules|dist|\.git|\.astro)(\/|$)/;

/**
 * Los documentos legales. Ver «QUÉ NO MIRA». Se borra cuando la rama
 * `fix/la-politica-publicada-dice-lo-que-hacemos` esté en `main`.
 */
const DOCUMENTOS_LEGALES: ReadonlyArray<RegExp> = [
  /^src\/components\/Legal\//,
  /^src\/pages\/(?:[^/]+\/)?legal\//,
];

const CON_LEGALES = process.argv.includes('--con-legales');

// Las leyes de datos que la web nombra. Nombrarlas no es el problema; decir que se «cumplen» sí.
const LEY = '(?:LGPD|RGPD|GDPR|CCPA|CPRA|LFPDPPP|HIPAA|COPPA|SCCs?)';
const ART = '(?:(?:la|el|las|los|a|o|as|os|the)\\s+)?';
// `\w` de JavaScript es sólo ASCII: «encriptación» y «criptografía» se cortan en la tilde.
const PAL = '[a-zà-ÿ]*';
const CIFRADO = `(?:encrypt|encript|cifrad|criptograf)${PAL}`;
// Lo mismo con `\b`: delante de «é» o «à» no hay frontera ASCII. Esta es la frontera que sirve.
const ANTES = '(?<![a-zà-ÿ0-9_])';

interface Regla {
  id: string;
  que: string;
  patron: RegExp;
  /** Frases que TIENEN que cantar. Las primeras son textos reales que estuvieron en la web. */
  canta: string[];
  /** Frases que NO pueden cantar: rótulos, derechos del usuario, lenguaje legal legítimo. */
  calla: string[];
}

const REGLAS: Regla[] = [
  {
    id: 'R1',
    que: 'dice «compliant»',
    patron: /\bcompliant\b/gi,
    canta: ['100% safe · CCPA compliant', '100% DGT compliant', '100% seguro y compliant', 'OAuth · LGPD-compliant'],
    calla: ['Compliance', 'Cumplimiento', 'Conformidade', 'section_compliance'],
  },
  {
    id: 'R2',
    que: 'afirma que cumple, sigue o fue construido para una ley',
    patron: new RegExp(
      [
        `\\b(?:cumple|cumplen|cumplimos|cumpliendo)\\s+(?:con\\s+)?${ART}${LEY}\\b`,
        `\\b(?:cumpre|cumprem|cumprimos)\\s+(?:com\\s+)?${ART}${LEY}\\b`,
        `\\b(?:comply|complies|complying)\\s+with\\s+${ART}${LEY}\\b`,
        `\\b(?:in|en|em)\\s+(?:full\\s+)?(?:compliance|cumplimiento|conformidade|conformidad)\\s+(?:with|con|com)\\s+${ART}${LEY}\\b`,
        `\\bem\\s+conformidade\\s+com\\s+${ART}${LEY}\\b`,
        `\\b(?:we\\s+follow|follows?|seguimos|sigue|siguen|segue|seguem)\\s+${ART}${LEY}\\b`,
        `\\b(?:constru[ií]d[oa]|diseñad[oa]|projetad[oa]|hech[oa]|built|designed|made)\\s+(?:para|for)\\s+${ART}${LEY}\\b`,
        `\\b${LEY}[\\s-]+(?:ready|friendly|certified|approved|conforme|aprovad[oa]|aprobad[oa])\\b`,
        `\\b(?:Zymplo|we)\\s+(?:fully\\s+|always\\s+)?(?:complies|comply)\\s+with\\b`,
      ].join('|'),
      'gi',
    ),
    canta: [
      'Sí. Cumple con LGPD/RGPD, encriptación punta a punta.',
      'Sim. Seguimos a LGPD, com criptografia em trânsito.',
      'Sim. Seguimos o RGPD, com criptografia em trânsito.',
      'Yes. We follow CCPA/GDPR, with encryption in transit.',
      'Construído para a LGPD',
      'Construído para o RGPD',
      'Diseñado para el RGPD',
      'We comply with the GDPR',
      'Zymplo complies with the data protection regulations',
      'em conformidade com a LGPD',
      'Todos cumplen con SCCs (Standard Contractual Clauses)',
      'LGPD-ready',
    ],
    calla: [
      'Tus derechos (LGPD · GDPR · CCPA)',
      'Your rights (LGPD · GDPR · CCPA)',
      'Cumplir con obligaciones legales locales (LGPD Brasil · Lei 1682/01 Paraguay · etc).',
      'Comply with local legal obligations (LGPD Brazil · Law 1682/01 Paraguay · etc).',
      'Cumplir con regulaciones fiscales y laborales de tu país.',
      'son necesarios para prestarte el servicio que pediste (LGPD, art. 33, IX, con art. 7, V)',
      'Perfil → Seguridad · LGPD',
      'Sua privacidade, sob a LGPD, é um direito',
      'Tus datos son tuyos',
    ],
  },
  {
    id: 'R3',
    que: 'nombra una certificación o marco de cumplimiento (SOC, ISO 27001, PCI-DSS, HIPAA…)',
    patron: new RegExp(
      [
        '\\bSOC\\s?[123]\\b',
        '\\bISO[\\s/-]?(?:IEC[\\s/-]?)?(?:27001|27017|27018|27701|9001)\\b',
        '\\bPCI[\\s-]?DSS\\b',
        '\\bFedRAMP\\b',
        '\\bPrivacy\\s+Shield\\b',
        '\\bCSA\\s+STAR\\b',
        '\\bTrustArc\\b',
      ].join('|'),
      'gi',
    ),
    canta: ['SOC 2 Type II', 'SOC2', 'ISO 27001', 'ISO/IEC 27001', 'PCI-DSS Level 1', 'PCI DSS', 'FedRAMP'],
    calla: ['ISO 8601', 'social 2 veces', 'Fecha ISO', 'PCI', 'Soc.'],
  },
  {
    id: 'R4',
    que: 'dice que está certificado o fue auditado',
    patron: new RegExp(
      [
        `${ANTES}(?:somos|es|está|están|estamos|é|são|is|are|we\\s+are|we\\u2019re|we're)\\s+(?:100\\s?%\\s+)?(?:certificad[oa]s?|certified|auditad[oa]s?|audited|homologad[oa]s?)\\b`,
        '\\bcertificad[oa]s?\\s+(?:por|pela|pelo|ISO|SOC|según|segun)\\b',
        '\\bcertified\\s+(?:by|under|to|in|ISO|SOC|secure)\\b',
        '\\b(?:auditad[oa]s?|audited)\\s+(?:por|by|pela|pelo|externamente|independent\\w*)\\b',
        '\\bindependent(?:ly)?\\s+audit\\w*',
        '\\bauditor[ií]a\\s+(?:externa|independiente|de\\s+seguridad)\\b',
        '\\bauditoria\\s+(?:externa|independente|de\\s+seguran[cç]a)\\b',
        '\\b(?:security|third-party|external)\\s+audit(?:s|ed)?\\b',
        '\\b(?:security|privacy|ISO|SOC)\\s+certifications?\\b',
        '\\bcertificaci(?:ón|ones|on)\\s+(?:de\\s+)?(?:seguridad|ISO|SOC|PCI)\\b',
        '\\bcertifica(?:ção|ções|cao)\\s+(?:de\\s+)?(?:segurança|seguranca|ISO|SOC|PCI)\\b',
        '\\btechnical\\s+certifications?\\b',
        '\\bcertificaciones\\s+t[eé]cnicas\\b',
      ].join('|'),
      'gi',
    ),
    canta: [
      'Zymplo es 100% certificado',
      'We are certified',
      'O Zymplo é certificado',
      'certificado por ISO',
      'audited by a third party',
      'auditado por terceros',
      'a security audit every year',
      'Technical certifications',
      'Certificaciones técnicas',
    ],
    calla: [
      'Lista en el chat · sin certificado',
      'Nota pronta no chat em segundos. Sem certificado.',
      'Necesitas un certificado digital para emitir la nota',
      'Role-restricted data access · audit logs.',
      'Acesso a dados restrito por função · logs de auditoria.',
      'Acceso a datos restringido por rol · audit logs.',
    ],
  },
  {
    id: 'R5',
    que: 'promete seguridad «de grado bancario» o «militar»',
    patron: new RegExp(
      [
        '\\bbank[\\s-]?(?:level|grade)\\b',
        '\\bbanking[\\s-]?(?:level|grade)\\b',
        '\\bmilitary[\\s-]?grade\\b',
        '\\bgrado\\s+(?:bancario|militar)\\b',
        '\\bnivel\\s+(?:bancario|militar)\\b',
        '\\bn[ií]vel\\s+(?:banc[aá]rio|militar)\\b',
        '\\bgrau\\s+(?:banc[aá]rio|militar)\\b',
        '\\bseguridad\\s+bancaria\\b',
        '\\bseguran[cç]a\\s+banc[aá]ria\\b',
      ].join('|'),
      'gi',
    ),
    canta: ['bank-grade encryption', 'banking level security', 'military grade', 'encriptación de grado bancario', 'segurança de nível bancário', 'grado militar'],
    calla: ['Cargá una cuenta bancaria con saldo', 'Pluggy: Bank account integration (BR Open Banking)', 'Conecta tu banco', 'Meu banco'],
  },
  {
    id: 'R6',
    que: 'promete seguridad absoluta («100 % seguro», «inhackeable»)',
    patron: new RegExp(
      [
        '100\\s?%\\s*(?:safe|secure|seguro|segura|seguros|protegid[oa]s?|protected)\\b',
        '\\b(?:completely|totally|totalmente)\\s+(?:safe|secure|seguro|segura)\\b',
        '\\bunhackable\\b',
        '\\binhackeable\\b',
        '\\bhack[\\s-]?proof\\b',
        '\\bprova\\s+de\\s+hackers?\\b',
      ].join('|'),
      'gi',
    ),
    canta: ['100% safe & free', '100% safe · CCPA compliant', '100% seguro y compliant', '100 % seguro', 'unhackable', 'totalmente seguro', 'à prova de hackers'],
    calla: ['100% free', '100% gratis', '100% grátis', '¿Es seguro? ¿Mis datos están protegidos?', 'Is it secure? Is my data protected?', 'Seguro de vida'],
  },
  {
    id: 'R7',
    que: 'promete cifrado «punta a punta» o «en reposo» / AES-256 que no se midió',
    patron: new RegExp(
      [
        `\\b(?:end[\\s-]to[\\s-]end|punta\\s+a\\s+punta|ponta\\s+a\\s+ponta|extremo\\s+a\\s+extremo)\\s+${CIFRADO}`,
        `${CIFRADO}\\s+(?:de\\s+|en\\s+|em\\s+)?(?:end[\\s-]to[\\s-]end|punta\\s+a\\s+punta|ponta\\s+a\\s+ponta|extremo\\s+a\\s+extremo)`,
        '\\bAES[\\s-]?(?:128|256)\\b',
        `${CIFRADO}[^.\\n]{0,40}?(?:at[\\s-]rest|en\\s+reposo|em\\s+repouso)`,
        `(?:at[\\s-]rest|en\\s+reposo|em\\s+repouso)[^.\\n]{0,20}?${CIFRADO}`,
      ].join('|'),
      'gi',
    ),
    canta: ['encriptación punta a punta', 'end-to-end encryption', 'criptografia ponta a ponta', 'AES-256 at rest', 'data encrypted at rest'],
    calla: [
      'Cifrado en tránsito (HTTPS) y ningún cliente ve los datos de otro.',
      'Encrypted in transit (HTTPS), and no client sees another client’s data.',
      'Criptografia em trânsito (HTTPS) e nenhum cliente vê dados de outro.',
      '≤30 seconds wall-clock end-to-end',
      'Implementar Onboarding5Steps end-to-end (5 pasos · 90s · confeti)',
    ],
  },
  {
    id: 'R8',
    que: 'pone una ley como sello suelto al final de una frase («…el producto. GDPR.»)',
    // Sólo tras punto de frase: «Seguridad · LGPD» (rótulo) y «(LGPD · GDPR)» (derechos) no son sellos.
    patron: new RegExp(`(?<=[.!?]\\s)${LEY}\\.?(?=\\s*(?:["'\`<]|$))`, 'gi'),
    canta: ['también medimos uso para mejorar el producto. GDPR.', 'Hecho en Brasil. LGPD', 'Sua conta é sua. LGPD.'],
    calla: [
      'Perfil → Seguridad · LGPD</strong>.',
      'Respondemos en 15 días hábiles máximo (LGPD · GDPR).',
      'Tus derechos (LGPD · GDPR · CCPA)',
      'Exercise your rights under the GDPR. We respond within 15 days.',
      '"legal_lgpd": "LGPD/GDPR"',
    ],
  },
];

const fallas: string[] = [];

function morir(motivo: string): never {
  console.error(`MEDICION-INVALIDA · ${motivo}`);
  console.error('  (no pude medir · esto NO quiere decir que esté bien)');
  process.exit(2);
}

/** Una regla con `g` guarda posición entre llamadas: se reinicia antes de cada prueba. */
function canta(regla: Regla, texto: string): boolean {
  regla.patron.lastIndex = 0;
  const si = regla.patron.test(texto);
  regla.patron.lastIndex = 0;
  return si;
}

const CODIGO = /\.(astro|ts|tsx|js|jsx|mjs)$/i;

/**
 * Tapa con espacios los comentarios de código de línea completa (no viajan al
 * navegador). Conserva el largo y los saltos de línea: el `archivo:línea` del
 * rojo sigue siendo el real.
 */
function sinComentariosDeCodigo(texto: string): string {
  const tapar = (m: string): string => m.replace(/[^\n]/g, ' ');
  return texto.replace(/^[ \t]*\/\*[\s\S]*?\*\//gm, tapar).replace(/^[ \t]*\/\/[^\n]*/gm, tapar);
}

// ── El interruptor, antes que nada ──────────────────────────────────────────
if (process.env.SALTAR_CANDADO_CERTIFICACIONES === 'si-y-me-hago-cargo') {
  console.warn('⚠️  CANDADO DE CERTIFICACIONES SALTEADO A MANO · SALTAR_CANDADO_CERTIFICACIONES');
  console.warn('   Nadie está mirando si la web afirma cumplimientos que no tiene.');
  process.exit(0);
}

// ── Control de los detectores · si una regla está ciega o histérica, no se mide ──
for (const r of REGLAS) {
  for (const frase of r.canta) {
    if (!canta(r, frase)) morir(`${r.id} (${r.que}) NO canta con «${frase}» · el detector está ciego`);
  }
  for (const frase of r.calla) {
    if (canta(r, frase)) morir(`${r.id} (${r.que}) canta con «${frase}» · daría rojos falsos`);
  }
}
// El tapador de comentarios también se prueba: tiene que tapar lo que no viaja y NO tapar lo que sí.
{
  const r1 = REGLAS[0];
  const tapado = sinComentariosDeCodigo("  // 100% safe · CCPA compliant\n/* LGPD-compliant\n   otra */\nconst a = 1;");
  if (canta(r1, tapado)) morir('el tapador de comentarios deja pasar un comentario de línea completa');
  if (tapado.split('\n').length !== 4) morir('el tapador de comentarios cambió la cantidad de líneas');
  if (!canta(r1, sinComentariosDeCodigo("text: '100% safe · CCPA compliant', // nota"))) {
    morir('el tapador de comentarios se come texto que SÍ viaja (un comentario al final de una línea de código)');
  }
  if (!canta(r1, sinComentariosDeCodigo('<!-- 100% DGT compliant -->'))) {
    morir('el tapador de comentarios se come un comentario HTML, que SÍ viaja a la página');
  }
}

/** Todos los archivos de texto bajo las carpetas vigiladas. */
function archivos(dir: string, acc: string[] = []): string[] {
  let entradas: string[];
  try {
    entradas = readdirSync(dir);
  } catch {
    return acc; // carpeta que no existe: lo detecta el conteo de más abajo
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

const todos = CARPETAS.flatMap((c) => archivos(join(RAIZ, c))).map((p) => ({ abs: p, rel: relative(RAIZ, p) }));
if (todos.length === 0) morir(`no encontré ni un archivo que mirar en ${CARPETAS.join('/, ')}/ · ¿mal directorio?`);

const locales = todos.filter((f) => /^src\/i18n\/[a-z]{2}-[a-z]{2}\.json$/.test(f.rel)).length;
if (locales === 0) morir('no encontré ni un JSON de textos en src/i18n/ · el candado no está mirando las home');

const esLegal = (rel: string): boolean => DOCUMENTOS_LEGALES.some((re) => re.test(rel));
const mirados = todos.filter((f) => CON_LEGALES || !esLegal(f.rel));
const omitidos = todos.length - mirados.length;

for (const { abs, rel } of mirados) {
  let texto: string;
  try {
    texto = readFileSync(abs, 'utf8');
  } catch (e) {
    morir(`no pude leer ${rel} · ${(e as Error).message}`);
  }
  if (CODIGO.test(rel)) texto = sinComentariosDeCodigo(texto);
  for (const r of REGLAS) {
    r.patron.lastIndex = 0;
    for (const m of texto.matchAll(r.patron)) {
      const i = m.index ?? 0;
      const linea = texto.slice(0, i).split('\n').length;
      const contexto = texto
        .slice(Math.max(0, i - 28), i + m[0].length + 28)
        .replace(/\s+/g, ' ')
        .trim();
      fallas.push(`${r.id} · ${rel}:${linea} · ${r.que} · «${contexto}»`);
    }
  }
}

const resumen =
  `${mirados.length} archivos mirados (${locales} locales de textos)` +
  ` · ${REGLAS.length} reglas con sus casos que cantan y que callan` +
  (omitidos > 0 ? ` · ${omitidos} archivos de documentos legales fuera (usar --con-legales)` : ' · documentos legales incluidos');

// ── Veredicto ───────────────────────────────────────────────────────────────
if (fallas.length > 0) {
  console.error('ROJO · la web afirma un cumplimiento o una certificación que no tiene\n');
  for (const f of fallas) console.error(`  ✗ ${f}`);
  console.error(`\n  ${fallas.length} hallazgos · ${resumen}`);
  console.error('\n  Qué se puede decir en cambio: «Tus datos son tuyos: podés pedir verlos o borrarlos cuando quieras».');
  console.error('  Si la certificación SÍ existe, se agrega la prueba al repo y se cambia la regla a propósito, no se esquiva.');
  process.exit(1);
}

console.log(`VERDE · la web no afirma cumplimientos ni certificaciones · ${resumen}`);
process.exit(0);
