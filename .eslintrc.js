module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12
  },
  ignorePatterns: ['coverage', 'dist', 'node_modules'],
  rules: {
    'no-param-reassign': ['error', { props: false }]
  }
};
