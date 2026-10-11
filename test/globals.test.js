/* eslint-disable security/detect-non-literal-fs-filename, security/detect-object-injection -- fixed paths, names from a fixed list */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { collectGlobals, render } from '../scripts/generate-globals.js';

test('globals.js is up to date with @types/google-apps-script (run `npm run generate`)', () => {
  const current = readFileSync(new URL('../globals.js', import.meta.url), 'utf8');

  assert.equal(current, render(collectGlobals()));
});

test('the well-known services are globals', async () => {
  const { default: globals } = await import('../globals.js');

  for (const name of ['SpreadsheetApp', 'GmailApp', 'Logger', 'Utilities', 'console', 'UrlFetchApp']) {
    assert.equal(globals[name], 'readonly', name);
  }

  assert.equal(globals.Date2, undefined);
});
