import ptBR from './pt-br.json';
import esMX from './es-mx.json';
import enUS from './en-us.json';
import esCO from './es-co.json';
import esES from './es-es.json';
import esAR from './es-ar.json';
import esPY from './es-py.json';
import esPE from './es-pe.json';
import esEC from './es-ec.json';
import esCL from './es-cl.json';
import esUY from './es-uy.json';
import esBO from './es-bo.json';
import esCR from './es-cr.json';
import ptPT from './pt-pt.json';
import type { CountrySlug } from '@data/countries';

export type Dict = typeof ptBR;

const DICTS: Record<CountrySlug, Dict> = {
  br: ptBR, mx: esMX, us: enUS, co: esCO, es: esES, ar: esAR, py: esPY,
  pe: esPE, ec: esEC, cl: esCL, uy: esUY, bo: esBO, cr: esCR, pt: ptPT,
};

export const getDict = (slug: CountrySlug): Dict => DICTS[slug] ?? ptBR;
