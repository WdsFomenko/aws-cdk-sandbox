const fileProgressActivate = parseInt(process.env?.LINT_VERBOSE || 1);

module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  ignorePatterns: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module',
  },
  plugins: ['import', 'file-progress', '@typescript-eslint', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'file-progress/activate': fileProgressActivate,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'require-yield': 'off',
    'prefer-spread': 'off',
    '@typescript-eslint/ban-types': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'object-curly-spacing': [2, 'always'],
    quotes: [2, 'single', { avoidEscape: true }],
    'no-restricted-imports': [2, { patterns: ['../../.*'] }],
    'import/no-unresolved': 'error',
    // 'import/named': 'error',
    // 'import/no-cycle': [1, { 'maxDepth': 1 }],
    semi: [2, 'always', { omitLastInOneLineBlock: true }],
    'no-multiple-empty-lines': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    // 'require-await': 'error',

    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
  },
};
