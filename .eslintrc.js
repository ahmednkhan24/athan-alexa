module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  ignorePatterns: ['coverage', 'dist', 'node_modules'],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    radix: 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
