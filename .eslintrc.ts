import type { Linter } from 'eslint';

const config: Linter.Config = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', '@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-param-reassign': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'no-useless-return': 'error',
    'no-else-return': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    indent: ['error', 2],
    'max-len': ['error', { code: 100, ignoreUrls: true }],
  },
  ignorePatterns: ['node_modules/', 'coverage/', 'dist/'],
};

export default config;
