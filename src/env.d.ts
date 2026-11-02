/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// `tsc` no lee archivos `.astro` (eso lo hace el servidor de lenguaje de Astro). Sin esta
// declaración, importar uno desde un `.ts`/`.tsx` —como hace el barril `components/index.ts`—
// da TS2307 aunque el archivo exista. El tipo es el que el propio Astro le da a un componente.
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  const Componente: AstroComponentFactory;
  export default Componente;
}
