// https://eslint.org/docs/latest/use/configure/
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    // Any of these can be removed if you don't need or like them
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier",
    "plugin:vuejs-accessibility/recommended",
    "plugin:vue-scoped-css/vue3-recommended",
  ],
  parserOptions: {
    // CloudBolt targets modern browsers. A late ecmaVersion leads
    // to less transpilation, faster builds, and smaller bundles.
    ecmaVersion: 2020,
  },
  rules: {
    // Allows some HTML tags to be self-closing
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "any",
          normal: "any",
          component: "any",
        },
        svg: "never",
        math: "never",
      },
    ],
    // Allows for vuetify syntax with v-slot modifiers
    "vue/valid-v-slot": ["error", { allowModifiers: true }],
  },
};
