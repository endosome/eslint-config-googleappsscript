# Changelog

## 1.0.1

- The Apps Script rules also apply to sidebar and dialog HTML: their functions are not reported as unused, the `n`
  rules are off there, and the scripts are parsed as classic scripts.
- Names that start with an underscore are also ignored for caught errors (`catch (_)`) and destructured array items.

## 1.0.0

First release: `@endosome/eslint-config-node` with the Apps Script runtime globals, `vars: 'local'` for unused
variables, and no Node.js rules.
