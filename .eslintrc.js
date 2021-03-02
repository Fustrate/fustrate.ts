module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:lodash/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  plugins: ['import', 'lodash', '@typescript-eslint'],
  rules: {
    'class-methods-use-this': 0,

    'import/extensions': ['error', 'always', { ts: 'never', js: 'never' }],

    // I want to allow 0 spaces between property definitions.
    'lines-between-class-members': 0,

    // Wants to use _.constant('constant') instead of a getter that returns a constant
    'lodash/prefer-constant': 0,

    'lodash/prefer-immutable-method': 0,

    // I prefer to use native methods when possible.
    'lodash/prefer-lodash-method': 0,

    'lodash/prefer-lodash-typecheck': 0,

    // Empty functions are fine by me.
    'lodash/prefer-noop': 0,

    'max-classes-per-file': 0,
    'max-len': [1, 120],
    'no-extend-native': 0,
    'no-param-reassign': 0,

    // I'm just not there yet on types
    '@typescript-eslint/no-explicit-any': 0,
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      'babel-module': {},
      node: {
        extensions: ['.js', '.ts'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './src/js',
      },
    },
  },
  overrides: [
    {
      files: ['**/*.spec.ts'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
