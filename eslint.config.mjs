import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import requireOnPushRule from './eslint-rules/require-onpush.js';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/*', 'dist/*'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@angular-eslint': angularEslintPlugin,
      '@typescript-eslint': typescriptEslintPlugin,
      'require-onpush': {
        rules: {
          'require-onpush': requireOnPushRule
        }
      }
    },
    rules: {
      ...angularEslintPlugin.configs.recommended.rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
      'require-onpush/require-onpush': 'error'
    },
  },
];
