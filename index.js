/* cspell:words googleappsscript */
import nodeConfig from '@endosome/eslint-config-node';
import { defineConfig } from 'eslint/config';
import nodeGlobals from 'globals';

import appsScriptGlobals from './globals.js';

const sourceFiles = ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'];
const scriptFiles = ['**/*.js'];
const typeScriptFiles = ['**/*.{ts,tsx,mts,cts}'];

// Apps Script does not run on Node.js: none of the n (eslint-plugin-n) rules apply
const nodeRulesOff = Object.fromEntries(
  nodeConfig
    .flatMap(config => Object.keys(config.rules ?? {}))
    .filter(rule => rule.startsWith('n/'))
    .map(rule => [rule, 'off'])
);

// the Node.js globals (process, require, setTimeout, URL, ...) do not exist in Apps Script
const nodeGlobalsOff = Object.fromEntries(Object.keys(nodeGlobals.node).map(name => [name, 'off']));

export default defineConfig([
  nodeConfig,

  {
    name: 'endosome-googleappsscript/rules',
    files: sourceFiles,
    rules: {
      ...nodeRulesOff,

      // Google calls menu handlers, triggers and web app entry points by name, so a function or a constant at the
      // top level of a file is not "unused". Variables inside functions still are. Without an import or an export
      // a TypeScript file is a script and its top level is the global scope, which `vars: 'local'` skips.
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'local', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // the build provides modules such as 'GoogleSpreadsheets' (typings in types/*.d.ts); npm package names
      // cannot contain capitals, so a bare specifier that starts with a capital is one of those
      'import-x/no-unresolved': ['error', { ignore: ['^[A-Z][A-Za-z0-9]*$'] }],

      // there are no modules in Apps Script
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },

  // Apps Script code is not an ES module, whatever "type" the package.json has (eslint-plugin-n would pick the source
  // type from it). The top level of a file is then not a module scope, which the 'vars: local' above relies on.
  {
    name: 'endosome-googleappsscript/typescript',
    files: typeScriptFiles,
    languageOptions: { sourceType: 'commonjs' },
  },

  // JavaScript files are scripts that share one global scope
  {
    name: 'endosome-googleappsscript/scripts',
    files: scriptFiles,
    languageOptions: {
      sourceType: 'script',
      globals: { ...nodeGlobalsOff, ...appsScriptGlobals },
    },
    rules: { 'no-undef': 'error' },
  },
]);
