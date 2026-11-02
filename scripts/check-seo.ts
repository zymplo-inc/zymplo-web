/**
 * Candado SEO post-build · corre en cada `npm run build` (local y CF Pages).
 *
 * Nació del aviso de GSC 2026-08-07: 70 páginas se auto-excluían con la
 * canónica apuntando al home, el apex declaraba 8 hreflang cuando eran 14 y el
 * sitemap mezclaba dominios de otra propiedad. Vigila la FORMA, no los casos:
 * se pone rojo si CUALQUIER página del dist vuelve a cualquiera de las tres.
 *
 *   1 · canónica de cada página == su propia URL pública (vía country-proxy)
 *   2 · todo set de hreflang == los 14 locales (± x-default) — ni uno menos
 *   3 · sitemap sólo con hosts de la propiedad sc-domain:zymplo.com
 *   4 · cero cifras fabricadas (R63) en el HTML
 *   5 · FUEGO 5 (2026-08-18) · ningún link legal de cara al usuario (footer,
 *       header, breadcrumbs, cross-link dentro del documento, canonical,
 *       hreflang o cualquier tag con href) queda con la ruta fija del apex ES
 *       (`/legal/{doc}/`) dentro de una página de país o de idioma — ver el
 *       bloque "FUEGO 5" más abajo para la forma exacta del defecto y por qué.
 *   6 · DOCUMENTOS LEGALES Y HOME (2026-11-02) · ninguna página legal (política
 *       de privacidad, términos, borrado de datos, eliminar cuenta, compliance)
 *       ni la home afirma lo que el repo no puede probar: contratos firmados con
 *       proveedores (DPA, NDA, SCC, «Data Processing Agreement», «contrato de
 *       tratamento … assinado») y «backups 30 días». Los documentos legales
 *       (no la home, que es copy de marketing con su propia revisión) tampoco
 *       afirman certificaciones (ISO 27001, SOC 2, PCI-DSS), cifrados con número
 *       (TLS 1.3, AES-256), «sin entrenamiento» atribuido a proveedores,
 *       «retención cero», «GDPR · CCPA compliance» ni un borrado «en menos de 24
 *       horas»; y los que hablan de datos, ningún plazo automático (90 días,
 *       7 años, 12 meses, «desde la última actividad»). La política decía
 *       «DPA firmados» y «todos cumplen SCC» y en el repo no consta ni un acuse
 *       (paquete legal 2-nov, hallazgo H1). Vigila la PROPIEDAD, no una frase:
 *       sin distinguir mayúsculas, en el texto visible y en las meta.
 *       Y EXIGE PRESENCIA (regla 47: un 0 se publica con su denominador): cada
 *       política de privacidad tiene que traer sus 13 secciones, la línea de su
 *       responsable (LTDA en br, S.A. en py, Inc. en el resto) y los proveedores
 *       de IA en la sección 5; si el cuerpo está vacío o falta una página que
 *       importa, el candado no midió y se pone rojo.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { COUNTRY_SLUGS, LEGAL_COUNTRY_SLUGS, getCountry } from '../src/data/countries';
import { NUMEROS_PROHIBIDOS } from '../src/data/numerosProhibidos';

const DIST = join(process.cwd(), 'dist');
const LOCALES = new Set(COUNTRY_SLUGS.map((s) => getCountry(s)!.locale));
const SLUGS = new Set<string>(COUNTRY_SLUGS);
const FORBIDDEN = ['12.847', '12,847']; // social-proof fabricado, purgado por R63 2026-06-09

// Números de WhatsApp PROHIBIDOS de publicar (Carlos 2026-07-22 · ratificado
// 2026-08-07): la regla es SOLO DOS — US 12027718788 global · BR 5511925697328.
//
// 🔴 2026-08-26 · La lista se mudó a `src/data/numerosProhibidos.ts` y ya NO se
// escribe acá. Este script valida el `dist` —el artefacto de ESTE repo— y una
// tester encontró 7 apariciones sirviéndose en `zymplo.com.br`, que es una
// publicación aparte. El candado nuevo (`check-dominios-vivos`) mira los
// dominios; los dos leen la MISMA lista, porque copiarla era el defecto de
// fondo. Ver el encabezado de ese archivo.
const FORBIDDEN_NUMBERS = NUMEROS_PROHIBIDOS;

// Los legales del apex vienen en trío de idiomas (/legal/ es · /en/legal/ en ·
// /pt/legal/ pt-BR) — un set de hreflang distinto al de países, y válido.
const LEGAL_TRIO = new Set(['es', 'en', 'pt-BR']);

// Páginas ALIAS: su canónica DEBE apuntar al destino, no a sí mismas.
const ALIASES: Record<string, string> = {
  'privacy/': 'https://zymplo.com/legal/privacy/',
  'terms/': 'https://zymplo.com/legal/terms/',
  'privacy/delete/': 'https://zymplo.com/legal/delete-account/',
  'legal/delete-request/': 'https://zymplo.com/legal/delete-account/',
};

// /en/legal/ y /pt/legal/ son secciones del APEX (idioma, no país): el prefijo
// pt/ colisiona con el slug de Portugal pero estas páginas viven en zymplo.com.
const APEX_LANG_PREFIXES = ['en/legal/', 'pt/legal/'];

// Deuda declarada (GSC 2026-08-07): experimentos sin canónica ni noindex.
const NO_CANONICAL_OK = new Set(['social/', 'social/c/', 'social/c-radical/']);

// Espejo del worker `zymplo-country-proxy` (leído del script vivo vía CF API
// 2026-08-07): estas rutas se sirven desde la RAÍZ del build en CUALQUIER
// subdominio de país, así que un link a ellas nunca se resuelve contra /{cc}/.
const SHARED_PREFIXES = ['/brand/', '/.well-known/', '/_astro/', '/emoji/', '/social/', '/videos/', '/legal/', '/pt/legal/', '/en/legal/', '/app/', '/lab/', '/icons/', '/fonts/', '/images/', '/preview/'];
const SHARED_FILES = new Set(['/favicon.ico', '/favicon.svg', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/404.html', '/llms.txt', '/pricing.md', '/AGENTS.md', '/isotipo.svg', '/apple-touch-icon.png', '/og.png', '/og-image.png', '/logo-zymplo.svg']);

const errors: string[] = [];
let pages = 0;
let withHreflang = 0;
// ── Candado 6 · lo que un documento legal (o la home) no puede afirmar sin respaldo en el repo ──
// Se compara SIN distinguir mayúsculas (el falso verde de 2-nov: «dpa firmado», «sccs») y sobre el texto
// visible más las meta. Palabra completa: «DPA», «NDA», «SCC» no coinciden con «standard», «Fernanda», «ANDAMENTO».
const NOMBRE_DE_COPIA_DE_SEGURIDAD = 'backups?|copias?\\s+de\\s+seguridad|c[oó]pias?\\s+de\\s+seguran[cç]a|respaldos?';
const TREINTA_DIAS = '30\\s*(?:dias|días|days)';
const SIN_RESPALDO: { re: RegExp; que: string }[] = [
  { re: /\bDPAs?\b/i, que: 'DPA' },
  { re: /\bNDAs?\b/i, que: 'NDA' },
  { re: /\bSCCs?\b/i, que: 'SCC' },
  { re: /data\s+processing\s+agreements?/i, que: 'Data Processing Agreement' },
  { re: /(?:acordos?|acuerdos?)\s+de\s+(?:processamento|procesamiento|tratamento|tratamiento)\s+de\s+(?:dados|datos)/i, que: 'acuerdo de tratamiento de datos' },
  { re: /contratos?\s+de\s+tratam(?:i)?ento[^.]{0,120}?\b(?:assinad|firmad)[oa]s?\b/i, que: 'contrato de tratamiento firmado' },
  { re: /\b(?:assinad|firmad)[oa]s?\b[^.]{0,60}contratos?\s+de\s+tratam(?:i)?ento/i, que: 'contrato de tratamiento firmado' },
  { re: /\b(?:signed|executed)\b[^.]{0,60}\b(?:agreements?|contracts?|clauses?)\b/i, que: 'signed agreement' },
  { re: /\b(?:agreements?|contracts?)\b[^.]{0,40}\b(?:signed|executed)\b/i, que: 'agreement signed' },
  { re: new RegExp(`\\b(?:${NOMBRE_DE_COPIA_DE_SEGURIDAD})\\b[^.]{0,100}?\\b${TREINTA_DIAS}\\b`, 'i'), que: 'backups con 30 días' },
  { re: new RegExp(`\\b${TREINTA_DIAS}\\b[^.]{0,100}?\\b(?:${NOMBRE_DE_COPIA_DE_SEGURIDAD})\\b`, 'i'), que: '30 días de backups' },
];
// Además, SÓLO en los documentos legales (no en la home, que es copy de marketing con su propia revisión).
const SIN_RESPALDO_EN_LEGALES: { re: RegExp; que: string }[] = [
  { re: /\b(?:no|sem|sin|zero)\s+(?:training|treinamento|entrenamiento)\b/i, que: '«sin entrenamiento» atribuido a proveedores' },
  { re: /\bzero[\s-]+(?:data[\s-]+)?retention\b|\bretenç[aã]o\s+zero\b|\bretenci[oó]n\s+cero\b/i, que: 'retención cero' },
  { re: /\bISO\s*\/?\s*(?:IEC\s*)?2700[01]\b|\bISO\s*27018\b|\bSOC\s*[-]?\s*2\b|\bPCI[\s-]?DSS\b/i, que: 'certificación (ISO/SOC/PCI)' },
  { re: /\bTLS\s*1\.[23]\b|\bAES[\s-]?256\b/i, que: 'cifrado con número (TLS/AES)' },
  { re: /\b(?:gdpr|ccpa|lgpd)\b(?:[\s·,/&-]+(?:gdpr|ccpa|lgpd))*[\s·,-]+(?:compliance|compliant)\b|\b(?:gdpr|ccpa)[\s-]+ready\b/i, que: '«GDPR · CCPA compliance»' },
  { re: /(?:delet|borr|elimin|exclu|exclus)[^.]{0,120}?\b(?:menos\s+de\s+24|24\s*(?:horas|hours)|within\s+24)\b/i, que: 'borrado «en menos de 24 horas»' },
];
// Plazos de retención que ningún código ejecuta: sólo en los documentos que hablan de datos.
const SIN_RESPALDO_DE_DATOS: { re: RegExp; que: string }[] = [
  { re: /\b90\s*(?:dias|días|days)\b/i, que: 'plazo automático de 90 días' },
  { re: /\b7\s*(?:anos|años|years)\b/i, que: 'plazo automático de 7 años' },
  { re: /\b12\s*(?:meses|months)\b/i, que: 'plazo automático de 12 meses' },
  { re: /últim[ao]\s+(?:atividade|actividad)|last\s+activity/i, que: '«desde la última actividad»' },
];
const DOCUMENTOS_LEGALES = ['privacy', 'terms', 'data-deletion', 'delete-account', 'compliance'];
const DOCUMENTOS_DE_DATOS = new Set(['privacy', 'data-deletion', 'delete-account', 'compliance']);
// Dónde tiene que existir cada documento: las 13 páginas de país con idioma propio + las 3 del apex (es · pt · en).
const LUGARES_LEGALES = [...LEGAL_COUNTRY_SLUGS.map((s) => `${s}/legal`), 'legal', 'pt/legal', 'en/legal'];
const HOMES_REQUERIDAS = ['index.html', ...COUNTRY_SLUGS.map((s) => `${s}/index.html`)];
// La línea de responsable de cada política (sección 1): la entidad y su número, en el MISMO renglón.
const RESPONSABLE: Record<'br' | 'py' | 'otro', { nombre: string; re: RegExp }> = {
  br: { nombre: 'Zymplo Brasil LTDA', re: /Zymplo\s+Brasil\s+LTDA[\s·]*CNPJ\s+66\.667\.634\/0001-00/ },
  py: { nombre: 'Zymplo S.A.', re: /Zymplo\s+S\.A\.[\s·]*RUC\s+80170149-0/ },
  otro: { nombre: 'Zymplo Inc.', re: /Zymplo\s+Inc\.[\s\S]{0,40}EIN\s+30-1486305/ },
};
const PROVEEDORES_EN_LA_SECCION_5 = ['Meta', 'Anthropic', 'Groq', 'Deepgram', 'OpenAI'];
const SECCIONES_DE_LA_POLITICA = 13;
const textoVisible = (html: string): string => {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((t) => /(?:name|property)="(?:og:|twitter:)?(?:description|title)"/i.test(t))
    .map((t) => t.match(/\bcontent="([^"]*)"/i)?.[1] ?? '');
  const cuerpo = html
    .replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return [cuerpo, ...metas].join(' ');
};
const seccion = (html: string, n: number): string | undefined =>
  html.match(new RegExp(`<h2[^>]*>\\s*${n}\\.[^<]*</h2>([\\s\\S]*?)(?=<h2[^>]*>\\s*${n + 1}\\.|<footer|$)`))?.[1];
const politicasVistas = new Set<string>();
const legalesVistos = new Set<string>();
const homesVistas = new Set<string>();
let paginasVigiladas = 0;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return name === 'index.html' ? [p] : [];
  });

const walkAll = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walkAll(p) : [p];
  });

if (!existsSync(DIST)) {
  console.error('check-seo: no existe dist/ — correr `astro build` antes.');
  process.exit(1);
}

const distFiles = new Set(walkAll(DIST).map((p) => relative(DIST, p)));
const brokenLinks: string[] = [];

for (const file of walk(DIST)) {
  const rel = relative(DIST, file); // ej: py/precios/index.html
  const html = readFileSync(file, 'utf8');
  pages++;

  const dirPath = rel === 'index.html' ? '' : rel.slice(0, -'/index.html'.length) + '/';
  const [first, ...restParts] = dirPath.split('/');
  // FUEGO 5: ¿es esta página uno de los 12 documentos standalone del
  // apex-idioma (en/legal/{doc}/, pt/legal/{doc}/)? `ownLegalDoc` es el doc
  // propio de la página cuando aplica (usado más abajo).
  const parts0En = first === 'en' && restParts[0] === 'legal';
  const parts0Pt = first === 'pt' && restParts[0] === 'legal';
  const ownLegalDoc = (parts0En || parts0Pt) ? restParts[1] : '';
  const expected =
    ALIASES[dirPath] ??
    (SLUGS.has(first) && !APEX_LANG_PREFIXES.some((p) => dirPath.startsWith(p))
      ? `https://${first}.zymplo.com/${restParts.join('/')}`
      : `https://zymplo.com/${dirPath}`);

  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1];
  if (!canonical) {
    // Una página noindex no necesita canónica: Google no la va a indexar.
    if (!noindex && !NO_CANONICAL_OK.has(dirPath)) errors.push(`${rel}: SIN canónica`);
  } else if (canonical !== expected) errors.push(`${rel}: canónica ${canonical} ≠ ${expected}`);

  const hreflangs = [...html.matchAll(/<link[^>]*hreflang="([^"]*)"/gi)].map((m) => m[1]);
  if (hreflangs.length > 0) {
    withHreflang++;
    const set = new Set(hreflangs.filter((h) => h !== 'x-default'));
    const isTrio = set.size === LEGAL_TRIO.size && [...set].every((l) => LEGAL_TRIO.has(l));
    const missing = [...LOCALES].filter((l) => !set.has(l));
    const extra = [...set].filter((l) => !LOCALES.has(l));
    if (!isTrio && (missing.length || extra.length))
      errors.push(`${rel}: hreflang faltan [${missing}] sobran [${extra}]`);
  }

  for (const bad of FORBIDDEN)
    if (html.includes(bad)) errors.push(`${rel}: contiene la cifra fabricada "${bad}"`);
  for (const num of FORBIDDEN_NUMBERS)
    if (html.includes(num)) errors.push(`${rel}: número de WhatsApp PROHIBIDO ${num}`);

  // 6 · documentos legales y home: nada sin respaldo, y presencia exigida (ver cabecera).
  const tipoLegal = DOCUMENTOS_LEGALES.find((d) => new RegExp(`(?:^|/)legal/${d}/index\\.html$`).test(rel));
  const esHome = HOMES_REQUERIDAS.includes(rel);
  if (tipoLegal || esHome) {
    paginasVigiladas++;
    if (tipoLegal) legalesVistos.add(rel);
    if (esHome) homesVistas.add(rel);
    const texto = textoVisible(html);
    const reglas = !tipoLegal
      ? SIN_RESPALDO
      : DOCUMENTOS_DE_DATOS.has(tipoLegal)
        ? [...SIN_RESPALDO, ...SIN_RESPALDO_EN_LEGALES, ...SIN_RESPALDO_DE_DATOS]
        : [...SIN_RESPALDO, ...SIN_RESPALDO_EN_LEGALES];
    const dichas = new Set<string>();
    for (const { re, que } of reglas) {
      const hallado = texto.match(re);
      if (hallado && !dichas.has(que)) {
        dichas.add(que);
        errors.push(`${rel}: afirma algo sin respaldo en el repo (${que}) → "${hallado[0].replace(/\s+/g, ' ').slice(0, 80)}"`);
      }
    }
    if (tipoLegal === 'privacy') {
      politicasVistas.add(rel);
      // País de la política (el apex es/pt/en no tiene país: responsable = «el resto»).
      const pais = SLUGS.has(first) && !APEX_LANG_PREFIXES.some((p) => dirPath.startsWith(p)) ? first : '';
      const resp = RESPONSABLE[pais === 'br' ? 'br' : pais === 'py' ? 'py' : 'otro'];
      const faltan = [...Array(SECCIONES_DE_LA_POLITICA).keys()].map((i) => i + 1).filter((n) => seccion(html, n) === undefined);
      if (faltan.length) errors.push(`${rel}: la política no trae sus ${SECCIONES_DE_LA_POLITICA} secciones (faltan ${faltan.join(',')}) — cuerpo vacío o recortado`);
      const sec1 = seccion(html, 1);
      if (sec1 !== undefined && !resp.re.test(textoVisible(sec1)))
        errors.push(`${rel}: la sección 1 no trae la línea del responsable (${resp.nombre}) con su número`);
      const sec5 = seccion(html, 5);
      if (sec5 !== undefined) {
        const t5 = textoVisible(sec5);
        const sinNombrar = PROVEEDORES_EN_LA_SECCION_5.filter((p) => !t5.includes(p));
        if (sinNombrar.length) errors.push(`${rel}: la sección 5 (proveedores) no nombra a ${sinNombrar.join(', ')}`);
      }
    }
  }

  // Links internos rotos: el footer viejo linkeaba 9 rutas que nunca existieron
  // (/about/, /blog/, /careers/…) y Google acumuló 49 URLs en 404 (GSC 7-ago).
  // Cada página del dist de un país se sirve en {slug}.zymplo.com/<resto>, así
  // que un href interno se resuelve contra el directorio del país de la página.
  const countryBase = SLUGS.has(first) && !APEX_LANG_PREFIXES.some((p) => dirPath.startsWith(p)) ? first : '';
  if (!noindex)
    for (const m of html.matchAll(/href="(\/[^"/][^"]*|\/)"/g)) {
      const path = m[1].split('#')[0].split('?')[0];
      if (!path || path.startsWith('/cdn-cgi/')) continue;
      const fromRoot = SHARED_FILES.has(path) || SHARED_PREFIXES.some((p) => path.startsWith(p));
      // FUEGO 5 (2026-08-18): un href puede venir YA con su propio prefijo de
      // país (p.ej. /{slug}/legal/{doc}/ — a propósito, porque el
      // country-proxy NO resuelve /legal/ por subdominio, medido 2026-08-18
      // 15:52 -03). Sin esto, el resolver de abajo lo duplicaba
      // (`${countryBase}${path}` = /ar/ar/legal/terms/) y marcaba roto un
      // link que en realidad apunta bien.
      const selfPrefixed = countryBase !== '' && (path === `/${countryBase}` || path.startsWith(`/${countryBase}/`));
      const resolved = (countryBase && !fromRoot && !selfPrefixed ? `${countryBase}${path}` : path.slice(1)).replace(/\/+$/, '');
      if (resolved === '' || resolved === countryBase) continue; // home siempre existe
      if (!distFiles.has(resolved) && !distFiles.has(`${resolved}/index.html`))
        brokenLinks.push(`${rel}: link roto → ${m[1]}`);
    }

  // FUEGO 5 (2026-08-18) · candado país/idioma en links legales.
  //
  // Forma del defecto: un link interno a un documento legal hermano (privacy,
  // terms, cookies, compliance, delete-account, data-deletion) construido con
  // la ruta fija del apex ES (`/legal/{doc}/`), servido dentro de una página
  // que vive bajo su propio prefijo de país (`/{cc}/...`) o de idioma
  // (`/en/legal/`, `/pt/legal/`). Medido en producción 2026-08-18 15:52 -03
  // con control 404: ese link bare SIEMPRE resuelve al documento en español,
  // sin importar el país/idioma real de quien lo lee —
  // br.zymplo.com/legal/privacy/ → <html lang="es">, br.zymplo.com/br/legal/
  // privacy/ → <html lang="pt-BR">. El switcher de idioma legítimo usa
  // SIEMPRE una URL absoluta con host (https://zymplo.com/...), nunca bare —
  // así que cualquier href bare "/legal/{doc}/" que sobreviva en el dist de
  // una página de país es, por construcción, el bug. El regex no distingue
  // tag: caza <a>, <link> canonical/hreflang o cualquier otro con href.
  for (const m of html.matchAll(/href="\/legal\/(privacy|terms|cookies|compliance|delete-account|data-deletion)\/"/g)) {
    const linkedDoc = m[1];
    if (parts0En || parts0Pt) {
      // Único caso legítimo: las 10 páginas standalone del apex-idioma
      // (en/legal/*, pt/legal/*, excepto data-deletion) tienen su PROPIO
      // switcher bare hacia Español — pero SÓLO hacia el MISMO documento.
      // Cualquier OTRO documento bare es el hermano encontrado en
      // src/components/Legal/*/{Pt,En}.astro (p.ej. "Termos de serviço"
      // apuntando a /legal/terms/ = español, dentro de la página PT).
      if (linkedDoc === ownLegalDoc) continue;
      errors.push(`${rel}: link a OTRO documento legal en español (bare) → href="/legal/${linkedDoc}/" — el switcher propio de esta página sólo puede ser bare hacia "${ownLegalDoc}"`);
    } else if (SLUGS.has(first)) {
      errors.push(`${rel}: link legal SIN prefijo de país (falta /${first}/) → href="/legal/${linkedDoc}/"`);
    }
  }
}

