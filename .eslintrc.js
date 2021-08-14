module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      globalReturn: true,
      impliedStrict: true,
      experimentalObjectRestSpread: true,
    }
  },
  plugins: [
    '@typescript-eslint'
  ],
  globals: {
    Omi: true,
    JSX: true,
    ParentNode: true
  },
  rules: {
    'space-before-function-paren': [
      'error',
      {
        'anonymous': 'never',
        'named': 'never',
        'asyncArrow': 'always'
      }
    ],
    'no-return-assign':[0, 'never'],
    'no-prototype-builtins': [0, 'never'],
    'no-sequences': [0, 'never'],
    indent: [2, 2],
    eqeqeq: [2, 'always'],
    semi: [1, 'never'],
    quotes: [2, 'single'],
    yoda: [0, 'never']
  }
}
