// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  globals: {
    vi: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: [
    'react',
    'jsx-a11y',
    'testing-library',
    'jest-dom',
    'cypress'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:jest-dom/recommended'
  ],
  rules: {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': ['warn'],
    'no-unused-vars': ['error', { 'args': 'none' }],
    'object-curly-spacing': [2, 'always'],
    'arrow-parens': ['error', 'always'],
    'keyword-spacing': ['error', { 'before': true, 'after': true }],
    'eol-last': ['warn', 'always'],
    'jest-dom/prefer-in-document': ['off'],
    'require-await': ['error']
  },
  overrides: [
    {
      files: '**/cypress/**/*',
      extends: [
        'eslint:recommended',
        'plugin:cypress/recommended'
      ]
    }
  ]
}
