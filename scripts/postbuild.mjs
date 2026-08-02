#!/usr/bin/env node
// Post-build fixes after tsup:
// 1. Prepends "use client" to JS bundles (esbuild strips module directives)
// 2. Writes TypeScript declarations for the styles subpath export

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const USE_CLIENT = '"use client";\n';
const jsFiles = [join('dist', 'index.js'), join('dist', 'index.cjs')];

for (const file of jsFiles) {
  const content = readFileSync(file, 'utf8');
  if (!content.startsWith('"use client"')) {
    writeFileSync(file, USE_CLIENT + content, 'utf8');
    console.log(`✓ Prepended "use client" to ${file}`);
  }
}

const stylesTypes = `/** Side-effect import for default SmartState styles: \`import '@libster/smart-state/styles'\` */
export {};
`;

for (const file of [join('dist', 'styles', 'index.d.ts'), join('dist', 'styles', 'index.d.cts')]) {
  writeFileSync(file, stylesTypes, 'utf8');
  console.log(`✓ Wrote ${file}`);
}
