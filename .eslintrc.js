module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'any',
          component: 'any'
        },
        svg: 'never',
        math: 'never'
      }
    ],
    'vue/no-v-html': 'off',
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
  }
}
