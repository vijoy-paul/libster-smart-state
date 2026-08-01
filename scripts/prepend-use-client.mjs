#!/usr/bin/env node
// scripts/prepend-use-client.mjs
// Prepends "use client"; to all JS output files after tsup builds them.
// This is needed because esbuild strips module-level directives during bundling.

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIRECTIVE = '"use client";\n';
const files = [
  join('dist', 'index.js'),
  join('dist', 'index.cjs'),
];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  if (!content.startsWith('"use client"')) {
    writeFileSync(file, DIRECTIVE + content, 'utf8');
    console.log(`✓ Prepended "use client" to ${file}`);
  } else {
    console.log(`  Already present in ${file}`);
  }
}
