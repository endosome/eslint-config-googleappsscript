import config from '@endosome/eslint-config-node';

export default [
  ...config,
  { ignores: ['globals.js', 'test/fixtures/**'] },
  // plain JavaScript without type annotations
  { files: ['**/*.js'], rules: { '@typescript-eslint/explicit-module-boundary-types': 'off' } },
];
