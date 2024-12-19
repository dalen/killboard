// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    jsxA11y.flatConfigs.recommended,
    prettier,
  ],
  rules: {
    'prettier/prettier': 'error',
    'linebreak-style': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'default-case': 'off',
    'no-bitwise': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__typename'],
      },
    ],
  },
  ignores: ['src/types.ts'],
  plugins: { prettier: prettierPlugin },
});
