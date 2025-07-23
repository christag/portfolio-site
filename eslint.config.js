import astro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Global ignores
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '*.config.*'],
  },

  // Astro files
  {
    files: ['**/*.astro'],
    plugins: {
      astro,
    },
    languageOptions: {
      parser: await import('astro-eslint-parser').then((mod) => mod.default),
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
      },
    },
    rules: {
      ...astro.configs.recommended.rules,
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
    },
  },

  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // JavaScript files
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];