// Los números prohibidos también viajan en los bundles de las islands (props
// serializadas del cliente) — el barrido cubre TODO el dist, no sólo los HTML.
for (const f of distFiles)
  if (/\.(js|mjs|json|xml|txt|webmanifest|css)$/.test(f)) {
    const c = readFileSync(join(DIST, f), 'utf8');
    for (const num of FORBIDDEN_NUMBERS)
      if (c.includes(num)) errors.push(`${f}: número de WhatsApp PROHIBIDO ${num}`);
  }

const sitemapPath = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  errors.push('dist/sitemap.xml: NO EXISTE');
} else {
  const sm = readFileSync(sitemapPath, 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const host = new URL(loc).hostname;
    if (host !== 'zymplo.com' && !host.endsWith('.zymplo.com'))
      errors.push(`sitemap.xml: host fuera de la propiedad → ${loc}`);
  }
  for (const s of COUNTRY_SLUGS)
    if (!locs.includes(`https://${s}.zymplo.com/`))
      errors.push(`sitemap.xml: falta el home de ${s}.zymplo.com`);
  if (!locs.includes('https://zymplo.com/')) errors.push('sitemap.xml: falta el apex');
}

errors.push(...brokenLinks);

// Un 0 se publica con su denominador (regla 47): si el candado 6 no vio las páginas que importan, no midió, no aprueba.
// Las que importan: los 5 documentos legales en las 13 páginas de país y en las 3 del apex (es · pt · en), y las 15 homes.
const LEGALES_REQUERIDOS = DOCUMENTOS_LEGALES.flatMap((d) => LUGARES_LEGALES.map((l) => `${l}/${d}/index.html`));
for (const requerida of LEGALES_REQUERIDOS)
  if (!legalesVistos.has(requerida)) errors.push(`candado 6: no vio ${requerida} (no midió esa página)`);
