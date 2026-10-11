import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ESLint } from 'eslint';

const cwd = new URL('fixtures/', import.meta.url).pathname;

const lint = async (file, overrideConfigFile = 'eslint.config.js') => {
  const eslint = new ESLint({ cwd, overrideConfigFile });
  const [result] = await eslint.lintFiles([file]);

  assert.deepEqual(
    result.messages.filter(message => message.fatal),
    [],
    `${file} has no parse errors and no unknown rules`
  );

  return result.messages;
};
const reports = (messages, rule) => messages.filter(message => message.ruleId === rule);

test('top-level functions are not reported as unused, variables inside functions still are', async () => {
  const messages = await lint('menu.ts');
  const unused = reports(messages, '@typescript-eslint/no-unused-vars');

  assert.equal(unused.length, 1, unused.map(message => message.message).join('; '));
  assert.match(unused[0].message, /'unused'/);
});

test('the plain Node config reports those top-level functions (control)', async () => {
  const messages = await lint('menu.ts', 'eslint.node.config.js');
  const names = reports(messages, '@typescript-eslint/no-unused-vars').map(message => message.message);

  assert.ok(
    names.some(name => name.includes("'onOpen'")),
    names.join('; ')
  );
  assert.ok(names.some(name => name.includes("'runReport'")));
});

test('modules provided by the build resolve, other missing modules do not', async () => {
  const unresolved = reports(await lint('imports.ts'), 'import-x/no-unresolved');

  assert.equal(unresolved.length, 1, unresolved.map(message => message.message).join('; '));
  assert.match(unresolved[0].message, /not-installed/);

  const control = reports(await lint('imports.ts', 'eslint.node.config.js'), 'import-x/no-unresolved');

  assert.equal(control.length, 2, 'the Node config also reports GoogleSpreadsheets');
});

test('Apps Script globals are defined in scripts, Node.js globals are not', async () => {
  const undef = reports(await lint('script.js'), 'no-undef');

  assert.deepEqual(
    undef.map(message => message.message),
    ["'process' is not defined."]
  );
});

test('the n rules are off', async () => {
  const messages = await lint('legacy.js');

  assert.deepEqual(
    messages.filter(message => message.ruleId?.startsWith('n/')),
    []
  );

  const control = await lint('legacy.js', 'eslint.node.config.js');

  assert.ok(control.some(message => message.ruleId?.startsWith('n/')), 'the Node config reports new Buffer()');
});
