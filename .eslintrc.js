// https://eslint.org/docs/latest/use/configure/
module.exports = {
  // This tells eslint to use this file for all files in this directory and subdirectories.
  root: true,
  
  // This tells eslint which global variables and features are available.
  env: {
    browser: true,
    node: true,
  },
  
  // These are sets of linting rules to use by default.
  extends: [
    // This plugin checks for common vue errors in your code.
    "plugin:vue/recommended", 

    // This plugin checks for common js errors in your code.
    "eslint:recommended",

    // This plugin keeps linting from clashing with prettier formatting.
    "prettier",

    // This plugin checks for accessibility issues in your code.
    "plugin:vuejs-accessibility/recommended",

    // This plugin helps your styles from leaking outside of your components.
    "plugin:vue-scoped-css/vue3-recommended",
  ],

  parserOptions: {
    // CloudBolt targets modern browsers. A late ecmaVersion leads
    // to less transpilation, faster builds, and smaller bundles.
    ecmaVersion: 2020,
  },

  // This is where you can add, remove, or change individual linting rules.
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
