import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import pluginImport from 'eslint-plugin-import';

export default [
  stylistic.configs.recommended,
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  {
    files: [
      '**/*.{js, mjs}'
    ],
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '**/*.config.js'
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      import: pluginImport,
      '@stylistic': stylistic,
    },
    rules: {
      'semi': 'off',
      '@stylistic/semi': ['error', 'always'],
      'indent': 'off',
      '@stylistic/indent': ['error', 2],
      'quotes': 'off',
      '@stylistic/quotes': ['error', 'single'],
      'arrow-parens': 'off',
      '@stylistic/arrow-parens': ['error', 'always'],
      'comma-dangle': 'off',
      '@stylistic/comma-dangle': ['error', {
        arrays: 'never',
        objects: 'always-multiline',
      }],
      'brace-style': 'off',
      '@stylistic/brace-style': ['error', '1tbs'],
      'import/no-extraneous-dependencies': ['error', {
        'devDependencies': [
          '__tests__/**',
          '__test__/**',
          '**/*.test.*',
          '**/*.spec.*',
          '**/test/**',
          '**/tests/**'
        ]
      }],
      'import/extensions': ['error', 'ignorePackages', {
        'js': 'never',
        'mjs': 'never'
      }],
    },
    settings: {
      'import/resolver': {
        'node': {
          'extensions': ['.js', '.mjs']
        }
      }
    },
  }
];