for (const requerida of HOMES_REQUERIDAS)
  if (!homesVistas.has(requerida)) errors.push(`candado 6: no vio la home ${requerida} (no midió esa página)`);
const POLITICAS_REQUERIDAS = LUGARES_LEGALES.map((l) => `${l}/privacy/index.html`);
const politicasMedidas = POLITICAS_REQUERIDAS.filter((p) => politicasVistas.has(p)).length;

if (errors.length) {
  console.error(`\n🔴 check-seo: ${errors.length} problema(s) en ${pages} páginas:\n`);
  const TOPE = process.env.CHECK_SEO_TODO ? errors.length : 40; // CHECK_SEO_TODO=1 imprime todos
  for (const e of errors.slice(0, TOPE)) console.error('  · ' + e);
  if (errors.length > TOPE) console.error(`  … y ${errors.length - TOPE} más`);
  process.exit(1);
}
console.log(
  `✅ check-seo: ${pages} páginas · canónicas propias OK · ${withHreflang} con hreflang completo (${LOCALES.size} locales) · sitemap OK · 0 links internos rotos · sin cifras fabricadas ni números prohibidos · candado 6: ${paginasVigiladas} páginas legales y homes sin afirmaciones sin respaldo (${LEGALES_REQUERIDOS.length} legales + ${HOMES_REQUERIDAS.length} homes exigidas) · ${politicasMedidas}/${POLITICAS_REQUERIDAS.length} políticas con sus 13 secciones, su responsable y sus proveedores`
);
