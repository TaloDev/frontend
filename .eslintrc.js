// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
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
    'jest-dom'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:testing-library/react',
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
    'jest-dom/prefer-in-document': ['off']
  }
}
